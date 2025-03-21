import React, { useState, useEffect } from "react";
import MinigameRulesModal from "../component/MinigameRulesModal.jsx"
import GameOverModal from "../component/GameOverModal.jsx"
import Swal from "sweetalert2";
import { createNewPlayedGame, addTotalPoints } from "../../services/APIServices.js";

const HigherLower = () => {
    const [currentMovie, setCurrentMovie] = useState(null);
    const [nextMovie, setNextMovie] = useState(null);
    const [score, setScore] = useState(0);
    const [isCorrect, setIsCorrect] = useState(null);
    const [gameOver, setGameOver] = useState(false);
    const [animatedRating, setAnimatedRating] = useState(0);

    const apiKey = process.env.TMDB_API_KEY;

    // TODO: Arreglar imagenes --> ponerla de imagen de fondo en el div
    // TODO: Dar feedback cuando se pierde con el gameover modal

    const fetchRandomMovie = async () => {
        const url = 'https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc';
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${apiKey}`
            }
        };
        const response = await fetch(url, options)
        const data = await response.json();
        const movies = data.results;
        return movies[Math.floor(Math.random() * movies.length)];
    }

    const startGame = async () => {
        const movieA = await fetchRandomMovie();
        const movieB = await fetchRandomMovie();
        setCurrentMovie(movieA);
        setNextMovie(movieB);
        setScore(0);
        setIsCorrect(null);
        setGameOver(false);
        setAnimatedRating(0);
    }

    const handleGuess = (guessHigher) => {
        const higher = nextMovie.vote_average >= currentMovie.vote_average;
        if (guessHigher === higher) {
            setScore(score + 1);
            setIsCorrect(true);
            setTimeout(async () => {
                setCurrentMovie(nextMovie);
                const newMovie = await fetchRandomMovie();
                setNextMovie(newMovie);
                setIsCorrect(null);
                setAnimatedRating(0);
            }, 2000);
        } else {
            setIsCorrect(false);
            setGameOver(true);

            // TODO: añadir llamada a API de usuarios para insertar nueva fila de DB de partidas jugadas.
            const isLogin = sessionStorage.getItem("token")
            if (isLogin) {

                const higherInfo = {
                    user_id: sessionStorage.getItem("id_user"),
                    minigame_id: 6,
                    game_data: "Informacion sobre la partida de Higher and Lower",
                    game_points: score,
                    record: null,
                    mithril_per_second: null
                }


                createNewPlayedGame(higherInfo)

                addTotalPoints(score, sessionStorage.getItem("id_user"))

                console.log("Se ha subido tu partida");

            } else {

                return Swal.fire({
                                icon: 'warning',
                                title: 'Warning',
                                text: `Debes logearte para poder guardar tus partidas`,
                              });    
                
            }  
        }
        animateRating(nextMovie.vote_average);
    }

    const animateRating = (target) => {
        let current = 0;
        const interval = setInterval(() => {
            current += 0.1;
            if (current >= target) {
                current = target;
                clearInterval(interval);
            }
            setAnimatedRating(current.toFixed(1));
        }, 5)
    }

    useEffect(() => {
        startGame();
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    if (!currentMovie || !nextMovie) return <div>Loading...</div>;

    return (
        <div
            className="container-fluid"
            style={{
                height: "100vh",
                display: "flex",
                flexDirection: "row",
            }}
        >
            <MinigameRulesModal gameName={"higherlower"} />
            <GameOverModal score={score} onRetry={startGame} show={gameOver} />
            {/* Panel de la película actual */}
            <div
                className="col-6 d-flex align-items-center justify-content-center"
                style={{
                    height: "100vh",
                    backgroundImage: `url(https://image.tmdb.org/t/p/w500${currentMovie.poster_path})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                }}
            >
                <div
                    style={{
                        color: "white",
                        textAlign: "center",
                        textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
                        fontSize: "1.5rem",
                        fontWeight: "bold",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        padding: "10px 20px",
                        borderRadius: "10px",
                    }}
                >
                    <h1>{currentMovie.title}</h1>
                    <p>Rating: {currentMovie.vote_average}</p>
                </div>
            </div>

            {/* Panel de la próxima película */}
            <div
                className="col-6 d-flex align-items-center justify-content-center"
                style={{
                    height: "100vh",
                    backgroundImage: `url(https://image.tmdb.org/t/p/w500${nextMovie.poster_path})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                }}
            >
                <div
                    style={{
                        color: "white",
                        textAlign: "center",
                        textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
                        fontSize: "1.5rem",
                        fontWeight: "bold",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        padding: "10px 20px",
                        borderRadius: "10px",
                    }}
                >
                    <h1>{nextMovie.title}</h1>
                    {isCorrect !== null && <p>Rating: {animatedRating}</p>}
                </div>
            </div>

            {/* Botones de acción */}
            <div
                className="d-flex flex-column"
                style={{
                    position: "fixed",
                    top: "55%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    zIndex: 10,
                    display: "flex",
                    gap: "20px",
                }}
            >
                <button
                    className="btn btn-success btn-lg mb-3"
                    onClick={() => handleGuess(true)}
                >
                    Higher
                </button>
                <button
                    className="btn btn-danger btn-lg mt-3"
                    onClick={() => handleGuess(false)}
                >
                    Lower
                </button>
            </div>
        </div>
    );
}

export default HigherLower;