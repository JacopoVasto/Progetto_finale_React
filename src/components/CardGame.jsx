import LazyLoadGameImage from '../components/LazyLoadGameImage';
import { Link } from 'react-router';

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
    <div className="card w-full bg-base-100 shadow-sm cardSpecial flex flex-col h-full">
      <Link to={`/games/${game.slug}/${game.id}`}>
        <figure className="w-full aspect-[3/2] overflow-hidden rounded-md relative">
          <LazyLoadGameImage
            image={game.background_image}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </figure>
      </Link>

      <div className="card-body flex flex-col flex-grow">
        <h2 className="card-title">{game.name}</h2>
        <div className="flex flex-wrap gap-1">{genres}</div>
        <p>{game.released}</p>
        <div className="card-actions justify-end mt-auto">
          <Link to={`/games/${game.slug}/${game.id}`} className="w-full">
            <button className="btn w-full btnSpecial">
              Visita il gioco
            </button>
          </Link>
        </div>
      </div>
    </div>
  );

}
