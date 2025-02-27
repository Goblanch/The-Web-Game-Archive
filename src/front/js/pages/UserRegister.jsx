import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const UserRegister = () => {

    const handleOnRegister = () => {
        console.log("REGISTRAR");
    }

    const handleGotoLogin = () => {
        console.log("Go to login")
    }

    return (
        <div className="container">
            <h1 className="mt-3 mb-5 text text-center">Create an Account</h1>

            <div className="row mb-5">
                <div className="col-lg-2 col-md-12">
                    <h6 className="text">USERNAME</h6>
                </div>
                <div className="col-lg-10 col-md-12">
                    <input type="text" className="form-control" name="" id="user-name" placeholder="Enter your user name" />
                </div>
            </div>

            <div className="row mb-5">
                <div className="col-lg-2 col-md-12">
                    <h6>NAME</h6>
                </div>
                <div className="col-lg-10 col-md-12">
                    <input type="text" className="form-control" name="" id="name" placeholder="Enter your name" />
                </div>
            </div>

            <div className="row mb-5">
                <div className="col-lg-2 col-md-12">
                    <h6>LAST NAME</h6>
                </div>
                <div className="col-lg-10 col-md-12">
                    <input type="text" className="form-control" name="" id="last-name" placeholder="Enter your last name" />
                </div>
            </div>

            <div className="row mb-5">
                <div className="col-lg-2 col-md-12">
                    <h6>EMAIL</h6>
                </div>
                <div className="col-lg-10 col-md-12">
                    <input type="text" className="form-control" name="" id="email" placeholder="Enter your email" />
                </div>
            </div>

            <div className="row mb-5">
                <div className="col-lg-2 col-md-12">
                    <h6>PASSWORD</h6>
                </div>
                <div className="col-lg-2 col-md-12">
                    <input type="password" className="form-control" name="" id="password" placeholder="Enter your password" />
                </div>
            </div>

            <div className="row mb-5">
                <div className="col-lg-2 col-md-12">
                    <h6>PASSWORD</h6>
                </div>
                <div className="col-lg-2 col-md-12">
                    <input type="password" className="form-control" name="" id="repeat-password" placeholder="Repeat your password" />
                </div>
            </div>

            <div className="d-flex flex-column align-items-center">
                <div className="mb-4">
                    <button className="btn" style={{ background: "rgb(205, 67, 26)", color: "white", fontSize: "23px" }} onClick={handleOnRegister}>
                        REGISTER
                    </button>
                </div>

                <div>
                    <button className="btn" style={{ background: "rgb(230, 230, 230)", fontSize: "18px" }} onClick={handleGotoLogin}>
                        ALREADY HAVE AN ACCOUNT? LOG IN
                    </button>
                </div>

            </div>

        </div>
    )
}

export default UserRegister;