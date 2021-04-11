import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import dotenv from "dotenv";

import Layout from "../core/Layout";
import { authenticate, isAuth } from "../auth/Helpers";


dotenv.config();

const Private = () => {
  const [values, setValues] = useState({
    role:"sub",
    name:isAuth().name,
    email: isAuth().email,
    password:"**************",
    buttonText: "submit",
  });
  const { role,name, email, password, buttonText } = values;

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

  const updateForm = () => (
    <form>
          <div className="form-group">
        <label className="text-muted">Name</label>
        <input       
         disabled={true}
          defaultValue={role}
          type="text"
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Name</label>
        <input
          onChange={handleChange("name")}
          defaultValue={name}
          type="text"
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Email</label>
        <input
        disabled={true}
          defaultValue={email}  
          type="email"
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Password</label>
        <input
          onChange={handleChange("password")}
          defaultValue={password}
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
      <div className="col-md-6 offset-md-3 vh-100">
        <ToastContainer />
        <h1 className="p-5 text-center ">Update Account</h1>
        {updateForm()}
      </div>
    </Layout>
  );
};

export default Private;
