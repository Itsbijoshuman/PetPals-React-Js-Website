import React, { Component } from "react";
import MessagesList from "./MessagesList";

import style from "./message.module.css";
import { motion } from "framer-motion";
class Message extends Component {
	render() {
		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
			>
				<div className={style.content}>
					<MessagesList />
				</div>
			</motion.div>
		);
	}
}

export default Message;
