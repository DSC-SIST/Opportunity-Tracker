import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

import Layout from "../core/Layout";

dotenv.config();

const Activate = ({match}) => {
  const [values, setValues] = useState({
    name: "",
    token: "",
    show: true,
  });
  useEffect(()=> {
      const token = match.params.token
      let {name} = jwt.decode(token)
      if(token){
          setValues({...values, name,token})
      }
  },[])


  const { name, token, show } = values;

  const clickSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, buttonText: "Submitting" });
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_API}/account-activation`,
      data: { token },
    })
      .then((response) => {
        console.log("account activation success", response);
        setValues({
          ...values,
          show:false
        });
        toast.success(response.data.message);
      })
      .catch((error) => {
        console.log("account activation error", error.response.data.error);
        toast.error(error.response.data.error);
      });
  };


  const activationLink = () => (
    <div className="text-center ">
      <h1 className="p-5  ">
        Hey {name}, Ready to acivate you account
      </h1>
      <button className="btn btn-outline-primary" onClick={clickSubmit}>
        Activate Account
      </button>
    </div>
  );

  return (
    <Layout>
      <div className="col-md-6 offset-md-3">
        <ToastContainer />

        {activationLink()}
      </div>
    </Layout>
  );
};

export default Activate;
