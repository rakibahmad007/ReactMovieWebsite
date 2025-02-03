import React from "react";
import Search from "./components/Search";
import { useState, useEffect } from "react";
import heroImg from "./images/hero.png";
import { use } from "react";  
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";

const API_BASE_URL = "https://api.themoviedb.org/3";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};
const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [movieList, setMovieList] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMovies = async (query = '') => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const endpoint = query? `${API_BASE_URL}/search/movie?query=${encodeURI(query)}`:`${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }

      const data = await response.json();
      console.log(data);

      if (data.Response === "False") {
        setErrorMessage(data.Error || "Failed to fetch movies");
        setMovueList([]);
        return;
      }

      setMovieList(data.results || []);
    } catch (error) {
      console.error(`Error fetching movies: ${error}`);
      setErrorMessage("Error fetching movies. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchMovies(searchTerm);
  }, [searchTerm]);

  // we are adding the dependency array to the useEffect hook, to ensure that the fetchMovies function is only called once when the component mounts and not on every re-render

  return (
    <main>
      <div className="pattern" />

      <div className="wrapper">
        <header>
          <img src={heroImg} alt="Hero Banner" />
          <h1>
            Find <span className="text-gradient">Movies</span> You'll Enjoy
            Without the Hassle
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        <section className="all-movies">
          <h2 className="mt-[40px]">All Movies</h2>

          {loading? (
            <Spinner/>
          ) : errorMessage ? ( 
            <p className="text-red-500"> {errorMessage}</p>
          ):(
            <ul>
              {movieList.map((movie)=> (
                <MovieCard key={movie.id} movie= {movie}/>
                // we are passing the movie object as a prop to the MovieCard component, so that we can destruct the movie object in the MovieCard component
              ))}
            </ul>
          )}



          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        </section>

        {/* state fields can also be passed as props */}
      </div>
    </main>
  );
};

export default App;
