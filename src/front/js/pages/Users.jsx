import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import { useContext } from "react";
import profilePic from "../../img/rigo-baby.jpg"
import backgroundImage from '../../img/fondo5.jpg'
import '../../styles/index.css';
import { privateRoute } from "../../services/APIServices";
import { editUser, deleteUser , deleteAllPlayedGames } from "../../services/APIServices";
import Swal from 'sweetalert2';
import Cloudinary from "../component/Cloudinary.jsx";
import { getInfoUser } from "../../services/APIServices";
import LeaderBoardTable from "../component/LeaderBoardTable.jsx";
import { Footer } from "../component/footer.js";


const Users = () => {

    const [isAuthtenticated, setIsAuthenticated] = useState(null)
    const [userInfo, setUserInfo] = useState({
        name: "",
        last_name: "",
        email: "",
        user_name: "",
        password: "",
        confirm_password: ""

    })
    const [error, setError] = useState()
    const [userScore, setUserScore] = useState(0);

    const navigate = useNavigate()

    const checkAuth = async () => {

        try {

            const authenticated = await privateRoute()

            if (!authenticated) {


                navigate("/user-login")


            }

            setIsAuthenticated(true)

        } catch (error) {

            console.log(error, "Error al entrar a private")

        }

    }


    // Función para actualizar solo el valor de 'name'
    const updateName = (info) => {

        console.log(info);

        setUserInfo(prevState => ({
            ...prevState,       // Mantener los demás valores
            name: info.name,
            last_name: info.last_name,
            email: info.email,
            user_name: info.user_name,

        }));
    };


    useEffect(() => {

        checkAuth()

        const checkInfoUser = async () => {


            try {
                const id = sessionStorage.getItem("id_user")

                const info = await getInfoUser(id)
                setUserScore(info.total_points);

                console.log("Esta es la prueba");
                console.log(info);

                updateName(info)

                return info

            } catch (error) {

                console.log(error, "Error al solictar la info de User")

            }
        }



        checkInfoUser()



    }, []);



    const handleOnchange = (event) => {


        setUserInfo({ ...userInfo, [event.target.name]: event.target.value })

    }

    const checkPassword = () => {
        return userInfo.password === userInfo.confirm_password;
    }


    ///////////////////////////////////////////////////////////////////////////




    const handleEliminarUser = (e) => {
        e.preventDefault();

        // Mostrar un SweetAlert2 de confirmación sin campo de texto
        Swal.fire({
            title: 'Vas a borrar tu usuario y perderás tus datos',
            text: '¿Estás seguro de que deseas eliminar tu cuenta?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar mi cuenta',
            cancelButtonText: 'Cancelar',
            reverseButtons: true  // Cambiar el orden de los botones
        }).then((result) => {
            if (result.isConfirmed) {
                // Llamar a la función deleteUser y redirigir
                deleteUser(navigate);
                Swal.fire('Usuario eliminado', 'Tu cuenta ha sido eliminada con éxito', 'success');
                 
            } else {
                // Si el usuario cancela la acción
                Swal.fire('Cancelado', 'No se ha borrado el usuario', 'info');
            }
        });
    };

    const handleGuardarCambios = (e) => {

        e.preventDefault();


        if (!userInfo) {
            return Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Debes rellenar algun campo para poder modificar tus datos',
            });
        }

        if (userInfo && userInfo.password) {

            if (!checkPassword()) {
                setError("Passwords do not match. Please make sure they match.")
                setUserInfo("password", "")
                setUserInfo("confirm_password", "")
                return;
            }

            setError("");

        }



        editUser(userInfo)

    }

    return (
        <>
            {
                isAuthtenticated == null ?

                    <div className="container">
                        <h1 >Loading..............</h1>
                    </div>

                    :



                    <div className="home-background vh-100" style={{ backgroundImage: `url(${backgroundImage})`}}>
                        <div className="container text-white">
                            {error && (
                                <div className="bg bg-danger border rounded mb-4 p-3">
                                    <h3 className="text text-light">Error</h3>
                                    <p className="text text-light">{error}</p>
                                </div>
                            )}
                            <h1 className="text-center">Tus datos</h1>
                            <form>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">Nombre</label>
                                            <input type="text" value={userInfo.name} placeholder="No has introducido ningun Name" className="form-control" name="name" onChange={(e) => handleOnchange(e)} />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Apellidos</label>
                                            <input type="text" value={userInfo.last_name} placeholder="No has introducido ningun Last Name" className="form-control" name="last_name" onChange={(e) => handleOnchange(e)} />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Email</label>
                                            <input type="text" value={userInfo.email} className="form-control" name="email" onChange={(e) => handleOnchange(e)} />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Nombre de usuario</label>
                                            <input type="text" value={userInfo.user_name} className="form-control" name="user_name" onChange={(e) => handleOnchange(e)} />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Password</label>
                                            <input type="password" className="form-control" name="password" onChange={(e) => handleOnchange(e)} />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Confirm Password</label>
                                            <input type="password" className="form-control" name="confirm_password" onChange={(e) => handleOnchange(e)} />
                                        </div>
                                        <div className="mb-3">
                                            <button className="btn btn-danger m-3" onClick={(e) => { handleGuardarCambios(e) }}>
                                                CONFIRMAR CAMBIOS
                                            </button>
                                            <button className="btn btn-danger" onClick={(e) => { handleEliminarUser(e) }}>
                                                ELIMINAR USUARIO
                                            </button>
                                        </div>
                                    </div>


                                    <div className="col-md-6 d-flex flex-column align-items-center justify-content-center ">
                                        <h2>Puntos ganados: {userScore}</h2>
                                        <Cloudinary />


                                    </div>
                                </div>
                            </form>
                            <LeaderBoardTable userId={sessionStorage.getItem("id_user")} boardTitle={"Historial"} />
                        </div>
                    </div>

            }


            <Footer/>
        </>


    )
}

export default Users;