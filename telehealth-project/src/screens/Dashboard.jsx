import React from "react";
import ImageCard from "../components/ImageCard";
import image from "../assets/images/ImageCard/image.png";
import image1 from "../assets/images/ImageCard/image1.png";
import image2 from "../assets/images/ImageCard/image2.jpg";
import image3 from "../assets/images/ImageCard/image3.png";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const navigate = useNavigate();
    return(
        <div >
            <ImageCard image={image} onClick={() => navigate("/dashboard/users")} text={"Registerd Users"} />

            <ImageCard image={image1} onClick={() => navigate("/dashboard/add")} text={"Add Doctor"} />
                
            <ImageCard image={image1} onClick={() => navigate("/dashboard/doctors")} text={"Edit Doctor"} />

            <ImageCard image={image1} onClick={() => navigate("/dashboard/request")} text={" Add Doctor Request"} />

            <ImageCard image={image2} onClick={() => navigate("/dashboard/patients")} text={"Manage Patients"} />

            <ImageCard image={image3} onClick={() => navigate("/dashboard/request")} text={" Add Doctor Request"} />
        </div>
    );
}
export default Dashboard;