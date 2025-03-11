const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}
			], 
			randomPokemon: null
		},
		actions: {
			// Use getActions to call a function within a fuction
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},

			changeColor: (index, color) => {
				//get the store
				const store = getStore();

				//we have to loop the entire demo array to look for the respective index
				//and change its color
				const demo = store.demo.map((elm, i) => {
					if (i === index) elm.background = color;
					return elm;
				});

				//reset the global store
				setStore({ demo: demo });
			},

			getRandomPokemon : async () => {
				
				try {
					setStore({ randomPokemon: null });
					const randomId = Math.floor(Math.random() * 1010) + 1;
			
					const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
					if (!response.ok) throw new Error(response.statusText);
			
					const pokemon = await response.json();
			
					const speciesResponse = await fetch(pokemon.species.url);
					if (!speciesResponse.ok) throw new Error(speciesResponse.statusText);
			
					const species = await speciesResponse.json();
			
					// Actualizar el store con los datos completos
					const randomPokemon = {
						...pokemon,
						color: species.color, // Agregar el color
						generation: species.generation.name, // Agregar la generación
					};

					setStore({ randomPokemon });
			
					return randomPokemon;
				} catch (error) {
					console.log("Error getting random pokemon:", error);
				}
			}
		}
	};
};

export default getState;
