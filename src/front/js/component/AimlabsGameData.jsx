import React from "react";
import PropTypes from "prop-types";

const AimlabsGameData = ({ gameTime, clickTime, score }) => {
    return (
        <div style={{
            backgroundColor: "#f8f9fa",
            padding: "10px",
            display: "flex",
            justifyContent: "space-between",
        }}>
            <span>Tiempo de partida: {gameTime}s</span>
            <span>Tiempo para clic: {clickTime}s</span>
            <span>Puntuación: {score}</span>
        </div>
    );
}

AimlabsGameData.propTypes = {
    gameTime: PropTypes.number.isRequired,
    clickTime: PropTypes.number.isRequired,
    score: PropTypes.number.isRequired,
};

export default AimlabsGameData;