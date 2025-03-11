import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { logIn } from "../../services/APIServices";

const UserLogin = () => {
   
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleOnSubmit = (e) => {
        e.preventDefault();

        // Hacer la llamada a la api aquí
        
        logIn(email,password,navigate)

    }


    const handleGotoRegister = () => {
        navigate('/user-register');
    }

    return (
        <div className="container">
            <h1 className="mt-3 mb-5 text text-center">Login</h1>

            {error && (
                <div className="bg bg-danger border rounded mb-4 p-3">
                    <h3 className="text text-light">Error</h3>
                    <p className="text text-light">{error}</p>
                </div>
            )}

            <form onSubmit={handleOnSubmit}>
                <div className="row mb-5">
                    <div className="col-lg-2 col-md-12">
                        <h6 className="text">EMAIL</h6>
                    </div>
                    <div className="col-lg-10 col-md-12">
                        <input
                            type="text"
                            className="form-control"
                            id="user-name"
                            placeholder="Enter your user email"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className="row mb-5">
                    <div className="col-lg-2 col-md-12">
                        <h6>PASSWORD</h6>
                    </div>
                    <div className="col-lg-2 col-md-12">
                        <input type="password"
                            className="form-control"
                            id="password"
                            placeholder="Enter your password"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className="d-flex flex-column align-items-center mb-4">
                    <button type="submit" className="btn" style={{ background: "rgb(205, 67, 26)", color: "white", fontSize: "23px" }}>
                        LOG IN
                    </button>
                </div>

            </form>

            <div className="d-flex justify-content-center">
                <button className="btn" style={{ background: "rgb(230, 230, 230)", fontSize: "18px" }} onClick={handleGotoRegister}>
                    DON'T YOU HAVE AN ACCOUNT? REGISTER
                </button>
            </div>

        </div>
    )
}

export default UserLogin;