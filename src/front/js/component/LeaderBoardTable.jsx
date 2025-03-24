import React, { useEffect, useState } from "react";
import { getBestFiveGames, getInfoUser, getLastFiveGames, getMinigameById } from "../../services/APIServices";

const LeaderBoardTable = ({ boardTitle, minigameId, userId }) => {
    const [leaderBoardData, setLeaderBoardData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loggedInUser, setLoggedInUser] = useState(0);

    useEffect(() => {
        const fetchLeaderBoard = async () => {
            try {
                setLoading(true);
                let data;

                if (userId) {
                    data = await getLastFiveGames(userId);
                } else {
                    data = await getBestFiveGames(minigameId);
                }

                if (!Array.isArray(data) || data.length === 0) {
                    setLeaderBoardData([]); // Asigna un array vacío si no hay datos
                    return;
                }

                const updateData = await Promise.all(
                    data.map(async (entry) => {
                        const userInfo = await getInfoUser(entry.user_id);
                        let minigameInfo
                        if (minigameId) {
                            minigameInfo = await getMinigameById(minigameId);
                        } else {
                            minigameInfo = await getMinigameById(entry.minigame_id)
                        }
                        return {
                            ...entry,
                            user_name: userInfo ? userInfo.user_name : "Desconocido",
                            minigameName: minigameInfo ? minigameInfo.title : "Desconocido",
                        };
                    })
                )

                setLeaderBoardData(updateData);
                console.log(leaderBoardData);
            } catch (error) {
                console.error("Error al obtener las leadderboards:", error);
            } finally {
                setLoading(false);
            }


        }

        fetchLeaderBoard();


    }, [minigameId])

    useEffect(() => {
        console.log(sessionStorage.getItem("id_user"));
        const userId = sessionStorage.getItem("id_user");
        setLoggedInUser(userId);
        console.log("USER: " + loggedInUser);
    })


    return (
        <div className="border rounded p-3" style={{ backgroundColor: "rgb(0,24,51)" }}>
            <h2 className="text-light">{boardTitle ? boardTitle : "Leader Board"}</h2>
            {loading ? (
                <p className="text-light">Cargando resultados...</p>
            ) : (
                <div className="table-responsive">
                    <table className="table table-striped table-bordered table-dark text-nowrap">
                        <thead>
                            <tr>
                                <th>Rank</th>
                                <th>Usuario</th>
                                <th>Minijuego</th>
                                <th>Puntuación</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(leaderBoardData) && leaderBoardData.length > 0 ? (
                                leaderBoardData.map((entry, index) => (
                                    <tr key={index}
                                        className={
                                            entry.user_id == loggedInUser
                                                ? "table-success"
                                                : ""
                                        }
                                    >
                                        <td>{index + 1}</td>
                                        <td>{entry.user_name}</td>
                                        <td>{entry.minigameName}</td>
                                        <td>{entry.game_points}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center">No hay datos disponibles</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

export default LeaderBoardTable;