import React, { useContext, useEffect, useState } from "react";
import { Context } from "./store/appContext";
import MinigameRulesModal from "./component/MinigameRulesModal.jsx"
import PokemonHints from "./component/PokemonHints.jsx";

const Pokemon = () => {

    const { store, actions } = useContext(Context);

    const [userInput, setUserInput] = useState("");
    const [showSilhouette, setShowSilhouette] = useState(true);
    const [hintTrigger, setHintTrigger] = useState(0);

    const handleUserGuess = () => {
        const formattedInput = userInput.toLowerCase();

        if (formattedInput === store.randomPokemon.name) {
            handleCorrectGuess();
        } else {
            setHintTrigger((prev) => prev + 1);
        }
    }

    const handleCorrectGuess = () => {
        console.log("SUCESS");
        setShowSilhouette(false);
    }

    const handleGameOver = () => {
        console.log("GAME OVER");
    }

    const handleNextPokemon = () => {
        actions.getRandomPokemon();
        setShowSilhouette(true);
        setUserInput("");
        setHintTrigger(0);
    }

    useEffect(() => {
        actions.getRandomPokemon();
    }, [])

    return (
        <div className="container d-flex flex-column align-items-center mt-3">

            <MinigameRulesModal gameName={"Who's that Pokémon?"} />

            {store.randomPokemon ? (

                <div className="d-flex flex-column align-items-center">
                    <h1>Who's that Pokémon?</h1>
                    <h1 style={{ display: showSilhouette ? "none" : "block" }}>
                        {store.randomPokemon.name}
                    </h1>
                    <img
                        src={store.randomPokemon.sprites.front_default}
                        alt={store.randomPokemon.name}
                        className={showSilhouette ? "img-fluid h-50 w-50 pokemon-silhouette" : "img-fluid h-50 w-50"}
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
                    <PokemonHints
                        pokemon={store.randomPokemon}
                        triggerHint={hintTrigger}
                        onGameOver={handleGameOver}
                    />
                </div>
            ) : (
                <button onClick={handleNextPokemon}>Next Pokémon</button>
            )}
        </div>
    );
}

export default Pokemon;