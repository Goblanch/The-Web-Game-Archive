import Swal from "sweetalert2";

const urlApi = process.env.BACKEND_URL







///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////----SERVICIOS DE LA API SOBRE LOS USUARIOS////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const getInfoUser = async (id_user) => {

    try{
        const response = await fetch(urlApi + `user/${id_user}` ,{

            method: "GET",
            headers:{"Content-Type": "application/json"}


        })

        const data = await response.json()

        if (response.ok) {
            
            return data
        }

    } catch (error){

        console.log(error , "No se ha podido acceder al usuario");

    }

}



//////////////////------TESTED--------/////////////////
export const createNewUser = async (userName,email,password,navigate) => {

    try {

        const response = await fetch(urlApi + "user/singup" ,{

            method: "POST",
            body: JSON.stringify({

                "user_name": userName,
                "name": null,
                "last_name": null,
                "user_img": null,
                "email": email,
                "password": password,
                "total_points": 0

            }),
            headers:{"Content-Type": "application/json"}


        })

        const data = await response.json()

        if(response.ok){

            navigate("/user-login")

            return Swal.fire({
                icon: 'success',
                title: `Bienvenido: ${userName}`,
                text: `${data["msg"]}`,
              });    

        }
        else{

            return Swal.fire({
                          icon: 'error',
                          title: 'Error',
                          text: `${data["msg"]}`,
                        });  
            
        }
    
    } catch (error){

        console.log(error , "No se ha podido crear el usuario");

        

    }

}

// export const editUser = async (infoUser) => {

//     try{

//         const response = await fetch( urlApi + "")


//     } catch (error){



//     }


// }


//////////////////------TESTED--------/////////////////
export const logIn = async (infoUser,navigate) => {

   

    try{


        const response = await fetch( urlApi + "user/login" , {

            method: "POST",
            body: JSON.stringify({

                "email": infoUser.email,
                "password": infoUser.password

            }),
            headers: {"Content-Type": "application/json"}


        })

        

        const data = await response.json()

     

        if(response.ok){


            sessionStorage.setItem("token", data.token)
            sessionStorage.setItem("id_user", data.id_user)

            navigate("/users") 


        }
        else{

            return Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `${data["msg"]}`,
              });  


        }

        window.location.reload();

    } catch (error){

        
        console.log(error);
        

    }

}

//////////////////------TESTED--------/////////////////
export const privateRoute = async () => {


    try{

        const token = sessionStorage.getItem("token")

        const response = await fetch( urlApi + "user/private" , {

            method: "GET",
            headers: {"Content-Type": "application/json",
                      "Authorization": `Bearer ${token}`

            }

        })

        if(response.ok){

            
            return true
        }

        if(!response.ok){

            sessionStorage.removeItem("token")

            return false
            
        }

    } catch (error){

        console.log(error, "Error al entrar a private")

    

    }

}

//////////////////------TESTED--------/////////////////
export const editUser = async (infoUser) => {

    try{

        const id_user = sessionStorage.getItem("id_user")

        const response = await fetch( urlApi + `user/${id_user}` , {

            method: "PUT",
            body: JSON.stringify({

                "name": infoUser.name,
                "last_name": infoUser.last_name,
                "email": infoUser.email,
                "password": infoUser.password,
                "user_name": infoUser.user_name,
                "user_img": infoUser.user_img

            }),
            headers: {"Content-Type": "application/json"}

        })

        const data = await response.json()

        if(response.ok){

            window.location.reload()
            
            return print(`El usuario : ${infoUser.email} se ha mofdificado correctamente`)
        }
        else{

            

            return Swal.fire({
                          icon: 'error',
                          title: 'Error',
                          text: `${data["msg"]}`,
                        });         
            
        }

        

    } catch (error){

        console.log(error , "No se ha podido modificar el usuario");  

    }

}

//////////////////------TESTED--------/////////////////
export const deleteUser = async (navigate) => {

    try{

        const id_user = sessionStorage.getItem("id_user")

        const response = await fetch(urlApi + `user/${id_user}`, {

            method: "DELETE",
            headers: {"Content-Type": "application/json"}


        }) 

        if(response.ok){

            sessionStorage.removeItem("token")
			sessionStorage.removeItem("id_user")

            navigate("/user-login"); 

            window.location.reload()

            return Swal.fire({
                icon: 'success',
                title: 'Información',
                text: `${data["msg"]}`,
              });      

        }


    } catch (error) {

        console.log(error , "No se ha podido borrar el usuario");

    }

}


///////////////-----Funcion para borrar todos los played_games de un usuario---------/////////////////
export const deleteAllPlayedGames = async () => {

    try {

        const id_user = sessionStorage.getItem("id_user")
     
        const response = await fetch( urlApi + `played_games/delete_all/${id_user}` ,{

            method: "DELETE",
            headers: {"Content-Type": "application/json"}



        })

        if(response.ok){

            return Swal.fire({
                icon: 'success',
                title: 'Información',
                text: `${data["msg"]}`,
              });      

        }

      

    } catch (error) {
        
        console.log(error , "No se ha podido borrar las partidas guardadas");
    }
    
}


export const addTotalPoints = async (sumTotalPoints,id_user) => {

    try{

        const response = await fetch( urlApi + `user/totalpoints/${id_user}`,{

            method: "PUT",
            body: JSON.stringify({

                "total_points": sumTotalPoints

            }),
            headers: {"Content-Type": "application/json"}

        })


        if(response.ok){

            console.log("Se han sumado los Total Points correctamente");
              

        }
        else{

            console.log("No se han sumado los Total Points correctamente");
        }

    } catch (error){

        console.log(error, "Error al sumar los Total Points")

    }

}


// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////----SERVICIOS DE LA API SOBRE LOS MINIGAMES////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////







// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////----SERVICIOS DE LA API SOBRE LOS PLAYED GAMES////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//////////////////------TESTED--------/////////////////
export const createNewPlayedGame = async (infoPlayedGame) => {

    try {

        const response = await fetch(urlApi + "played_games" ,{

            method: "POST",
            body: JSON.stringify({

                "user_id": infoPlayedGame.user_id ,
                "minigame_id": infoPlayedGame.minigame_id,
                "game_data": infoPlayedGame.game_data,
                "game_points": infoPlayedGame.game_points,
                "record": infoPlayedGame.record,
                "mithril_per_second": infoPlayedGame.mithril_per_second,
                

            }),
            headers:{"Content-Type": "application/json"}


        })

        const data = await response.json()

        if(response.ok){


           console.log("Se pudo crear el Played Game",data);
            

        }
        
    } catch (error){

        console.log(error , "No se ha podido crear el Played Game");
    }

}

////////////////Función que devuelva las 5 últimas partidas jugadas (de cualquier minijuego)///////////////
export const getLastFiveGames = async (id_user) => {

    try{
        const response = await fetch(urlApi + `played_games/last_games/${id_user}` ,{

            method: "GET",
            headers:{"Content-Type": "application/json"}


        })

        const data = await response.json()

        if (response.ok) {
            
            return data
        }

    } catch (error){

        console.log(error , "No se ha podido acceder al usuario");

    }

    
} 

//////////////////Función que obtenga las 5 mejores partidas de un minijuego.//////////////
export const getBestFiveGames = async (id_minigame) => {

    try{
        const response = await fetch(urlApi + `played_games/best_games/${id_minigame}` ,{

            method: "GET",
            headers:{"Content-Type": "application/json"}


        })

        const data = await response.json()

        if (response.ok) {
            
            return data
        }

    } catch (error){

        console.log(error , "No se ha podido acceder al usuario");

    }

    
} 

////////////////////////Función que devuelva todos los datos de un minijuego////////////////////////
export const getMinigameById = async (id_minigame) => {

    try{
        const response = await fetch(urlApi + `minigame/${id_minigame}` ,{

            method: "GET",
            headers:{"Content-Type": "application/json"}


        })

        const data = await response.json()

        if (response.ok) {
            
            return data
        }

    } catch (error){

        console.log(error , "No se ha podido acceder al minigame");

    }
  
} 


