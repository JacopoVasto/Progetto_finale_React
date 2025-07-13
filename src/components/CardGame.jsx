import { Link } from 'react-router';
import LazyLoadGameImage from '../components/LazyLoadGameImage';
import ToggleFavorite from '../components/ToggleFavorite';

export default function CardGame({ game }) {
  const genres = game.genres.map((genre) => (
    <Link
      key={genre.id}
      to={`/games/${genre.slug}`}
      className="badge badge-outline genreBadge"
    >
      {genre.name}
    </Link>
  ));

  return (
    <div className="card w-full bg-base-300 shadow-sm cardSpecial flex flex-col h-full">
      <div className="relative">
        {/* Link wrapping only the image */}
        <Link to={`/games/${game.slug}/${game.id}`}>  
          <figure className="w-full aspect-[3/2] overflow-hidden rounded-md">
            <LazyLoadGameImage
              image={game.background_image}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </figure>
        </Link>
        {/* Favorite toggle overlay bottom-right, outside the Link */}
        <div className="absolute bottom-2 right-2">
          <ToggleFavorite data={game} />
        </div>
      </div>

      <div className="card-body flex flex-col flex-grow">
        <h2 className="card-title">{game.name}</h2>
        <div className="flex flex-wrap gap-1">{genres}</div>
        <p>{game.released}</p>
        <div className="card-actions justify-end mt-auto">
          <Link to={`/games/${game.slug}/${game.id}`} className="w-full">
            <button className="btn w-full btnSpecial">
              Show game page
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
