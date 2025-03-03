import React, { useContext, useEffect, useState } from "react";
import { Context } from "./store/appContext";
import MinigameRulesModal from "./component/MinigameRulesModal.jsx"
import PokemonHints from "./component/PokemonHints.jsx";
import PokemonGameData from "./component/PokemonGameData.jsx";

import WhosThatPokemonImg from "../../../public/whosthatpokemon.png";
import minigamesData from "../../../public/minigames.json";

const Pokemon = () => {

    const { store, actions } = useContext(Context);

    const [userInput, setUserInput] = useState("");
    const [showSilhouette, setShowSilhouette] = useState(true);
    const [hintTrigger, setHintTrigger] = useState(0);
    const [lives, setLives] = useState(4);
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);

    const pokemonGameData = minigamesData.find(game => game.name === "pokemon");
    const points = pokemonGameData ? pokemonGameData.points : 0;

    const handleUserGuess = () => {
        const formattedInput = userInput.toLowerCase();

        if (formattedInput === store.randomPokemon.name) {
            handleCorrectGuess();
        } else {
            handleBadGuess();
        }
    }

    const handleCorrectGuess = () => {
        console.log("SUCESS");
        setScore((prev) => prev + points);
        // TODO: Añadir llamada a api de usuarios para añadir puntos.
        setStreak((prev) => prev + 1);
        setShowSilhouette(false);
    }

    const handleBadGuess = () => {
        setHintTrigger((prev) => prev + 1);
        setLives((prev) => prev - 1);
        console.log(store.randomPokemon.name);
    }

    const handleGameOver = () => {
        console.log("GAME OVER");
        setShowSilhouette(false);
        // TODO: añadir llamada a api de usuarios para insertar nueva fila de DB de partidas jugadas.
        setHintTrigger(0);
        setScore(0);
        setStreak(0);
    }

    const handleNextPokemon = () => {
        actions.getRandomPokemon();
        setShowSilhouette(true);
        setUserInput("");
        setHintTrigger(0);
        setLives(4);
    }

    useEffect(() => {
        actions.getRandomPokemon();
    }, [])

    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-lg-3 order-2 order-lg-1 mt-3 mt-lg-0">
                    <PokemonHints
                        pokemon={store.randomPokemon}
                        triggerHint={hintTrigger}
                        onGameOver={handleGameOver}
                    />
                </div>

                <div className="col-lg-6 order-1 order-lg-2 d-flex flex-column align-items-center">
                    {store.randomPokemon ? (
                        <div className="text-center">
                            <h1>Who's that Pokémon?</h1>
                            <img
                                src={store.randomPokemon.sprites.front_default}
                                alt={store.randomPokemon.name}
                                className={
                                    showSilhouette ? "img-fluid pokemon-silhouette" : "img-fluid"
                                }
                                draggable="false"
                            />
                            <h1
                                style={{ display: showSilhouette ? "none" : "block" }}
                                className="mt-3"
                            >
                                {store.randomPokemon.name}
                            </h1>
                        </div>
                    ) : (
                        <p>Loading Pokémon...</p>
                    )}

                    <div className="mt-3">
                        {showSilhouette ? (
                            <div className="d-flex">
                                <input
                                    type="text"
                                    className="form-control me-2"
                                    name="user-guess"
                                    id="user-guess"
                                    placeholder="Who's that Pokémon?"
                                    value={userInput}
                                    onChange={(e) => setUserInput(e.target.value)}
                                />
                                <button onClick={handleUserGuess} className="btn btn-danger">
                                    Guess
                                </button>
                            </div>
                        ) : (
                            <button onClick={handleNextPokemon} className="btn btn-danger">
                                Next Pokémon
                            </button>
                        )}
                    </div>
                </div>

                <div className="col-lg-3 order-3 mt-3 mt-lg-0">
                    <PokemonGameData
                        remainingLives={lives}
                        score={score}
                        streak={streak}
                    />
                </div>
            </div>
        </div>
    );
}

export default Pokemon;