"use client";

import { Input } from "@/components/ui/input";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface FileInputProps {
  onChange: (...event: any[]) => void;
  value?: File | null;
}

export const FileInput = ({ onChange }: FileInputProps) => {
  return (
    <Input
      type="file"
      accept="image/*"
      onChange={(e) => {
        if (e.target.files && e.target.files.length > 0) {
          onChange(e.target.files[0]);
        }
      }}
    />
  );
};
