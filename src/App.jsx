import { Routing } from "./routes/Routing";
import SessionProvider from "./context/SessionProvider";

function App() {
  return ( 
    <SessionProvider>
      <Routing />
    </SessionProvider>
  );
}

export default App;