"use client";

import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Send, Sparkles, Lightbulb } from "lucide-react";
import { Platform } from "@/lib/types/database.types";
import { toast } from "sonner";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface AIChatProps {
  platform: Platform;
  onGeneratePost: (content: string) => void;
  onPlatformChange?: (platform: Platform) => void;
}

export function AIChat({ platform, onGeneratePost, onPlatformChange }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string>("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize conversation
  useEffect(() => {
    // Generate a unique conversation ID
    const newConversationId = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setConversationId(newConversationId);

    // Add welcome message
    const welcomeMessage: Message = {
      id: `msg_${Date.now()}`,
      role: "assistant",
      content: `Hi! I'll help you create content for ${getPlatformName(platform)}. What would you like to post?`,
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);

    // Focus input
    inputRef.current?.focus();
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // Load conversation history (only for existing conversations)
  // Skip for new conversations since they don't have history yet
  useEffect(() => {
    if (!conversationId) return;

    const loadHistory = async () => {
      try {
        const response = await fetch(`/api/chat?conversationId=${conversationId}`);
        if (response.ok) {
          const data = await response.json();
          // Only replace messages if server has data (existing conversation)
          if (data.messages && data.messages.length > 1) {  // > 1 to keep welcome message
            setMessages(data.messages);
          }
        }
      } catch (error) {
        console.error("Error loading conversation history:", error);
        // Silently fail - new conversations don't exist yet
      }
    };

    // Small delay to avoid race condition with welcome message
    setTimeout(loadHistory, 100);
  }, [conversationId]);

  const getPlatformName = (p: Platform): string => {
    const names = { tiktok: "TikTok", linkedin: "LinkedIn", twitter: "Twitter" };
    return names[p] || p;
  };

  const getPlatformEmoji = (p: Platform): string => {
    const emojis = { tiktok: "🎵", linkedin: "💼", twitter: "🐦" };
    return emojis[p] || "📱";
  };

  const handleSendMessage = async (messageContent?: string) => {
    const content = messageContent || input.trim();
    if (!content || isLoading) return;

    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Call chat API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId,
          message: content,
          platform,
          history: messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMsg = errorData.details || errorData.error || "Failed to get response";
        console.error("API Error:", errorMsg);
        throw new Error(errorMsg);
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: `msg_${Date.now() + 1}`,
        role: "assistant",
        content: data.message || data.content || "Sorry, I couldn't generate a response.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      toast.error(`Error: ${errorMsg}`);

      const errorMessage: Message = {
        id: `msg_${Date.now() + 1}`,
        role: "assistant",
        content: `Sorry, an error occurred: ${errorMsg}\n\n${errorMsg.includes('ai_conversations') ? '⚠️ Please run the Supabase migration SQL!' : 'Please try again!'}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !isLoading) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestTopic = async () => {
    setIsLoading(true);
    toast.loading("Generating topics...", { id: "suggest-topic" });

    try {
      const response = await fetch("/api/chat/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get suggestions");
      }

      const data = await response.json();

      // Format suggestions into a readable message
      let suggestionText = `Here are some topic ideas for ${getPlatformName(platform)}:\n\n`;

      if (data.suggestions && Array.isArray(data.suggestions)) {
        suggestionText += data.suggestions.map((s: any, i: number) =>
          `${i + 1}. **${s.title}** - ${s.description}`
        ).join('\n\n');
      } else {
        suggestionText = data.suggestions || data.message || "Failed to generate topics.";
      }

      const suggestionMessage: Message = {
        id: `msg_${Date.now()}`,
        role: "assistant",
        content: suggestionText,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, suggestionMessage]);
      toast.success("Topics generated!", { id: "suggest-topic" });
    } catch (error) {
      console.error("Error getting suggestions:", error);
      toast.error("Error generating topics", { id: "suggest-topic" });

      // Fallback suggestions
      const fallbackMessage: Message = {
        id: `msg_${Date.now()}`,
        role: "assistant",
        content: `Here are some topic ideas for ${getPlatformName(platform)}:\n\n${
          platform === "tiktok"
            ? "1. Trends and challenges\n2. Behind the scenes content\n3. Educational videos\n4. Entertainment content"
            : platform === "linkedin"
            ? "1. Share professional experiences\n2. Industry trend analysis\n3. Success stories\n4. Useful tips and advice"
            : "1. Current topics and news\n2. Quick tips and tricks\n3. Thought-provoking questions\n4. Community interactions"
        }`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptimize = async () => {
    // Find the last assistant message with substantial content
    const lastAssistantMessage = messages
      .filter((m) => m.role === "assistant" && m.content.length > 20)
      .pop();

    if (!lastAssistantMessage) {
      toast.error("No content to optimize");
      return;
    }

    const optimizePrompt = `Optimize the following content for ${getPlatformName(platform)}: "${lastAssistantMessage.content}"`;
    await handleSendMessage(optimizePrompt);
  };

  const handleUseContent = () => {
    // Find the last assistant message with substantial content
    const lastAssistantMessage = messages
      .filter((m) => m.role === "assistant" && m.content.length > 20)
      .pop();

    if (!lastAssistantMessage) {
      toast.error("No content to use");
      return;
    }

    onGeneratePost(lastAssistantMessage.content);
    toast.success("Content copied to post!");
  };

  return (
    <Card className="flex flex-col h-[600px]">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            AI Chat Assistant
          </CardTitle>
          <Select
            value={platform}
            onValueChange={(value) => onPlatformChange?.(value as Platform)}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue>
                {getPlatformEmoji(platform)} {getPlatformName(platform)}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tiktok">🎵 TikTok</SelectItem>
              <SelectItem value="linkedin">💼 LinkedIn</SelectItem>
              <SelectItem value="twitter">🐦 Twitter</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2 mt-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleSuggestTopic}
            disabled={isLoading}
          >
            <Lightbulb className="h-4 w-4 mr-1" />
            Suggest Topic
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleOptimize}
            disabled={isLoading}
          >
            <Sparkles className="h-4 w-4 mr-1" />
            Optimize
          </Button>
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={handleUseContent}
            disabled={isLoading}
            className="ml-auto"
          >
            Use Content
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0 flex flex-col overflow-hidden">
        {/* Messages Area */}
        <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.role === "user"
                        ? "text-blue-100"
                        : "text-gray-500"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString("hu-HU", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-900 rounded-lg px-4 py-2">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Typing...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              type="button"
              onClick={() => handleSendMessage()}
              disabled={isLoading || !input.trim()}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
