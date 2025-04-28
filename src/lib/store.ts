"use server";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export const addGroup = async (formData: FormData) => {
  try {
    const name = formData.get("name") as string;
    const supabase = createClientComponentClient();
    const { data } = await supabase.from("groups").insert([{ name }]).select();
    return data;
  } catch (error) {
    console.log("Error adding group: ", error);
  }
};

export const getGroups = async () => {
  try {
    const supabase = createClientComponentClient();
    const { data } = await supabase.from("groups").select("*");
    return data;
  } catch (error) {
    console.log("Error getting groups: ", error);
  }
};

export const deleteGroup = async (id: number) => {
  try {
    const supabase = createClientComponentClient();
    const { data } = await supabase.from("groups").delete().eq("id", id);
    return data;
  } catch (error) {
    console.log("Error deleting group: ", error);
  }
};

export const getMessages = async (groupId: number) => {
  try {
    const supabase = createClientComponentClient();
    const { data } = await supabase
      .from("messages")
      .select("*")
      .eq("group_id", groupId);
    return data;
  } catch (error) {
    console.log("Error getting messages: ", error);
  }
};

export const addMessage = async (
  groupId: number,
  content: string,
  userId: number
) => {
  try {
    const supabase = createClientComponentClient();
    const { data } = await supabase
      .from("messages")
      .insert([{ group_id: groupId, content, user_id: userId }])
      .select();
    return data;
  } catch (error) {
    console.log("Error adding message: ", error);
  }
};

export const deleteMessage = async (id: number) => {
  try {
    const supabase = createClientComponentClient();
    const { data } = await supabase.from("messages").delete().eq("id", id);
    return data;
  } catch (error) {
    console.log("Error deleting message: ", error);
  }
};
