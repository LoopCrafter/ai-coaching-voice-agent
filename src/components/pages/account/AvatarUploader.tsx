"use client";
import { useEffect, useState } from "react";

interface AvatarUploaderProps {
  currentAvatarUrl?: string;
  onFileChange: (file: File | null) => void;
  value?: File | null;
}

export function AvatarUploader({
  currentAvatarUrl,
  onFileChange,
  value,
}: AvatarUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (value instanceof File) {
      const objectUrl = URL.createObjectURL(value);
      setPreview(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreview(null);
    }
  }, [value]);

  return (
    <div className="flex items-center space-x-4">
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            onFileChange(e.target.files[0]);
          } else {
            onFileChange(null);
          }
        }}
      />
      <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
        {preview ? (
          <img
            src={preview}
            alt="Preview avatar"
            className="object-cover w-full h-full"
          />
        ) : currentAvatarUrl ? (
          <img
            src={currentAvatarUrl}
            alt="Current avatar"
            className="object-cover w-full h-full"
          />
        ) : (
          <span className="text-gray-500 text-sm">No Avatar</span>
        )}
      </div>
    </div>
  );
}
