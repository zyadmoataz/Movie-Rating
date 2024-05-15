import { useEffect } from "react";
export function useKey(key, action) {
  useEffect(
    function () {
      function callBack(e) {
        if (e.code.toLowerCase() === key.toLocaleLowerCase()) {
          action();
        }
      }
      document.addEventListener("keydown", callBack);

      return function () {
        document.removeEventListener("keydown", callBack); //to clean up this event listner and prevent accumlaing event listners
      };
    },
    [key, action]
  );
}
