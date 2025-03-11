import React, { useState, useEffect } from "react";

const PokemonHints = ({ pokemon, triggerHint, onGameOver }) => {
    const [hints, setHints] = useState([]);

    const getNextHint = () => {
        const possibleHints = [
            `Color: ${pokemon.color.name}`,
            `Generation: ${pokemon.generation}`,
            `Type: ${pokemon.types.map((t) => t.type.name).join(", ")}`,
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
                setHints([]);
                return;
            }
            setHints((prevHints) => [...prevHints, nextHint]);
        }
    }, [triggerHint])

    useEffect(() => {
        setHints([]);
    }, [pokemon])

    return (
        <div>
            <div>
                <h2>Hints</h2>
                <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                    <ul className="list-group">
                        {hints.map((hint, index) => (
                            <li className="list-group-item" key={index}>{hint}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default PokemonHints;