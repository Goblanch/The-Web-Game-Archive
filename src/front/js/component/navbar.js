import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import '../../styles/index.css';
import logo from "../../img/logo.png";
import { useContext , useEffect} from "react";
import { privateRoute } from "../../services/APIServices";
import { getInfoUser } from "../../services/APIServices";

export const Navbar = () => {
	

	const [isVerificated, setVerificated] = useState(false)
	const [imgUser,setImgUser] = useState("")

	const navigate = useNavigate()

	const checkVerificated = async () => {

		const auth = await privateRoute()

		setVerificated(auth)

	}
	const checkInfoUser = async () => {
	
	
			try{
				const id = sessionStorage.getItem("id_user")
	
				const info = await getInfoUser(id)
	  
				if(info.user_img){

					console.log(info.user_img);
					
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
						    <Link to="Users" className="me-2 rounded-circle">
							<img src={imgUser} className='rounded-circle border border-2 border-danger' style={{ width: "3.5em", height: "3.5em", objectFit: "cover" }} alt="👤 Profile"/>
							
							</Link>
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
