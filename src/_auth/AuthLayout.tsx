import React from 'react'
import { Outlet, Navigate } from "react-router-dom"

//here, when you try to write the path of SignupForm in the web page,you'll see the AuthLayout,because
//in this component you still haven't returned the child pages withing the component,you can achieve this by Outlet component of react router dom
const AuthLayout = () => {
  const isAuthenticated = false;
  return (
    <>
      {isAuthenticated ? (
        <Navigate to="/" />
      ) : (
        <>
          <section className="flex flex-1 justify-center items-center flex-col py-10">
            <Outlet />
          </section>

          <img
            src="/assets/images/side-img.svg"
            alt="logo"
            className="hidden xl:block h-screen w-1/2 object-cover bg-no-repeat"
          />
        </>
      )}
    </>
  );
}

export default AuthLayout
