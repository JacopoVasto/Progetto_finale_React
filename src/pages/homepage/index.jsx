import { useContext, useEffect, useState } from "react";
import { ApiContext } from "../../contexts/ApiContext";
import CardGame from "../../components/CardGame"
import useFetchSolution from "../../hook/useFetchSolution";

export default function HomePage() {
  const { rawgApiKey } = useContext(ApiContext)

  const initialUrl = `https://api.rawg.io/api/games?key=${ rawgApiKey }&dates=2024-01-01,2024-12-31&page=1`;

  const { data, loading, error, updateUrl } = useFetchSolution(initialUrl)

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