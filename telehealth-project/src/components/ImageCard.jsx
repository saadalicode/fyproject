import React from "react";
import ButtonComponent from "./ButtonComponent";
import "./ImageCard.css";

const ImageCard = ({ image, onClick, text }) => {
  return (
    <div className="imageCard-container">
      {/* Image */}
      <div className="image-container">
          <img
            src={image}
            className="image"
            alt="Card Image"
          />
      </div>
        {/* Button */}
        <ButtonComponent className='imageCard-button' text={text} onClick={onClick} />

    </div>
  );
};

export default ImageCard;
