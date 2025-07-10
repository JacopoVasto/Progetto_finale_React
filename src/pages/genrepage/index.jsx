import { useParams } from "react-router";
import { rawgApiKey } from "../../api/apiKeys";
import CardGame from '../../components/CardGame'
import useFetchSolution from "../../hook/useFetchSolution";

export default function GenrePage () {
    const { genre } = useParams();

    const initialUrl = `https://api.rawg.io/api/games?key=${ rawgApiKey }&genres=${genre}&page=1`;
    const { data, error, loading } = useFetchSolution(initialUrl); 
    
    
    return (
        <>
            <h2 className="text-center text-2xl font-bold my-6">Search by {genre}</h2>
    {error && <h1>{error}</h1>}

    {loading && (
      <div className="flex justify-center items-center my-4">
        <span className="loading loading-ring loading-xl" />
        <span className="ml-4">Caricamento...</span>
      </div>
    )}

    <div className="max-w-7xl mx-auto px-4">
      <div
        className="
          grid
          grid-cols-[repeat(auto-fit,minmax(280px,1fr))]
          gap-6
          justify-items-center
        "
      >
        {!loading &&
          data?.results?.map(game => (
            <div key={game.id} className="w-full">
              <CardGame game={game} />
            </div>
          ))
        }
      </div>
    </div>
  </>
    )
}