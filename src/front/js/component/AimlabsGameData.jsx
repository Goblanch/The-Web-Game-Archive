import React from "react";
import PropTypes from "prop-types";

const AimlabsGameData = ({ gameTime, clickTime, score }) => {
    return (
        <div className="d-flex justify-content-around align-items-center bg-dark text-light p-3 rounded shadow-lg">
            <div className="text-center">
                <h5 className="mb-1">Tiempo de Partida</h5>
                <span className="fs-4 fw-bold text-warning">{gameTime}s</span>
            </div>
            <div className="text-center">
                <h5 className="mb-1">Tiempo para Clic</h5>
                <span className="fs-4 fw-bold text-danger">{clickTime}s</span>
            </div>
            <div className="text-center">
                <h5 className="mb-1">Puntuación</h5>
                <span className="fs-4 fw-bold text-success">{score}</span>
            </div>
        </div>
    );
};

AimlabsGameData.propTypes = {
    gameTime: PropTypes.number.isRequired,
    clickTime: PropTypes.number.isRequired,
    score: PropTypes.number.isRequired,
};

export default AimlabsGameData;
