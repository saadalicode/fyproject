import React from "react";
// import './ButtonComponent.css';

const ButtonComponent = ({ onClick, text, className, disable = false}) => {
  return (
    <button
      onClick={onClick}
      className={className}
      disabled={disable}
    >
      {text}
    </button>
  );
};

export default ButtonComponent;
