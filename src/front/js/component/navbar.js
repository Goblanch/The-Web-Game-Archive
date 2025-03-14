import React from "react";
import { Link } from "react-router-dom";
import '../../styles/index.css';
import logo from "../../img/logo.png";
import { Context } from "../store/appContext";
import { useContext } from "react";

export const Navbar = () => {
	const { store, actions } = useContext(Context);

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
					{!store.isAuthenticated ? (
						<>
							<Link to="User-Register" className="btn btn-outline-danger me-2">Register</Link>
							<Link to="User-Login" className="btn btn-danger">Log In</Link>
						</>
					) : (
						<>
						    <Link to="Users" className="btn btn-danger me-2">👤 Profile</Link>
							<button onClick={actions.logout} className="btn btn-outline-danger me-2">
								Logout
							</button>
						</>
					)}
				</div>

			</div>
		</nav>
	);
};
