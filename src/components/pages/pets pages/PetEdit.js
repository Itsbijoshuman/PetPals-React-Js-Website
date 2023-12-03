import React from "react";
import { useState, useEffect, useCallback } from "react";
import { db, storage, auth } from "../../../firebase-config";
import {
  getDoc,
  updateDoc,
  arrayUnion,
  doc,
  arrayRemove,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import { v4 } from "uuid"; // generate uniq image name
import style from "../../PetCreateForm.module.css";
import { useDropzone } from "react-dropzone";
import Typewriter from "typewriter-effect"; // give the typing text effect
import { ClassNames } from "@emotion/react";

function PetEdit() {
  let params = useParams();
  const navigate = useNavigate();

  const [petInfo, setPetInfo] = useState(null);

  // store all update info of a pet into seperate states
  const [updateName, setNewName] = useState(null);
  const [updateAge, setNewAge] = useState(null);
  const [updateDOB, setNewDOB] = useState(null);
  const [updateUrl, setNewUrl] = useState(null);
  const [updateType, setNewType] = useState(null);
  const [updateGender, setNewGender] = useState(null);
  const [updateLocation, setNewLocation] = useState(null);
  const [updateDescription, setNewDescription] = useState(null);

  let data;
  const [selectedImages, setSelectedImages] = useState([]);
  // get the current pet data
  const getPet = async (uid) => {
    const petDocRef = doc(db, "pets", uid);
    const petDocSnap = await getDoc(petDocRef);
    data = petDocSnap.data();
    setPetInfo(data);
  };

  const onDrop = useCallback(
    (acceptedFiles) => {
      const arr = acceptedFiles.map((file) => file);
      const newImages = arr.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );
      setSelectedImages(newImages);
    },
    [selectedImages]
  );

  const deleteImage = (file) => {
    const newFiles = [...selectedImages];
    newFiles.splice(newFiles.indexOf(file), 1);
    setSelectedImages(newFiles);
  };

  const deleteExImg = async (img) => {
    await updateDoc(doc(db, "pets", params.type), {
      imagesUrl: arrayRemove(img),
    });
    window.location.reload(false);
  };

  // Whole different on change function that sets the state for selectedImages.
  const { getRootProps, getInputProps } = useDropzone({ onDrop });
  const selected_images = selectedImages?.map((file, i) => (
    <div className={style.preview_div}>
      <img
        src={file.preview}
        style={{
          width: "100%",
          height: "150px",
          display: "block",
          objectFit: "cover",
        }}
      />
      <button className={style.upload_button} onClick={() => deleteImage(file)}>
        Delete
      </button>
    </div>
  ));

  //if nothing changed, store  existing data into the update variables
  if (petInfo !== null) {
    if (updateName == null) {
      setNewName(`${petInfo.name}`);
    }
    if (updateAge == null) {
      setNewAge(`${petInfo.age}`);
    }
    if (updateDOB == null) {
      setNewDOB(`${petInfo.dob}`);
    }
    if (updateUrl == null) {
      setNewUrl(`${petInfo.imageUrl}`);
    }
    if (updateLocation == null) {
      setNewLocation(`${petInfo.location}`);
    }
    if (updateGender == null) {
      setNewGender(`${petInfo.gender}`);
    }
    if (updateType == null) {
      setNewType(`${petInfo.type}`);
    }
    if (updateDescription == null) {
      setNewDescription(`${petInfo.description}`);
    }
  }

  const upload = () => {
    selectedImages.map((image) => {
      const imageRef = ref(storage, `images/pets/${v4() + image.path}`);
      uploadBytes(imageRef, image, "data_url").then(async () => {
        const downloadUrl = await getDownloadURL(imageRef);
        updateDoc(doc(db, "pets", params.type), {
          imagesUrl: arrayUnion(downloadUrl),
        });
        alert("Upload Successful");
      });
    });
  };

  // update pet info
  const updatePet = async () => {
    const petDoc = doc(db, "pets", params.type);
    updateDoc(petDoc, {
      name: updateName,
      age: updateAge,
      dob: updateDOB,
      type: updateType,
      gender: updateGender,
      location: updateLocation,
      description: updateDescription,
    });
  };

  useEffect(() => {
    if (petInfo === null) {
      getPet(params.type);
    }
  }, []);

  return (
    <div>
      {petInfo === null ? (
        ""
      ) : (
        <div className={style.container}>
          <h1 className={style.form_title}>🐕 Update your pet's profile 🐈 </h1>
          <label className={style.form_label}>Name:</label>
          <input
            className={style.form_field}
            defaultValue={petInfo.name}
            onChange={(event) => {
              setNewName(event.target.value);
            }}
          />

          <label className={style.form_label}>Date of birth:</label>
          <input
            className={style.form_field}
            type="date"
            defaultValue={petInfo.dob}
            onChange={(event) => {
              setNewDOB(event.target.value);
            }}
          />

          <label className={style.form_label}>Age:</label>
          <input
            className={style.form_field}
            type="number"
            defaultValue={petInfo.age}
            onChange={(event) => {
              setNewAge(event.target.value);
            }}
          />

          <label className={style.form_label}>Type:</label>
          <select
            className={style.form_field}
            defaultValue={petInfo.type}
            onChange={(event) => {
              setNewType(event.target.value);
            }}
          >
            <option value="cat">Cat</option>
            <option value="dog">Dog</option>
            <option value="otherPet">Other pets</option>
          </select>

          <label className={style.form_label}>Gender:</label>
          <input
            className={style.form_field}
            defaultValue={petInfo.gender}
            onChange={(event) => {
              setNewGender(event.target.value);
            }}
          />

          <label className={style.form_label}>Location:</label>
          <input
            className={style.form_field}
            defaultValue={petInfo.location}
            onChange={(event) => {
              setNewLocation(event.target.value);
            }}
          />

          <div className={style.drop_image_box}>
            <div>
              <div {...getRootProps()} className={style.drop_box}>
                <input {...getInputProps()} />
                <p>Adding more images ...</p>
              </div>
              <div className={style.flex_box}>
                {petInfo.imagesUrl.map((img) => {
                  return (
                    <div className={style.preview_div}>
                      <img
                        src={img}
                        style={{
                          width: "100%",
                          height: "150px",
                          display: "block",
                          objectFit: "cover",
                        }}
                      />
                      <button
                        className={style.upload_button}
                        onClick={() => deleteExImg(img)}
                      >
                        Delete
                      </button>
                    </div>
                  );
                })}
                {selected_images}
              </div>
              <div className={style.text_align}>
                <div>
                  <em>
                    (Please wait for "Upload Successful" alert before clicking
                    Update Profile)
                  </em>
                </div>
                <button className={style.button74} onClick={upload}>
                  Upload Image
                </button>
              </div>
            </div>
          </div>

          <label className={style.form_label}>Description:</label>
          <textarea
            className={style.form_textarea}
            defaultValue={petInfo.description}
            rows="10"
            onChange={(event) => {
              setNewDescription(event.target.value);
            }}
          />

          <NavLink to={`/pet/${params.type}`}>
            <div className={style.text_align}>
              <button
                className={style.button74}
                onClick={updatePet}
                style={{ marginBottom: "30px" }}
              >
                {" "}
                Update Profile{" "}
              </button>
            </div>
          </NavLink>

          <div className={style.animation_dog}>
            <div className={style.dog}>
              <div className={style.body}></div>
              <div className={style.neck}></div>
              <div className={style.leg1}></div>
              <div className={style.leg2}></div>
              <div className={style.leg3}></div>
              <div className={style.leg4}></div>
              <div className={style.belly}></div>
              <div className={style.nose}></div>
              <div className={style.eye}></div>
              <div className={style.eyeball}></div>
              <div className={style.ear1}></div>
              <div className={style.ear2}></div>
              <div className={style.tail}></div>
              <div className={style.tongue}></div>
              <div className={style.shadow}></div>
              <div className={style.bubble}>
                <Typewriter
                  onInit={(typewriter) => {
                    typewriter
                      .typeString("Will you take me home? 🏡")
                      .pauseFor(2000)
                      .deleteAll()
                      .typeString("I want to be your friend! 🐶")
                      .start();
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PetEdit;
