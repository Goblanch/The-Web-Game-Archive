import React, { useContext } from "react";
import { Context } from "../store/appContext";
import backgroundImage from '../../img/fondo5.jpg'
import { useState } from "react";
import { useEffect } from "react";
import LeaderBoardTable from "../component/LeaderBoardTable.jsx";
import { FooterFix } from "../component/footerFix.js";

const LeaderBoards = () => {
    const [filtro, setFiltro] = useState(null);
    const { store } = useContext(Context);

    return (
        <>
            <div className="home-background" style={{ backgroundImage: `url(${backgroundImage})` }}>
                <div className="container mt-0">
                    <h1 className="text-center text-white">Leaderboards</h1>
                    <div className="d-flex m-3">
                        <label className="text-white me-4">Selecciona un minijuego para ver su leaderboard: </label>
                        <select
                            id="filtro"
                            className="form-select"
                            style={{ width: "50%" }}
                            value={filtro || "Selecciona un minijuego"}
                            onChange={(e) => setFiltro(e.target.value)}
                        >
                            <option value={null}>Selecciona un minijuego</option>
                            {/* Aquí llenamos las opciones del filtro con los títulos de los minijuegos */}
                            {store.minigamesData.map((minigame, index) => (
                                <option key={index} value={index + 1}>
                                    {minigame.title}
                                </option>
                            ))}
                        </select>
                    </div>
                    {filtro ? (
                        <>
                            <LeaderBoardTable minigameId={parseInt(filtro)} />
                        </>
                    ) : (
                        <h3 className="text-center text-white">Selecciona un minijuego para ver su leaderboard</h3>
                    )}
                </div>
            </div>
            <FooterFix/>
        </>
    );
}

export default LeaderBoards;
