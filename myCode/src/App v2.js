import { useEffect, useState } from "react";
import NavBar from "./NavBar";
import Main from "./Main";
import Results from "./Results";
import Search from "./Search";
import Box from "./Box";
import MovieList from "./MovieList";
import WatchSummary from "./WatchSummary";
import WatchListMovie from "./WatchListMovie";
import Loader from "./Loader";
import ErrorMessage from "./ErrorMessage";
import MovieDetails from "./MovieDetails";

const keyOMDB = "32609fd4";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedID, setSelectedID] = useState("");

  function handleSelectedMovie(id) {
    setSelectedID((currId) => (currId === id ? null : id)); //if i close on the same movie for the second time it will close it
  }

  function handleCloseMovie() {
    setSelectedID(null);
  }

  function handleAddWatched(watchedMovie) {
    setWatched((watched) => [...watched, watchedMovie]);
  }

  function deleteWatchedMovies(id) {
    setWatched((watched) => watched.filter((movies) => movies.imdbID !== id));
  }

  useEffect(
    function () {
      const controller = new AbortController(); //browser api, has nothing to do with react
      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${keyOMDB}&s=${query}`,
            { signal: controller.signal }
          );

          if (!res.ok) throw new Error("Please Check Internet Connection..");

          const data = await res.json();

          if (data.Response === "False") throw new Error("No Movies Found!");

          setMovies(data.Search);
          setError(""); //set error to empty after movies have been set
        } catch (err) {
          if (err !== "AbortError") {
            setError(err.message || "Error found!");
          }
        } finally {
          setIsLoading(false);
        }
      }
      //if query is less than 3 characters no movie called by that name
      if (query.length < 3) {
        setError("");
        setMovies([]);
        return;
      }

      handleCloseMovie(); //when i change movie name in search close the current one
      fetchMovies();
      return function () {
        controller.abort(); //clean up function that cancel current request each time new one comes in
      };
    },
    [query]
  );

  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <Results movies={movies} />
      </NavBar>
      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectedMovie={handleSelectedMovie} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>

        <Box>
          {selectedID ? (
            <MovieDetails
              selectedID={selectedID}
              onCloseMovie={handleCloseMovie}
              onAddWatched={handleAddWatched}
              watchedMoveis={watched}
            />
          ) : (
            <>
              {" "}
              <WatchSummary watched={watched} />
              <WatchListMovie
                watched={watched}
                onDeleteWatched={deleteWatchedMovies}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
