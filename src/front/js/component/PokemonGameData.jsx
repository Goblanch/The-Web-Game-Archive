import React from "react";
import PokeballSprite from "../../../../public/pokeball.png"

const PokemonGameData = ({ remainingLives, score, streak }) => {
    const pokeballs = [1, 2, 3, 4];

    

    return (
        <div>
            <ul className="list-group">
                <li className="list-group-item">
                    Lives
                    <div className="d-flex">
                        {pokeballs.map((_, index) => (
                            <div key={index} className="me-2">
                                <img
                                    className={`img-fluid ${index >= remainingLives ? "pokemon-silhouette" : ""}`}
                                    style={{ width: "25px" }}
                                    src={PokeballSprite}
                                    alt="Pokeball"
                                />
                            </div>
                        ))}
                    </div>
                </li>

                <li className="list-group-item">
                    Score

                    <div className="d-flex justify-content-center">
                        <strong>{score}</strong>
                    </div>
                </li>

                <li className="list-group-item">
                    Streak
                    <div className="d-flex justify-content-center">
                        <strong>{streak}</strong>
                    </div>
                </li>
            </ul>
        </div>
    )
}

export default PokemonGameData;