import { rawgApiKey } from "../../api/apiKeys";
import CardGame from "../../components/CardGame"
import useFetchSolution from "../../hook/useFetchSolution";

export default function HomePage() {
  
  const initialUrl = `https://api.rawg.io/api/games?key=${ rawgApiKey }&dates=2024-01-01,2024-12-31&page=1`;

  const { data, loading, error, updateUrl } = useFetchSolution(initialUrl)

return (
  <>
    <h1 className="text-4xl font-bold mb-6">Home Page</h1>

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
);


}