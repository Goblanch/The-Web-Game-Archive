import React, { useState } from "react";

const PokemonHints = ({ pokemon, onGameOver }) => {
    const [hints, setHints] = useState([]);

    const getNextHint = () => {
        const possibleHints = [
            `Color: ${pokemon.color.name}`,
            `Generación: ${pokemon.generation}`,
            `Tipo: ${pokemon.types.map((t) => t.type.name).join(", ")}`,
        ];

        for (const hint of possibleHints) {
            if (!hints.includes(hint)) {
                return hint;
            }
        }

        return null;
    }

    const handleHintRequest = () => {
        const nextHint = getNextHint();
        if (!nextHint) {
            onGameOver();
            return;
        }

        setHints((prevHints) => [...prevHints, nextHint]);
    }

    return (
        <div>
            {hints.length > 0 && (
                <div>
                    <h2>Hints:</h2>
                    <ul>
                        {hints.map((hint, index) => (
                            <li key={index}>{hint}</li>
                        ))}
                    </ul>
                </div>
            )}
            <button onClick={handleHintRequest}>Get a Hint</button>
        </div>
    )
}

export default PokemonHints;