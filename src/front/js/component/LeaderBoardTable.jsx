import React, { useEffect, useState } from "react";
import { getBestFiveGames, getInfoUser, getLastFiveGames, getMinigameById } from "../../services/APIServices";

const LeaderBoardTable = ({ minigameId, userId }) => {
    const [leaderBoardData, setLeaderBoardData] = useState([]);
    const [loading, setLoading] = useState(true);

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
            } catch (error) {
                console.error("Error al obtener las leadderboards:", error);
            } finally {
                setLoading(false);
            }


        }

        fetchLeaderBoard();
    }, [minigameId])

    return (
        <div className="border rounded p-3" style={{ backgroundColor: "#001833" }}>
            <h2 className="text text-light">Leader Board</h2>
            {loading ? (
                <p className="text text-light">Cargando resultados...</p>
            ) : (
                <table className="table table-striped table-bordered">
                    <thead>
                        <tr>
                            <th className="text text-light">Rank</th>
                            <th className="text text-light">Usuario</th>
                            <th className="text text-light">Minijuego</th>
                            <th className="text text-light">Puntuación</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(leaderBoardData) && leaderBoardData.length > 0 ? (
                            leaderBoardData.map((entry, index) => (
                                <tr key={index}>
                                    <td className="text text-light">{index + 1}</td>
                                    <td className="text text-light">{entry.user_name}</td>
                                    <td className="text text-light">{entry.minigameName}</td>
                                    <td className="text text-light">{entry.game_points}</td>
                                </tr>
                            ))
                        ) : (
                            <td colSpan="4" className="text-center text-light">
                                No hay datos disponibles
                            </td>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    )
}

export default LeaderBoardTable;