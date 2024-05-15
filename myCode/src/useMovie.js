//using named exports for custom hooks and default exports for components
import { useEffect, useState } from "react";

const keyOMDB = "32609fd4";

//this is a function we dont accept props so wtite in parameters
export function useMovie(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(
    function () {
      //   callback?.(); //when i change movie name in search close the current one from the details using handle close

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

      fetchMovies();
      return function () {
        controller.abort(); //clean up function that cancel current request each time new one comes in
      };
    },
    [query]
  );

  return { movies, isLoading, error };
}
