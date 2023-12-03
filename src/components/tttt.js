import React, { useState, useEffect } from "react";
import { db, auth } from "../../../firebase-config";
import {
  collection,
  getDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { NavLink } from "react-router-dom";
import style from "./PetProfileList.module.css";

function PetProfileList() {
  const [pets, setPets] = useState([]);
  const [filterPets, setFilterPets] = useState([]);
  const [userInfo, setUserInfo] = useState({});
  const [likedPets, setLikedPets] = useState([]);

  const getPets = async () => {
    const petsCollectionRef = collection(db, "pets");
    const data = await getDocs(petsCollectionRef);
    setPets(data.docs.map((pet) => ({ ...pet.data(), id: pet.id })));
  };

  const getUser = async (uid) => {
    const userDocRef = doc(db, "users", uid);
    const userDocSnap = await getDoc(userDocRef);
    const data = userDocSnap.data();
    setUserInfo(data);
  };

  const filteredPets = () => {
    let filteredPets = [];
    if (auth.currentUser) {
      filteredPets = pets.filter(
        (pet) =>
          pet.user_uid !== auth.currentUser.uid &&
          pet.isAdopted === false &&
          !userInfo.petArr.includes(pet.id) &&
          !likedPets.includes(pet) // Exclude liked pets
      );
    } else {
      filteredPets = pets.filter((pet) => pet.isAdopted === false);
    }
    setFilterPets(filteredPets);
  };

  const getUserData = async function (user) {
    const UserDoc = doc(db, "users", user);
    const DocSnap = await getDoc(UserDoc);
    return DocSnap.data();
  };

  const handleFav = async function (pet) {
    const currentUserData = await getUserData(auth.currentUser.uid);
    const petUserData = await getUserData(pet.user_uid);
    const petUser = pet.user_uid;
    const petId = pet.id;
    const updatePetInterestedArr = doc(db, "pets", petId);
    const petSnap = await getDoc(updatePetInterestedArr);
    const petData = petSnap.data();

    if (!petData.interested.includes(currentUserData.uid)) {
      await updateDoc(updatePetInterestedArr, {
        interested: [...petData.interested, currentUserData.uid],
      });
    }
    if (currentUserData.favArr.includes(petUser)) {
      if (currentUserData.petArr.includes(pet.id)) {
        return;
      } else {
        const updateFile = doc(db, "users", auth.currentUser.uid);
        await updateDoc(updateFile, {
          petArr: [...currentUserData.petArr, pet.id],
        });
      }
    } else {
      const updateFile = doc(db, "users", auth.currentUser.uid);
      await updateDoc(updateFile, {
        favArr: [...currentUserData.favArr, petUser],
        petArr: [pet.id, ...currentUserData.petArr],
      });
    }
    setLikedPets([...likedPets, pet]);
    if (petUserData.favArr.includes(currentUserData.uid)) {
      console.log("the vote is true", pet.user_uid, pet.id);
    } else {
      const updatePetUserfavArr = doc(db, "users", petUser);
      await updateDoc(updatePetUserfavArr, {
        favArr: [...petUserData.favArr, currentUserData.uid],
      });
    }
  };

  const truncate = (input) =>
    input?.length > 100 ? `${input.substring(0, 90)}...` : input;

  useEffect(() => {
    getPets();
  }, []);

  useEffect(() => {
    getUser(auth.currentUser.uid);
    filteredPets();
  }, [userInfo]);

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        getUser(auth.currentUser.uid);
        filteredPets();
      }
    });
  }, []);

  return (
    <div className={style.container}>
      {likedPets.length > 0 ? (
        <div>
          <h2>Liked Pets</h2>
          {likedPets.map((pet) => (
            <div className={style.pet_index_card} key={pet.id}>
              <NavLink
                to={`/pet/${pet.id}`}
                key={pet.id}
                style={{ color: "black" }}
              >
                {pet.imageUrl !== [] ? (
                  <img
                    src={pet.imagesUrl[0]}
                    className={style.pet_image}
                    alt={pet.name}
                  />
                ) : (
                  " "
                )}
                <h2 className={style.pet_name}>{pet.name}</h2>
                <div className={style.text_align}>
                  <p
                    style={{
                      fontWeight: "bold",
                      fontSize: "20px",
                      color: "#006E7F",
                      marginBottom: "10px",
                    }}
                  >
                    🏠 {pet.location}
                  </p>
                </div>
                <p style={{ textAlign: "center" }}>{pet.gender}</p>
                <p style={{ fontStyle: "italic", textAlign: "center" }}>
                  {truncate(`${pet.description}`)}
                </p>
              </NavLink>
              <div className={style.button_div}>
                <button
                  className={style.button74}
                  onClick={() => handleFav(pet)}
                >
                  Like
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={style.nopetsmessage}>No liked pets found.</div>
      )}

      {filterPets.length > 0 ? (
        <div>
          <h2>Available Pets</h2>
          {filterPets.map((pet) => (
            <div className={style.pet_index_card} key={pet.id}>
              <NavLink
                to={`/pet/${pet.id}`}
                key={pet.id}
                style={{ color: "black" }}
              >
                {pet.imageUrl !== [] ? (
                  <img
                    src={pet.imagesUrl[0]}
                    className={style.pet_image}
                    alt={pet.name}
                  />
                ) : (
                  " "
                )}
                <h2 className={style.pet_name}>{pet.name}</h2>
                <div className={style.text_align}>
                  <p
                    style={{
                      fontWeight: "bold",
                      fontSize: "20px",
                      color: "#006E7F",
                      marginBottom: "10px",
                    }}
                  >
                    🏠 {pet.location}
                  </p>
                </div>
                <p style={{ textAlign: "center" }}>{pet.gender}</p>
                <p style={{ fontStyle: "italic", textAlign: "center" }}>
                  {truncate(`${pet.description}`)}
                </p>
              </NavLink>
              <div className={style.button_div}>
                <button
                  className={style.button74}
                  onClick={() => handleFav(pet)}
                >
                  Like
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={style.nopetsmessage}>No available pets found.</div>
      )}
    </div>
  );
}

export default PetProfileList;
