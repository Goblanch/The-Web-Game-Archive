import React, { useState, useEffect } from "react";

const PokemonHints = ({ pokemon, triggerHint, onGameOver }) => {
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

    useEffect(() => {
        if (triggerHint) {
            const nextHint = getNextHint();
            if (!nextHint) {
                onGameOver();
                return;
            }
            setHints((prevHints) => [...prevHints, nextHint]);
        }
    }, [triggerHint])

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
        </div>
    )
}

export default PokemonHints;