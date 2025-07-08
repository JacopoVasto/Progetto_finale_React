import { useEffect, useState } from "react";
import supabase from "../supabase/supabase-client";

export default function Avatar({ url, size, onUpload }) {
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fallback = "https://<tuo-progetto>.supabase.co/storage/v1/object/public/avatars/vault_profile_logo.png";

  useEffect(() => {
    if (!url) return setAvatarUrl(fallback);
    // Se è già un link completo
    if (url.startsWith("http")) return setAvatarUrl(url);

    // Altrimenti url è solo il fileName: genero publicUrl
    const { data, error } = supabase
      .storage
      .from("avatars")
      .getPublicUrl(url);
    if (error) {
      console.error("getPublicUrl error:", error.message);
      setAvatarUrl(fallback);
    } else {
      setAvatarUrl(data.publicUrl);
    }
  }, [url]);

  const uploadAvatar = async (e) => {
    setUploading(true);
    try {
      const file = e.target.files[0];
      if (!file) throw new Error("Seleziona un’immagine");

      const ext = file.name.split(".").pop();
      // nome sempre unico per non sovrascrivere
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error } = await supabase
        .storage
        .from("avatars")
        .upload(fileName, file);
      if (error) throw error;

      // salvo in profiles.avatar_url via callback
      onUpload(e, fileName);
    } catch (err) {
      alert(err.message);
    }
    setUploading(false);
  };

  return (
    <div>
      <img
        src={avatarUrl}
        alt="Avatar"
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          objectFit: "cover",
          boxShadow: "3px 3px 8px #000",
        }}
      />
      <input
        type="file"
        accept="image/*"
        onChange={uploadAvatar}
        disabled={uploading}
        className="file-input file-input-bordered w-full max-w-xs mt-3"
      />
    </div>
  );
}
