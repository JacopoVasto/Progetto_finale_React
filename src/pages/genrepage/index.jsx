import { useState, useEffect, useContext } from "react";
import { ApiContext } from '../../contexts/ApiContext';
import { useParams } from "react-router";
import CardGame from '../../components/CardGame'

export default function GenrePage () {
    const { genre } = useParams();

    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const { rawgApiKey } = useContext(ApiContext);

    const initialUrl = `https://api.rawg.io/api/games?key=${ rawgApiKey }&genres=${genre}&page=1`;

    const load = async () => {
        try {
            const response = await fetch(initialUrl);
            if (!response.ok) {
                throw new Error(response.statusText);
            }
        const json = await response.json();
        setData(json.results);
        } catch (error) {
            setError(error.message);
            setData(null);
        }
    };

    useEffect(() => {
        load();
    }, [genre]);

    console.log(data);
    
    
    return (
        <>
            <h2>Welcome to {genre} page </h2>
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-items">
                    {error && <article>{error}</article>}
                    {data &&
                        data.map((game) => 
                            <CardGame key={game.id} game={game} />
                        )
                    }
                </div>
            </div>
        </>
    )
}