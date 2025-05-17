"use client";
import { Button } from "@/components/ui/button";
import { CoachingOptions } from "@/utils/consts/Options";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { BlurFade } from "@/components/magicui/blur-fade";
import { UserInputDialog } from "./userInputDialog";

export const FeatureAssistant = () => {
  const { user } = useUser();

  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="">
          <h2 className="font-medium text-gray-500">My Workspace</h2>
          <h3 className="text-3xl font-bold">
            Welcome Back, {user?.username || ""}
          </h3>
        </div>
        <Button className="cursor-pointer">Profile</Button>
      </div>
      <div className="grid grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-10 mt-6">
        {CoachingOptions.map((option, index) => {
          return (
            <BlurFade key={option.name} delay={0.25 * index * 0.4} inView>
              <UserInputDialog coachingOption={option}>
                <div
                  className="flex flex-col justify-center items-center p-4 rounded-3xl transition-all duration-300 
                    bg-secondary text-primary dark:bg-zinc-800 dark:text-white hover:shadow-lg hover:scale-105 cursor-pointer"
                >
                  <Image
                    src={option.icon}
                    width={70}
                    height={70}
                    alt={option.name}
                    className="mb-3"
                  />
                  <h4 className=" font-semibold text-black">{option.name}</h4>
                </div>
              </UserInputDialog>
            </BlurFade>
          );
        })}
      </div>
    </div>
  );
};
