// index all favourited pets for a user
import React, { Component, useState, useEffect } from "react";
import PetProfileList from "./PetProfileList.js";
import { motion } from "framer-motion";

function PetIndex() {
	const [pets, setPets] = useState([]);

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
		>
			<div>
				<PetProfileList />
			</div>
		</motion.div>
	);
}

export default PetIndex;
