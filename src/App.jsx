import { Routing } from "./routes/Routing";
import SessionProvider from "./context/SessionProvider";
import FavoritesProvider from "./context/FavoritesProvider";

function App() {
  return ( 
    <SessionProvider>
      <FavoritesProvider>
        <Routing />
      </FavoritesProvider>
    </SessionProvider>
  );
}

export default App;