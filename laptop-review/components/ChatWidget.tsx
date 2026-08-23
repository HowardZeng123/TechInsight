"use client";

import { useChat } from "@ai-sdk/react";
import { MessageCircle, X, Send } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const { messages, sendMessage, status } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isLoading = status === 'submitted' || status === 'streaming';

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    sendMessage({ text: input });
    setInput("");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 flex flex-col w-[350px] sm:w-[400px] h-[500px] bg-background border rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-primary text-primary-foreground">
            <div>
              <h3 className="font-semibold text-lg">Trợ lý TechInsight</h3>
              <p className="text-xs opacity-90">Tư vấn Laptop & Điện thoại</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-full hover:bg-primary-foreground/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/20">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground mt-10">
                <p>👋 Chào bạn!</p>
                <p className="text-sm mt-2">
                  Bạn cần tư vấn mua laptop hay điện thoại? Hãy nhắn cho mình nhé!
                </p>
              </div>
            ) : (
              messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${
                    m.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 ${
                      m.role === "user"
                        ? "bg-primary text-primary-foreground rounded-tr-sm"
                        : "bg-muted text-foreground rounded-tl-sm"
                    }`}
                  >
                    {m.role === "user" ? (
                      <div className="text-sm whitespace-pre-wrap break-words">
                        {m.parts?.filter((p: any) => p.type === 'text').map((p: any) => p.text).join('') || m.text || m.content || ""}
                      </div>
                    ) : (
                      <div className="prose prose-sm dark:prose-invert max-w-none text-sm">
                        <ReactMarkdown
                          components={{
                            a: ({ node, ...props }) => (
                              <a
                                {...props}
                                className="text-blue-500 hover:underline break-words"
                                target="_blank"
                                rel="noopener noreferrer"
                              />
                            ),
                            p: ({ node, ...props }) => (
                              <p {...props} className="mb-2 last:mb-0" />
                            ),
                            ul: ({ node, ...props }) => (
                              <ul {...props} className="list-disc pl-4 mb-2" />
                            ),
                          }}
                        >
                          {m.parts?.filter((p: any) => p.type === 'text').map((p: any) => p.text).join('') || m.text || m.content || ""}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted text-foreground rounded-2xl rounded-tl-sm p-3 flex space-x-1 items-center">
                  <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form
            onSubmit={handleSubmit}
            className="p-3 border-t bg-background flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Nhập câu hỏi của bạn..."
              className="flex-1 px-4 py-2 bg-muted/50 border-none rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="p-4 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 hover:scale-105 transition-all duration-200"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}
