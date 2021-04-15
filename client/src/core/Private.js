import React, { useState, useEffect, useDebugValue } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import dotenv from "dotenv";

import Layout from "../core/Layout";
import { authenticate, getCookie, isAuth, signout, updateUser } from "../auth/Helpers";

dotenv.config();

const Private = ({ history }) => {
  const [values, setValues] = useState({
    role: "",
    name: "",
    email: "",
    password: "",
    buttonText: "Submit",
  });

  const loadProfile = async () => {
    try {
      // fet the logged in user data
      const { data: userDetails } = await axios.get(
        `${process.env.REACT_APP_API}/user/${isAuth()._id}`,
        { headers: { Authorization: `Bearer ${getCookie("token")}` } }
      );

      const { name, role, email } = userDetails;

      // update the user state with fetched data
      setValues({ ...values, role, name, email });
    } catch (error) {
      console.log(error.message);

      // if token expired then singout the user and push them to home page
      if (error.response.status === 401) {
        signout(() => {
          history.push("/");
        });
      }
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const { role, name, email, password, buttonText } = values;

  const handleChange = (field) => (event) => {
    //check the field whether it is name,email,password and change state accordingly
    setValues({ ...values, [field]: event.target.value });
  };

  const clickSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, buttonText: "Submitting" });
    axios({
      method: "PUT",
      url: `${process.env.REACT_APP_API}/user/update`,
      data: { name, password },
      headers: { Authorization: `Bearer ${getCookie("token")}` },
    })
      .then((response) => {
        console.log("profile update", response);
        updateUser(response,()=>{
          setValues({
            ...values,
            buttonText: "submitted",
          });
          toast.success("profile updated successfully");
        });

      })
      .catch(error=> {
        console.log("profile update error", error.response.data.error);
        
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
          placeholder="enter new password"
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
