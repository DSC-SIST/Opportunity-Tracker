import React from "react";
import axios from "axios";
import { GoogleLogin } from "react-google-login";
import dotenv from "dotenv";

dotenv.config();

const Google = ({ text,informParent=f=>f }) => {
  const responseGoogle = (response) => {
    
    axios({
      method: 'POST',
      url: `${process.env.REACT_APP_API}/google-login`,
      data: { idToken: response.tokenId }
    }).then((response) => {
        console.log("Google Signin success",response);
        
        informParent(response)
      })
      .catch((error) => {
        console.log("google signin error",error);
      });
  };
  return (
    <div className="mt-5 d-flex justify-content-center">
      <GoogleLogin
        clientId="630459639966-eaqe91dlj6ovga07113sllvakl9iit2g.apps.googleusercontent.com"
        buttonText="Login With Google"
        onSuccess={responseGoogle}
        onFailure={responseGoogle}
        render={(renderProps) => (
          <button
            onClick={renderProps.onClick}
            disabled={renderProps.disabled}
            className="btn btn-danger btn-lg btn-block"
          >
            <i class="bi bi-google me-3"></i>
            {text}
          </button>
        )}
        cookiePolicy={"single_host_origin"}
      />
    </div>
  );
};

export default Google;
