"use client";

import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase/client";

export function SendMessage({ groupId, user }: { groupId: number; user: any }) {
  const supabase = createClient();
  const [message, setMessage] = useState<string>("");

  const handleSendMessage = async () => {
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
    }
  };

  return (
    <div className="flex gap-5 items-center absolute bottom-5 left-0 right-0 mx-5">
      <Input
        placeholder="Type a message"
        className="w-full"
        type="text"
        id="message"
        name="message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <Button onClick={handleSendMessage}>Send</Button>
    </div>
  );
}
