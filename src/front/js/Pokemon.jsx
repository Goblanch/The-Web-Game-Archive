import React, { useContext, useEffect, useState } from "react";
import { Context } from "./store/appContext";
import MinigameRulesModal from "./component/MinigameRulesModal.jsx"
import PokemonHints from "./component/PokemonHints.jsx";

const Pokemon = () => {

    const { store, actions } = useContext(Context);

    const [userInput, setUserInput] = useState("");
    const [showSilhouette, setShowSilhouette] = useState(true);
    const [hints, setHints] = useState([]);

    const handleUserGuess = () => {
        const formattedInput = userInput.toLowerCase();

        if (formattedInput === store.randomPokemon.name) {
            handleCorrectGuess();
        } else {
            const nextHint = getNextHint();

            if (!nextHint) {
                handleGameOver();
                return;
            }

            setHints((prevHints) => [...prevHints, nextHint]);
        }
    }

    const handleCorrectGuess = () => {
        console.log("SUCESS");
        setShowSilhouette(false);
        setHints([]);
    }

    const handleGameOver = () => {
        console.log("GAME OVER");
    }

    const handleNextPokemon = () => {
        actions.getRandomPokemon();
        setShowSilhouette(true);
        setUserInput("");
        setHints([]);
    }

    useEffect(() => {
        actions.getRandomPokemon();
    }, [])

    return (
        <div>

            <MinigameRulesModal gameName={"Who's that Pokémon?"} />

            {store.randomPokemon ? (

                <div>
                    <h1>{store.randomPokemon.name}</h1>
                    <h1 style={{ display: showSilhouette ? "none" : "block" }}>
                        {store.randomPokemon.name}
                    </h1>
                    <img
                        src={store.randomPokemon.sprites.front_default}
                        alt={store.randomPokemon.name}
                        className={showSilhouette ? "pokemon-silhouette" : ""}
                        draggable="false"
                    />
                </div>
            ) : (
                <p>Cargando Pokémon...</p>
            )}

            {showSilhouette ? (
                <div>
                    <input
                        type="text"
                        name="user-guest"
                        id="user-guest"
                        placeholder="Who's that Pokémon?"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                    />
                    <button onClick={handleUserGuess}>Guess</button>
                    <PokemonHints
                        pokemon={store.randomPokemon}
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