import LazyLoadGameImage from '../components/LazyLoadGameImage'

export default function CardGame({ game }) {
    
    const genres = game.genres.map((genre) => genre.name).join(`, `);

    return(
        <div className="card w-full sm:w-11/12 md:w-80 bg-base-100 shadow-sm">
  <figure>
    <LazyLoadGameImage image={game.background_image} />
  </figure>
  <div className="card-body">
    <h2 className="card-title">{game.name}</h2>
    <small>{genres}</small>
    <p>{game.released}</p>
    <div className="card-actions justify-end">
      <button className="btn btn-primary">Visita il gioco</button>
    </div>
  </div>
</div>
    );
}