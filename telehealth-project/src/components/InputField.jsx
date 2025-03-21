import React from "react";
import './InputField.css'

const InputField = ({ type, placeholder, value, onChange}) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className= "input-field"
    />
  );
};

export default InputField;
