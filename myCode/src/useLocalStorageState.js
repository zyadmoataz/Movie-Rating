import { useState, useEffect } from "react";
export function useLocalStorageState(initialState, key) {
  const [value, setValue] = useState(function () {
    const storedWatchedMovies = localStorage.getItem(key); //allow user to pass key not hard coded
    return storedWatchedMovies ? JSON.parse(storedWatchedMovies) : initialState;
    //if we have empty array "null" > return it in false as empty array
  });

  useEffect(
    function () {
      localStorage.setItem(key, JSON.stringify(value));
    },
    [value, key]
  );

  return [value, setValue];
}
