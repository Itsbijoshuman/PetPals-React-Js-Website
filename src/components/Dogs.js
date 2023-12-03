import React, { useEffect, useState } from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import { db } from "../firebase-config";
import { collection, query, where, limit, getDocs } from "firebase/firestore";
import styled from "styled-components";
import "@splidejs/react-splide/css";
import style from "./Cats.module.css";

// helper function for window width adjustments
function useWindowWidth() {
	const [size, setSize] = useState([window.innerHeight, window.innerWidth]);

	useEffect(() => {
		const handleResize = () => {
			setSize([window.innerHeight, window.innerWidth]);
		};
		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);
	return size;
}

// carousel for landing page dogs wheel
function Dogs() {
	const [dogs, setDogs] = useState([]);
	const [height, width] = useWindowWidth();

	const getPets = async function (pet) {
		const petsRef = collection(db, "pets");
		const q = query(petsRef, where("type", "in", [pet]), limit(8));
		const getFiles = await getDocs(q);
		const petDataArray = [];
		getFiles.forEach((pet) => {
			petDataArray.push({ petID: pet.id, ...pet.data() });
		});
		setDogs(petDataArray);
	};
	const carouselWidth = function () {
		if (width < 800 || (width > 800 && height > width * 2)) {
			return 2;
		} else return 4;
	};

	useEffect(() => {
		getPets("Dog");
	}, []);
	return (
		<div>
			<Wrapper className={style.container_dog}>
				<div className={style.div}>
					<h1 className={style.home_title}> 🐕 Your Would be Pals! 🐕</h1>
				</div>
				<Splide
					options={{
						perPage: carouselWidth(),
						arrows: false,
						pagination: false,
						drag: "free",
						gap: "0.5rem",
					}}
					style={{ width: "80%", margin: "auto" }}
				>
					{dogs.map((dog) => {
						return (
							<SplideSlide key={dog.petID}>
								<Card>
									<p>{dog.name}</p>
									<img
										src={dog.imagesUrl[0]}
										alt={dog.name}
									/>
									<Gradient />
								</Card>
							</SplideSlide>
						);
					})}
				</Splide>
			</Wrapper>
		</div>
	);
}

const Wrapper = styled.div`
	margin: 50px auto;
`;
const Card = styled.div`
	height: 15rem;
	border-radius: 1rem;
	position: reletive;

	img {
		border-radius: 1rem;
		position: absolute;
		left: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	p {
		position: absolute;
		z-index: 10;
		top: 50%;
		left: 50%;

		transform: translate(-50%, 0%);
		color: white;
		width: 100%;
		text-align: center;
		font-weight: 600;
		font-size: 1.5vw;
		height: 30%;
		display: flex;
		justify-content: center;
		align-items: center;
	}
`;
const Gradient = styled.div`
	background: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5));
	position: absolute;
	z-index: 3;
	width: 100%;
	height: 100%;
	overflow: hidden;
	border-radius: 1rem;
`;

export default Dogs;
