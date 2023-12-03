import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import {
	createUserWithEmailAndPassword,
	onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../../firebase-config";
import { db } from "../../firebase-config";
import { doc, setDoc } from "firebase/firestore";
import style from "./SignUp.module.css";

import Button from "../Button";

function SignUp() {
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [registerEmail, setRegisterEmail] = useState("");
	const [registerPassword, setRegisterPassword] = useState("");
	//   const [users, setUsers] = useState([]);

	const createUser = async (user) => {
		const uid = user.user.uid;
		await setDoc(doc(db, "users", user.user.uid), {
			firstName: firstName,
			lastName: lastName,
			email: registerEmail,
			uid: uid,
			favArr: [],
			petArr: [],
			location: "",
			description: "",
			imageUrl: "",
			adoptedPets: [],
		});
	};

	const register = async () => {
		try {
			const user = await createUserWithEmailAndPassword(
				auth,
				registerEmail,
				registerPassword
			).then((user) => {
				createUser(user);
			});
		} catch (error) {
			// need to add alert or message when failed signup
			console.log(error.message);
		}
	};
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
		>
			<div className={style.background}>
				<div className={style.container}>
					<h3 className={style.hover}>Register User</h3>
					<input
						className={style.input}
						placeholder="First Name..."
						required
						onChange={(event) => {
							setFirstName(event.target.value);
						}}
					/>
					<input
						className={style.input}
						placeholder="Last Name..."
						required
						onChange={(event) => {
							setLastName(event.target.value);
						}}
					/>
					<input
						className={style.input}
						placeholder="Email..."
						required
						onChange={(event) => {
							setRegisterEmail(event.target.value);
						}}
					/>
					<input
						className={style.input}
						placeholder="Password..."
						required
						type="password"
						onChange={(event) => {
							setRegisterPassword(event.target.value);
						}}
					/>
					<NavLink to={"/"}>
						<Button
							onClick={register}
							classnames={style.button74}
							content="Register"
						/>
					</NavLink>
				</div>
			</div>
		</motion.div>
	);
}

export default SignUp;
