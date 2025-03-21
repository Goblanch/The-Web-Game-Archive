import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import '../../styles/index.css';
import logo from "../../img/logo.png";
import { useContext , useEffect} from "react";
import { privateRoute } from "../../services/APIServices";
import { getInfoUser } from "../../services/APIServices";
import Swal from "sweetalert2";

export const Navbar = () => {
	

	const [isVerificated, setVerificated] = useState(false)
	const [imgUser,setImgUser] = useState("")

	const navigate = useNavigate()

	const checkVerificated = async () => {

		const auth = await privateRoute()

		setVerificated(auth)

		if (!auth) {

			 // Mostrar un SweetAlert2 de confirmación sin campo de texto
				return	Swal.fire({
						title: 'Debes Logearte para poder guardar tus partidas',
						text: 'Puedes seguir jugando sin guardar o pulsar el boton Login',
						icon: 'warning',
						showCancelButton: true,
						confirmButtonText: 'Login',
						cancelButtonText: 'Seguir sin registrarse',
						reverseButtons: true  // Cambiar el orden de los botones
					}).then((result) => {
						if (result.isConfirmed) {
							
							navigate("/user-login");  // Redirigir al login
						} else {
							// Si el usuario cancela la acción
							Swal.fire('Bienvenido', 'Seguiras jugando sin guardar', 'info');
						}
					});
		   
		}

	}
	const checkInfoUser = async () => {
	
	
			try{
				const id = sessionStorage.getItem("id_user")
	
				const info = await getInfoUser(id)
	  
				if(info.user_img){
					
					setImgUser(info.user_img)
				}
				
				
				return 
	
			} catch(error){
	
				console.log(error, "Error al solictar la info de User")
	
			}
		}

	 useEffect(() => {
	
			checkVerificated()

			checkInfoUser()

			
	
		}, []);
		


	  const handleLogOut = () => {
	
			setVerificated(false)
	
			sessionStorage.removeItem("token")

			sessionStorage.removeItem("id_user")
	
			navigate("/user-login")
	
		}

	return (
		<nav className="navbar navbar-expand-lg py-4 navbar-background" >
			<div className="container">
				<div className="navbar-brand text-dark fs-4">
					<img src={logo} alt="Logo" height="70em" width="auto" />
				</div>
				<div className="collapse navbar-collapse justify-content-center" id="navbarNav">
					<ul className="navbar-nav">
						<li className="nav-item fs-5 ms-4">
							<Link to="/" className="nav-link text-white fs-5">Home</Link>
						</li>
						<li className="nav-item fs-5 ms-4">
							<Link to="/Leaderboards" className="nav-link text-white fs-5">Leaderboards</Link>
						</li>
					</ul>
				</div>
				<div className="d-flex">
					{!isVerificated ? (
						<>
							<Link to="User-Register" className="btn btn-outline-danger me-2">Register</Link>
							<Link to="User-Login" className="btn btn-danger">Log In</Link>
						</>
					) : (
						<>
						    
							{
								imgUser ? (
									<Link to="Users" className="me-2 rounded-circle">
										<img src={imgUser} className='rounded-circle border border-2 border-danger' style={{ width: "3.5em", height: "3.5em", objectFit: "cover" }} alt="👤 Profile"/>
									</Link>
								) : (

									<Link to="Users" className="btn btn-danger me-2">👤 Profile</Link>
								)

							}
					
							
							
							<button onClick={handleLogOut} className="btn btn-outline-danger me-2">
								Logout
							</button>
						</>
					)}
				</div>

			</div>
		</nav>
	);
};
