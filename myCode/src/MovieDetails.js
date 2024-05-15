import { useEffect, useRef, useState } from "react";
import StarRating from "./StarRating";
import Loader from "./Loader";
import { useKey } from "./useKey";

const keyOMDB = "32609fd4";

export default function MovieDetails({
  selectedID,
  onCloseMovie,
  onAddWatched,
  watchedMoveis,
}) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState("");
  const countRef = useRef(0); //initial value is 0 , how many times user click the star rating
  useKey("Escape", onCloseMovie);

  const isWatched = watchedMoveis
    .map((watched) => watched.imdbID)
    .includes(selectedID); //derived state

  const watchedRating = watchedMoveis.find(
    (movie) => movie.imdbID === selectedID
  )?.userRating; //optional chaining as it might not be found

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selectedID,
      poster,
      runtime: Number(runtime.split(" ").at(0)),
      imdbRating: Number(imdbRating),
      year,
      title,
      userRating,
      countUserRatingDecesion: countRef.current,
    };
    onAddWatched(newWatchedMovie);
    onCloseMovie();
  }

  useEffect(
    function () {
      if (userRating) countRef.current++; //to avoid updating it in first mounts
    },
    [userRating]
  );

  useEffect(
    function () {
      async function movieDetails() {
        setIsLoading(true);
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${keyOMDB}&i=${selectedID}`
        );
        const data = await res.json();
        setMovie(data);
        setIsLoading(false);
      }
      movieDetails();
    },
    [selectedID]
  );

  //change title of webpage by movie title
  useEffect(
    function () {
      if (!title) return;
      document.title = `Movie | ${title}`;

      return function () {
        document.title = "usePopCorn";
      };
    },
    [title]
  );

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${movie} movie`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span>
                {imdbRating} IMDB Rating
              </p>
            </div>
          </header>

          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating
                    maxNumber={10}
                    size={30}
                    onSetRating={setUserRating}
                  />
                  {userRating > 0 && (
                    <button className="btn-add" onClick={handleAdd}>
                      {" "}
                      + Add To List
                    </button> //add when we rate
                  )}
                </>
              ) : (
                <p>
                  You Rated this movie with: {watchedRating} <span>⭐</span>
                </p>
              )}
            </div>

            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}
