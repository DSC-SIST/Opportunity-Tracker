import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import dotenv from "dotenv";

import Layout from "../core/Layout"; 
dotenv.config();

const ResetPassword = ({match,history}) => {
  const [values, setValues] = useState({
    token:'',
    newPassword: '',
    confirmPassword:'',
    buttonText: "Reset Password ",
  });
  useEffect(()=>{
    const  token = match.params.token;
    setValues({...values, token});
  },[])
  const { token, newPassword,confirmPassword, buttonText } = values;
    console.log( { token, newPassword,confirmPassword, buttonText })
  const handleChange = (field) => (event) => {
    //check the field  change state accordingly
    setValues({ ...values, [field]: event.target.value });
  };

  const clickSubmit = (event) => {
    event.preventDefault(); 
    if (newPassword===confirmPassword){
        setValues({ ...values, buttonText: "Resetting Password" });
        axios({
          method: "PUT",
          url: `${process.env.REACT_APP_DEPLOYED_API}/reset-password`,
          data: { newPassword, resetPasswordLink:token },
        })
          .then((response) => {
            // save the response {user, token} in local storage/cookie
            toast.success(response.data.message);
            history.push('/signin')
            setValues({...values, buttonText:'Done'})
          })
          .catch((error) => {
            console.log("reset password error", error.response.data);
            toast.error(error.response.data.error);
            setValues({ ...values, buttonText: "Reset Password" });
    
          });
    }
    else {
        toast.error("Password does not match")
        setValues({ ...values, buttonText: "Reset Password" });
    }
  };

  const resetPasswordForm = () => (
    <form className="vh-100" >
      <div className="form-group">
        <label className="text-muted">New Password</label>
        <input
          onChange={handleChange("newPassword")}
          value={newPassword}
          type="password"
          className="form-control"
          placeholder="Enter New Password"
          required
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Confirm Password</label>
        <input
          onChange={handleChange("confirmPassword")}
          value={confirmPassword}
          type="password"
          className="form-control"
          placeholder="Confirm New password"
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

        <h1 className="p-5 text-center ">Reset Password</h1>
        {resetPasswordForm()}
      </div>
    </Layout>
  );
};

export default ResetPassword;
