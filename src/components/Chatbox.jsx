import { useContext, useRef } from "react";
import { Link } from "react-router";
import supabase from "../supabase/supabase-client";
import SessionContext from "../context/SessionContext";
import RealtimeChat from "./RealtimeChat";
import EasyQuitModal from "./EasyQuitModal";
import { Send } from "lucide-react";

export default function Chatbox({ data }) {
  const { session } = useContext(SessionContext);
  const modalRef = useRef(null);

  const handleMessageSubmit = async (event) => {
    event.preventDefault();
    if (!session) {
      modalRef.current?.showModal();
      return;
    }

    const form = event.currentTarget;
    const { message } = Object.fromEntries(new FormData(form));

    if (message.trim().length === 0) return;

    const { error } = await supabase
      .from("messages")
      .insert([
        {
          profile_id: session.user.id,
          game_id: data.id,
          content: message,
        },
      ])
      .select();

    if (error) {
      console.error(error);
    } else {
      form.reset();
    }
  };

  return (
    <>
      <h4>Gamers chat</h4>
      <RealtimeChat data={data} />


<form onSubmit={handleMessageSubmit}>
  <div className="relative w-full">
    <input
      type="text"
      name="message"
      placeholder="Chat..."
      autoComplete="off"
      className="
        input input-bordered w-full 
        pr-12
        z-0
      "
    />
    <button
      type="submit"
      className="
        btn btnSpecial btn-circle btn-sm
        absolute top-1 right-2
        z-1
      "
    >
      <Send className="w-5 h-5" />
    </button>
  </div>
</form>

      <EasyQuitModal id="chat-login-modal" ref={modalRef} title="Login required">
        <p>You must be a registered user to send messages.</p>
        <div className="modal-action">
          <Link to="/login" className="btn btnSpecial">
            Login
          </Link>
          <Link to="/register" className="btn btnSpecial">
            Register
          </Link>
        </div>
      </EasyQuitModal>
    </>
  );
}
