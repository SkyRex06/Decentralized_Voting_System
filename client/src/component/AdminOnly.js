import React from "react";
import { Link } from "react-router-dom";

const AdminOnly = (props) => {
  return (
    <div className="container-main">
      <div className="welcome-box">
        <h1>Admin Access Required</h1>
        <p className="welcome-subtitle">
          This section is only accessible to election administrators
        </p>
      </div>
      
      <div className="container-item alert">
        <h3>Restricted Area</h3>
        <p>
          The {props.page} requires administrative privileges. 
          If you are an administrator, please sign in with your admin account.
        </p>
        <div className="form-actions" style={{marginTop: "1.5rem"}}>
          <Link to="/">
            <button>Return to Home</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminOnly;
