import { useState } from "react";
import { FiMessageCircle, FiX, FiSend } from "react-icons/fi";
import { useApi } from "../hooks/useApi";

const Chat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const { data: messages, createMutation } = useApi("chat");

  const sendMessage = async () => {
    if (!message.trim()) return;
    await createMutation.mutateAsync({ text: message });
    setMessage("");
  };

  return (
    <div className="fixed bottom-4 right-4">
      {!isOpen && (
        <button
          className="p-3 bg-zinc-800 text-white rounded-full shadow-lg hover:bg-zinc-700 transition cursor-pointer"
          onClick={() => setIsOpen(true)}
        >
          <FiMessageCircle size={24} />
        </button>
      )}

      {isOpen && (
        <div className="w-72 bg-white shadow-lg border border-zinc-300 rounded-xs overflow-hidden">
          <div className="p-1 px-2 flex justify-between bg-zinc-800 text-white">
            <span>Chat</span>
            <button onClick={() => setIsOpen(false)} className="cursor-pointer">
              <FiX size={20} />
            </button>
          </div>
          <div className="h-60 p-3 overflow-y-auto flex flex-col-reverse">
            {messages?.length ? (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-2 text-sm p-2 rounded-xs max-w-[85%] ${
                    msg.author === "AI Bot"
                      ? "bg-blue-100 text-blue-900 self-start text-left"
                      : "bg-gray-100 text-gray-900 self-end text-right"
                  } flex flex-col`}
                  style={{
                    alignSelf: msg.author === "AI Bot" ? "flex-start" : "flex-end",
                  }}
                >
                  <span className="font-semibold">{msg.author === "system" ? "AI Bot" : "You"}:</span>
                  <p>{msg.text}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No messages yet.</p>
            )}
          </div>
          <div className="px-2 py-1 border-t flex">
            <input
              type="text"
              className="flex-1 border border-zinc-400 text-zinc-900 px-2 py-1 rounded-l-xs focus:outline-none focus:ring-2 focus:ring-zinc-500"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
            />
            <button
              className="px-2 py-1 bg-zinc-800 text-white rounded-r-xs hover:bg-zinc-700 cursor-pointer"
              onClick={sendMessage}
            >
              <FiSend />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
