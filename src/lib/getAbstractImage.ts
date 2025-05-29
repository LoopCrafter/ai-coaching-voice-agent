import { CoachingOptions } from "@/utils/consts/Options";

export const getAbstractImage = (option: string) => {
  const coachingOption = CoachingOptions.find((coach) => coach.name === option);
  if (coachingOption) {
    return coachingOption.abstract;
  }
  return "/lecture.png";
};
