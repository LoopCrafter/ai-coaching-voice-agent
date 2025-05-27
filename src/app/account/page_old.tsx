"use client";
import { useUser } from "@clerk/nextjs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function AccountPage() {
  const { user } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.emailAddresses[0]?.emailAddress || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (!user) return;
      
      // Update user's first name and last name
      await user.update({
        firstName: formData.firstName,
        lastName: formData.lastName,
      });

      // If email is changed, update it
      if (formData.email !== user.emailAddresses[0]?.emailAddress) {
        await user.createEmailAddress({
          email: formData.email,
        });
      }

      setIsEditing(false);
    } catch (error) {
      console.error("Error updating user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
        Account Settings
      </h1>

      <Card className="p-6 bg-card dark:bg-zinc-800/50 border border-border/50">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-primary/20 dark:border-zinc-700">
                {user?.imageUrl ? (
                  <img
                    src={user.imageUrl}
                    alt={user.fullName || "User"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary/10 dark:bg-zinc-800 text-primary dark:text-zinc-100 font-medium text-xl">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </div>
                )}
              </div>
              <Button
                type="button"
                variant="outline"
                className="dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-700/50"
              >
                Change Photo
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, firstName: e.target.value })}
                  disabled={!isEditing}
                  className="bg-background/50 dark:bg-zinc-900/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, lastName: e.target.value })}
                  disabled={!isEditing}
                  className="bg-background/50 dark:bg-zinc-900/50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, email: e.target.value })}
                disabled={!isEditing}
                className="bg-background/50 dark:bg-zinc-900/50"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            {isEditing ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      firstName: user?.firstName || "",
                      lastName: user?.lastName || "",
                      email: user?.emailAddresses[0]?.emailAddress || "",
                    });
                  }}
                  className="dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-700/50"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </>
            ) : (
              <Button
                type="button"
                onClick={() => setIsEditing(true)}
                className="dark:bg-zinc-700 dark:hover:bg-zinc-600"
              >
                Edit Profile
              </Button>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
} 