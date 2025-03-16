import React from "react";
import backgroundImage from '../../img/fondo5.jpg'
import { useState } from "react";
import { useEffect } from "react";

const LeaderBoards = () => {
    const [filtro, setFiltro] = useState("Selecciona un minijuego");
    const [minigames, setMinigames] = useState([]);

    useEffect(() => {
        // Aquí se hace la llamada a la API
        const fetchMinigames = async () => {
            try {
                

            } catch (error) {
                console.error("Error al cargar los minijuegos:", error);
            }
        };
        fetchMinigames();
    }, []);

    return (
        <div className="home-background" style={{ backgroundImage: `url(${backgroundImage})` }}>
            <div className="container mt-0">
                <h1 className="text-center text-white">Leaderboards</h1>
                <div className="d-flex m-3">
                    <label className="text-white me-4">Selecciona un minijuego para ver su leaderboard: </label>
                    <select
                        id="filtro"
                        className="form-select"
                        style={{ width: "50%" }}
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value)}
                    >
                        <option value="Selecciona un minijuego">Selecciona un minijuego</option>
                        {/* Aquí llenamos las opciones del filtro con los títulos de los minijuegos */}
                        {minigames.map((minigame) => (
                            <option key={minigame.title} value={minigame.title}>
                                {minigame.title}
                            </option>
                        ))}

                    </select>
                </div>
                <h3 className="text-center text-white">{filtro}</h3>
                <table className="table table-bordered text-white border-dark mb-0">
                    <thead>
                        <tr className="bg-light">
                            <th className="text-center" style={{ width: "10%" }}>RANK</th>
                            <th className="text-center" style={{ width: "45%" }}>USERNAME</th>
                            <th className="text-center" style={{ width: "45%" }}>SCORE</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-dark">
                            <td className="text-center">1</td>
                            <td>Dato 1</td>
                            <td>Dato 2</td>
                        </tr>
                        <tr className="border-dark">
                            <td className="text-center">2</td>
                            <td>Dato 3</td>
                            <td>Dato 4</td>
                        </tr>
                        <tr className="border-dark">
                            <td className="text-center">3</td>
                            <td>Dato 5</td>
                            <td>Dato 6</td>
                        </tr>
                        <tr className="border-dark">
                            <td className="text-center">4</td>
                            <td>Dato 7</td>
                            <td>Dato 8</td>
                        </tr>
                        <tr className="border-dark">
                            <td className="text-center">5</td>
                            <td>Dato 9</td>
                            <td>Dato 10</td>
                        </tr>
                        <tr className="border-dark">
                            <td className="text-center">6</td>
                            <td>Dato 11</td>
                            <td>Dato 12</td>
                        </tr>
                        <tr className="border-dark">
                            <td className="text-center">7</td>
                            <td>Dato 13</td>
                            <td>Dato 14</td>
                        </tr>
                        <tr className="border-dark">
                            <td className="text-center">8</td>
                            <td>Dato 15</td>
                            <td>Dato 16</td>
                        </tr>
                        <tr className="border-dark">
                            <td className="text-center">9</td>
                            <td>Dato 17</td>
                            <td>Dato 18</td>
                        </tr>
                        <tr className="border-dark">
                            <td className="text-center">10</td>
                            <td>Dato 19</td>
                            <td>Dato 20</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

    )
}

export default LeaderBoards;
