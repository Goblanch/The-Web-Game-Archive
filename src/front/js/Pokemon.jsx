import React, { useContext, useEffect, useState } from "react";
import { Context } from "./store/appContext";
import MinigameRulesModal from "./component/MinigameRulesModal.jsx"
import PokemonHints from "./component/PokemonHints.jsx";
import PokemonGameData from "./component/PokemonGameData.jsx";

const Pokemon = () => {

    const { store, actions } = useContext(Context);

    const [userInput, setUserInput] = useState("");
    const [showSilhouette, setShowSilhouette] = useState(true);
    const [hintTrigger, setHintTrigger] = useState(0);
    const [lives, setLives] = useState(4);
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);

    const handleUserGuess = () => {
        const formattedInput = userInput.toLowerCase();

        if (formattedInput === store.randomPokemon.name) {
            handleCorrectGuess();
        } else {
            setHintTrigger((prev) => prev + 1);
            setLives((prev) => prev - 1);
            console.log(store.randomPokemon.name);
        }
    }

    const handleCorrectGuess = () => {
        console.log("SUCESS");
        setShowSilhouette(false);
    }

    const handleGameOver = () => {
        console.log("GAME OVER");
        setShowSilhouette(false);
        setHintTrigger(0);
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
        <div className="container d-flex justify-content-center">

            {/* <MinigameRulesModal gameName={"Who's that Pokémon?"} /> */}

            <div className="d-flex mt-3">
                <PokemonHints
                    pokemon={store.randomPokemon}
                    triggerHint={hintTrigger}
                    onGameOver={handleGameOver}
                />
            </div>



            <div className="d-flex flex-column align-items-center mt-3 mx-auto">
                {store.randomPokemon ? (

                    <div className="d-flex flex-column align-items-center">
                        <h1>Who's that Pokémon?</h1>
                        <h1 style={{ display: showSilhouette ? "none" : "block" }}>
                            {store.randomPokemon.name}
                        </h1>
                        <img
                            src={store.randomPokemon.sprites.front_default}
                            alt={store.randomPokemon.name}
                            className={showSilhouette ? "img-fluid pokemon-silhouette" : "img-fluid"}
                            draggable="false"
                        />
                    </div>
                ) : (
                    <p>Cargando Pokémon...</p>
                )}

                {showSilhouette ? (
                    <div className="d-flex">
                        <input
                            type="text"
                            className="form-control me-2"
                            name="user-guest"
                            id="user-guest"
                            placeholder="Who's that Pokémon?"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                        />
                        <button onClick={handleUserGuess} className="btn btn-danger">
                            Guess
                        </button>
                    </div>
                ) : (
                    <button onClick={handleNextPokemon} className="btn btn-danger">Next Pokémon</button>
                )}
            </div>

            <div className="d-flex ms-auto me-3">
                <PokemonGameData
                    remainingLives={lives}
                    score={score}
                    streak={streak}
                />
            </div>

        </div>
    );
}

export default Pokemon;