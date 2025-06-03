import { createContext } from 'react';

export const ApiContext = createContext({
    rawgApiKey: '',
});

export const ApiProvider = ({ children }) => {
    const rawgApiKey = import.meta.env.VITE_RAWG_API_KEY;
    

    return (
        <ApiContext.Provider value={{ rawgApiKey }}>
            {children}
        </ApiContext.Provider>
    );
};