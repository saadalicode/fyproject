import React from "react";
import ImageCard from "../components/ImageCard";
import image1 from "../assets/images/ImageCard/image.png";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const navigate = useNavigate();
    return(
        <div >
            <ImageCard image={image1} onClick={() => navigate("/dashboard/add")} text={"Add Doctor"} />
                
            <ImageCard image={image1} onClick={() => navigate("/dashboard/doctors")} text={"Edit Doctor"} />
        </div>
    );
}
export default Dashboard;