import { useState } from "react";
import { useNavigate } from "react-router";

export default function SearchButton() {
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  // const [ ariaInvalid, setAriaInvalid ] = useState(null);

  const handleSearch = (event) => {
    event.preventDefault();
    if (typeof search === 'string' && search.trim().length !== 0) {
      navigate(`/search?query=${encodeURIComponent(search.trim())}`)
      setSearch("");
      setSearchOpen(false);
  //   } else {
  //     setAriaInvalid(true)
  //   }
    }
  }

  return (
    <>
      {searchOpen ? (
        <form onSubmit={handleSearch}>
          <fieldset role="group">
            <input
              type="text"
              name="search"
              className="input input-sm input-bordered w-32 transition-all duration-300"
              placeholder={
                // ariaInvalid ? "Invalid input" : 
                "Search a game"}
              value={search}
              autoFocus
              onChange={(e) => setSearch(e.target.value)}
              // aria-invalid={ariaInvalid}
              onBlur={() => setSearchOpen(false)}
            />
          </fieldset>
        </form>
      ) : (
        <button
          className="btn btn-ghost btn-circle"
          onClick={() => setSearchOpen(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
      )}
    </>
  );
}
