import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const GameOverModal = ({ score, onRetry, show }) => {
    const navigate = useNavigate();

    if (!show) return null;

    return (
        <div className="game-over-overlay d-flex justify-content-center align-items-center">
            <div className="game-over-modal bg-light p-4 rounded shadow">
                <h2 className="text-danger fw-bold">Game Over!</h2>
                <p className="mt-3">
                    <strong>Score:</strong> {score}
                </p>
                <div className="mt-3">
                    <h4>Leaderboards</h4>
                    <p>Por implementar</p>
                </div>
                <div className="d-flex justify-content-around mt-4">
                    <button className="btn btn-danger" onClick={onRetry}>
                        Play Again
                    </button>
                    <button className="btn btn-secondary" onClick={() => navigate("/")}>
                        Home
                    </button>
                </div>
            </div>
        </div>
    )
};

GameOverModal.propTypes = {
    score: PropTypes.number.isRequired,
    onRetry: PropTypes.func.isRequired,
    show: PropTypes.bool.isRequired,
};

export default GameOverModal;