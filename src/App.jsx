import React from "react";
import Search from "./components/Search";
import { useState, useEffect } from "react";
import heroImg from "./images/hero.png";
import { use } from "react";  
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";
import { useDebounce } from 'react-use'
import { updateSearchCount, getTrendingMovies } from "./appwrite";


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
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [searchTerm, setSearchTerm] = useState("");

  const [movieList, setMovieList] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);


  const[trendingMovies, setTrendingMovies] = useState([]);
  

  //Debounce the search term to prevent making too many requests
  //by waiting for the user to stop typing before making a request for 500ms
  //optimal search solution improves the user experience, by debouncing the input field
  useDebounce( () => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

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
        setMovieList([]);
        return;
      }

      setMovieList(data.results || []);

      if(query && data.results.length > 0){
        // if a movie is found, update the search count
        await updateSearchCount(query, data.results[0]);
      }
    } catch (error) {
      console.error(`Error fetching movies: ${error}`);
      setErrorMessage("Error fetching movies. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();

      setTrendingMovies(movies);
    } catch (error) {
      console.error(`Error fetching trending movies: ${error}`);
    }
  }
  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  // we are adding the dependency array to the useEffect hook, to ensure that the fetchMovies function is only called once when the component mounts and not on every re-render
  useEffect(() => {
    loadTrendingMovies();
  }, []);

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

        {trendingMovies.length > 0 && (
          <section className="trending">
            <h2>Trending Movies</h2>
                <ul>
                  {trendingMovies.map((movie, index) => (
                    <li key={movie.$id}>
                      {/* this id is coming from database and database start their id with this dollar character */}
                      <p>{index +1}</p>
                      <img src={movie.poster_url} alt={movie.title} />
                    </li>
                  ))}
                </ul>
            
            </section>
        )}

        <section className="all-movies">
          <h2>All Movies</h2>

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
