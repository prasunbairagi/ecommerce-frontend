import React from "react";
import Login from "../Users/Forms/Login";
const AuthRoute = ({children}) => {
    //get login user from local storage
    const user = JSON.parse(localStorage.getItem("userInfo"));
    const isLoggedIn = user?.token ? true : false;
    if(!isLoggedIn) return <Login/>;
    return <>{children}</>
}
export default AuthRoute;