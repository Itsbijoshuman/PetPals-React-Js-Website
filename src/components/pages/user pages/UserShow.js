import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { db, auth } from "../../../firebase-config";
import { motion } from "framer-motion";
import {
	doc,
	getDoc,
	collection,
	query,
	where,
	getDocs,
	updateDoc,
} from "firebase/firestore";
import { NavLink } from "react-router-dom";
import style from "./UserShow.module.css";
import { Dropdown } from "react-dropdown-now";
import "react-dropdown-now/style.css";

function User() {
	let params = useParams();
	const [userInfo, setUserInfo] = useState(null);
	const [userPets, setUserPets] = useState([]);
	const [userFavPets, setUserFavPets] = useState([]);
	const [likedUsers, setLikedUsers] = useState([]);
	const [adopter, setAdopter] = useState();

	const getUser = async (uid) => {
		const userDocRef = doc(db, "users", uid);
		const userDocSnap = await getDoc(userDocRef);
		const data = userDocSnap.data();
		setUserInfo(data);
	};

	const getUserPets = async (user_uid) => {
		const petsRef = collection(db, "pets");
		const q = query(petsRef, where("user_uid", "==", user_uid));
		const petsData = await getDocs(q);
		// get pet id to set the key when rendering
		setUserPets(
			petsData.docs.map((pet) => ({ ...pet.data(), id: pet.id }))
		);
	};

	// this is only returning 10 pets its to do with the query firebase doesnt allow more then 10 on where queries
	const getUserFavPets = async (uid) => {
		const userDocRef = doc(db, "users", uid);
		const userDocSnap = await getDoc(userDocRef);
		const data = userDocSnap.data();
		const petIdArr = data.petArr;
		if (petIdArr.length > 0) {
			const q = query(collection(db, "pets"));
			const petDoc = await getDocs(q);
			let petArray = [];
			petDoc.forEach((doc) => {
				// doc.data() is never undefined for query doc snapshots
				petArray.push({ id: doc.id, ...doc.data() });
			});
			let filteredPetArray = [];
			petArray.forEach((pet) => {
				if (!petIdArr.includes(pet.id)) {
					if (pet.user_uid !== auth.currentUser.uid) {
						filteredPetArray.push(pet);
					}
				}
			});
			setUserFavPets(filteredPetArray);
		}
	};

	const getLikedUsers = async (uid) => {
		const userDocRef = doc(db, "users", uid);
		const userDocSnap = await getDoc(userDocRef);
		const data = userDocSnap.data();
		const favIdArr = data.favArr;
		const q = query(
			collection(db, "users"),
			where("__name__", "in", favIdArr)
		);
		const userDoc = await getDocs(q);
		let userArray = [];
		userDoc.forEach((doc) => {
			// doc.data() is never undefined for query doc snapshots
			userArray.push({ id: doc.id, ...doc.data() });
		});
		setLikedUsers(userArray);
	};

	const truncate = (input) =>
		input?.length > 30 ? `${input.substring(0, 25)}...` : input;

	const getAge = function (dob) {
		if (dob !== null) {
			let formattedDob =
				dob.split("-").reverse().splice(0, 2).reverse().join("/") +
				"/" +
				dob.split("-").reverse().splice(2).join();
			let today = new Date(); // MM/DD/YYYY format, and formattedDob changes data from YYYY/MM/DD to this format
			let birthDate = new Date(formattedDob);
			let age = today.getFullYear() - birthDate.getFullYear();
			let m = today.getMonth() - birthDate.getMonth();
			if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
				age--;
			}
			return age;
		}
	};

	const adopt = function (name, id, adopt) {
		console.log("adopting", name, id, adopt);
	};

	// map our current user's favArr (other users)
	const dropdown = likedUsers.map((user) => {
		return {
			label: user.firstName + " " + user.lastName,
			value: user.uid,
		};
	});

	const adoptee = async function (adopter, petId) {
		const getUserData = async function (user) {
			const UserDoc = doc(db, "users", user);
			const DocSnap = await getDoc(UserDoc);
			return DocSnap.data();
		};
		const currentUserData = await getUserData(adopter.value);
		// console.log("adopter button clicked", adopter.value, petId);
		// adding userID to pet adoptedBy field
		const petDoc = doc(db, "pets", petId);
		await updateDoc(petDoc, {
			adoptedBy: adopter,
			isAdopted: true,
		});

		const userDoc = doc(db, "users", adopter.value);
		await updateDoc(userDoc, {
			adoptedPets: [petId, ...currentUserData.adoptedPets],
		});
		window.location.reload();
	};

	const editAdoptee = async function (adopter, petId) {
		const getUserData = async function (user) {
			const UserDoc = doc(db, "users", user);
			const DocSnap = await getDoc(UserDoc);
			return DocSnap.data();
		};
		const currentUserData = await getUserData(adopter.value);
		const userDoc = doc(db, "users", adopter.value);
		const index = currentUserData.adoptedPets.indexOf(adopter.value);
		await updateDoc(userDoc, {
			adoptedPets: currentUserData.adoptedPets.splice(index, 1),
		});

		const petDoc = doc(db, "pets", petId);
		await updateDoc(petDoc, {
			adoptedBy: "",
			isAdopted: true,
		});

		window.location.reload();
	};

	useEffect(() => {
		if (userInfo === null) {
			getUser(params.id);
			getUserPets(params.id);
			getUserFavPets(params.id);
			getLikedUsers(params.id);
		}
	}, []);

	//   const editInterest = async function (user, petId) {
	//     const petDoc = doc(db, "pets", petId);
	//     const petDocSnap = await getDoc(petDoc);
	//     const petData = petDocSnap.data();
	//     const index = petData.interested.indexOf(user);
	//     console.log(index);
	//     petData.interested.splice(index, 1);

	// await updateDoc(petDoc, {
	//   interested: petData.interested.splice(index, 1),
	// });
	// window.location.reload();
	//};

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
		>
			<div className={style.container}>
				<div className={style.profile}>
					{userInfo === null ? (
						""
					) : (
						<div className={style.profileInfo}>
							<h1 className={style.profileHeading}>My Profile</h1>
							<div className={style.sticky}>
								<div
									className={style.profileImage}
									style={{
										backgroundImage: `url(${userInfo.imageUrl})`,
									}}
								></div>
								<h3>First Name:</h3>
								<p>{userInfo.firstName}</p>
								<h3>Last Name:</h3>
								<p>{userInfo.lastName}</p>
								<h3>Email:</h3>
								<p>{userInfo.email}</p>
								<h3>Location:</h3>
								<p>{userInfo.location}</p>
								<h3>Description:</h3>
								<p>{userInfo.description}</p>
								<div>
									{params.id === auth.currentUser.uid ? (
										<div className={style.edit}>
											<NavLink
												to={`/user/edit/${params.id}`}
											>
												<button
													className={style.button74}
												>
													Edit
												</button>
											</NavLink>
											<NavLink to={"/newpet"}>
												<button
													className={style.button74}
												>
													New Pet
												</button>
											</NavLink>
										</div>
									) : (
										""
									)}
								</div>
							</div>
						</div>
					)}
				</div>

				<div className={style.petContainer}>
					<div>
						{userPets.length < 1 ? (
							""
						) : (
							<div>
								<h1>My Pets</h1>
								<div className={style.pets}>
									{userPets.map((pet) => {
										return (
											<div key={pet.id}>
												<NavLink
													to={`/pet/${pet.id}`}
													key={pet.id}
												>
													<div
														key={pet.id}
														className={
															style.petTile
														}
													>
														<div
															className={
																style.image
															}
															style={{
																backgroundImage: `url(${pet.imagesUrl[0]})`,
															}}
														></div>
														<h2>
															{pet.name},{" "}
															{pet.age === 0
																? getAge(
																		pet.dob
																  )
																: pet.age}
														</h2>
														<h4
															className={
																style.capital
															}
														>
															{pet.location}
														</h4>
														<h4
															className={
																style.capital
															}
														>
															{pet.gender}
														</h4>
														<h5>
															{" "}
															<em>
																{truncate(
																	pet.description
																)}
															</em>
														</h5>
													</div>
												</NavLink>
												<div className={style.select}>
													{!pet.adoptedBy ? (
														<div>
															<h5>
																Choose an
																Adopter
															</h5>

															<Dropdown
																baseClassName="rdn"
																onChange={(
																	value
																) =>
																	setAdopter(
																		value
																	)
																}
																// onChange={(value) => console.log('change!', value.label, value.value, pet.name)}
																options={dropdown.filter(
																	(options) =>
																		pet.interested.includes(
																			options.value
																		)
																)}
															/>
															<div
																className={
																	style.btnContainer
																}
															>
																<button
																	className={
																		style.button74
																	}
																	onClick={() =>
																		adoptee(
																			adopter,
																			pet.id
																		)
																	}
																>
																	Select
																</button>
															</div>
														</div>
													) : (
														<div>
															<h5>
																Adopter:{" "}
																{
																	pet
																		.adoptedBy
																		.label
																}
															</h5>
															<div
																className={
																	style.btnContainer
																}
															>
																<button
																	className={
																		style.button74
																	}
																	onClick={() =>
																		editAdoptee(
																			pet.adoptedBy,
																			pet.id
																		)
																	}
																>
																	Edit
																</button>
															</div>
														</div>
													)}
												</div>
											</div>
										);
									})}
								</div>
							</div>
						)}
					</div>

					<div>
						{userFavPets.length < 1 ? (
							""
						) : (
							<div>
								<h1>Liked Pets</h1>
								<div className={style.pets}>
									{userFavPets.map((pet) => {
										return (
											<div
												className={style.liked}
												key={pet.id}
											>
												<NavLink
													to={`/pet/${pet.id}`}
													key={pet.id}
												>
													<div
														key={pet.id}
														className={
															style.petTile
														}
													>
														<div
															className={
																style.image
															}
															style={{
																backgroundImage: `url(${pet.imagesUrl[0]})`,
															}}
														></div>
														<h2>
															{pet.name},{" "}
															{pet.age === 0
																? getAge(
																		pet.dob
																  )
																: pet.age}
														</h2>
														<h4
															className={
																style.capital
															}
														>
															{" "}
															{`${pet.location}`}
														</h4>
														<h4
															className={
																style.capital
															}
														>
															{pet.gender}
														</h4>
														<h5>
															<em>
																"
																{truncate(
																	pet.description
																)}
																"
															</em>
														</h5>
													</div>
												</NavLink>

												{pet.adoptedBy.value !==
												userInfo.uid ? (
													<div>
														{pet.interested.includes(
															`${params.id}`
														) ? (
															<button
																className={
																	style.button74
																}
															>
																Request Sent
															</button>
														) : (
															<NavLink
																to={`/adoptionForm/${pet.id}`}
															>
																<button
																	onClick={() =>
																		adopt(
																			pet.name,
																			pet.id,
																			pet.isAdopted
																		)
																	}
																	className={
																		style.button74
																	}
																>
																	Send
																	Adoption
																	Request
																</button>
															</NavLink>
														)}
													</div>
												) : (
													<NavLink
														to={`/adoptionForm/${pet.id}`}
													>
														<button
															onClick={() =>
																adopt(
																	pet.name,
																	pet.id,
																	pet.isAdopted
																)
															}
															className={
																style.button74
															}
														>
															ADOPTION APPROVED 😁
														</button>
													</NavLink>
												)}
											</div>
										);
									})}
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</motion.div>
	);
}

export default User;
