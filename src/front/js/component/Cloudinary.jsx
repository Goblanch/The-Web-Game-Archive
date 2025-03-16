import React from 'react'
import { useState } from 'react'
import { editUser } from '../../services/APIServices';
import { useEffect } from 'react';

const Cloudinary = () => {

    const preset_name = "yu1h90st";                       
    const cloud_name = "dud4akxpa"                         

    const [ image, setImage ] = useState('');      
    const [ loading, setLoading ] = useState(false) 
//    ////////////////////////////////////////////////////////// 
//     const [allIfoUser,setAllInfoUser] = useState(null)

//     const checkInfoUser = async () => {
    
//             setLoading(true) 

//             try{
//                 const id = sessionStorage.getItem("id_user")
    
//                 const info = await getInfoUser(id)
    
//                 console.log(info);
    
//                 setAllInfoUser(info)

//                 setLoading(false) 
                
//                 return 
    
//             } catch(error){
    
//                 console.log(error, "Error al solictar la info de User")
    
//             }
//         }

//          useEffect(() => {
        
        
               
//                 checkInfoUser()
               
               
                
//             }, []);
        
// //////////////////////////////////////////////////////////////////
    const uploadImage = async (e)=>{            
        const files = e.target.files          
        const data = new FormData()             
        data.append('file', files[0])          
        data.append('upload_preset',preset_name)  

        setLoading(true)                       

        try {
            
            const response = await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, {
                method: 'POST',
                body: data
            });

            const file = await response.json();    
            setImage(file.secure_url);  
            
            // const url = {"user_img": file.secure_url} 
           
            // console.log(url);
            
            // editUser(url)
            
            setLoading(false);                      
        } catch (error) {
            console.error('Error uploading image:', error);
            setLoading(false);
        }

    }

  return (
    <div className='text-center '>
        <h1>Imagen de Perfil</h1>

    

        <input type="file"
        name="file"
        placeholder='Imagen de Perfil'
        // accept='image/png, image/jpeg' 
        onChange={(e)=>uploadImage(e)}
        />

        <br></br>
        
        {loading ? (
            <h3>Loading...</h3>
        ) : (
        <img src={image} className='rounded-circle' style={{ width: "15em", height: "15em", objectFit: "cover" }} alt="imagen subida"/>
        )}
       

    </div>
  );
}

export default Cloudinary





