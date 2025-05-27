"use client";

import { Input } from "@/components/ui/input";
import { useEffect } from "react";

interface FileInputProps {
  onChange: (...event: any[]) => void;
  value?: File | null;
}

export const FileInput = ({ onChange, value }: FileInputProps) => {
  useEffect(() => {
    if (value) {
      console.log("Selected file: ", value);
    }
  }, [value]);

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
