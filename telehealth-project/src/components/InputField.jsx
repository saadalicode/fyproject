import React from "react";
import './InputField.css'

const InputField = ({ type, placeholder,name, value, onChange}) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      name={name}
      value={value}
      onChange={(e) => onChange(e)} 
      className= "input-field"
    />
  );
};

export default InputField;
