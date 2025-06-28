import { useContext } from "react";
import { Heart } from 'lucide-react';
import FavoritesContext from '../context/FavoritesContext';

export default function ToggleFavorite({ data }) {
  const { favorites, addFavorites, removeFavorite } = useContext(FavoritesContext);

  const isFavorite = () => favorites.find((el) => +el.game_id === data?.id);

  return (
    <div>
      {isFavorite() ? (
        <button onClick={() => removeFavorite(data.id)} className="btn btn-circle btn-error">
          <Heart />
        </button>
      ) : (
        <button onClick={() => addFavorites(data)} className="btn btn-circle">
          <Heart />
        </button>
      )}
    </div>
  );
}