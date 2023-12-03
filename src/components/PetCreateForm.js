import React from "react";
import Modal from 'react-modal'
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { db, storage, auth } from "../firebase-config";
import {
	addDoc,
	arrayUnion,
	collection,
	doc,
	updateDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid"; // generate uniq image name
import style from "./PetCreateForm.module.css";
import Typewriter from "typewriter-effect"; // give the typing text effect

function PetCreateForm() {
	let navigate = useNavigate();
	// store all new info of a pet into seperate states
	const [newName, setNewName] = useState("");
	const [newAge, setNewAge] = useState(0);
	const [newDOB, setNewDOB] = useState(null);
	const [newType, setNewType] = useState("");
	const [newGender, setNewGender] = useState("");
	const [newLocation, setNewLocation] = useState("");
	const [newDescription, setNewDescription] = useState("");
	const [newUserID, setNewUserID] = useState("");

	const [uploading, setUploading] = useState(false);

	const toggleModal = () => {
	setUploading(!uploading);
	};


	const [selectedImages, setSelectedImages] = useState([]);

	const onDrop = useCallback((acceptedFiles) => {
		const arr = acceptedFiles.map((file) => file);

		const newImages = arr.map((file) =>
			Object.assign(file, {
				preview: URL.createObjectURL(file),
			})
		);
		setSelectedImages(selectedImages.concat(newImages));
	}, []);

	// Whole different on change function that sets the state for selectedImages.
	const { getRootProps, getInputProps } = useDropzone({ onDrop });
	const selected_images = selectedImages?.map((file) => (
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
			<button
				className={style.upload_button}
				onClick={() => deleteImage(file)}
			>
				Delete
			</button>
		</div>
	));

	const deleteImage = (file) => {
		const newFiles = [...selectedImages]; // make a var for the new array
		newFiles.splice(newFiles.indexOf(file), 1); // remove the file from the array
		setSelectedImages(newFiles);
	};

	// get the current user's info from db
	const fetchUser = async () => {
		if (newUserID === "") {
			const uid = auth.currentUser.uid;
			setNewUserID(uid);
		} else {
			return;
		}
	};
	if (newUserID === "") {
		fetchUser();
	}

	// create a pet into db first and then add selected images to this pet
	const createPet = async () => {
		const petNewRef = collection(db, "pets");
		console.log("this is the pet new ref" + JSON.stringify(petNewRef));
		const petRef = await addDoc(petNewRef, {
			name: newName,
			age: newAge,
			dob: newDOB,
			type: newType,
			gender: newGender,
			location: newLocation,
			description: newDescription,
			user_uid: newUserID,
			imagesUrl: [],
			interested: [],
			adoptedBy: "",
			isAdopted: false,
		});
		if (selectedImages.length > 0) {
			toggleModal(); // Show the modal before starting the upload
		
			await Promise.all(
			  selectedImages.map((image) => {
				const imageRef = ref(storage, `images/pets/${v4() + image.path}`);
				uploadBytes(imageRef, image, 'data_url').then(async () => {
				  // File upload successful
				  const downloadUrl = await getDownloadURL(imageRef);
				  await updateDoc(doc(db, 'pets', petRef.id), {
					imagesUrl: arrayUnion(downloadUrl),
				  });
				  //alert('Upload Successful');
				  navigate(`/user/${newUserID}`);
				  toggleModal(); // Hide the modal after successful upload
				});
			  })
			);
		  } else {
			navigate(`/user/${newUserID}`);
		  }
	};

	return (
		<div className={style.container}>
			<h1 className={style.form_title}>🐕 Describe your pet 🐈 </h1>
			<label className={style.form_label}>Name:</label>
			<input
				className={style.form_field}
				placeholder="Enter the name of your pet..."
				required
				onChange={(event) => {
					setNewName(event.target.value);
				}}
			/>
			<Modal
				isOpen={uploading}
				onRequestClose={toggleModal}
				className={style.modal}
				overlayClassName={style.overlay}
				>
				<div className="modal-content">
					<div className="spinner"></div>
					<h2>Uploading file...</h2>
				</div>
			</Modal>


			<label className={style.form_label}>Date of birth:</label>
			<input
				className={style.form_field}
				type="date"
				required
				onChange={(event) => {
					setNewDOB(event.target.value);
				}}
			/>

			<label className={style.form_label}>Age:</label>
			<input
				className={style.form_field}
				type="number"
				required
				onChange={(event) => {
					setNewAge(event.target.value);
				}}
			/>

			<label className={style.form_label}>Type:</label>
			<select
				className={style.form_field}
				required
				onChange={(event) => {
					setNewType(event.target.value);
				}}
			>
				<option value="Cat">Cat</option>
				<option value="Dog">Dog</option>
				<option value="OtherPet">Other pets</option>
			</select>

			<label className={style.form_label}>Gender:</label>
			<input
				className={style.form_field}
				required
				onChange={(event) => {
					setNewGender(event.target.value);
				}}
			/>

			<label className={style.form_label}>Location:</label>
			<input
				className={style.form_field}
				required
				onChange={(event) => {
					setNewLocation(event.target.value);
				}}
			/>
			<div className={style.drop_image_box}>
				<div>
					<div {...getRootProps()} className={style.drop_box}>
						<input {...getInputProps()} />
						<p>Drop the files here ...</p>
					</div>
					{selected_images}
				</div>
			</div>

			<label className={style.form_label}>Description:</label>
			<textarea
				className={style.form_textarea}
				required
				rows="10"
				onChange={(event) => {
					setNewDescription(event.target.value);
				}}
			/>

			<div className={style.text_align}>
				<button className={style.button74} onClick={createPet}>
					{" "}
					Submit Form{" "}
				</button>
			</div>

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
	);
}

export default PetCreateForm;
