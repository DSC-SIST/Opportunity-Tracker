import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import dotenv from "dotenv";
import Google from "./Google";
import Layout from "../core/Layout";
import { authenticate, isAuth } from "./Helpers";

dotenv.config();

const Signup = ({history}) => {
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
  const informParent = response => {
    authenticate(response, () => {
      isAuth() && isAuth().role === "admin"
        ? history.push("/admin")
        : history.push("/");
    });
  };

  const clickSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, buttonText: "Submitting" });
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_API}/signup`,
      data: { name, email, password },
    })
      .then((response) => {
        console.log("signup success", response);
        setValues({
          ...values,
          name: "",
          email: "",
          password: "",
        });
        toast.success(response.data.message);
      })
      .catch((error) => {
        console.log("signup error", error.response.data);
        setValues({ ...values, buttonText: "Submit" });
        toast.error(error.response.data.error);
      });
  };

  const signupForm = () => (
    <form>
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
      <div className="d-flex justify-content-center mt-3">
        <button className="btn btn-primary mt-2 w-50" onClick={clickSubmit}>
          {buttonText}
        </button>
      </div>
    </form>
  );


  
  return (
    <Layout>
      <div className="col-md-6 offset-md-3 vh-100 ">
        <ToastContainer />
        {isAuth() ? <Redirect to="/" /> : null}
        <h1 className="p-5 text-center ">Opportunity Tracker</h1>
        {signupForm()}
        <Google text="Signup With Google" informParent={informParent}/>
        <Link to="/signin" className="text-center text-decoration-none d-flex justify-content-center">
  
          <h4 className="mt-5 btn btn-outline-info ">Have an account? Log in</h4>
        </Link>

      </div>
    </Layout>
  );
};

export default Signup;
