import React, { useEffect, useState, useContext } from "react";
import Dogs from "../Dogs";
import Cats from "../Cats";
import { db, auth } from "../../firebase-config";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../context/auth";
import style from "./Home.module.css";
import { motion } from "framer-motion";
import { onAuthStateChanged } from "firebase/auth";

import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import styles from "./pets pages/styles.module.css";
import { Stack } from "./pets pages/stack";
import styled from "@emotion/styled";

function Home() {
	const { user } = useContext(AuthContext);

	const Wrapper = styled(Stack)`
		background: #ffffff;
		border-radius: 50px;
	`;

	const Item = styled.div`
		background: #f9fafb;
		width: 400px;
		height: 550px;
		text-shadow: 0 10px 10px #d1d5db;
		box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
		border-radius: 10px;
		padding: 15px;
		transform: ${() => {
			let rotation = Math.random() * (5 - -5) + -5;
			return `rotate(${rotation}deg)`;
		}};
	`;

	const [pets, setPets] = useState([]);
	const [userInfo, setUserInfo] = useState({});
	const [filteredPets, setFilteredPets] = useState([]);

	// get all pets info from firebase
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

	// filter out users own pets
	// let filterPets = function () { pets.filter(pet => {
	//     pet.user_uid != auth.currentUser.uid;
	//     !pet.id.includes(auth.currentUser.petArr)
	// })}
	const getFilteredPets = function () {
		let filterPets;
		if (user !== null) {
			filterPets = pets.filter(
				(pet) =>
					pet.user_uid !== auth.currentUser.uid &&
					pet.isAdopted === false &&
					!userInfo.petArr.includes(pet.id)
			);
			setFilteredPets(filterPets);
		}
	};

	// shuffle pets
	function shuffle(array) {
		let currentIndex = array.length,
			tempValue,
			randomIndex;
		while (0 !== currentIndex) {
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;
			tempValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = tempValue;
		}
		return array;
	}

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
	// truncate description ( for long descriptions - don't fit on cards)
	const truncate = (input) =>
		input?.length > 50 ? `${input.substring(0, 45)}...` : input;

	useEffect(() => {
		onAuthStateChanged(auth, async (user) => {
			if (user) {
				getUser(auth.currentUser.uid);
			}
		});
	}, []);

	// get pets on pageload
	useEffect(() => {
		getPets();
	}, []);

	// filter the pets only once pets has finished
	useEffect(() => {
		getFilteredPets();
	}, [pets]);
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
		>
			<div>
				{!user ? (
					<>
						<div>
							<div className={style.container}>
								<div className={style.centerDiv}>
									<h1 className={style.title}>
										Adopt the perfect pet
									</h1>
									<p className={style.des}>
										Our mission is to help the pets in need
										of rescue and rehabilitation and help
										them find a loving home. Open your doors
										and hearts to pets in needs of a home.
									</p>
									<div style={{ textAlign: "center" }}>
										<h3 className={style.sub_title}>
											{" "}
											Pets available for adoption nearby
										</h3>
										<NavLink
											to={"/signup"}
											className={style.button87}
										>
											Start your search
										</NavLink>
									</div>
								</div>
							</div>
							<Dogs />
						</div>
					</>
				) : (
					<>
						<div>
							<h1 className={styles.heading}>
								<NavLink
									to={"/pet/index"}
									className={styles.link}
								>
									<button className={styles.button74}>
										<span>🐶</span> List View{" "}
										<span>🐰</span>
									</button>
								</NavLink>
							</h1>

							<h5 className={styles.alternative}>
								<em>
									(If you prefer to view in list form over
									swipe)
								</em>
							</h5>

							<div className={styles.showPage}>
								<div className={styles.dislike}> </div>
								<div className={styles.deck}>
									<Wrapper
										onVote={(item, vote) =>
											console.log(item.props, vote)
										}
									>
										{shuffle(filteredPets).map((pet) => {
											return (
												<Item
													data-value={pet.user_uid}
													whileTap={{
														scale: 1.15,
													}}
													key={pet.id}
												>
													<div
														className={
															styles.imageContainer
														}
														style={{
															backgroundImage: `url(${pet.imagesUrl[0]})`,
														}}
													></div>
													<div>
														<h2
															className={
																styles.petName
															}
														>
															{pet.name},{" "}
															{pet.age === 0
																? getAge(
																		pet.dob
																  )
																: pet.age}
														</h2>
														<p
															className={
																styles.petDetails
															}
														>
															{pet.location}
														</p>
														<p
															className={
																styles.petDetails
															}
														>
															{pet.gender}
														</p>
														<p
															className={
																styles.petDetails
															}
														>
															<em>
																"
																{truncate(
																	`${pet.description}`
																)}
																"
															</em>
														</p>
													</div>
												</Item>
											);
										})}
									</Wrapper>
								</div>
								<div className={styles.like}></div>
							</div>
						</div>
					</>
				)}
			</div>
		</motion.div>
	);
}

export default Home;
