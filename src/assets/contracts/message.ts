// Define an interface for the message type, matching MessageModel
export interface MessageType {
  message: string;
  sentTime: string;
  sender: string;
  direction: "incoming" | "outgoing";
  position: "single" | "first" | "normal" | "last"; // Adjust this to match MessageModel
}
export interface ChatMessage {
  role: string;
  user: string;
  message: string;
  type: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
}

// Define the type for each chat history entry
export interface ChatHistoryEntry {
  question: string;
  answer: string;
  sentTime: string;
}
