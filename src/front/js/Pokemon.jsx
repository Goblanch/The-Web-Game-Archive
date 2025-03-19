import React, { useContext, useEffect, useState } from "react";
import { Context } from "./store/appContext";
import MinigameRulesModal from "./component/MinigameRulesModal.jsx";
import GameOverModal from "./component/GameOverModal.jsx";
import PokemonHints from "./component/PokemonHints.jsx";
import PokemonGameData from "./component/PokemonGameData.jsx";
import SearchBar from "./component/SearchBar.jsx";
import { createNewPlayedGame , addTotalPoints } from "../services/APIServices.js";

import WhosThatPokemonImg from "../../../public/whosthatpokemon.png";
import minigamesData from "../../../public/minigames.json";

const Pokemon = () => {
    const { store, actions } = useContext(Context);

    const [showSilhouette, setShowSilhouette] = useState(true);
    const [hintTrigger, setHintTrigger] = useState(0);
    const [lives, setLives] = useState(4);
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [gameOver, setGameOver] = useState(false);

    const pokemonGameData = minigamesData.find((game) => game.name === "pokemon");
    const points = pokemonGameData ? pokemonGameData.points : 0;

    const handleUserGuess = (guess) => {
        const formattedInput = guess.toLowerCase();

        if (formattedInput === store.randomPokemon.name) {
            handleCorrectGuess();
        } else {
            handleBadGuess();
        }
    };

    const handleCorrectGuess = () => {
        console.log("SUCCESS");
        setScore((prev) => prev + points);
        // TODO: Añadir llamada a API de usuarios para añadir puntos.
        setStreak((prev) => prev + 1);
        setShowSilhouette(false);
    };

    const handleBadGuess = () => {
        setHintTrigger((prev) => prev + 1);
        setLives((prev) => prev - 1);
        console.log(store.randomPokemon.name);
    };

    const handleGameOver = () => {
        console.log("GAME OVER");
        setShowSilhouette(false);
        setGameOver(true);
        // TODO: añadir llamada a API de usuarios para insertar nueva fila de DB de partidas jugadas.
        const isLogin = sessionStorage.getItem("token")
        if(isLogin){

            const pokeInfo = {
                user_id: sessionStorage.getItem("id_user"),
                minigame_id: 1,
                game_data: "Informacion sobre la partida de Whos that Pokemon",
                game_points: score,
                record: streak,
                mithril_per_second: null
            } 

            
            createNewPlayedGame(pokeInfo)

            addTotalPoints(score,sessionStorage.getItem("id_user"))

            console.log("Se ha subido tu partida");
            
        }else{

            console.log("No estas logeado no puedes guardar tu partida");
            
        }   
        
           
    };

    const handleRetry = () => {
        setGameOver(false);
        setShowSilhouette(true);
        setHintTrigger(0);
        setScore(0);
        setStreak(0);
        setLives(4);
        actions.getRandomPokemon();
    };

    const handleNextPokemon = () => {
        actions.getRandomPokemon();
        setShowSilhouette(true);
        setHintTrigger(0);
        setLives(4);
    };

    useEffect(() => {
        actions.getPokemonList();
        actions.getRandomPokemon();
    }, []);

    return (
        <div className="container mt-4">
            <MinigameRulesModal gameName={"pokemon"} />
            <GameOverModal score={score} onRetry={handleRetry} show={gameOver} />

            <div className="row">
                <div className="col-lg-3 order-2 order-lg-1 mt-3 mt-lg-0">
                    <PokemonHints
                        pokemon={store.randomPokemon}
                        triggerHint={hintTrigger}
                        onGameOver={handleGameOver}
                    />
                </div>

                <div className="col-lg-6 order-1 order-lg-2 d-flex flex-column align-items-center">
                    {store.randomPokemon ? (
                        <div className="text-center">
                            <h1>Who's that Pokémon?</h1>
                            <img
                                src={store.randomPokemon.sprites.front_default}
                                alt={store.randomPokemon.name}
                                className={
                                    showSilhouette ? "img-fluid pokemon-silhouette" : "img-fluid"
                                }
                                draggable="false"
                            />
                            <h1
                                style={{ display: showSilhouette ? "none" : "block" }}
                                className="mt-3"
                            >
                                {store.randomPokemon.name}
                            </h1>
                        </div>
                    ) : (
                        <p>Loading Pokémon...</p>
                    )}

                    <div className="mt-3">
                        {showSilhouette ? (
                            <div className="d-flex">
                                <SearchBar
                                    names={store.pokemonList || []} // Lista de nombres de Pokémon
                                    onSelect={handleUserGuess} // Llama al manejador de adivinanzas
                                />
                            </div>

                        ) : (
                            <button onClick={handleNextPokemon} className="btn btn-danger">
                                Next Pokémon
                            </button>
                        )}
                    </div>
                </div>

                <div className="col-lg-3 order-3 mt-3 mt-lg-0">
                    <PokemonGameData
                        remainingLives={lives}
                        score={score}
                        streak={streak}
                    />
                </div>
            </div>
        </div>
    );
};

export default Pokemon;
