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
            <h2>Welcome to {genre} page </h2>
            {error && <article>{error}</article>}
            {loading && (
                <div className="flex justify-center items-center my-4">
                    <span className="loading loading-ring loading-xl"></span>
                    <span className="ml-4">Caricamento...</span>
                </div>
            )}
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-items">
                    {!loading && data?.results?.map((game) => 
                            <CardGame key={game.id} game={game} />
                        )
                    }
                </div>
            </div>
        </>
    )
}