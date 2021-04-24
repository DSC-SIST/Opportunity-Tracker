import React, { Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import { isAuth, signout } from "../auth/Helpers";


const Layout = ({ children, match, history }) => {
  const isActive = (path) => {
    if (match.path === path) {
      return { color: "#000" };
    } else {
      return { color: "#fff" };
    }
  };

  const nav = () => {
    return (
      <ul className=" d-flex nav nav-tabs bg-light">
        <li className="nav-item flex-grow-1 ">
          <Link to="/" className=" nav-link my-2 fs-5 text-dark" >
            Opportunity Tracker
          </Link>
        </li>

        {!isAuth() && (
          <Fragment >
            <li className="nav-item me-3 my-2 nav-btn">
              <Link
                to="/signup"
                className=" nav-link bg-primary rounded-5"
                style={isActive("/signup")}
              >
                Sign up
              </Link>
            </li>

            <li  className="nav-item my-2 me-5 nav-btn">
              <Link
                to="/signin"
                className="nav-link bg-primary rounded-5"
                style={isActive("/signin")}
              >
                Sign in
              </Link>
            </li>
          </Fragment>
        )}

        {isAuth() && (
          <li className="nav-item nav-item my-2 me-5 nav-btn">
            <span
              className="nav-link bg-primary rounded-5"
              style={{cursor:'pointer',color:'#fff'}}
              onClick={() => {
                signout(() => {
                  history.push("/");
                });
              }}
            >
              signout
            </span>
          </li>
        )}

        {isAuth() && isAuth().role==='admin' && (
          <li className="nav-item nav-item my-2 me-5 nav-btn">
            <Link
              className="nav-link bg-primary rounded-5"
              style={isActive("/admin")}
              to='/admin'
            >
            {isAuth().name}
            </Link>
          </li>
        )}
        {isAuth() && isAuth().role==='subscriber' && (
          <li className="nav-item nav-item my-2 me-5 nav-btn">
            <Link
              className="nav-link bg-primary rounded-5"
              style={isActive("/private")}
              to='/private'
            >
            {isAuth().name}
            </Link>
          </li>
        )}
      </ul>
    );
  };
  return (
    <div >
      {nav()}
      <div 
      >{children}</div>
    </div>
  );
};

export default withRouter(Layout);
