"use client";

import { createClient } from "@/lib/supabase/client";
import { UserInfoAvatar } from "./user-info-avatar";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";

export function UserInfo({ showEmail = false }: { showEmail?: boolean }) {
  const [userLoggedIn, setUserLoggedIn] = useState<User | null>(null);
  
  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        setUserLoggedIn(user);
      }
    }
    
    getUser();
  }, [])

  if (!userLoggedIn) {
    return null;
  }

  return <UserInfoAvatar user={userLoggedIn!} showEmail={showEmail} />;
}
