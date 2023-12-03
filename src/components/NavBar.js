import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { auth } from "../firebase-config";
import { AuthContext } from "../context/auth";
import style from "./NavBar.module.css";

function NavBar() {
  const { user } = useContext(AuthContext);
  const logout = async () => {
    await auth.signOut();
  };
  let uid;
  if (user !== null) {
    uid = user.uid;
  }

  return (
    <div className={style.nav_container}>
      {user ? (
        <>
          {/* <div className="nav-left"> */}
          <NavLink to={"/"}>
            <button className={style.button51}>Home </button>
          </NavLink>
          <NavLink to={"/message"}>
            <button className={style.button51}>Messages</button>
          </NavLink>
          {/* </div>
					<div className="nav-right"> */}
          <NavLink to={`/user/${uid}`}>
            <button className={style.button51}>My Profile </button>
          </NavLink>
          <NavLink to={"/"}>
            <button className={style.button51} onClick={logout}>
              Sign Out
            </button>
            <NavLink to={"/sos"}>
          <button className={style.button51}>SOS</button>
          </NavLink>
          </NavLink>
          {/* </div> */}
        </>
      ) : (
        <>
          {/* <div className="nav-left"> */}
          <NavLink to={"/"}>
            <button className={style.button51}>Home </button>
          </NavLink>
          {/* </div>
					<div className="nav-right"> */}
          <NavLink to={"/login"}>
            <button className={style.button51}>Login</button>
          </NavLink>
          <NavLink to={"/signup"}>
            <button className={style.button51}>Sign up</button>
          </NavLink>
          {/* </div> */}
          <NavLink to={"/about"}>
          <button className={style.button51}>About Us</button>
          </NavLink>
          <NavLink to={"/sos"}>
          <button className={style.button51}>SOS</button>
          </NavLink>
        </>
      )}
    </div>
  );
}

export default NavBar;
