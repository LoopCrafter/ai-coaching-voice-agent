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
import { Coach, CoachingExpert } from "@/utils/consts/Options";
import { FC, ReactNode, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useGeneralStore } from "@/stores/generalStore";
import { Id } from "../../../../convex/_generated/dataModel";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { CoachSchema, CoachSchemaType } from "@/utils/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ExpertName } from "@/types";

type UserInputDialog = {
  children: ReactNode;
  coachingOption: Coach;
};
export const UserInputDialog: FC<UserInputDialog> = ({
  children,
  coachingOption,
}) => {
  const router = useRouter();
  const form = useForm<CoachSchemaType>({
    resolver: zodResolver(CoachSchema),
    defaultValues: {
      topic: "",
      expert: "Salli",
    },
  });
  const user = useGeneralStore((store) => store.user);

  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const createDiscussionRoom = useMutation(api.DiscussionRoom.CreateNewRoom);

  const handleNext = async () => {
    setLoading(true);
    const result = await createDiscussionRoom({
      coachingOption: coachingOption.name,
      topic: form.getValues("topic"),
      expertName: form.getValues("expert"),
      uid: user?._id as Id<"users">,
    });
    setLoading(false);
    setOpenDialog(false);
    router.push(`/dashboard/workspace/${result}`);
  };

  const onSubmit = (values: CoachSchemaType) => {
    console.log(values);
    handleNext();
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger className="w-full">{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{coachingOption.name}</DialogTitle>
          <DialogDescription asChild>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="topic"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>
                          Enter a topic to master your skills in{" "}
                          {coachingOption.name}
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            className="my-3 resize-none"
                            placeholder="Enter your topic here ..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name="expert"
                  render={() => (
                    <FormItem>
                      <FormLabel>Select your coaching expert:</FormLabel>
                      <div className="flex justify-start items-center gap-3 mt-3">
                        {CoachingExpert.map((expert) => (
                          <div
                            key={expert.name}
                            onClick={() =>
                              form.setValue(
                                "expert",
                                expert.name as ExpertName,
                                {
                                  shouldValidate: true,
                                }
                              )
                            }
                            className="cursor-pointer"
                          >
                            <Image
                              src={expert.avatar}
                              alt={expert.name}
                              width={100}
                              height={100}
                              className={`border border-transparent p-1 transition-all ${
                                form.watch("expert") === expert.name
                                  ? "border-blue-700!"
                                  : ""
                              } rounded-2xl w-[80px] h-[80px] object-cover hover:scale-105`}
                            />
                            <h4
                              className={`text-center transition-all ${
                                form.watch("expert") === expert.name
                                  ? "text-blue-700 dark:text-yellow-500"
                                  : "text-gray-800 dark:text-white"
                              }`}
                            >
                              {expert.name}
                            </h4>
                          </div>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter className="mt-3">
                  <Button
                    variant="ghost"
                    type="button"
                    onClick={() => setOpenDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {loading ? (
                      <LoaderCircle className="animate-spin" />
                    ) : (
                      "Next"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
