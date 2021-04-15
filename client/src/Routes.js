import React from "react";
import { Switch, Route, BrowserRouter } from "react-router-dom";

import App from "./App";
import Activate from "./auth/Activate";
import Signin from "./auth/Signin";
import Signup from "./auth/Signup.js";
import Admin from "./core/Admin";
import Private from "./core/Private";
import ForgotPassword from "./auth/ForgotPassword";
import AdminRoute from "./auth/privateroutes/AdminRoute";
import PrivateRoute from "./auth/privateroutes/PrivateRoute";
import ResetPassword from "./auth/ResetPassword";

import Savedpost from "./core/components/savedpost/Savedpost";
import Createpost from "./core/newPost/Createpost";

const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={App} />
        <Route path="/signup" exact component={Signup} />
        <Route path="/signin" exact component={Signin} />
        <Route path="/account-activation/:token" exact component={Activate} />
        <Route path="/auth/password/forgot" exact component={ForgotPassword} />
        <Route path="/auth/password/reset/:token" exact component={ResetPassword} />
        
        <PrivateRoute path="/private" exact component={Private} />
        <PrivateRoute path="/newpost" exact component={Createpost}/>
        <PrivateRoute path="/private" exact component={Private} />
        <PrivateRoute path="/bookmarks" exact component={Savedpost}/>
        <AdminRoute path="/admin" exact component={Admin} />
      </Switch>
    </BrowserRouter>
  );
};
export default Routes;
