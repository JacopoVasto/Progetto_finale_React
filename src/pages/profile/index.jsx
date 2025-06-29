import { useContext } from "react";
import SessionContext from "../../context/SessionContext";
import FavoritesContext from "../../context/FavoritesContext";
import { Trash2 } from 'lucide-react';

const favoriteGameUI = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

export default function ProfilePage() {
  const { session } = useContext(SessionContext);
  const { favorites, removeFavorite } = useContext(FavoritesContext);

  return (
    <div className="container">
      <h2> Hey {session?.user.user_metadata.first_name} </h2>
      <details className="dropdown">
        <summary>Favorites</summary>
        {favorites.lenght == 0 && <p>Non ci sono favoriti al momento...</p>}
        <ul>
          {favorites.map((game) => (
            <li key={game.id} style={favoriteGameUI}>
              <div>
                <img width={50} height={50} src={game.game_image} alt={`Cover image for the game ${game.game_name}`} />
                <p>{game.game_name}</p>
              </div>
              <button className="secondary" onClick={() => removeFavorite(game.game_id)}>
                <Trash2 />
              </button>
            </li>
          ))}
        </ul>
      </details>
    </div>
  )
}