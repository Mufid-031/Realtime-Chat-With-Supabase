"use client";

import type React from "react";

import { createClient } from "@/lib/supabase/client";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "sonner";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Users, Plus } from "lucide-react";

export function CreateGroupForm() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddGroup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isLoading) return;

    const formData = new FormData(event.target as HTMLFormElement);
    const name = formData.get("name") as string;

    if (!name.trim()) {
      toast.error("Please enter a group name");
      return;
    }

    setIsLoading(true);
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from("groups")
        .insert([{ name: name.trim() }])
        .select();
      if (data) {
        toast.success("Group created successfully");
        inputRef.current!.value = "";
      }
    } catch (error) {
      console.log("Error adding group: ", error);
      toast.error("Error adding group");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-gray-900 dark:bg-gray-100 rounded-2xl mb-4"
          >
            <Users className="w-8 h-8 text-white dark:text-gray-900" />
          </motion.div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Create New Group
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Start a new conversation with your team
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6"
        >
          <form onSubmit={handleAddGroup} className="space-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Group Name
              </Label>
              <Input
                ref={inputRef}
                id="name"
                name="name"
                type="text"
                placeholder="Enter group name..."
                className="h-12 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-gray-500 focus:border-transparent rounded-lg"
                disabled={isLoading}
              />
            </div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200 text-white dark:text-gray-900 font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white dark:border-gray-900 border-t-transparent rounded-full animate-spin" />
                    Creating...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Create Group
                  </div>
                )}
              </Button>
            </motion.div>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
}
