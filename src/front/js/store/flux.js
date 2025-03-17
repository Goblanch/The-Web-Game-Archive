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
			randomPokemon: null,
			pokemonList: [],
			fakeStoreProducts: [],
		},
		actions: {
			// Use getActions to call a function within a fuction
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},

			getMessage: async () => {
				try{
					// fetching data from the backend
					const resp = await fetch(process.env.BACKEND_URL + "/api/hello")
					const data = await resp.json()
					setStore({ message: data.message })
					// don't forget to return something, that is how the async resolves
					return data;
				}catch(error){
					console.log("Error loading message from backend", error)
				}
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
			},

			getPokemonList: async () => {
				try{
					const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1010");
					const data = await response.json();

					const pokemonNames = data.results.map((pokemon) => pokemon.name);
					setStore({pokemonList: pokemonNames});
				}catch(error){
					console.error("Error fetching Pokémon list:", error);
				}
			},

			getStoreProducts: async () => {
				try{
					console.log("Hola");
					const response = await fetch("https://fakestoreapi.com/products")
					if(!response.ok) throw new Error(response.statusText);

					const products = await response.json();
					setStore({fakeStoreProducts: products})
					console.log(products);
					return products;
					
				}catch(error){
					console.error("Error fetching products:", error);
				}
			}
		}
	};
};

export default getState;
