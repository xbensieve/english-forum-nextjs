"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { Avatar, Button, Modal, Spin, Tooltip, Typography } from "antd";
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
import { PhoneCallIcon, PhoneOffIcon } from "lucide-react";
import toast from "react-hot-toast";

const { Text } = Typography;

interface IncomingCall {
  sdp: string;
  type: RTCSdpType;
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
  const [callDuration, setCallDuration] = useState(0);
  const callTimerRef = useRef<NodeJS.Timeout | null>(null);
  const dialTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [isDialing, setIsDialing] = useState(false);
  const [inCall, setInCall] = useState(false);
  const [incomingCall, setIncomingCall] = useState<IncomingCall | null>(null);
  const [calling, setCalling] = useState(false);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [callEnded, setCallEnded] = useState<number | null>(null);
  const [showCallEnded, setShowCallEnded] = useState(false);

  const remoteAudioRef = useRef<HTMLAudioElement>(null);
  const currentUserId = session?.user?.id;

  const chatId =
    currentUserId && user?._id
      ? [currentUserId, user._id].sort().join("_")
      : "";

  function formatDuration(seconds: number) {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  // --- LOAD USER ---
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

  // --- LISTEN FOR CALL SIGNALS ---
  useEffect(() => {
    if (!chatId || !currentUserId || !user?._id) return;

    // listen for incoming offer
    const offerRef = ref(db, `chats/${chatId}/call/offer`);
    onValue(offerRef, (snap) => {
      const offer = snap.val();
      if (offer && offer.callerId && offer.callerId !== currentUserId) {
        console.log("Incoming offer:", offer);
        setIncomingCall(offer);
      } else {
        setIncomingCall(null);
      }
    });

    // listen for answer
    const answerRef = ref(db, `chats/${chatId}/call/answer`);
    onValue(answerRef, (snap) => {
      const answer = snap.val();
      if (answer && isDialing) {
        console.log("Answer received:", answer);
        setIsDialing(false);
        setInCall(true);
        setCallDuration(0);
      }
    });

    // ICE / answer / end listeners
    listenForAnswer(chatId);
    listenForCandidates(chatId, user._id);
    listenForCandidates(chatId, currentUserId);

    const firstLoad = { current: true };
    listenForCallEnd(chatId, () => {
      if (firstLoad.current) {
        firstLoad.current = false;
        return;
      }
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
        callTimerRef.current = null;
      }
      setCallEnded(callDuration);
      setShowCallEnded(true);
      setCalling(false);
      setIsDialing(false);
      setInCall(false);
      setIncomingCall(null);
      setRemoteStream(null);
    });

    return () => {
      if (dialTimeoutRef.current) {
        clearTimeout(dialTimeoutRef.current);
        dialTimeoutRef.current = null;
      }
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
        callTimerRef.current = null;
      }
    };
  }, [chatId, currentUserId, user?._id, isDialing, callDuration]);

  // --- SEND MESSAGE ---
  const handleSend = async () => {
    if (!input.trim() || !session?.user?.id || !user?._id) return;
    const chatId = [session.user.id, user._id].sort().join("_");
    await sendMessage(chatId, session.user.id, input.trim());
    setInput("");
  };

  // --- CALL ACTIONS ---
  const handleStartCall = async () => {
    if (!chatId || !currentUserId) return;
    setIsDialing(true);
    setCalling(true);
    console.log("Start call:", currentUserId);
    await startCall(chatId, currentUserId);

    if (dialTimeoutRef.current) clearTimeout(dialTimeoutRef.current);
    dialTimeoutRef.current = setTimeout(() => {
      handleEndCall();
      toast("Không có phản hồi từ đối phương, cuộc gọi đã kết thúc");
    }, 30000);
  };

  const handleAnswerCall = async () => {
    if (!chatId || !currentUserId) return;
    setIncomingCall(null);
    setCalling(true);
    setIsDialing(false);
    setInCall(true);
    setCallDuration(0);
    console.log("Answer call:", currentUserId);
    await answerCall(chatId, currentUserId);
  };

  const handleEndCall = async () => {
    if (!chatId) return;
    await endCall(chatId);
    if (callTimerRef.current) {
      clearInterval(callTimerRef.current);
      callTimerRef.current = null;
    }
    setCallEnded(callDuration);
    setShowCallEnded(true);
    setInCall(false);
    setIsDialing(false);
    setIncomingCall(null);
    setRemoteStream(null);
    setCalling(false);
    if (dialTimeoutRef.current) {
      clearTimeout(dialTimeoutRef.current);
      dialTimeoutRef.current = null;
    }
  };

  // --- REMOTE STREAM ---
  useEffect(() => {
    setOnRemoteStream((stream) => {
      setRemoteStream(stream);
    });
  }, []);

  useEffect(() => {
    if (remoteAudioRef.current && remoteStream) {
      remoteAudioRef.current.srcObject = remoteStream;
      remoteAudioRef.current.volume = 1;
    }
  }, [remoteStream]);

  // --- UI ---
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
    <div className="w-full h-[640px] flex">
      <div className="flex flex-col flex-1 md:ml-[200px] p-2 sm:p-4">
        <div className="flex flex-col md:flex-row flex-1 rounded-none overflow-hidden">
          <div className="flex flex-col flex-1">
            <div className="flex justify-between items-center px-3 py-4 rounded-none">
              <div className="flex items-center gap-2">
                <Avatar src={user.avatar || "/default-avatar.png"} size={32} />
                <Text strong className="truncate">
                  {user.name}
                </Text>
              </div>

              <audio
                ref={remoteAudioRef}
                autoPlay
                controls={false}
                playsInline
              />
              {!calling && !incomingCall ? (
                <Tooltip title="Bắt đầu cuộc gọi" placement="top">
                  <Button
                    type="primary"
                    shape="circle"
                    size="middle"
                    className="flex items-center justify-center bg-green-500 hover:bg-green-600 border-none shadow-md transition-all"
                    onClick={handleStartCall}
                  >
                    <PhoneCallIcon className="w-5 h-5 text-white" />
                  </Button>
                </Tooltip>
              ) : (
                <Tooltip title="Kết thúc cuộc gọi" placement="top">
                  <Button
                    shape="circle"
                    size="middle"
                    className="flex items-center justify-center bg-red-500 hover:bg-red-600 border-none transition-all"
                    onClick={handleEndCall}
                  >
                    <PhoneOffIcon className="w-5 h-5 text-white" />
                  </Button>
                </Tooltip>
              )}
            </div>

            <div className="flex-1 min-h-0.5">
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
          </div>

          <div className="hidden md:flex w-[300px]">
            <UserInfoCard user={user} />
          </div>
        </div>
      </div>

      {/* --- GIAI ĐOẠN 2: ĐANG GỌI --- */}
      <Modal
        open={isDialing}
        closable={false}
        footer={null}
        centered
        width={400}
      >
        <div className="flex flex-col items-center gap-4 p-4">
          <Avatar src={user.avatar || "/default-avatar.png"} size={64} />
          <Text strong className="text-lg">
            {user.name}
          </Text>
          <Text type="secondary">Đang gọi... Xin chờ đối phương trả lời</Text>
          <Button
            shape="circle"
            size="large"
            className="bg-red-500 hover:bg-red-600 border-none mt-4"
            onClick={handleEndCall}
          >
            <PhoneOffIcon className="w-5 h-5 text-red-500" />
          </Button>
        </div>
      </Modal>

      <Modal
        open={!!incomingCall}
        onCancel={handleEndCall}
        footer={[
          <Button key="reject" danger onClick={handleEndCall}>
            Từ chối
          </Button>,
          <Button key="accept" type="primary" onClick={handleAnswerCall}>
            Chấp nhận
          </Button>,
        ]}
        centered
        width={400}
      >
        <div className="flex flex-col items-center gap-4 p-4">
          <Avatar src={user.avatar || "/default-avatar.png"} size={64} />
          <Text strong className="text-lg">
            {user.name}
          </Text>
          <Text type="secondary">đang gọi cho bạn...</Text>
        </div>
      </Modal>

      {/* --- GIAI ĐOẠN 3: TRONG CUỘC GỌI --- */}
      <Modal open={inCall} closable={false} footer={null} centered width={400}>
        <div className="flex flex-col items-center gap-4 p-4">
          <Avatar src={user.avatar || "/default-avatar.png"} size={64} />
          <Text strong className="text-lg">
            {user.name}
          </Text>
          <Text type="secondary">Đang trong cuộc gọi...</Text>
          <Text type="secondary">
            Thời gian: {formatDuration(callDuration)}
          </Text>
          <Button
            shape="circle"
            size="large"
            className="bg-red-500 hover:bg-red-600 border-none mt-4"
            onClick={handleEndCall}
          >
            <PhoneOffIcon className="w-5 h-5 text-red-500" />
          </Button>
        </div>
      </Modal>

      {/* --- GIAI ĐOẠN 4: SAU KHI KẾT THÚC --- */}
      <Modal
        open={showCallEnded}
        onOk={() => setShowCallEnded(false)}
        footer={[
          <Button key="ok" onClick={() => setShowCallEnded(false)}>
            OK
          </Button>,
        ]}
        centered
        width={400}
      >
        <div className="flex flex-col items-center gap-4 p-4">
          <Text strong className="text-lg">
            Cuộc gọi đã kết thúc
          </Text>
          <Text type="secondary">
            Thời gian: {formatDuration(callEnded || 0)}
          </Text>
        </div>
      </Modal>
    </div>
  );
}
