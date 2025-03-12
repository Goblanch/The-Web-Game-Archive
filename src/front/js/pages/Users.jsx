import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import { useContext } from "react";
import profilePic from "../../img/rigo-baby.jpg"
import backgroundImage from '../../img/fondo5.jpg'
import '../../styles/index.css';
import { privateRoute } from "../../services/APIServices";

const Users = () => {

    const [isAuthtenticated,setIsAuthenticated] = useState(null)
    const navigate = useNavigate()

    const checkAuth = async () => {

        try{

            const authenticated = await privateRoute()

            if(!authenticated){


                navigate("/user-login")


            }  

            setIsAuthenticated(true)

        } catch (error) {

            console.log(error, "Error al entrar a private")

        }

    }

    useEffect(() => {

        checkAuth()

    }, []);

    ///////////////////////////////////////////////////////////////////////////
    const [userName, setUserName] = useState("");
    const [name, setName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [profilePic, setProfilePic] = useState("");

    const handleEliminarUser  = () =>{
        
    }

    const handleGuardarCambios  = () =>{
        
    }

    return (
        <>
            {
                isAuthtenticated == null ?

                <div className="container">
                        <h1 >Loading..............</h1>
                </div>

                :

                <div className="home-background" style={{ backgroundImage: `url(${backgroundImage})` }}>
                    <div className="container text-white">
                        <h1 className="text-center">Tus datos</h1>
                        <form>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label className="form-label">Nombre</label>
                                        <input type="text" className="form-control" id="name" onChange={(e) => setName(e.target.value)} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Apellidos</label>
                                        <input type="text" className="form-control" id="last-name" onChange={(e) => setLastName(e.target.value)} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Email</label>
                                        <input type="text" className="form-control" id="email" onChange={(e) => setEmail(e.target.value)} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Nombre de usuario</label>
                                        <input type="text" className="form-control" id="user-name" onChange={(e) => setUserName(e.target.value)} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Password</label>
                                        <input type="password" className="form-control" id="password" onChange={(e) => setPassword(e.target.value)} />
                                    </div>
                                    <div className="mb-3">
                                        <button className="btn btn-danger m-3" onClick={handleGuardarCambios}>
                                            CONFIRMAR CAMBIOS
                                        </button>
                                        <button className="btn btn-danger" onClick={handleEliminarUser}>
                                            ELIMINAR USUARIO
                                        </button>
                                    </div>
                                </div>


                                <div className="col-md-6 d-flex flex-column align-items-center justify-content-center ">
                                    <h2 className="form-label">Imagen de perfil</h2>
                                    <img
                                        src={profilePic}
                                        className="img-fluid rounded-circle mb-3"
                                        alt="Profile"
                                        style={{ width: "15em", height: "15em", objectFit: "cover" }}
                                    />
                                    <label className="d-block">Cambiar la URL de tu imagen:</label>
                                    <input
                                        type="text"
                                        className="form-control w-75 mt-2"
                                        placeholder="URL de la nueva imagen"
                                        onChange={(e) => setProfilePic(e.target.value)}
                                    />
                                </div>
                            </div>
                        </form>
                        <div className="container mt-4 border-top border-2">
                            <h2 className="text-center text-white mb-3 mt-3">Historial de las últimas 5 partidas</h2>
                            <table className="table table-bordered text-center text-white mb-0">
                                <thead className="table">
                                    <tr className="text-white">
                                        <th>Minijuego</th>
                                        <th>Puntos conseguidos</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Dato 1</td>
                                        <td>Dato 2</td>
                                    </tr>
                                    <tr>
                                        <td>Dato 3</td>
                                        <td>Dato 4</td>
                                    </tr>
                                    <tr>
                                        <td>Dato 5</td>
                                        <td>Dato 6</td>
                                    </tr>
                                    <tr>
                                        <td>Dato 7</td>
                                        <td>Dato 8</td>
                                    </tr>
                                    <tr>
                                        <td>Dato 9</td>
                                        <td>Dato 10</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                


            }
        
        
        </>


    )
}

export default Users;