import React from "react";
import { Link } from "react-router-dom";

import style from "./Home.module.css"; // Reusing the styles from Home.js
import { motion } from "framer-motion";

function AboutUs() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={style.container} // Reusing the container style from Home.js
    >{/* Reusing the NavBar component */}
      <div className={style.centerDiv}>
        <h1 className={style.title}>About Us</h1>
        <p className={style.des}>
          Our mission is to help the pets in need of rescue and rehabilitation
          and help them find a loving home. Open your doors and hearts to pets
          in needs of a home.
          
        </p>
        <p className={style.des}>Made
          by Team 10</p>
        <p className={style.des}>For queries contact : bps.petpals@gmail.com</p>
        {/* Navigation link to go back to the home page */}
        <Link to="/" className={style.button87}>
          Back to Home
        </Link>
      </div>
    </motion.div>
  );
}

export default AboutUs;
