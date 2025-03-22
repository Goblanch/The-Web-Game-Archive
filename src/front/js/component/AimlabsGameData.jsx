import React from "react";
import PropTypes from "prop-types";

const AimlabsGameData = ({ gameTime, clickTime, score }) => {
    return (
        <div className="d-flex flex-column flex-md-row justify-content-around align-items-stretch bg-dark text-light rounded shadow-lg">
            <div className="text-center border border-warning rounded-start w-100 w-md-auto h-100">
                <div className="p-3 d-flex flex-column justify-content-center">
                    <h5 className="mb-1 min-h-48">Tiempo de Partida</h5>
                    <span className="fs-4 fw-bold text-warning">{gameTime}s</span>
                </div>
            </div>
            <div className="text-center border border-warning w-100 w-md-auto h-100">
                <div className="p-3 d-flex flex-column justify-content-center">
                    <h5 className="mb-1 min-h-48">Tiempo para Clic</h5>
                    <span className="fs-4 fw-bold text-danger">{clickTime}s</span>
                </div>
            </div>
            <div className="text-center border border-warning rounded-end w-100 w-md-auto h-100">
                <div className="p-3 d-flex flex-column justify-content-center">
                    <h5 className="mb-1 min-h-48">Puntuación</h5>
                    <span className="fs-4 fw-bold text-success mt-md-4">{score}</span>
                </div>
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
