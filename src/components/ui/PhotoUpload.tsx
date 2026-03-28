"use client";

import { useRef, useState } from "react";

interface PhotoUploadProps {
  onPhotoSelected: (file: File, preview: string) => void;
  disabled?: boolean;
}

export default function PhotoUpload({
  onPhotoSelected,
  disabled,
}: PhotoUploadProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setPreview(url);
    onPhotoSelected(file, url);
  };

  return (
    <div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleChange}
      />
      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="인증 사진"
            className="w-full h-48 object-cover rounded-xl"
          />
          <button
            onClick={() => {
              setPreview(null);
              if (fileRef.current) fileRef.current.value = "";
            }}
            className="absolute top-2 right-2 bg-dark/60 text-white w-6 h-6 rounded-full text-xs flex items-center justify-center"
          >
            ✕
          </button>
        </div>
      ) : (
        <button
          onClick={() => fileRef.current?.click()}
          disabled={disabled}
          className="w-full h-32 border-2 border-dashed border-beige rounded-xl flex flex-col items-center justify-center gap-2 text-brown-dark disabled:opacity-40"
        >
          <span className="text-2xl">📸</span>
          <span className="text-xs">사진을 촬영하거나 선택하세요</span>
        </button>
      )}
    </div>
  );
}
