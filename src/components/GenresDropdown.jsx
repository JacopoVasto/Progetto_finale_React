import { useEffect, useState, useContext } from 'react';
import { ApiContext } from '../contexts/ApiContext';
import { Link } from 'react-router'
import useFetchSolution from '../hook/useFetchSolution';

export default function GenresDropdown() {
    const { rawgApiKey } = useContext(ApiContext);

    const initialUrl = `https://api.rawg.io/api/genres?key=${rawgApiKey}`;
    const { data, error } = useFetchSolution(initialUrl);

    if (error) return <p>Errore: {error}</p>
    if (!data) return <p>Nessun genere disponibile</p>

    return (
        <>
            <details className="dropdown">
                <summary>Genres</summary>
                {error && <small>{error}</small>}
                    <ul>
                        {data && data.results.map((genre) => (
                            <li key={genre.id}>
                                <Link to={`/games/${genre.slug}`}>
                                    {genre.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </details>
        </>
    );
}
