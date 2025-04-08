import React from "react";

const NotInit = () => {
  return (
    <div className="container-main">
      <div className="welcome-box">
        <h1>Election Not Started</h1>
        <p className="welcome-subtitle">
          The administrator has not initialized the election yet.
          Please wait for the election to be started.
        </p>
        <div className="container-item info" style={{ margin: "2rem auto", maxWidth: "600px" }}>
          <p>
            <strong>What this means:</strong> The election administrator needs to complete the setup process.
            Once complete, you will be able to access the voting features.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotInit;
