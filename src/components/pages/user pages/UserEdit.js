import React from "react";
import { useState, useEffect } from "react";
import { db, storage, auth } from "../../../firebase-config";
import { motion } from "framer-motion";

import { addDoc, collection, getDoc, updateDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { NavLink, useParams } from "react-router-dom";
import { v4 } from "uuid"; // generate uniq image name
import style from "../../PetCreateForm.module.css";

function UserEdit() {
  let params = useParams();

  const [userInfo, setUserInfo] = useState(null);

  // store all update info of a user into seperate states
  const [updateFirstName, setNewFirstName] = useState(null);
  const [updateLastName, setNewLastName] = useState(null);
  //   const [updateAge, setNewAge] = useState(null);
  const [updateUrl, setNewUrl] = useState(null);
  //   const [updateGender, setNewGender] = useState(null);
  const [updateLocation, setNewLocation] = useState(null);
  const [updateDescription, setNewDescription] = useState(null);

  let data;

  // get the current pet data
  const getUser = async (uid) => {
    const userDocRef = doc(db, "users", uid);
    const userDocSnap = await getDoc(userDocRef);
    data = userDocSnap.data();
    setUserInfo(data);
  };

  const onFileChange = async () => {
    if (updateUrl == null) return;
    const uniqImageName = v4() + updateUrl.name;
    const imageRef = ref(storage, `user/${uniqImageName}`);

    await uploadBytes(imageRef, updateUrl).then(() => {
      alert("File upload");
    });
    getDownloadURL(imageRef).then((url) => {
      setNewUrl(url);
    });
  };

  //if nothing changed, store  existing data into the update variables
  if (userInfo !== null) {
    if (updateFirstName == null) {
      setNewFirstName(userInfo.firstName);
    }
    if (updateLastName == null) {
      setNewLastName(`${userInfo.lastName}`);
    }
    if (updateUrl == null) {
      setNewUrl(`${userInfo.imageUrl}`);
    }
    if (updateLocation == null) {
      setNewLocation(`${userInfo.location}`);
    }
    if (updateDescription == null) {
      setNewDescription(`${userInfo.description}`);
    }
  }

  // update user info
  const updateUser = async () => {
    const userDoc = doc(db, "users", params.id);
    updateDoc(userDoc, {
      firstName: updateFirstName,
      lastName: updateLastName,
      imageUrl: updateUrl,
      location: updateLocation,
      description: updateDescription,
    });
  };

  useEffect(() => {
    if (userInfo === null) {
      getUser(params.id);
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div>
        {userInfo === null ? (
          ""
        ) : (
          <div className={style.container}>
            <h1 className={style.form_title}> Update your profile </h1>
            <label className={style.form_label}>First Name:</label>
            <input
              defaultValue={userInfo.firstName}
              className={style.form_field}
              onChange={(event) => {
                setNewFirstName(event.target.value);
              }}
            />
            <label className={style.form_label}>Last Name:</label>
            <input
              defaultValue={userInfo.lastName}
              className={style.form_field}
              onChange={(event) => {
                setNewLastName(event.target.value);
              }}
            />
            <label className={style.form_label}>Location:</label>
            <input
              defaultValue={userInfo.location}
              className={style.form_field}
              placeholder="Bengaluru"
              onChange={(event) => {
                setNewLocation(event.target.value);
              }}
            />
            <label className={style.form_label}>Image:</label>
            <input
              type="file"
              className={style.form_field}
              onChange={(event) => {
                setNewUrl(event.target.files[0]);
              }}
            />
            <button
              onClick={onFileChange}
              value="Upload"
              className={style.button74}
            >
              {" "}
              Upload Image{" "}
            </button>
            <div style={{ textAlign: "center", color: "grey" }}>
              <em>
                (Please wait for "Upload Successful" alert before clicking
                Update Profile)
              </em>
            </div>
            <div>
              <label className={style.form_label}>Description:</label>
              <textarea
                defaultValue={userInfo.description}
                className={style.form_textarea}
                rows="10"
                placeholder="Describe about yourself..."
                onChange={(event) => {
                  setNewDescription(event.target.value);
                }}
              />
            </div>

            <div>
              <NavLink to={`/user/${params.id}`}>
                <div className={style.text_align}>
                  <button className={style.button74} onClick={updateUser}>
                    {" "}
                    Update Profile{" "}
                  </button>
                </div>
              </NavLink>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default UserEdit;
