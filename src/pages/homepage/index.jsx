import { useContext, useEffect, useState } from "react";
import { ApiContext } from "../../contexts/ApiContext";
import CardGame from "../../components/CardGame"

export default function HomePage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false)
  const { rawgApiKey } = useContext(ApiContext)

  
  const initialUrl = `https://api.rawg.io/api/games?key=${ rawgApiKey }&dates=2024-01-01,2024-12-31&page=1`;

  const load = async () => {
    setLoading(true)
    try {
      const response = await fetch(initialUrl);
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const json = await response.json();
      setData(json);
    } catch (error) {
      setError(error.message);
      setData(null);
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    load();
  }, []);

    return (
    <>
        <h1 className="text-center text-2xl font-bold my-6">Home Page</h1>

        {/* <div className="max-w-7xl mx-auto px-4"> */}
            {error && <h1>{error}</h1>}
            {loading && (
              <div className="flex justify-center items-center my-4">
                    <span className="loading loading-ring loading-xl"></span>
                    <span className="ml-4">Caricamento...</span>
                </div>
            )}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-items">
            {!loading && data?.results?.map((game) => (
              <CardGame key={game.id} game={game} />
              ))
            }
        </div>
        {/* </div> */}
    </>
    );
}