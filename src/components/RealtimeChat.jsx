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

  const scrollSmoothtoBottom = () => {
    if (messageRef.current) {
      messageRef.current.scrollTop = messageRef.current.scrollHeight;
    }
  };

  const getInitialMessages = useCallback(async () => {
    if (!data?.id) return;
    setLoadingInitial(true);
    const { data: msgs, error } = await supabase
      .from("messages")
      .select()
      .eq("game_id", data.id);
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
        ({ new: newMsg }) => {
          setMessages((prev) => [...prev, newMsg]);
        }
      )
      .subscribe();

    return () => {
      try {
        channel.unsubscribe();
      } catch (err) {
        console.warn("Errore durante unsubscribe:", err);
      }
    };
  }, [data?.id, getInitialMessages]);

  useEffect(scrollSmoothtoBottom, [messages]);

  return (
    <div
      ref={messageRef}
      className="mt-1 px-3 w-full h-[50vh] flex flex-col justify-end bg-[#1b212b] overflow-y-auto"
    >
      {loadingInitial && (
        <progress className="progress w-full mb-2"></progress>
      )}
      {error && (
        <div className="text-red-500 mb-2">{error}</div>
      )}
      {messages.map((msg) => {
        const isOwn = session?.user.id === msg.profile_id;
        return (
          <div
            key={msg.id}
            className={`chat ${isOwn ? "chat-end" : "chat-start"} mb-2`}
          >
            <div className="chat-image avatar">
              <div className="w-10 rounded-full">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                    msg.profile_username
                  )}&background=random`}
                  alt={msg.profile_username}
                />
              </div>
            </div>
            <div className="chat-header">
              {msg.profile_username}
            </div>
            <div className="chat-bubble">{msg.content}</div>
            <div className="chat-footer opacity-50 text-xs">
              <time className="text-xs opacity-50 ml-2">
                {dayjs(msg.updated_at).format("HH:mm")}
              </time>
            </div>
          </div>
        );
      })}
    </div>
  );
}
