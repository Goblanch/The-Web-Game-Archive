

const urlApi = process.env.BACKEND_URL

console.log(urlApi);




///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////----SERVICIOS DE LA API SOBRE LOS USUARIOS////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const createNewUser = async (userName,email,password) => {

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

        if(response.ok){

            return print(`El usuario : ${email} se ha creado correctamente`)
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

// export const logIn = async (infoUser,navigate) => {

    

//     try{

//         const response = await fetch( urlApi + "user/login" , {

//             method: "POST",
//             body: JSON.stringify({

//                 "email": infoUser.email,
//                 "passwword": infoUser.password

//             }),
//             headers: {"Content-Type": "application/json"}


//         })

//         const data = await response.json

//         if(response.ok){


//             sessionStorage.setItem("token", data.token)

//             navigate("/private")

//         }



//     } catch (error){


//         console.log(error);
        

//     }

// }

// export const privateRoute = async (infoUser) => {


//     try{

//         const token = sessionStorage.getItem("token")

//         const response = await fetch( urlApi + "user/private" , {

//             method: "GET",
//             headers: {"Content-Type": "application/json",
//                       "Authorization": `Bearer ${token}`

//             }

//         })

//         if(response.ok){

//             console.log("Puedes entrar a private");
            
//             return true
//         }

//     } catch (error){

//         console.log(error, "Error al entrar a private")

//     }



// }

// export const addTotalPoints = async (sumTotalPoints,id_user) => {

//     try{

//         const response = await fetch( urlApi + `user/totalpoints/${id_user}`,{

//             method: "POST",
//             body: JSON.stringify({

//                 "total_points": sumPoints

//             })



//         })

//     } catch (error){

//         console.log(error, "Error al sumar los Total Points")

//     }



// }


// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////----SERVICIOS DE LA API SOBRE LOS MINIGAMES////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////







// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////----SERVICIOS DE LA API SOBRE LOS PLAYED GAMES////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// export const addGamePoints = async (sumGamePoints,id_played_game) => {

//     try{

//         const response = await fetch( urlApi + `played_games/game_points/${id_played_game}`,{

//             method: "POST",
//             body: JSON.stringify({

//                 "game_points": sumGamePoints

//             })

//         })

//     } catch (error){

//         console.log(error,"Error al sumar los Game Points");
        
//     }

// }

