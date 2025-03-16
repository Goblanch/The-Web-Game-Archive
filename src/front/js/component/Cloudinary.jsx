import React from 'react'
import { useState } from 'react'
import { editUser } from '../../services/APIServices';
import { useEffect } from 'react';
import { getInfoUser } from '../../services/APIServices';

const Cloudinary = () => {

    const preset_name = "yu1h90st";                       
    const cloud_name = "dud4akxpa"                         

    const [ image, setImage ] = useState('');      
    const [ loading, setLoading ] = useState(false) 
   ////////////////////////////////////////////////////////// 


    const checkInfoUser = async () => {
    
            setLoading(true) 

            try{
                const id = sessionStorage.getItem("id_user")
    
                const info = await getInfoUser(id)
    
                console.log(info);
    
                setImage(info.user_img)

                setLoading(false) 
                
                return 
    
            } catch(error){
    
                console.log(error, "Error al solictar la info de User")
    
            }
        }

         useEffect(() => {
        
        
               
                checkInfoUser()
               
               
                
            }, []);
        
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
            
            const url = {"user_img": file.secure_url} 
           
            console.log(url);
            
            editUser(url)
            
            setLoading(false);                      
        } catch (error) {
            console.error('Error uploading image:', error);
            setLoading(false);
        }

    }

  return (
    <div className='text-center '>
        <h1>Imagen de Perfil</h1>

        {loading ? (
            <h3>Loading...</h3>
        ) : (
        <img src={image} className='rounded-circle' style={{ width: "15em", height: "15em", objectFit: "cover" }} alt="imagen subida"/>
        )}
    

        <br></br>
        

        <input type="file"
        name="file"
        placeholder='Imagen de Perfil'
        // accept='image/png, image/jpeg' 
        onChange={(e)=>uploadImage(e)}
        />
       

    </div>
  );
}

export default Cloudinary





