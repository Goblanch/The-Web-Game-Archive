import React from "react";
import { useNavigate } from "react-router-dom";

const MinigameCard = ({ title, description, image, view }) => {
    //const { image, title, description, view } = props.cards;
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/${view}`);
    };

    return (
        <div className="card h-100 m-3">
            <img src={image} className="card-img-top" style={{ height: '200px', objectFit: 'cover' }} alt="Imagen" onClick={handleClick} />
            <div className="card-body">
                <h5 className="card-title">{title}</h5>
                <p className="card-text">{description}</p>
            </div>
        </div>
    );
};

export default MinigameCard;