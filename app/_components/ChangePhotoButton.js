"use client";

import { useRef, useState } from "react";
import { updateAvatar } from "../_lib/actions";

const MAX_INPUT_BYTES = 15 * 1024 * 1024;

async function resizeToSquare(file, size = 512) {
  const bitmap = await createImageBitmap(file);
  const side = Math.min(bitmap.width, bitmap.height);
  const sx = (bitmap.width - side) / 2;
  const sy = (bitmap.height - side) / 2;

  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;

  const context = canvas.getContext("2d");
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, size, size);
  context.drawImage(bitmap, sx, sy, side, side, 0, 0, size, size);
  bitmap.close();

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) =>
        blob ? resolve(blob) : reject(new Error("Could not process image")),
      "image/jpeg",
      0.85,
    );
  });
}

function ChangePhotoButton() {
  const inputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    if (file.size > MAX_INPUT_BYTES) {
      setError("That image is too large. Please choose one under 15 MB.");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const blob = await resizeToSquare(file);
      const formData = new FormData();
      formData.append("avatar", blob, "avatar.jpg");
      await updateAvatar(formData);
    } catch (err) {
      console.error(err);
      setError("Your photo could not be uploaded. Please try again");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={isUploading}
        className="text-left text-xs font-medium text-iron hover:underline disabled:opacity-50"
      >
        {isUploading ? "Uploading..." : "Change photo"}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        aria-label="Choose a profile photo"
        className="hidden"
      />

      {error && <p className="text-xs text-rust">{error}</p>}
    </div>
  );
}

export default ChangePhotoButton;
