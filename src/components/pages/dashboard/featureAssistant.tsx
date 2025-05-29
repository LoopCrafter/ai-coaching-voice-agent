import { CoachingOptions } from "@/utils/consts/Options";
import Image from "next/image";
import { BlurFade } from "@/components/magicui/blur-fade";
import { UserInputDialog } from "./userInputDialog";
import TopHeader from "./TopHeader";

export const FeatureAssistant = () => {
  return (
    <div>
      <TopHeader />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-3 lg:gap-10 mt-6">
        {CoachingOptions.map((option, index) => {
          return (
            <BlurFade
              key={option.name}
              delay={0.25 * index * 0.4}
              inView
              className="h-full"
            >
              <UserInputDialog coachingOption={option}>
                <div
                  className="flex flex-col justify-center items-center p-4 rounded-3xl transition-all duration-300 
                    bg-secondary text-primary dark:bg-zinc-800 dark:text-zinc-100 
                    hover:shadow-lg hover:scale-105 cursor-pointer
                    dark:hover:bg-zinc-700 dark:hover:shadow-zinc-900/20 h-full"
                >
                  <Image
                    src={option.icon}
                    width={70}
                    height={70}
                    alt={option.name}
                    className="mb-3 dark:brightness-90"
                  />
                  <h4 className="font-semibold text-black dark:text-zinc-100">
                    {option.name}
                  </h4>
                </div>
              </UserInputDialog>
            </BlurFade>
          );
        })}
      </div>
    </div>
  );
};
