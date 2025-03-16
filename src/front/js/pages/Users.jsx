import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import { useContext } from "react";
import profilePic from "../../img/rigo-baby.jpg"
import backgroundImage from '../../img/fondo5.jpg'
import '../../styles/index.css';
import { privateRoute } from "../../services/APIServices";
import { editUser , deleteUser } from "../../services/APIServices";
import Swal from 'sweetalert2';
import Cloudinary from "../component/Cloudinary.jsx";
import { getInfoUser } from "../../services/APIServices";


const Users = () => {

    const [isAuthtenticated,setIsAuthenticated] = useState(null)
    const [allIfoUser,setAllInfoUser] = useState(null)
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

    const checkInfoUser = async () => {


        try{
            const id = sessionStorage.getItem("id_user")

            const info = await getInfoUser(id)
  

            setAllInfoUser(info)
            
            return 

        } catch(error){

            console.log(error, "Error al solictar la info de User")

        }
    }

    useEffect(() => {

        checkAuth()

       
        checkInfoUser()
       
       
        
    }, []);

    

  

    const [userInfo,setUserInfo] = useState()
    const [error,setError] = useState()

    const handleOnchange = (event) => {


        setUserInfo({...userInfo , [event.target.name]: event.target.value})   

    }

    const checkPassword = () => {
        return userInfo.password === userInfo.confirm_password;
    }


    ///////////////////////////////////////////////////////////////////////////

    const [profilePic, setProfilePic] = useState("");


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
            deleteUser();
            Swal.fire('Usuario eliminado', 'Tu cuenta ha sido eliminada con éxito', 'success');
            navigate("/user-login");  // Redirigir al login
          } else {
            // Si el usuario cancela la acción
            Swal.fire('Cancelado', 'No se ha borrado el usuario', 'info');
          }
        });
      };

    const handleGuardarCambios  = (e) =>{

        e.preventDefault();
  

        if (!userInfo) {
            return Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Debes rellenar algun campo para poder modificar tus datos',
            });
          }

        if(userInfo && userInfo.password){

            if (!checkPassword()) {
                setError("Passwords do not match. Please make sure they match.")
                setUserInfo("password","")
                setUserInfo("confirm_password","")
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

               

                <div className="home-background" style={{ backgroundImage: `url(${backgroundImage})` }}>
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
                                        <input type="text" defaultValue={allIfoUser.name ? allIfoUser.name : "No has introducido un Name"} className="form-control" name="name" onChange={(e) => handleOnchange(e)} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Apellidos</label>
                                        <input type="text" defaultValue={allIfoUser.last_name ? allIfoUser.last_name : "No has introducido un Last Name"} className="form-control" name="last_name" onChange={(e) => handleOnchange(e)} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Email</label>
                                        <input type="text" defaultValue={allIfoUser.email} className="form-control" name="email" onChange={(e) => handleOnchange(e)} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Nombre de usuario</label>
                                        <input type="text" defaultValue={allIfoUser.user_name} className="form-control" name="user_name" onChange={(e) => handleOnchange(e)} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Password</label>
                                        <input type="password" className="form-control" name="password" onChange={(e) => handleOnchange(e)} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Confirm Password</label>
                                        <input type="password"  className="form-control" name="confirm_password" onChange={(e) => handleOnchange(e)} />
                                    </div>
                                    <div className="mb-3">
                                        <button className="btn btn-danger m-3"  onClick={(e) => {handleGuardarCambios(e)}}>
                                            CONFIRMAR CAMBIOS
                                        </button>
                                        <button className="btn btn-danger" onClick={(e) => {handleEliminarUser(e)}}>
                                            ELIMINAR USUARIO
                                        </button>
                                    </div>
                                </div>


                                <div className="col-md-6 d-flex flex-column align-items-center justify-content-center ">
                                
                                    <Cloudinary/>
                                   
                                    
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