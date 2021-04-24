import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";
import { isAuth } from "../Helpers";


// checks if the user is admin or not and redirects the user accordingly
const AdminRoute = ({ component: Component, ...rest }) => (

    <Route
        {...rest}
        render={props =>
            isAuth() && isAuth().role==='admin' ? (
                <Component {...props} />
            ) : (
                <Redirect
                    to={{
                        pathname: '/signin',
                        state: { from: props.location }
                    }}
                />
            )
        }
    ></Route>
);

export default AdminRoute;