import { useContext } from "react";
import { ApiContext } from '../../contexts/ApiContext';
import { useParams } from "react-router";
import useFetchSolution from "../../hook/useFetchSolution";

export default function GamePage() {
    const { id } = useParams();
    const { rawgApiKey } = useContext(ApiContext);

    const initialUrl = `https://api.rawg.io/api/games/${id}?key=${rawgApiKey}`
    const { data, error, loading } = useFetchSolution(initialUrl)



    return (
        <>
            {error && <h1>{error}</h1>}
            {loading && (
                <div className="flex justify-center items-center my-4">
                    <span className="loading loading-ring loading-xl"></span>
                    <span className="ml-4">Caricamento...</span>
                </div>
            )}

            {!loading && data && (
                <div className="style-gamepage">
                    <div className="style-game-info">
                        <p>{data.released}</p>
                        <h1>{data.name}</h1>
                        <p>Rating: {data.rating}</p>
                        <p>About:</p>
                        <p>{data.description_raw}</p>
                    </div>
                    <div className="style-game-image">
                        <img src={data.background_image} alt={data.name} />
                    </div>
                </div>
            )}
        </>
    )
}