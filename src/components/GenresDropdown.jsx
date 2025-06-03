import { useEffect, useState, useContext } from 'react';
import { ApiContext } from '../contexts/ApiContext'

export default function GenresDropdown() {
    const { rawgApiKey } = useContext(ApiContext);
    const [genres, setGenres] = useState([]);
    const [error, setError] = useState(null);

    const initialUrl = `https://api.rawg.io/api/genres?key=${rawgApiKey}`;

    const load = async () => {
        try {
            const response = await fetch(initialUrl);
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            const json = await response.json();
            setGenres(json.results);
        } catch (error) {
            setError(error.message);
            setGenres(null);
        }
    };

    useEffect(() => {
        load();
    }, []);

    if (error) return <p>Errore: {error}</p>
    if (!genres) return <p>Nessun genere disponibile</p>

    return (
        <>
            <details className="dropdown">
                <summary>Genres</summary>
                {error && <small>{error}</small>}
                    <ul>
                        {genres && genres.map((genre) => (
                            <li key={genre.id}>{genre.name}</li>
                        ))}
                    </ul>
                </details>
        </>
    );
}
