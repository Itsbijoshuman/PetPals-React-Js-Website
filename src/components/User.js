import React from "react";

// this component is for the chat index page
function User({ user, selectUser }) {
  return (
    <div className="user-wrapper" onClick={() => selectUser(user)}>
      <div
        className="user-info"
        style={{
          display: "grid",
          gridTemplateColumns: "60px 150px",
          marginBottom: "10px",
        }}
      >
        {user.imageUrl === "" ? (
          <div
            className="userIcon"
            style={{
              backgroundImage:
                "url(https://cdn-icons-png.flaticon.com/512/141/141783.png)",
            }}
          ></div>
        ) : (
          <div
            className="userIcon"
            style={{
              backgroundImage: `url(${user.imageUrl})`,
            }}
          ></div>
        )}

        <div style={{ lineHeight: "50px" }}>
          <h4>{user.firstName}</h4>
        </div>
      </div>
    </div>
  );
}

export default User;
