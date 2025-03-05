import React, { useState, useEffect } from "react";
import minigamesData from "../../../public/minigames.json";

import MinigameRulesModal from "./component/MinigameRulesModal.jsx";

const Aimlabs = () => {
    const gameData = minigamesData.find((game) => game.name === "aimlabs");

    const [position, setPosition] = useState({ top: 50, left: 50 });
    const [gameStarted, setGameStarted] = useState(false);
    const [gameTime, setGameTime] = useState(gameData.game_time);
    const [clickTime, setClickTime] = useState(gameData.click_time);
    const [score, setScore] = useState(0);
    const [clickTimer, setClickTimer] = useState(null);

    const generateRandomPosition = () => {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        const buttonSize = 50; // Tamaño aprox. TODO: intentar tomar el tamañao total del botón.
        const navbarHeight = 150;

        const randomTop = navbarHeight + Math.random() * (windowHeight - navbarHeight - buttonSize);
        const randomLeft = Math.random() * (windowWidth - buttonSize);

        return { top: randomTop, left: randomLeft };
    }

    const handleButtonClick = () => {
        const newPosition = generateRandomPosition();
        setPosition(newPosition);
        setScore((prev) => prev + gameData.points)
        resetClickTimer();
    }

    const resetClickTimer = () => {
        if (clickTimer) clearTimeout(clickTimer);
        setClickTime(gameData.click_time);
        const timer = setTimeout(() => {
            handleEndGame();
        }, gameData.click_time * 1000);
        setClickTimer(timer);
    }

    const handleStart = () => {
        console.log("Start");
        setGameStarted(true);
        resetClickTimer();

        const gameInterval = setInterval(() => {
            setGameTime((prevTime) => {
                if (prevTime <= 0) {
                    clearInterval(gameInterval);
                    handleEndGame();
                    return 0;
                }
                return prevTime - 1;
            })
        }, 1000)
    }

    const handleEndGame = () => {
        setGameStarted(false);
        if (clickTimer) clearTimeout(clickTimer);
        alert("Fin del juego", score);
    }

    useEffect(() => {
        const initialPosition = generateRandomPosition();
        setPosition(initialPosition);
    }, [])

    useEffect(() => {
        if (gameStarted && clickTime > 0) {
            const interval = setInterval(() => {
                setClickTime((prevTime) => prevTime - 1);
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [gameStarted, clickTime])

    return (
        <div>
            <h1>Aimlabs</h1>
            <MinigameRulesModal gameName={"aimlabs"} onRulesClosed={handleStart} />

            <div style={{backgroundColor: "#f8f9fa", padding: "10px", display: "flex", justifyContent: "space-between" }}>
                <span>Tiempo de partida: {gameTime}s</span>
                <span>Tiempo para clic: {clickTime}s</span>
                <span>Puntuación: {score}</span>
            </div>

            {gameStarted && (
                <div>
                    <div
                        style={{
                            position: "absolute",
                            top: `${position.top}px`,
                            left: `${position.left}px`,
                            transition: "top 0.2s, left 0.2s",
                        }}
                    >
                        <button
                            className="btn btn-primary"
                            style={{ width: "50px", height: "50px" }}
                            onClick={handleButtonClick}
                        >
                            Click Me!
                        </button>
                    </div>
                </div>
            )}

            {/* <div
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
                    onClick={handleButtonClick}
                >
                    Click Me!
                </button>
            </div> */}
        </div>
    )
}

export default Aimlabs;