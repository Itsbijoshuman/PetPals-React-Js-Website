// show page for a certain pet
import React, { useState, useEffect } from "react";
import { db, auth } from "../../../firebase-config";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { NavLink, useParams } from "react-router-dom";
import { createUseStyles } from "react-jss";
import { Carousel } from "react-responsive-carousel";
import { motion } from "framer-motion";

import "react-responsive-carousel/lib/styles/carousel.min.css";
import style from "./PetShow.module.css";

const TRANSITION_DURATION = 2000;

const useStyles = createUseStyles({
  container: {
    "&& .slide img": {},
    width: "70%",
    margin: "30px auto",
  },
  slide: {
    justifyContent: "center",
    alignItems: "center",
    height: 400,
  },
  selectedSlide: {
    transform: "scale(1.2)",
  },
});

function PetShow() {
  // get the pet id(the file name)
  let params = useParams();
  console.log(params.type);
  const [petInfo, setPetInfo] = useState(null);
  let data;
  let filterPets;

  const getPet = async (uid) => {
    const petDocRef = doc(db, "pets", uid);
    const petDocSnap = await getDoc(petDocRef);
    if (petDocSnap.exists()) {
      data = petDocSnap.data();
      // Fetch owner's information based on user_uid
      const ownerDocRef = doc(db, "users", data.user_uid);
      const ownerDocSnap = await getDoc(ownerDocRef);
      if (ownerDocSnap.exists()) {
        const ownerData = ownerDocSnap.data();
        // Include owner's name in the petInfo object
        data.ownerName = ownerData.name; // Replace 'name' with the field name containing owner's name in your database
      }
      setPetInfo(data);
    } else {
      // Handle case when pet doesn't exist
      console.log("Pet not found");
    }
  };
  

  const deletePet = async () => {
    const petDoc = doc(db, "pets", params.type);
    await deleteDoc(petDoc);
  };
  
  const classes = useStyles();

  useEffect(() => {
    if (petInfo === null) {
      getPet(params.type);
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div>
        {petInfo === null ? (
          ""
        ) : (
          <div>
            <Carousel
              className={classes.container}
              centerMode
              swipeable
              emulateTouch
              infiniteLoop
              centerSlidePercentage={100}
              onSwipeMove={() => Boolean(true)}
              renderItem={(Slide, isSelected) => (
                <div className={isSelected ? classes.selectedSlide : ""}>
                  {Slide}
                </div>
              )}
            >
              {petInfo.imagesUrl.map((image) => {
                return (
                  <div className={classes.slide}>
                    <div style={{ height: "400px" }}>
                      <img
                        src={image}
                        style={{
                          height: "400px",
                          objectFit: "contain",
                        }}
                      ></img>
                    </div>
                  </div>
                );
              })}
            </Carousel>
            <div className={style.center_div}>
                <h1 className={style.title}>Name: {petInfo.name}</h1>
                <p className={style.des}> 🍃 Age: {petInfo.age}</p>
                <p className={style.des}> 🧁 DOB: {petInfo.dob}</p>
                <p className={style.des}> 🐼 Type: {petInfo.type}</p>
                <p className={style.des}> 🤯 Gender: {petInfo.gender}</p>
                <p className={style.des}> 🏡 Location: {petInfo.location}</p>
                <p className={style.des}> 🐶 Description: {petInfo.description}</p>
                {petInfo.ownerName && (
                  <p className={style.des}> 🧑 Owner: {petInfo.ownerName}</p>
                )}
              </div>

            {/* Only the owner of the pet can edit and delete the profile */}
            {petInfo.user_uid === auth.currentUser.uid ? (
              <div className={style.text_align}>
                <NavLink
                  to={`/pet/edit/${params.type}`}
                  className={style.button74}
                >
                  Edit
                </NavLink>

                <NavLink
                  to={`/pet/index`}
                  onClick={deletePet}
                  className={style.button74}
                >
                  Delete
                </NavLink>
              </div>
            ) : (
              ""
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default PetShow;
