import React, { useState } from "react";
import InputField from "../components/InputField";
import ButtonComponent from "../components/ButtonComponent";
import "./AddDoctor.css";

const Signup = () => {
  const [Name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);  
  };

  return (
    <div className="addDoctor-container">
        
          <h2 className="my-4">Add a New Doctor</h2>
          
          <InputField 
            type="Name" 
            placeholder="Name" 
            value={Name} 
            onChange={(e) => setName(e.target.value)} 
          />

          <InputField 
            type="Phone" 
            placeholder="Phone" 
            value={phone} 
            onChange={(e) => setPhone(e.target.value)} 
          />

          <InputField 
            type="Email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />

          <InputField 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />

          <InputField 
            type="address" 
            placeholder="Address" 
            value={address} 
            onChange={(e) => setAddress(e.target.value)} 
          />

          <div className="addDoctor-image-container">
            <input 
                type="file"
                accept="image/*"
                onChange={handleImageChange}
            />
          </div>

          <ButtonComponent text="Submit" onClick={() => alert("Add New Doctor logic here")}  className='addDoctor-button'/>

    </div>
  );
};

export default Signup;
