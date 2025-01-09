"use client";

import { useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function CreateProfileForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/profiles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          bio,
          imageUrl,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create profile");
      }

      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="mb-4">
        <label
          htmlFor="username"
          className="block text-sm font-medium text-gray-700"
        >
          Username
        </label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="bio"
          className="block text-sm font-medium text-gray-700"
        >
          Bio
        </label>
        <textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          rows={4}
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Profile Picture
        </label>
        {imageUrl && (
          <div className="relative w-32 h-32 mb-4">
            <Image
              src={imageUrl}
              alt="Profile preview"
              fill
              className="rounded-lg object-cover"
            />
          </div>
        )}
        <CldUploadWidget
          uploadPreset="profile_pictures"
          onUpload={(result: any) => {
            if (result.info) {
              setImageUrl(result.info.secure_url);
            }
          }}
        >
          {({ open }) => (
            <button
              type="button"
              onClick={() => open()}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
            >
              Upload Image
            </button>
          )}
        </CldUploadWidget>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Create Profile
      </button>
    </form>
  );
}
