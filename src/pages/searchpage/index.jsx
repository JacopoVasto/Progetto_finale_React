import { useEffect } from "react";
import { useSearchParams } from "react-router";
import CardGame from "../../components/CardGame";
import useFetchSolution from "../../hook/useFetchSolution";
import { rawgApiKey } from "../../api/apiKeys";

export default function SearchPage() {
  let [searchParams] = useSearchParams();
  const game = searchParams.get("query");
  const initialUrl = `https://api.rawg.io/api/games?key=${ rawgApiKey }&search=${game}`;
  const { loading, data, error, updateUrl } = useFetchSolution(initialUrl);

  useEffect(() => {
    updateUrl(initialUrl);
  }, [initialUrl, updateUrl]);

  return (
    <>
      <h2 className="text-4xl font-bold mb-6">Result by: {game}</h2>
      {error && <h1>{error}</h1>}
      {loading && (
        <div className="flex justify-center items-center my-4">
          <span className="loading loading-ring loading-xl"></span>
          <span className="ml-4">Caricamento...</span>
        </div>
      )}

      {/* wrapper identico a GenrePage */}
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
            data?.results?.map((g) => (
              <div key={g.id} className="w-full">
                <CardGame game={g} />
              </div>
            ))
          }
        </div>
      </div>
    </>
  );
}
