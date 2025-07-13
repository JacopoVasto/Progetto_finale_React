import { rawgApiKey } from '../api/apiKeys';
import { Link } from 'react-router'
import useFetchSolution from '../hook/useFetchSolution';

export default function GenresDropdown() {

    const initialUrl = `https://api.rawg.io/api/genres?key=${rawgApiKey}`;
    const { data, error } = useFetchSolution(initialUrl);

    if (error) return <p>Errore: {error}</p>
    if (!data) return <p>Nessun genere disponibile</p>

    return (
        <>

            <div className="collapse">
                <input type="checkbox" />
                <div className="collapse-title font-semibold">Genres</div>
                <div className="collapse-content text-sm">
                {error && <small>{error}</small>}
                    <ul>
                        {data && data.results.map((genre) => (
                            <li key={genre.id} className='py-1 listColor'>
                                <Link to={`/games/${genre.slug}`}>
                                    {genre.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                        </div>
                </div>
        </>
    );
}
