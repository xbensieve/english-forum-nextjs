import { db } from "./firebase";
import {
  ref,
  set,
  onValue,
  push,
  remove,
  get,
  DataSnapshot,
} from "firebase/database";

let pc: RTCPeerConnection | null = null;
let localStream: MediaStream | null = null;
let pendingCandidates: RTCIceCandidateInit[] = [];

let onRemoteStream: ((stream: MediaStream) => void) | null = null;
export function setOnRemoteStream(cb: (stream: MediaStream) => void): void {
  onRemoteStream = cb;
}

function createPeerConnection(
  chatId: string,
  userId: string
): RTCPeerConnection {
  const config: RTCConfiguration = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  };

  pc = new RTCPeerConnection(config);

  localStream?.getTracks().forEach((track: MediaStreamTrack) => {
    pc!.addTrack(track, localStream!);
  });

  pc.ontrack = (event: RTCTrackEvent) => {
    if (onRemoteStream) {
      const remoteOnly = new MediaStream();
      event.streams[0].getTracks().forEach((track) => {
        if (track.kind === "audio") {
          remoteOnly.addTrack(track);
        }
      });
      onRemoteStream(remoteOnly);
    }
  };

  pc.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
    if (event.candidate) {
      const candidatesRef = ref(
        db,
        `chats/${chatId}/call/candidates/${userId}`
      );
      push(candidatesRef, event.candidate.toJSON());
    }
  };

  return pc;
}

export async function startCall(
  chatId: string,
  callerId: string
): Promise<void> {
  localStream = await navigator.mediaDevices.getUserMedia({
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
    },
    video: false,
  });
  createPeerConnection(chatId, callerId);

  const offer: RTCSessionDescriptionInit = await pc!.createOffer();
  await pc!.setLocalDescription(offer);

  await set(ref(db, `chats/${chatId}/call/offer`), {
    sdp: offer.sdp,
    type: offer.type,
    callerId,
  });
}

export async function answerCall(
  chatId: string,
  calleeId: string
): Promise<void> {
  localStream = await navigator.mediaDevices.getUserMedia({
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
    },
    video: false,
  });
  createPeerConnection(chatId, calleeId);

  // lấy offer một lần bằng get
  const offerSnap = await get(ref(db, `chats/${chatId}/call/offer`));
  if (!offerSnap.exists()) return;

  const offer = offerSnap.val();
  await pc!.setRemoteDescription(new RTCSessionDescription(offer));

  const answer: RTCSessionDescriptionInit = await pc!.createAnswer();
  await pc!.setLocalDescription(answer);

  await set(ref(db, `chats/${chatId}/call/answer`), {
    sdp: answer.sdp,
    type: answer.type,
    calleeId,
  });

  flushPendingCandidates();
}

export function listenForAnswer(chatId: string): void {
  onValue(
    ref(db, `chats/${chatId}/call/answer`),
    async (snap: DataSnapshot) => {
      const answer: RTCSessionDescriptionInit | null = snap.val();
      if (answer && pc && !pc.currentRemoteDescription) {
        try {
          await pc.setRemoteDescription(new RTCSessionDescription(answer));
          flushPendingCandidates();
        } catch (err) {
          console.warn("Error setting remote answer", err);
        }
      }
    }
  );
}

export function listenForCandidates(chatId: string, peerId: string): void {
  onValue(
    ref(db, `chats/${chatId}/call/candidates/${peerId}`),
    async (snap: DataSnapshot) => {
      const candidates: Record<string, RTCIceCandidateInit> | null = snap.val();
      if (candidates) {
        Object.values(candidates).forEach((c: RTCIceCandidateInit) => {
          if (pc && pc.remoteDescription) {
            pc.addIceCandidate(new RTCIceCandidate(c)).catch((e) =>
              console.error("Error adding ICE candidate", e)
            );
          } else {
            pendingCandidates.push(c);
          }
        });
      }
    }
  );
}

function flushPendingCandidates(): void {
  if (pc && pc.remoteDescription) {
    pendingCandidates.forEach(async (c: RTCIceCandidateInit) => {
      try {
        await pc!.addIceCandidate(new RTCIceCandidate(c));
      } catch (e) {
        console.error("Error adding buffered ICE candidate", e);
      }
    });
    pendingCandidates = [];
  }
}

export async function endCall(chatId: string): Promise<void> {
  await remove(ref(db, `chats/${chatId}/call`));

  if (localStream) {
    localStream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
    localStream = null;
  }

  if (pc) {
    pc.ontrack = null;
    pc.onicecandidate = null;
    pc.close();
    pc = null;
  }

  pendingCandidates = [];
}

export function listenForCallEnd(chatId: string, onEnded: () => void): void {
  const callRef = ref(db, `chats/${chatId}/call`);
  onValue(callRef, (snap: DataSnapshot) => {
    if (!snap.exists()) {
      if (pc || localStream) {
        endCall(chatId);
      }
      onEnded();
    }
  });
}
