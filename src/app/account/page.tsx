"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { updateUserProfile } from "@/lib/actions";
import { ProfileSchema, ProfileType } from "@/utils/zodSchemas";
import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

const Profile = () => {
  const { user, isLoaded } = useUser();
  console.log("user,", user);
  const form = useForm<ProfileType>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      email: "",
      avatar: "",
      firstName: "",
      lastName: "",
    },
  });

  useEffect(() => {
    if (isLoaded && user) {
      form.reset({
        email: user?.emailAddresses[0].emailAddress,
        avatar: user?.imageUrl,
        firstName: user?.firstName ?? "",
        lastName: user?.lastName ?? "",
      });
    }
  }, [isLoaded, user]);

  const onSubmit = async (values: ProfileType) => {
    try {
      const result = await updateUserProfile(values);
      console.log("RESULTS", result);
    } catch (e) {
      console.log("RESULTS", e);
    }
  };

  if (!isLoaded) {
    return (
      <div className="container max-w-lg mx-auto pt-30 pb-4">Loading...</div>
    );
  }

  return (
    <div className="container max-w-lg mx-auto pt-30 pb-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem className="mt-4">
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="First Name..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem className="mt-4">
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Last Name..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            disabled
            render={({ field }) => (
              <FormItem className="mt-4 select-none">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="text-end mt-3">
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Profile;
