import { UserButton } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export const Header = async () => {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    redirect("/sign-in");
  }

  return (
    <header className="dark:bg-gray-900 text-white shadow-lg ">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <Image
            src="/logo.svg"
            alt="Logo"
            width={80}
            height={40}
            className="rounded-full"
          />
        </Link>

        <div className="flex items-center space-x-3">
          <span className="text-sm font-medium">
            {user.fullName || user.firstName || "کاربر"}
          </span>
          <UserButton />
          {/* <Image
          src={user.imageUrl}
          alt="Profile"
          width={40}
          height={40}
          className="rounded-full"
        /> */}
        </div>
      </div>
    </header>
  );
};
