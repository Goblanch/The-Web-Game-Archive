import React, { act, useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import logo from "../../img/logo.png";
import "../../styles/index.css";
import backgroundImage from '../../img/fondo5.jpg'
import pokemonImg from "../../../../public/pokeball.png"
import MinigameCard from "./MinigameCard.jsx";
import { getMinigameById } from "../../services/APIServices.js";

const cards = [
	{
		image: backgroundImage,
		view: "Pokemon"
	},
	{
		image: pokemonImg,
		view: "Aimlabs"
	},
	{
		image: backgroundImage,
		view: "FairPrice"
	},
	{
		image: pokemonImg,
		view: "MithrilClicker"
	},
	{
		image: backgroundImage,
		view: "Potterdle"
	},
	{
		image: backgroundImage,
		view: "HigherLower"
	}
];

export const Home = () => {
	const { store, actions } = useContext(Context);
	const [minigames, setMinigames] = useState([]);

	//Llamada a la API

	useEffect(() => {
		setMinigames(store.minigamesData);
	}, [store.minigamesData])

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
					{minigames.map((item, index) => (
						<div className="col-12 col-sm-6 col-md-4 col-lg-4 mb-5" key={index}>
							<MinigameCard
								title={item.title}
								description={item.description}
								image={cards[index]?.image || backgroundImage}
								view={cards[index]?.view || "/"}
							/>
						</div>
					))}
				</div>
			</div>

		</div>
	);
};
