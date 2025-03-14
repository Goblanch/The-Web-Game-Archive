import React, { useState, useEffect } from "react";

const HigherLower = () => {
    const [currentMovie, setCurrentMovie] = useState(null);
    const [nextMovie, setNextMovie] = useState(null);
    const [score, setScore] = useState(0);
    const [isCorrect, setIsCorrect] = useState(null);

    const apiKey = process.env.TMDB_API_KEY;

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
    }

    const handleGuess = (guessHigher) => {
        const higher = nextMovie.vote_average > currentMovie.vote_average;
        if (guessHigher === higher) {
            setScore(score + 1);
            setIsCorrect(true);
            setTimeout(async () => {
                setCurrentMovie(nextMovie);
                const newMovie = await fetchRandomMovie();
                setNextMovie(newMovie);
                setIsCorrect(null);
            }, 1000);
        } else {
            setIsCorrect(false);
        }
    }

    useEffect(() => {
        startGame();
    }, [])

    if (!currentMovie || !nextMovie) return <div>Loading...</div>;

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-6 d-flex justify-content-center p-0 position-relative">
                    <img
                        src={`https://image.tmdb.org/t/p/w300${currentMovie.poster_path}`}
                        alt={currentMovie.title}
                        className="img-fluid h-100 w-100 mx-auto p-0"
                        style={{
                            objectFit: "cover",
                            filter: "brightness(0.5)", // Oscurece la imagen un 30%
                        }}
                    />

                    <div
                        className="position-absolute top-0 p-5 mt-4 start-50 translate-middle text-center"
                        style={{
                            color: "white",
                            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)", // Añade sombra para mejor visibilidad
                            fontSize: "1.5rem",
                            fontWeight: "bold",
                        }}
                    >
                        <h1 className="mt-5 fw-bold">{currentMovie.title}</h1>
                        <h2>Vote Average: {currentMovie.vote_average}</h2>
                    </div>

                </div>

                <div className="col-6 d-flex justify-content-center p-0 position-relative">
                    <img
                        src={`https://image.tmdb.org/t/p/w300${nextMovie.poster_path}`}
                        alt={nextMovie.title}
                        className="img-fluid h-100 w-100 mx-auto p-0"
                        style={{
                            objectFit: "cover",
                            filter: "brightness(0.5)", // Oscurece la imagen un 30%
                        }}
                    />

                    <div
                        className="position-absolute top-0 p-5 mt-4 start-50 translate-middle text-center"
                        style={{
                            color: "white",
                            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)", // Añade sombra para mejor visibilidad
                            fontSize: "1.5rem",
                            fontWeight: "bold",
                        }}
                    >
                        <h1 className="mt-5 fw-bold">{nextMovie.title}</h1>
                        <h2>Vote Average: {isCorrect ? nextMovie.vote_average : "???"}</h2>
                    </div>
                </div>

                <div className="position-relative">
                    <button
                        className="btn btn-success btn-lg"
                        style={{
                            position: "fixed",
                            top: "45%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            zIndex: 9999, // Asegura que el botón esté sobre otros elementos
                        }}
                    >
                        Higher
                    </button>

                    <button
                        className="btn btn-danger btn-lg"
                        style={{
                            position: "fixed",
                            top: "55%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            zIndex: 9999, // Asegura que el botón esté sobre otros elementos
                        }}
                    >
                        Lower
                    </button>

                </div>
            </div>
        </div >
    );
}

export default HigherLower;