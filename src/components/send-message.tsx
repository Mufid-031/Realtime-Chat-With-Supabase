"use client";

import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { motion } from "framer-motion";
import { Send, Smile } from "lucide-react";

export function SendMessage({
  groupId,
  user,
}: {
  groupId: number;
  user: User;
}) {
  const supabase = createClient();
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return;

    setIsLoading(true);
    try {
      await supabase
        .from("messages")
        .insert([
          { group_id: groupId, content: message.trim(), user_id: user.id },
        ])
        .select();
      setMessage("");
    } catch (error) {
      console.log("Error adding message: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4"
    >
      <div className="flex items-center gap-3 max-w-4xl mx-auto">
        {/* Emoji button */}
        <Button
          variant="ghost"
          size="icon"
          className="flex-shrink-0 w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <Smile className="w-5 h-5 text-gray-500" />
        </Button>

        {/* Message input */}
        <div className="flex-1 relative">
          <Input
            placeholder="Type your message..."
            className="h-12 pr-12 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 rounded-full focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200"
            type="text"
            value={message}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            onChange={(e) => setMessage(e.target.value)}
            disabled={isLoading}
          />
        </div>

        {/* Send button */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={handleSendMessage}
            disabled={!message.trim() || isLoading}
            className="w-12 h-12 rounded-full bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200 text-white dark:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            <Send className="w-5 h-5" />
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
