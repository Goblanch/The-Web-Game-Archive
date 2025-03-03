import React, { useState, useEffect } from "react";


const MinigameRulesModal = ({ gameName }) => {
    const [rules, setRules] = useState([]);
    const [showModal, setShowModal] = useState(true);

    useEffect(() => {
        import("../../../../public/minigames.json").then((module) => {
            const games = module.default;
            const game = games.find((minigame) => minigame.name === gameName);
            if (game) {
                setRules(game.rules);
            }
        })
            .catch((error) => console.error("Error loading minigame data", error));
    }, [gameName]);

    return (
        <div>
            {/* Modal */}
            {showModal && (
                <div
                    className="modal fade show"
                    style={{ display: "block" }}
                    tabIndex="-1"
                    role="dialog"
                >
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Rules for {gameName}</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                {rules.length > 0 ? (
                                    <ol>
                                        {rules.map((rule, index) => (
                                            <li key={index}>{rule}</li>
                                        ))}
                                    </ol>
                                ) : (
                                    <p>Loading rules...</p>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={() => setShowModal(false)}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* Fondo del modal */}
                    <div
                        onClick={() => setShowModal(false)}
                    ></div>
                </div>
            )}
        </div>
    )
}

export default MinigameRulesModal;