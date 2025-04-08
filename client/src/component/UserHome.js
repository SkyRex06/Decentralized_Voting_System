import React from "react";

function UserHome(props) {
  return (
    <div className="container-main">
      <div className="welcome-box">
        <h1 className="welcome-title">{props.el.electionTitle}</h1>
        <p className="welcome-subtitle">
          {props.el.organizationTitle}
        </p>
      </div>
      
      <div className="container-item">
        <h3 className="title">Election Information</h3>
        <div className="election-details">
          <table>
            <tbody>
              <tr>
                <th>Administrator</th>
                <td>
                  {props.el.adminName} <span className="admin-title">({props.el.adminTitle})</span>
                </td>
              </tr>
              <tr>
                <th>Contact</th>
                <td className="admin-email">{props.el.adminEmail}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default UserHome;
