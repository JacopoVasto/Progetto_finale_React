import { useContext, useRef } from "react";
import { Heart } from "lucide-react";
import FavoritesContext from "../context/FavoritesContext";
import SessionContext from "../context/SessionContext";
import EasyQuitModal from "./EasyQuitModal";
import { Link } from "react-router";

export default function ToggleFavorite({ data }) {
  const { favorites, addFavorites, removeFavorite } = useContext(FavoritesContext);
  const { session } = useContext(SessionContext);
  const modalRef = useRef(null);

  const isFavorite = favorites.find((el) => +el.game_id === data?.id);

  const handleClick = () => {
    if (!session) {
      modalRef.current?.showModal();
      return;
    }
    isFavorite ? removeFavorite(data.id) : addFavorites(data);
  };

  return (
    <>
      <button
        onClick={handleClick}
        className={`btn btn-circle ${isFavorite ? "btn-error" : ""}`}
      >
        <Heart />
      </button>

      <EasyQuitModal id="login-required-modal" ref={modalRef} title="Login required">
        <p>You must be a registered user to add a game to your favorites.</p>
        <div className="flex justify-end gap-2 mt-5">
          <Link to="/register" className="btn btn-sm btnSpecial">
            Register
          </Link>
          <Link to="/login" className="btn btn-sm btnSpecial">
            Login
          </Link>
        </div>
      </EasyQuitModal>
    </>
  );
}
