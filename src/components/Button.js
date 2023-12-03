import React from "react";

function Button({ content, classnames, onClick }) {
	return (
		<button className={classnames} onClick={onClick}>
			{content}
		</button>
	);
}

export default Button;
