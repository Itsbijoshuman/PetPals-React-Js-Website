import { useState, useEffect } from "react";
import { db, auth } from "../../../firebase-config";
import { collection, getDocs } from "firebase/firestore";
import styles from "./styles.module.css";
import { Stack } from "./stack";
import styled from "@emotion/styled";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";

function App() {
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

	// get all pets info from firebase
	const getPets = async () => {
		const petsCollectionRef = collection(db, "pets");
		const data = await getDocs(petsCollectionRef);
		setPets(data.docs.map((pet) => ({ ...pet.data(), id: pet.id })));
	};

	// filter out users own pets
	let filterPets = pets.filter(
		(pet) => pet.user_uid != auth.currentUser.uid && pet.isAdopted === false
	);

	// truncate description ( for long descriptions - don't fit on cards)
	const truncate = (input) =>
		input?.length > 100 ? `${input.substring(0, 90)}...` : input;

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

	useEffect(() => {
		if (pets !== []) {
			getPets();
		}
	}, []);
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
		>
			<div>
				<h1 className={styles.heading}>
					<NavLink to={"/pet/index"} className={styles.link}>
						<button className={styles.button74}>
							<span>🐶</span> List View <span>🐰</span>
						</button>
					</NavLink>
				</h1>

				<h5 className={styles.alternative}>
					<em>(If you prefer to view in list form over swipe)</em>
				</h5>

				<div className={styles.showPage}>
					<div className={styles.dislike}> </div>
					<div className={styles.deck}>
						<Wrapper
							onVote={(item, vote) =>
								console.log(item.props, vote)
							}
						>
							{shuffle(filterPets).map((pet) => {
								return (
									<Item
										data-value={pet.user_uid}
										whileTap={{ scale: 1.15 }}
										key={pet.id}
									>
										<div
											className={styles.imageContainer}
											style={{
												backgroundImage: `url(${pet.imagesUrl[0]})`,
											}}
										></div>
										<div>
											<h2 className={styles.petName}>
												{pet.name},{" "}
												{pet.age == 0
													? getAge(pet.dob)
													: pet.age}
											</h2>
											<p className={styles.petDetails}>
												{pet.location}
											</p>
											<p className={styles.petDetails}>
												{pet.gender}
											</p>
											<p className={styles.petDetails}>
												<em>
													"
													{truncate(
														`${pet.description}`
													)}
													"
												</em>
											</p>
											{/* <p className={styles.petDetails}>
                                            {auth.currentUser.uid}
                                        </p>
                                        <p className={styles.petDetails}>
                                            {pet.user_uid}
                                        </p> */}
										</div>
									</Item>
								);
							})}
						</Wrapper>
					</div>
					<div className={styles.like}></div>
				</div>
			</div>
		</motion.div>
	);
}

export default App;
