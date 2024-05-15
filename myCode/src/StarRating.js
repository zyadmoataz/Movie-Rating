import { useState } from "react";
import PropTypes from "prop-types";

//To make sure consumer will type the correct data type we will use prop types
//1-Import PropTypes as it is a spearate package from React itself
//2-name of the component.propType ={}
//isRequired when we must define that proptype

StarRating.propTypes = {
  maxNumber: PropTypes.number.isRequired,
  color: PropTypes.string,
  size: PropTypes.number,
  className: PropTypes.string,
  messages: PropTypes.array,
  defaultRating: PropTypes.number,
  onSetRating: PropTypes.func,
};

const containerStyle = {
  display: "flex",
  alignItems: "center",
  gap: "16px",
};
const starConatinerStyle = {
  display: "flex",
};

// No problem to initialize your state based on a prop as in defaultRating
//onSetRating is a prop that is done to update the rating when we use external states to get the number of stars
//to say for example movie is 5 stars, so we will use another state  const [movieRating, setMovieRating] = useState(0);
//then in calling this component make onSetRating={setMovieRating} so we can get the value of stars easily
export default function StarRating({
  maxNumber = 5,
  color = "#fcc419",
  size = 48,
  className = "",
  messages = [],
  defaultRating = 0,
  onSetRating,
}) {
  const [rating, setRating] = useState(defaultRating);
  const [tempRating, setTempRating] = useState(0);

  //Properties that depend on props > Props is only accessed inside the component
  const textStyle = {
    lineHeight: "1",
    margin: "0",
    color,
    fontSize: `${size / 1.6}px`,
  };

  function handleRating(rating) {
    setRating(rating);
    onSetRating(rating);
  }

  return (
    <div style={containerStyle} className={className}>
      {/* empty array with 5 elements we can loop over by passing in a function like map function as a second argument */}
      {/* we are not interedted as the element itslef so use _  we are intersted in the number */}
      <div style={starConatinerStyle}>
        {Array.from({ length: maxNumber }, (_, i) => (
          <Star
            key={i}
            color={color}
            size={size}
            full={tempRating ? tempRating >= i + 1 : rating >= i + 1}
            onRate={() => handleRating(i + 1)}
            onHoverIn={() => setTempRating(i + 1)}
            onHoverOut={() => setTempRating(0)}
          />
        ))}
      </div>
      <p style={textStyle}>
        {/* when messages array "5" = max number of stars "5" then give me message when i hover or when i click */}
        {messages.length === maxNumber
          ? messages[tempRating ? tempRating - 1 : rating - 1]
          : rating || tempRating || ""}
      </p>
    </div>
  );
}

function Star({ full, onRate, onHoverIn, onHoverOut, color, size }) {
  const starStyle = {
    width: `${size / 1.6}px`,
    height: `${size / 1.6}px`,
    cursor: "pointer",
    display: "block",
  };

  return (
    <span
      role="button"
      style={starStyle}
      onClick={onRate}
      onMouseEnter={onHoverIn}
      onMouseLeave={onHoverOut}
    >
      {full ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill={color}
          stroke={color}
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke={color}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="{2}"
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      )}
    </span>
  );
}
