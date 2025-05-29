"use client";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { ReactNode, useEffect } from "react";
import { api } from "../../../convex/_generated/api";
import { useGeneralStore } from "@/stores/generalStore";

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useUser();
  const setUser = useGeneralStore((state) => state.setUser);
  const createUser = useMutation(api.users.CreateUser);
  useEffect(() => {
    if (user) {
      createNewUser();
    }
  }, [user]);

  const createNewUser = async () => {
    if (user) {
      const email = user.primaryEmailAddress?.emailAddress || "";
      const name = user?.fullName || "";
      const result = await createUser({
        name,
        email,
        avatar: user?.imageUrl ?? "",
      });
      setUser(result);
    }
  };

  return <div>{children}</div>;
};

export default AuthProvider;
