import { useEffect, useRef, useState } from "react";
import { UserProfileProps } from "./types";
import { useRouter } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import { motion, AnimatePresence } from "motion/react";
import { LogOut, User } from "lucide-react";
import Image from "next/image";

export const UserProfile = ({ user }: UserProfileProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { signOut } = useClerk();
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = () => {
    signOut();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 focus:outline-none"
      >
        <span className="text-sm font-medium text-foreground dark:text-zinc-100 hidden lg:inline-block ">
          {user?.fullName || ""}
        </span>
        <div
          className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-primary/20 dark:border-zinc-700 
            hover:border-primary/40 dark:hover:border-zinc-600 transition-colors duration-200"
        >
          {user?.imageUrl ? (
            <Image
              width={45}
              height={45}
              src={user.imageUrl}
              alt={user.fullName || "User"}
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center bg-primary/10 dark:bg-zinc-800 
                text-primary dark:text-zinc-100 font-medium"
            >
              {getInitials(user?.fullName || "User")}
            </div>
          )}
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-white dark:bg-zinc-800 
                border border-zinc-200 dark:border-zinc-700 overflow-hidden z-50"
          >
            <div className="py-1">
              <button
                onClick={() => {
                  router.push("/account");
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-foreground dark:text-zinc-200 
                    hover:bg-zinc-100 dark:hover:bg-zinc-700/50 flex items-center space-x-2 
                    transition-colors duration-200"
              >
                <User className="w-4 h-4" />
                <span>Manage Account</span>
              </button>

              <div className="h-px bg-border dark:bg-zinc-700 my-1" />

              <button
                onClick={handleSignOut}
                className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 
                    hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-2 
                    transition-colors duration-200"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
