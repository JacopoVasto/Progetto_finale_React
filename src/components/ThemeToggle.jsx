import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  // Stato del tema (JSX - JavaScript puro), default a 'dark'
  const [theme, setTheme] = useState('dark');

  // Al montaggio, recupera il tema dal localStorage (solo se eseguito in browser)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem('theme');
      const initialTheme = storedTheme === 'light' ? 'light' : 'dark';
      setTheme(initialTheme);
      document.documentElement.setAttribute('data-theme', initialTheme);
    }
  }, []);

  // Ogni volta che cambia il tema, aggiorna HTML e localStorage
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Funzione di toggle
  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm opacity-60 hover:opacity-100 transition-opacity duration-200">
    <label className="swap swap-rotate">
        <input
        type="checkbox"
        onChange={toggleTheme}
        checked={theme === 'dark'}
        />
        {/* Sole più piccolo */}
        <Sun className="swap-on w-6 h-6" />
        {/* Luna più piccola */}
        <Moon className="swap-off w-6 h-6" />
    </label>
    </div>
  )
}
