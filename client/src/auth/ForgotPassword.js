import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import dotenv from "dotenv";

import Layout from "../core/Layout";
dotenv.config();

const ForgotPassword = ({history}) => {
  const [values, setValues] = useState({
    email: '',
    buttonText: "Request Password Reset",
  });
  const { email,  buttonText } = values;

  const handleChange = (field) => (event) => {
    //check the field whether it is name,email,password and change state accordingly
    setValues({ ...values, [field]: event.target.value });
  };

  const clickSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, buttonText: "Submitting" });
    axios({
      method: "PUT",
      url: `${process.env.REACT_APP_DEPLOYED_API}/forgot-password`,
      data: { email },
    })
      .then((response) => {
        // save the response {user, token} in local storage/cookie
        toast.success(response.data.message);
        setValues({...values, buttonText:'Requested'})
      })
      .catch((error) => {
        console.log("forgot password error", error.response.data);
        toast.error(error.response.data.error);
        setValues({ ...values, buttonText: "Request Password" });

      });
  };

  const forgotPasswordForm = () => (
    <form className="vh-100" >
      <div className="form-group">
        <label className="text-muted">Email</label>
        <input
          onChange={handleChange("email")}
          value={email}
          type="email"
          className="form-control"
          placeholder="Enter you registered email"
          required
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

        <h1 className="p-5 text-center ">Verify Your Email</h1>
        {forgotPasswordForm()}
      </div>
    </Layout>
  );
};

export default ForgotPassword;
