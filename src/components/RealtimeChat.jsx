import { useEffect, useState, useRef, useCallback, useContext } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import supabase from "../supabase/supabase-client";
import SessionContext from "../context/SessionContext";

dayjs.extend(relativeTime);

// Fallback avatar file path nel bucket
const fallbackAvatarPath = 'vault_profile_logo.png';

export default function RealtimeChat({ data }) {
  const { session } = useContext(SessionContext);
  const [messages, setMessages] = useState([]);
  const [loadingInitial, setLoadingInitial] = useState(false);
  const [error, setError] = useState("");
  const messageRef = useRef(null);

  // Stato per cache delle signed URL per non rigenerare duplicati
  const urlCache = useRef({});

  // Genera una Signed URL valida 7 giorni, con caching
  const makeSignedUrl = useCallback(async (path) => {
    if (urlCache.current[path]) return urlCache.current[path];
    try {
      const { data: signedData, error: urlError } = await supabase
        .storage
        .from('avatars')
        .createSignedUrl(path, 60 * 60 * 24 * 7);
      if (urlError) throw urlError;
      urlCache.current[path] = signedData.signedUrl;
      return signedData.signedUrl;
    } catch (err) {
      console.error('Errore signedUrl:', err.message);
      // fallback: rigenera signed URL per file di default
      return makeSignedUrl(fallbackAvatarPath);
    }
  }, []);

  const scrollSmoothToBottom = () => {
    if (messageRef.current) {
      messageRef.current.scrollTop = messageRef.current.scrollHeight;
    }
  };

  const getInitialMessages = useCallback(async () => {
    if (!data?.id) return;
    setLoadingInitial(true);

    const { data: msgs, error: msgsError } = await supabase
      .from("messages")
      .select(`
        id,
        profile_id,
        content,
        updated_at,
        profiles (
          username,
          avatar_url
        )
      `)
      .eq("game_id", data.id)
      .order("updated_at", { ascending: true });

    if (msgsError) {
      setError(msgsError.message);
    } else {
      const withUrls = await Promise.all(
        msgs.map(async (m) => {
          const path = m.profiles?.avatar_url || fallbackAvatarPath;
          const url = await makeSignedUrl(path);
          return {
            ...m,
            profiles: {
              ...m.profiles,
              avatar_url: url,
            },
          };
        })
      );
      setMessages(withUrls);
    }
    setLoadingInitial(false);
  }, [data?.id, makeSignedUrl]);

  useEffect(() => {
    if (!data?.id) return;

    getInitialMessages();

    const channel = supabase
      .channel(`messages_game_${data.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `game_id=eq.${data.id}`,
        },
        async ({ new: newMsg }) => {
          const { data: prof, error: profErr } = await supabase
            .from("profiles")
            .select("username, avatar_url")
            .eq("id", newMsg.profile_id)
            .single();

          const path = !profErr && prof?.avatar_url ? prof.avatar_url : fallbackAvatarPath;
          const url = await makeSignedUrl(path);
          const enriched = {
            ...newMsg,
            profiles: {
              username: profErr || !prof ? 'user' : prof.username,
              avatar_url: url,
            },
          };
          setMessages((prev) => [...prev, enriched]);
        }
      )
      .subscribe();

    return () => channel.unsubscribe();
  }, [data?.id, getInitialMessages]);

  useEffect(scrollSmoothToBottom, [messages]);

  // Raggruppa i messaggi contigui per profile_id
  const grouped = [];
  for (const msg of messages) {
    const lastGroup = grouped[grouped.length - 1];
    if (lastGroup && lastGroup.profile_id === msg.profile_id) {
      lastGroup.items.push(msg);
    } else {
      grouped.push({
        profile_id: msg.profile_id,
        profiles: msg.profiles,
        items: [msg],
      });
    }
  }

  return (
    <div
      ref={messageRef}
      className="mt-1 px-3 w-full h-[50vh] flex flex-col justify-end bg-[#1b212b] overflow-y-auto"
    >
      {loadingInitial && <progress className="progress w-full mb-2" />}
      {error && <div className="text-red-500 mb-2">{error}</div>}

      {grouped.map((grp) => {
        const isOwn = session.user.id === grp.profile_id;
        const { username, avatar_url } = grp.profiles || {};
        const key = `${grp.profile_id}-${grp.items[0]?.id}`;
        return (
          <div key={key} className={`chat ${isOwn ? "chat-end" : "chat-start"} mb-4`}>
            <div className="chat-image avatar">
              <div className="w-10 rounded-full">
                <img
                  src={avatar_url}
                  alt={username}
                  onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = avatar_url; }}
                />
              </div>
            </div>
            <div className="chat-header">{username}</div>
            <div className="chat-bubble space-y-2">
              {grp.items.map((m) => (
                <div key={m.id} className="flex justify-between items-end">
                  <span>{m.content}</span>
                  <time className="text-[10px] opacity-50 ml-2">
                    {dayjs(m.updated_at).format("HH:mm")}
                  </time>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
