
import { useEffect, useContext } from "react";
import { useSearchParams } from "react-router";
import CardGame from "../../components/CardGame";
import useFetchSolution from "../../hook/useFetchSolution";
import { ApiContext } from "../../contexts/ApiContext";

export default function SearchPage() {
    
    let [searchParams] = useSearchParams();
    const game = searchParams.get("query");
    const { rawgApiKey } = useContext(ApiContext);

    const initialUrl = `https://api.rawg.io/api/games?key=${ rawgApiKey }&search=${game}`;

    const { loading, data, error, updateUrl } = useFetchSolution(initialUrl);

    useEffect(() => {
        updateUrl(initialUrl);
    }, [initialUrl, updateUrl]);

    return (
        <div className="container">
            <h1>Risultati per: {game}</h1>
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
                ))}
            </div>
        </div>
    )
}