import React, { useState, useEffect } from "react";
import MinigameRulesModal from "./component/MinigameRulesModal.jsx";

const Aimlabs = () => {

    const [position, setPosition] = useState({ top: 50, left: 50 });

    const generateRandomPosition = () => {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        const buttonSize = 50; // Tamaño aprox. TODO: intentar tomar el tamañao total del botón.
        const navbarHeight = 150;

        const randomTop = navbarHeight + Math.random() * (windowHeight - navbarHeight - buttonSize);
        const randomLeft = Math.random() * (windowWidth - buttonSize);

        return { top: randomTop, left: randomLeft };
    }

    const handleClick = () => {
        const newPosition = generateRandomPosition();
        setPosition(newPosition);
    }

    const handleStart = () => {
        console.log("Start");
    }

    useEffect(() => {
        const initialPosition = generateRandomPosition();
        setPosition(initialPosition);
    }, [])

    return (
        <div>
            <h1>Aimlabs</h1>
            <MinigameRulesModal gameName={"aimlabs"} onRulesClosed={handleStart} />
            <div
                style={{
                    position: "absolute",
                    top: `${position.top}px`,
                    left: `${position.left}px`,
                    transition: "top 0.2s, left 0.2s",
                }}
            >
                <button
                    className="btn btn-warning"
                    style={{ width: "100px", height: "50px" }}
                    onClick={handleClick}
                >
                    Click Me!
                </button>
            </div>
        </div>
    )
}

export default Aimlabs;