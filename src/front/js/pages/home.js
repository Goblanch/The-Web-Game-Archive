import React, { useContext } from "react";
import { Context } from "../store/appContext";
import logo from "../../img/logo.png";
import "../../styles/index.css";
import backgroundImage from '../../img/fondo5.jpg'
import MinigameCard from "./MinigameCard.jsx";
import { Footer } from "../component/footer.js";

const cards = [
	{
		image: backgroundImage,
		title: "Who's that Pokemon?",
		description: "Descripcion1",
		view: "Pokemon"
	},
	{
		image: backgroundImage,
		title: "Aimlab",
		description: "Descripcion2",
		view: "Aimlabs"
	},
	{
		image: backgroundImage,
		title: "FairPrice",
		description: "Descripcion3",
		view: "FairPrice"
	},
	{
		image: backgroundImage,
		title: "MithrilClicker",
		description: "Descripcion4",
		view: "MithrilClicker"
	},
	{
		image: backgroundImage,
		title: "Potterdle",
		description: "Descripcion5",
		view: "Potterdle"
	},
	{
		image: backgroundImage,
		title: "HigherLowerGame",
		description: "Descripcion6",
		view: "HigherLower"
	}
];

export const Home = () => {
	const { store, actions } = useContext(Context);

	//Llamada a la API

	return (
		<div className="text-center home-background" style={{ backgroundImage: `url(${backgroundImage})` }}>
			<p>
				<img src={logo} />
			</p>
			<div>
				<h1 className="text-white">¡Bienvenido!</h1>
				<p className="text-white">
					The Game Web Archive es una página de recopilación de algunos de los minijuegos famosos de internet.
				</p>
				<p className="text-white">
					Puedes acceder a nuestros juegos desde tu ordenador, smartphone o tablet, así que puedes disfrutarlos en todas partes!
				</p>
			</div>
			<div className="container">
				<div className="row">
					{cards.map((item, index) => (
						<div className="col-12 col-sm-6 col-md-4 col-lg-4 mb-5" key={index}>
							<MinigameCard cards={item} />
						</div>
					))}
				</div>
			</div>
			<Footer/>
		</div>
	);
};
