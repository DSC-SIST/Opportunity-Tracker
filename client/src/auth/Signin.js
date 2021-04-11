import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import dotenv from "dotenv";

import Layout from "../core/Layout";
import { authenticate, isAuth } from "./Helpers";

dotenv.config();

const Signin = ({history}) => {
  const [values, setValues] = useState({
    email: "",
    password: "",
    buttonText: "submit",
  });
  const { email, password, buttonText } = values;

  const handleChange = (field) => (event) => {
    //check the field whether it is name,email,password and change state accordingly
    setValues({ ...values, [field]: event.target.value });
  };

  const clickSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, buttonText: "Submitting" });
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_API}/signin`,
      data: { email, password },
    })
      .then((response) => {
        // save the response {user, token} in local storage/cookie
        authenticate(response, () => {
          setValues({
            ...values,
            email: "",
            password: "",
          });
          isAuth() && isAuth().role === 'admin' ? history.push('/admin') : history.push('/private')
        });
      })
      .catch((error) => {
        console.log("signin error", error.response.data);
        setValues({ ...values, buttonText: "Submit" });
        toast.error(error.response.data.error);
      });
  };

  const signinForm = () => (
    <form className="vh-100" >
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
      {JSON.stringify(isAuth("user"))}
      <div className="col-md-6 offset-md-3">
        <ToastContainer />
        {isAuth() ? <Redirect to="/"/> : null}
        <h1 className="p-5 text-center ">Signin</h1>
        {signinForm()}
      </div>
    </Layout>
  );
};

export default Signin;
