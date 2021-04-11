import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import dotenv from "dotenv";

import Layout from "../core/Layout";
import { authenticate, isAuth } from "./Helpers";

dotenv.config();

const Signup = () => {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    buttonText: "submit",
  });
  const { name, email, password, buttonText } = values;

  const handleChange = (field) => (event) => {
    //check the field whether it is name,email,password and change state accordingly
    setValues({ ...values, [field]: event.target.value });
  };

  const clickSubmit = event => {
    event.preventDefault();
    setValues({ ...values, buttonText: "Submitting" });
    axios({
      method: 'POST',
      url: `${process.env.REACT_APP_API}/signup`,
      data: { name, email, password },
    }).then((response) => {
        console.log("signup success", response);
        setValues({
          ...values,
          name: "",
          email: "",
          password: ""
        });
        toast.success(response.data.message);
      }).catch((error) => {
        console.log("signup error", error.response.data);
        setValues({ ...values, buttonText: "Submit" });
        toast.error(error.response.data.error);
      });
  };

  const signupForm = () => (
    <form className="vh-100">
      <div className="form-group">
        <label className="text-muted">Name</label>
        <input
          onChange={handleChange("name")}
          value={name}
          type="text"
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Email</label>
        <input
          onChange={handleChange("email")}
          value={email}
          type="email"
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Password</label>
        <input
          onChange={handleChange("password")}
          value={password}
          type="password"
          className="form-control"
        />
      </div>
      <div>
        <button className="btn btn-primary mt-2" onClick={clickSubmit}>
          {buttonText}
        </button>
      </div>
    </form>
  );

  return (
    <Layout>
      <div className="col-md-6 offset-md-3">
        <ToastContainer />
        {isAuth() ? <Redirect to="/"/> : null}
        <h1 className="p-5 text-center ">Signup</h1>
        {signupForm()}
      </div>
    </Layout>
  );
};

export default Signup;
