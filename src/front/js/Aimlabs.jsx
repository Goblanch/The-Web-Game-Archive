import React, { useState, useEffect, useRef } from "react";
import minigamesData from "../../../public/minigames.json";

import MinigameRulesModal from "./component/MinigameRulesModal.jsx";
import GameOverModal from "./component/GameOverModal.jsx";
import AimlabsGameData from "./component/AimlabsGameData.jsx";
import { createNewPlayedGame, addTotalPoints } from "../services/APIServices.js";
import Swal from "sweetalert2";

const Aimlabs = () => {
    const gameData = minigamesData.find((game) => game.name === "aimlabs");

    const [position, setPosition] = useState({ top: 50, left: 50 });
    const [gameStarted, setGameStarted] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [gameTime, setGameTime] = useState(gameData.game_time);
    const [clickTime, setClickTime] = useState(gameData.click_time);
    const [score, setScore] = useState(0);
    const [iconColor, setIconColor] = useState("text-warning");

    const clickTimer = useRef(null);
    const gameTimer = useRef(null);

    const generateRandomPosition = () => {
        const navbarHeightVH = 30;
        const buttonSizeVW = 10;
        const buttonSizeVH = 5;

        const maxTop = 100 - buttonSizeVH;
        const minTop = navbarHeightVH;

        const randomTop = Math.random() * (maxTop - minTop) + minTop;
        const randomLeft = Math.random() * (100 - buttonSizeVH);

        return { top: randomTop, left: randomLeft };
    };

    const handleButtonClick = (event) => {
        const newPosition = generateRandomPosition();
        setPosition(newPosition);
        setScore((prev) => prev + gameData.points);

        setIconColor("text-success");
        setTimeout(() => {
            setIconColor("text-warning");
        }, 250);

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



        //Llamada a la API para guardar las partida y los Total Points
        const isLogin = sessionStorage.getItem("token")

        if (isLogin) {

            const aimLabsInfo = {
                user_id: sessionStorage.getItem("id_user"),
                minigame_id: 2,
                game_data: "Informacion sobre la partida de Aim Labs",
                game_points: score + 1,
                record: null,
                mithril_per_second: null


            }

            createNewPlayedGame(aimLabsInfo)

            addTotalPoints(score, sessionStorage.getItem("id_user"))

            console.log("Se ha subido tu partida");
        } else {

            return Swal.fire({
                icon: 'warning',
                title: 'Warning',
                text: `Debes logearte para poder guardar tus partidas`,
            });

        }

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
        <div
            style={{ backgroundColor: "rgb(10, 35, 70)" }}
            className="container-fluid vh-100 d-flex flex-column justify-content-start align-items-center"
        >
            <h1 className="text-warning fw-bold mb-4 mt-3">Aimlabs</h1>
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
                        <div
                            style={{ width: "50px", height: "50px" }}
                            onClick={handleButtonClick}
                            tabIndex="-1"
                        >
                            <i class={`fa-solid fa-crosshairs fs-1 ${iconColor}`}></i>
                        </div>
                    </div>
                </div>
            )
            }

            {/* Modal de Game Over */}
            <GameOverModal
                score={score}
                onRetry={handleRetry}
                show={gameOver}
            />
        </div >
    );
};

export default Aimlabs;
