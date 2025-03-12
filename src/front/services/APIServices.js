import { useNavigate } from "react-router-dom";


const urlApi = process.env.BACKEND_URL


console.log(urlApi);




///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////----SERVICIOS DE LA API SOBRE LOS USUARIOS////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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

        if(response.ok){

            navigate("/user-login")

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

        console.log(data)

        if(response.ok){


            sessionStorage.setItem("token", data.token)

            navigate("/users")

        }



    } catch (error){

        console.log("es aqui");
        
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

            console.log("Puedes entrar a private");
            
            return true
        }

        if(!response.ok){

            return false
        }

    } catch (error){

        console.log(error, "Error al entrar a private")

    

    }

}

//////////////////------TESTED--------/////////////////
export const editUser = async (infoUser) => {

    try{

        const response = await fetch( urlApi + "user" , {

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

        if(response.ok){

            return print(`El usuario : ${infoUser.email} se ha mofdificado correctamente`)
        }

    } catch (error){

        console.log(error , "No se ha podido modificar el usuario");

    }

}
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

