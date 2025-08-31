"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { Button, Modal, Spin, Typography } from "antd";
import Link from "next/link";
import axios from "axios";
import ChatContainer from "./ChatContainer";
import UserInfoCard from "./UserInfoCard";
import { sendMessage, listenMessages } from "@/lib/chatService";
import { db } from "@/lib/firebase";
import {
  startCall,
  answerCall,
  listenForAnswer,
  listenForCandidates,
  endCall,
  setOnRemoteStream,
  listenForCallEnd,
} from "@/lib/callService";
import { ref, onValue } from "firebase/database";
const { Text } = Typography;
interface IncomingCall {
  sdp: string;
  type: RTCSdpType; // "offer" | "answer" | "pranswer" | "rollback"
  callerId: string;
}
export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Message {
  senderId: string;
  text: string;
  timestamp: number;
}

interface ChatPageProps {
  userId: string;
}

export default function ChatPage({ userId }: ChatPageProps) {
  const { data: session } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  // --- CALL STATE ---
  const [calling, setCalling] = useState(false);
  const [incomingCall, setIncomingCall] = useState<IncomingCall | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const remoteAudioRef = useRef<HTMLAudioElement>(null);
  const currentUserId = session?.user?.id;
  const chatId =
    currentUserId && user?._id
      ? [currentUserId, user._id].sort().join("_")
      : "";

  useEffect(() => {
    try {
      const realId = atob(userId);
      axios
        .get<User>(`/api/users/${realId}/detail`)
        .then((res) => setUser(res.data))
        .catch(() => setUser(null))
        .finally(() => setLoading(false));
    } catch {
      setLoading(false);
    }
  }, [userId]);
  // --- LISTEN MESSAGES ---
  useEffect(() => {
    if (!chatId) return;
    listenMessages(chatId, setMessages);
  }, [chatId]);

  // --- LISTEN FOR INCOMING CALLS ---
  useEffect(() => {
    if (!chatId || !currentUserId || !user?._id) return;

    const offerRef = ref(db, `chats/${chatId}/call/offer`);
    onValue(offerRef, (snap) => {
      const offer = snap.val();
      if (offer && offer.callerId !== currentUserId) {
        setIncomingCall(offer);
      }
    });

    // Setup listeners for call signaling
    listenForAnswer(chatId);
    listenForCandidates(chatId, user._id);
    listenForCandidates(chatId, currentUserId);

    listenForCallEnd(chatId, () => {
      setCalling(false);
      setIncomingCall(null);
      setRemoteStream(null);
    });
  }, [chatId, currentUserId, user?._id]);

  // --- LISTEN MESSAGES ---
  useEffect(() => {
    if (!session?.user?.id || !user?._id) return;
    const chatId = [session.user.id, user._id].sort().join("_");
    listenMessages(chatId, setMessages);
  }, [session?.user?.id, user?._id]);

  const handleSend = async () => {
    if (!input.trim() || !session?.user?.id || !user?._id) return;
    const chatId = [session.user.id, user._id].sort().join("_");
    await sendMessage(chatId, session.user.id, input.trim());
    setInput("");
  };
  // --- CALL ACTIONS ---
  const handleStartCall = async () => {
    if (!chatId || !currentUserId) return;
    setCalling(true);
    await startCall(chatId, currentUserId);
  };
  const handleAnswerCall = async () => {
    if (!chatId || !currentUserId) return;
    setIncomingCall(null);
    setCalling(true);
    await answerCall(chatId, currentUserId);
  };

  const handleEndCall = async () => {
    if (!chatId) return;
    await endCall(chatId);
    setCalling(false);
    setIncomingCall(null);
    setRemoteStream(null);
  };
  useEffect(() => {
    setOnRemoteStream((stream) => {
      setRemoteStream(stream);
    });
  }, []);

  useEffect(() => {
    if (remoteAudioRef.current && remoteStream) {
      remoteAudioRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);
  if (!session?.user) {
    return (
      <div className="flex justify-center items-center h-[600px]">
        <div className="p-8 flex flex-col items-center gap-4">
          <Text type="secondary" className="text-lg">
            Please log in to continue
          </Text>
          <Link
            href="/login"
            className="px-6 py-2 rounded-xl bg-blue-500 text-white font-medium hover:bg-blue-600 transition"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  if (loading) return <Spin fullscreen />;

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen px-4 py-8">
        <div className="flex flex-col items-center gap-3 text-gray-500">
          <p className="text-lg font-medium">User not found</p>
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-7 left-0 w-screen h-screen overflow-hidden flex items-center justify-center p-4">
      <div className="flex w-full max-w-5xl gap-3">
        <div className="w-full md:w-3/4 flex flex-col">
          <div className="flex justify-between items-center p-3 border-b">
            <Text strong>{user.name}</Text>
            <audio ref={remoteAudioRef} autoPlay controls={false} />
            {!calling ? (
              <Button type="primary" onClick={handleStartCall}>
                📞 Call
              </Button>
            ) : (
              <Button danger onClick={handleEndCall}>
                🔴 End Call
              </Button>
            )}
          </div>
          <ChatContainer
            messages={messages}
            currentUserId={session.user.id}
            input={input}
            setInput={setInput}
            onSend={handleSend}
            showEmojiPicker={showEmojiPicker}
            setShowEmojiPicker={setShowEmojiPicker}
          />
        </div>
        <div className="hidden md:flex w-1/4">
          <UserInfoCard user={user} />
        </div>
        <Modal
          open={!!incomingCall}
          onCancel={() => setIncomingCall(null)}
          footer={[
            <Button key="reject" danger onClick={() => setIncomingCall(null)}>
              Reject
            </Button>,
            <Button key="accept" type="primary" onClick={handleAnswerCall}>
              Accept
            </Button>,
          ]}
        >
          <p>📞 Incoming call from {incomingCall?.callerId}</p>
        </Modal>
      </div>
    </div>
  );
}
