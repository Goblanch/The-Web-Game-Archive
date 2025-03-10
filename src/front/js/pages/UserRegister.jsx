import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createNewUser } from "../../services/APIServices";

const UserRegister = () => {

    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();


    const handleOnSubmit = (e) => {

        e.preventDefault();

        if (!checkPassword()) {
            setError("Passwords do not match. Please make sure they match.")
            setPassword("");
            setConfirmPassword("");
            return;
        }

        setError("");

        // Hacer llamada a la api aquí
        handleSingup()
    }

    const checkPassword = () => {
        return password === confirmPassword;
    }

    const handleGotoLogin = () => {
        navigate('/user-login');
    }

    const handleSingup = () =>{

        createNewUser(userName,email,password)

        navigate("/user-login")

    }

    return (
        <div className="container">
            <h1 className="mt-3 mb-5 text text-center">Create an Account</h1>

            {error && (
                <div className="bg bg-danger border rounded mb-4 p-3">
                    <h3 className="text text-light">Error</h3>
                    <p className="text text-light">{error}</p>
                </div>
            )}

            <form onSubmit={(e)=>handleOnSubmit(e)}>
                <div className="row mb-5">
                    <div className="col-lg-2 col-md-12">
                        <h6 className="text">USERNAME</h6>
                    </div>
                    <div className="col-lg-10 col-md-12">
                        <input
                            type="text"
                            className="form-control"
                            id="user-name"
                            placeholder="Enter your user name"
                            onChange={(e) => setUserName(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className="row mb-5">
                    <div className="col-lg-2 col-md-12">
                        <h6>EMAIL</h6>
                    </div>
                    <div className="col-lg-10 col-md-12">
                        <input
                            type="text"
                            className="form-control"
                            id="email"
                            placeholder="Enter your email"
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
                            value={password}
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
                            id="repeat-password"
                            placeholder="Repeat your password"
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            value={confirmPassword}
                            required
                        />
                    </div>
                </div>

                <div className="d-flex flex-column align-items-center mb-4">
                    <button type="submit" className="btn" style={{ background: "rgb(205, 67, 26)", color: "white", fontSize: "23px" }}>
                        REGISTER
                    </button>
                </div>

            </form>

            <div className="d-flex justify-content-center">
                <button className="btn" style={{ background: "rgb(230, 230, 230)", fontSize: "18px" }} onClick={handleGotoLogin}>
                    ALREADY HAVE AN ACCOUNT? LOG IN
                </button>
            </div>

        </div>
    )
}

export default UserRegister;