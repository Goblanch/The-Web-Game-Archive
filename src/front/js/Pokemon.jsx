import React, { useContext, useEffect, useState } from "react";
import { Context } from "./store/appContext";

const Pokemon = () => {

    const { store, actions } = useContext(Context);

    const [userInput, setUserInput] = useState("");

    const handleUserGuess = () => {
        const formattedInput = userInput.toLowerCase();
        if (formattedInput === store.randomPokemon.name) {
            console.log("SUCESS");
        }
    }

    useEffect(() => {
        actions.getRandomPokemon();
    }, [])

    return (
        <div>
            {store.randomPokemon ? (
                <div>
                    <h1>{store.randomPokemon.name}</h1>
                    <img
                        src={store.randomPokemon.sprites.front_default}
                        alt={store.randomPokemon.name}
                    />
                </div>
            ) : (
                <p>Cargando Pokémon...</p>
            )}

            <input
                type="text"
                name="user-guest"
                id="user-guest"
                placeholder="Who's that Pokemon?"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
            />
            <button onClick={handleUserGuess}>Guess</button>
        </div>
    )
}

export default Pokemon;