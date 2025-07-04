// import { rawgApiKey } from "../../api/apiKeys"
// import { useParams } from "react-router";
// import useFetchSolution from "../../hook/useFetchSolution";
// import ToggleFavorite from "../../components/ToggleFavorite";

// export default function GamePage() {
//     const { id } = useParams();

//     const initialUrl = `https://api.rawg.io/api/games/${id}?key=${rawgApiKey}`
//     const { data, error, loading } = useFetchSolution(initialUrl)

//     return (
//         <>
//             {error && <h1>{error}</h1>}
//             {loading && (
//                 <div className="flex justify-center items-center my-4">
//                     <span className="loading loading-ring loading-xl"></span>
//                     <span className="ml-4">Caricamento...</span>
//                 </div>
//             )}

//             {!loading && data && (
//                 <div className="style-gamepage">
//                     <div className="style-game-info">
//                         <p>{data.released}</p>
//                         <h1>{data.name}</h1>
//                         <ToggleFavorite data={data} />
//                         <p>Rating: {data.rating}</p>
//                         <p>About:</p>
//                         <p>{data.description_raw}</p>
//                     </div>
//                     <div className="style-game-image">
//                         <img src={data.background_image} alt={data.name} />
//                     </div>
//                 </div>
//             )}
//         </>
//     )
// }

import { rawgApiKey } from "../../api/apiKeys";
import { useParams } from "react-router";
import useFetchSolution from "../../hook/useFetchSolution";
import ToggleFavorite from "../../components/ToggleFavorite";
import Chatbox from "../../components/Chatbox";

export default function GamePage() {
  const { id } = useParams();
  const initialUrl = `https://api.rawg.io/api/games/${id}?key=${rawgApiKey}`;
  const { data, error, loading } = useFetchSolution(initialUrl);

  if (error) {
    return <h1 className="text-red-500 text-center">{error}</h1>;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center my-8">
        <span className="loading loading-ring loading-xl"></span>
        <span className="ml-4 text-lg">Caricamento...</span>
      </div>
    );
  }

  return (
    data && (
      <div className="container mx-auto px-4 py-6">
        {/* Titolo con immagine di sfondo */}
        <div
  className="relative h-64 w-full rounded-lg overflow-hidden shadow-lg mb-8"
  style={{
    backgroundImage: `url("${data.background_image}")`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  }}
>
  {/* Contenuto testuale visibile sopra l'immagine */}
  <div className="absolute inset-0 flex items-center justify-center">
    <h1 className="text-white text-3xl md:text-5xl font-bold text-center px-4 drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
      {data.name}
    </h1>
  </div>
</div>

        {/* Info gioco */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Colonna info */}
          <div className="flex-1 space-y-4">
            <p className="text-sm text-gray-400">Rilasciato: {data.released}</p>
            <ToggleFavorite data={data} />
            <p className="text-lg">⭐ Rating: {data.rating}</p>
            <div>
              <p className="font-semibold">About:</p>
              <p className="text-justify">{data.description_raw}</p>
            </div>
          </div>
        </div>
        <Chatbox data={data} />
      </div>
    )
  );
}
