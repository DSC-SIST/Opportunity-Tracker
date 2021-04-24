import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import dotenv from "dotenv";
import Layout from "../Layout";

dotenv.config()
// import { authenticate, isAuth } from "./Helpers";

const Createpost = (props) => {
  const [values, setValues] = useState({
    name: "",
    description: "",
    detailsLink: "",
    registrationLink: "",
    category: "",
    buttonText: "submit",
  });

  const [option, setOption] = useState();
  function handleCategoryChange(event) {
    setOption(event.target.value);
    setValues({ ...values, category: option });
  }

  const {
    name,
    description,
    detailsLink,
    registrationLink,
    category,
    buttonText,
  } = values;

  const handleChange = (field) => (event) => {
    //check the field whether it is name,email,password and change state accordingly
    setValues({ ...values, [field]: event.target.value });
  };

  const clickSubmit = (event) => {
    event.preventDefault();
    console.log(values);
    setValues({ ...values, buttonText: "Submitting" });
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_DEPLOYED_API}/post`,
      data: { name, description, detailsLink, registrationLink, category },
    })
      .then((response) => {
        console.log("post submitted succesfully", response);
        setValues({
          ...values,
          name: "",
          description: "",
          detailsLink: "",
          registrationLink: "",
          category: "",
          buttonText: "submit",
        });
        toast.success(
          "Post submitted successfully! please refersh to view the post"
        );
      })
      .catch((error) => {
        console.log("post submittion error", error.response.data);
        setValues({ ...values, buttonText: "Submit" });
        toast.error(error.response.data.error);
      });
  };

  const createPostForm = () => (
    <form className="vh-100">
      <div className="form-group my-2">
        <label className="text-dark fs-5 mb-1">Name</label>
        <input
          onChange={handleChange("name")}
          value={name}
          type="text"
          className="form-control"
        />
      </div>
      <div className="form-group my-2">
        <label className="text-dark fs-5 mb-1">Description</label>

        <textarea
          onChange={handleChange("description")}
          value={description}
          className="form-control"
          rows="3"
        />
      </div>
      <div className="form-group my-2">
        <label className="text-dark fs-5 mb-1">Details Link</label>
        <input
          onChange={handleChange("detailsLink")}
          value={detailsLink}
          type="url"
          className="form-control"
        />
      </div>
      <div className="form-group  my-2">
        <label className="text-dark fs-5 mb-1">Registration Link</label>
        <input
          onChange={handleChange("registrationLink")}
          value={registrationLink}
          type="url"
          className="form-control"
        />
      </div>
      <div className="form-group  my-2">
        <label className="text-dark fs-5 mb-1 me-4 ">Category</label>

        <select name="category" style={{width:"100%",height:"42px", border:"none", borderRadius:".25rem", lineHeight: "1.5"}} onChange={handleCategoryChange}>
          <option value="Coding">Coding</option>
          <option value="interships">Interships</option>
          <option value="openSource">Open Source </option>
          <option value="Scholarships">Scholarships</option>
          <option value="studentPrograms">Student Programs</option>
          <option value="OtherCategories">Other Categories</option>
        </select>
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
        <h1 className="p-5 text-center ">Submit New Post</h1>
        {createPostForm()}
      </div>
    </Layout>
  );
};

export default Createpost;
