// ErrorModal.js

import React from "react";
import style from "./ErrorModal.module.css";

const ErrorModal = ({ errorMessage, onClose }) => {
    return (
      <div className={style.modalBackground}>
        <div className={style.modalContent}>
          <h2>Error</h2>
          <p>{errorMessage}</p>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    );
  };
export default ErrorModal;
