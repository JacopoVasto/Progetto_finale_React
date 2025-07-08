import { useEffect, useState, useRef, useCallback, useContext } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import supabase from "../supabase/supabase-client";
import SessionContext from "../context/SessionContext";

dayjs.extend(relativeTime);

export default function RealtimeChat({ data }) {
  const { session } = useContext(SessionContext);
  const [messages, setMessages] = useState([]);
  const [loadingInitial, setLoadingInitial] = useState(false);
  const [error, setError] = useState("");
  const messageRef = useRef(null);

  const fallbackAvatar =
    "https://saqayuloiokgjgtcpymo.supabase.co/storage/v1/object/public/avatar/vault_profile_logo.png";

  const scrollSmoothToBottom = () => {
    if (messageRef.current) {
      messageRef.current.scrollTop = messageRef.current.scrollHeight;
    }
  };

  const getInitialMessages = useCallback(async () => {
    if (!data?.id) return;
    setLoadingInitial(true);

    const { data: msgs, error } = await supabase
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

    if (error) {
      setError(error.message);
    } else {
      setMessages(msgs);
    }
    setLoadingInitial(false);
  }, [data?.id]);

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

          const enriched = profErr ? newMsg : { ...newMsg, profiles: prof };
          setMessages((prev) => [...prev, enriched]);
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
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
      {loadingInitial && <progress className="progress w-full mb-2"></progress>}
      {error && <div className="text-red-500 mb-2">{error}</div>}

      {grouped.map((grp, i) => {
        const isOwn = session.user.id === grp.profile_id;
        const { username, avatar_url } = grp.profiles || {};
        return (
          <div
            key={i}
            className={`chat ${isOwn ? "chat-end" : "chat-start"} mb-4`}
          >
            {/* Avatar e username una sola volta */}
            <div className="chat-image avatar">
              <div className="w-10 rounded-full">
                <img
                  src={avatar_url || fallbackAvatar}
                  alt={username || "user"}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = fallbackAvatar;
                  }}
                />
              </div>
            </div>
            <div className="chat-header">{username}</div>

            {/* Unico "balloon" con tutti i messaggi del gruppo */}
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
