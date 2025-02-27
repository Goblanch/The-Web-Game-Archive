import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const UserRegister = () => {

    const [userName, setUserName] = useState("");
    const [name, setName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");


    const handleOnSubmit = (e) => {
        e.preventDefault();
        console.log(userName);
        console.log(name);
        console.log(lastName);
        console.log(email);
        console.log(password);
        console.log(confirmPassword);
    }

    const handleGotoLogin = () => {
        console.log("Go to login")
    }

    return (
        <div className="container">
            <h1 className="mt-3 mb-5 text text-center">Create an Account</h1>

            <form onSubmit={handleOnSubmit}>
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
                        />
                    </div>
                </div>

                <div className="row mb-5">
                    <div className="col-lg-2 col-md-12">
                        <h6>NAME</h6>
                    </div>
                    <div className="col-lg-10 col-md-12">
                        <input
                            type="text"
                            className="form-control"
                            id="name"
                            placeholder="Enter your name"
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                </div>

                <div className="row mb-5">
                    <div className="col-lg-2 col-md-12">
                        <h6>LAST NAME</h6>
                    </div>
                    <div className="col-lg-10 col-md-12">
                        <input type="text"
                            className="form-control"
                            id="last-name"
                            placeholder="Enter your last name"
                            onChange={(e) => setLastName(e.target.value)}
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