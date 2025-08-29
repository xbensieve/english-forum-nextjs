import { db } from "./firebase";
import { ref, push, onValue } from "firebase/database";

interface Message {
  senderId: string;
  text: string;
  timestamp: number;
}

export function sendMessage(chatId: string, senderId: string, text: string) {
  const messagesRef = ref(db, `chats/${chatId}/messages`);
  return push(messagesRef, {
    senderId,
    text,
    timestamp: Date.now(),
  });
}

export function listenMessages(
  chatId: string,
  callback: (msgs: Message[]) => void
) {
  const messagesRef = ref(db, `chats/${chatId}/messages`);
  onValue(messagesRef, (snapshot) => {
    const data = snapshot.val() || {};
    const msgs: Message[] = Object.values(data);
    callback(msgs.sort((a, b) => a.timestamp - b.timestamp));
  });
}
