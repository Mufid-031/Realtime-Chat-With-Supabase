import supabase from "./supabase-client";

export const getGroups = async () => {
  try {
    const { data } = await supabase.from("groups").select();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const addGroup = async (name: string) => {
  try {
    const { data } = await supabase
      .from("groups")
      .insert([
        {
          name,
        },
      ])
      .select();

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const updateGroup = async (id: number, name: string) => {
  try {
    const { data } = await supabase
      .from("groups")
      .update({ name })
      .eq("id", id)
      .select();

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const deleteGroup = async (id: number) => {
  try {
    const { data } = await supabase
      .from("groups")
      .delete()
      .eq("id", id)
      .select();

    return data;
  } catch (error) {
    console.log(error);
  }
};
