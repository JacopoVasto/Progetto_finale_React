import { useState, useRef } from "react";
import supabase from "../supabase/supabase-client";
import Modal from "./Modal";

export default function Avatar({ url, size, onUpload }) {
  const [uploading, setUploading] = useState(false);
  const [imgLoading, setImgLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const errorModalRef = useRef(null);

  const uploadAvatar = async (e) => {
    setUploading(true);
    try {
      const file = e.target.files[0];
      if (!file) throw new Error("Select an image file");
      const ext = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase
        .storage
        .from("avatars")
        .upload(fileName, file);
      if (error) throw error;
      onUpload(e, fileName);
      setImgLoading(true); // reset loading for new image
    } catch (err) {
      setErrorMessage(err.message);
      errorModalRef.current?.showModal();
    }
    setUploading(false);
  };

  return (
    <div>
      <div
        style={{
          position: "relative",
          width: size,
          height: size,
          borderRadius: "50%",
          boxShadow: "3px 3px 8px rgba(0,0,0,0.5)",
          overflow: "hidden",
        }}
      >
        {imgLoading && (
          <div
            className="loading loading-ring loading-xl"
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              borderWidth: "4px",
            }}
          />
        )}

        {url && (
          <img
            src={url}
            alt={imgLoading ? "" : "Avatar"}
            onLoad={() => setImgLoading(false)}
            onError={() => setImgLoading(false)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: imgLoading ? "none" : "block",
            }}
          />
        )}
      </div>

      <input
        type="file"
        accept="image/*"
        onChange={uploadAvatar}
        disabled={uploading}
        className="file-input file-input-bordered w-full max-w-xs mt-3"
      />

      <Modal
        id="error-avatar-modal"
        ref={errorModalRef}
        title="Error during upload"
      >
        <p>{errorMessage}</p>
      </Modal>
    </div>
  );
}
