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
import { useMovie } from "./useMovie";
import { useLocalStorageState } from "./useLocalStorageState";

// const keyOMDB = "32609fd4";

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedID, setSelectedID] = useState("");
  const { movies, isLoading, error } = useMovie(query);
  const [watched, setWatched] = useLocalStorageState([], "watched");

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
