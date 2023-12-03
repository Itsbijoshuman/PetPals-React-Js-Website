import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	onAuthStateChanged,
	signInWithEmailAndPassword,
	GoogleAuthProvider,
	signInWithPopup,
} from "firebase/auth";
import { auth } from "../../firebase-config";
import { db } from "../../firebase-config";
import { motion } from "framer-motion";
import { doc, setDoc, getDoc } from "firebase/firestore";
import Button from "../Button";
import style from "./SignUp.module.css";

function Login() {
	const [loginEmail, setLoginEmail] = useState("");
	const [loginPassword, setLoginPassword] = useState("");
	const [user, setUser] = useState({});
	const [errorMessage, setErrorMessage] = useState(null);
	const [loading, setLoading] = useState(false); // Add loading state
	let navigate = useNavigate();

	const login = async () => {
		setLoading(true);
		try {
			const result = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);

			if (result) {
				navigate("/");
			} else {
				setErrorMessage("Invalid ID or password. Please try again.");
				console.error("Invalid ID or password");
			}
		} catch (error) {
			setErrorMessage("Invalid ID or password. Please try again.");
			console.error(error.message);
		} finally {
			setLoading(false);
		}
	};
	const createUser = async (result) => {
		const user = result.user;
		const userDocRef = doc(db, "users", user.uid);
		const userDocSnap = await getDoc(userDocRef);
		const uid = user.uid;

		if (!userDocSnap.exists()) {
			await setDoc(doc(db, "users", user.uid), {
				firstName: user.displayName.split(" ")[0],
				lastName: user.displayName.split(" ")[1],
				email: user.email,
				uid: uid,
				favRef: [],
				petArr: [],
				location: "",
				description: "",
				imageUrl: user.photoURL,
				adoptedPets:[],   
			});
		}
	};

	const provider = new GoogleAuthProvider();
	const signInWithGoogle = () => {
		signInWithPopup(auth, provider)
			.then((result) => {
				createUser(result);
				//logInFailed = false;
				navigate("/");
			})
			.catch((error) => {
				//logInFailed = true;
				//setErrorDisplay(error.message);
				console.log(error);
			});
	};


	useEffect(() => {
		// Clear error message after 3 seconds
		const timeout = setTimeout(() => {
			setErrorMessage(null);
		}, 3000);

		// Clear the timeout if the component unmounts
		return () => clearTimeout(timeout);
	}, [errorMessage]);
	return (
		<motion.div
      		initial={{ opacity: 0 }}
      		animate={{ opacity: 1 }}
      		exit={{ opacity: 0 }}
    	>
		<div className={style.background}>
				{errorMessage && <div className={style.errorMessage}>{errorMessage}</div>}
				<div className={style.container}>
					<h3 className={style.hover}>Login</h3>
					<input
						placeholder="Email..."
						name="loginEmail"
						value={loginEmail}
						className={style.input}
						onChange={(event) => {
							setLoginEmail(event.target.value);
						}}
					/>
					<input
						placeholder="Password..."
						name="loginPassword"
						value={loginPassword}
						type="password"
						className={style.input}
						onChange={(event) => {
							setLoginPassword(event.target.value);
						}}
					/>
					<Button
						onClick={login}
						classnames={style.button74}
						content="Login"
						disabled={loading} // Disable button when loading is true
					/>
					<h4 style={{ margin: "20px" }}> User Logged In:</h4>
					<h4>{user?.email}</h4>
					<div>
						<Button
							onClick={signInWithGoogle}
							classnames={style.button74}
							content="Sign in with google"
							disabled={loading} // Disable button when loading is true
						/>
					</div>
				</div>
			</div>
		</motion.div>
	);
}

export default Login;