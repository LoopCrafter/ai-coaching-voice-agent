"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Coach, CoachingExpert, Expert } from "@/utils/consts/Options";
import { FC, ReactNode, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";

type UserInputDialog = {
  children: ReactNode;
  coachingOption: Coach;
};
export const UserInputDialog: FC<UserInputDialog> = ({
  children,
  coachingOption,
}) => {
  const router = useRouter();
  const [selectedExpert, setSelectedExpert] = useState<string>("");
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const createDiscussionRoom = useMutation(api.DiscussionRoom.CreateNewRoom);
  const handleSelectExpert = (expertName: string) => {
    setSelectedExpert((prevExpert) =>
      prevExpert !== expertName ? expertName : ""
    );
  };

  const handleNext = async () => {
    setLoading(true);
    const result = await createDiscussionRoom({
      coachingOption: coachingOption.name,
      topic,
      expertName: selectedExpert,
    });
    setLoading(false);
    setOpenDialog(false);
    router.push(`/discussion-room/${result}`);
  };
  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger className="w-full">{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{coachingOption.name}</DialogTitle>
          <DialogDescription asChild>
            <div className="mt-3">
              <h2 className="text-black">
                Enter a topic to master your skills in {coachingOption.name}
              </h2>
              <Textarea
                className="my-3 resize-none"
                placeholder="Enter your topic here ..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
              <div className="flex flex-col">
                <div className="mt-3">
                  <h2 className="text-black">Select your coaching expert:</h2>
                  <div className="flex justify-start items-center gap-3 mt-3">
                    {CoachingExpert.map((expert) => {
                      return (
                        <div
                          key={expert.name}
                          onClick={() => handleSelectExpert(expert.name)}
                          className="cursor-pointer"
                        >
                          <Image
                            src={expert.avatar}
                            alt={expert.name}
                            width={100}
                            height={100}
                            className={`border border-transparent p-1 transition-all ${selectedExpert === expert.name ? " border-blue-700!" : ""} rounded-2xl w-[80px] h-[80px] object-cover hover:scale-105 transition-all`}
                          />
                          <h4
                            className={`text-center transition-all ${selectedExpert === expert.name ? "text-blue-700" : "text-gray-800"}`}
                          >
                            {expert.name}
                          </h4>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </DialogDescription>
          <DialogFooter>
            <div className="flex justify-end gap-2">
              <Button variant="ghost">Cancel</Button>
              <Button onClick={handleNext}>
                {loading ? <LoaderCircle className="animate-spin" /> : "Next"}
              </Button>
            </div>
          </DialogFooter>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
