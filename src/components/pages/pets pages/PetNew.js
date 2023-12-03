// form components for adding new pet
import React from "react";
import PetCreateForm from "../../PetCreateForm";
import { motion } from "framer-motion";

function PetNew() {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
		>
			<div>
				<PetCreateForm />
			</div>
		</motion.div>
	);
}

export default PetNew;
