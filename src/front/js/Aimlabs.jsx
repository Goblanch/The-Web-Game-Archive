import React, { useState, useEffect, useRef } from "react";
import minigamesData from "../../../public/minigames.json";

import MinigameRulesModal from "./component/MinigameRulesModal.jsx";
import GameOverModal from "./component/GameOverModal.jsx";
import AimlabsGameData from "./component/AimlabsGameData.jsx";

const Aimlabs = () => {
    const gameData = minigamesData.find((game) => game.name === "aimlabs");

    const [position, setPosition] = useState({ top: 50, left: 50 });
    const [gameStarted, setGameStarted] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [gameTime, setGameTime] = useState(gameData.game_time);
    const [clickTime, setClickTime] = useState(gameData.click_time);
    const [score, setScore] = useState(0);

    const clickTimer = useRef(null);
    const gameTimer = useRef(null);

    const generateRandomPosition = () => {
        const buttonSizeVW = 10; // Button width in vw
        const buttonSizeVH = 5;  // Button height in vh

        const randomTop = Math.random() * (100 - buttonSizeVH);
        const randomLeft = Math.random() * (100 - buttonSizeVW);

        return { top: randomTop, left: randomLeft };
    };

    const handleButtonClick = (event) => {
        const newPosition = generateRandomPosition();
        setPosition(newPosition);
        setScore((prev) => prev + gameData.points);

        // Eliminar el foco del ratón manualmente.
        event.target.blur();
        resetClickTimer();
    };

    const resetClickTimer = () => {
        if (clickTimer.current) clearTimeout(clickTimer.current);
        setClickTime(gameData.click_time);
        clickTimer.current = setTimeout(() => {
            handleEndGame();
        }, gameData.click_time * 1000);
    };

    const handleStart = () => {
        setGameStarted(true);
        resetClickTimer();

        gameTimer.current = setInterval(() => {
            setGameTime((prevTime) => {
                if (prevTime <= 1) {
                    clearInterval(gameTimer.current);
                    handleEndGame();
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);
    };

    const handleEndGame = () => {
        setGameStarted(false);
        setGameOver(true);

        // Detener ambos temporizadores
        if (clickTimer.current) clearTimeout(clickTimer.current);
        if (gameTimer.current) clearInterval(gameTimer.current);
    };

    const handleRetry = () => {
        setPosition(generateRandomPosition());
        setGameTime(gameData.game_time);
        setClickTime(gameData.click_time);
        setScore(0);
        setGameOver(false);
        handleStart();
    }

    useEffect(() => {
        const initialPosition = generateRandomPosition();
        setPosition(initialPosition);
    }, []);

    useEffect(() => {
        if (gameStarted && clickTime > 0) {
            const interval = setInterval(() => {
                setClickTime((prevTime) => prevTime - 1);
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [gameStarted, clickTime]);

    return (
        <div className="container-fluid bg-secondary vh-100 d-flex flex-column justify-content-start align-items-center">
            <h1 className="text-warning fw-bold mb-4">Aimlabs</h1>
            <MinigameRulesModal gameName={"aimlabs"} onRulesClosed={handleStart} />

            <AimlabsGameData gameTime={gameTime} clickTime={clickTime} score={score} />

            {gameStarted && (
                <div>
                    <div
                        style={{
                            position: "absolute",
                            top: `${position.top}%`,
                            left: `${position.left}%`,
                            transition: "top 0.2s, left 0.2s",
                            width: "10vw",
                            height: "5vw"
                        }}
                    >
                        <button
                            className="btn btn-warning"
                            style={{ width: "100px", height: "50px" }}
                            onClick={handleButtonClick}
                            tabIndex="-1" // Evitar navegación con tabulador
                        >
                            Click Me!
                        </button>
                    </div>
                </div>
            )}

            {/* Modal de Game Over */}
            <GameOverModal
                score={score}
                onRetry={handleRetry}
                show={gameOver}
            />
        </div>
    );
};

export default Aimlabs;
