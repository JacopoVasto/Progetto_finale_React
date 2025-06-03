import { useContext, useEffect, useState } from "react";
import { ApiContext } from "../../contexts/ApiContext";
import CardGame from "../../components/CardGame"

export default function HomePage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const { rawgApiKey } = useContext(ApiContext)

  
  const initialUrl = `https://api.rawg.io/api/games?key=${ rawgApiKey }&dates=2024-01-01,2024-12-31&page=1`;

  const load = async () => {
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
    }
  };

  useEffect(() => {
    load();
  }, []);

    return (
    <>
        <h1 className="text-center text-2xl font-bold my-6">Home Page</h1>

        <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-items">
            {error && <article>{error}</article>}
            {data && data.results.map((game) => (
            <CardGame key={game.id} game={game} />
            ))}
        </div>
        </div>
    </>
    );
}