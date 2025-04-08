import React from "react";

const ElectionStatus = (props) => {
  const getStatusDisplay = () => {
    if (!props.elStarted && !props.elEnded) {
      return {
        title: "Election Not Started",
        message: "The election has not been initiated yet.",
        statusClass: "pending",
        icon: "⏱️"
      };
    } else if (props.elStarted && !props.elEnded) {
      return {
        title: "Election In Progress",
        message: "Voting is currently open.",
        statusClass: "active",
        icon: "🗳️"
      };
    } else if (!props.elStarted && props.elEnded) {
      return {
        title: "Election Concluded",
        message: "Voting has ended. Results are available.",
        statusClass: "ended",
        icon: "✅"
      };
    }
  };
  
  const status = getStatusDisplay();
  
  return (
    <div className="container-main">
      <div className="election-status-container">
        <div className={`election-status-card ${status.statusClass}`}>
          <div className="status-icon">{status.icon}</div>
          <h3>{status.title}</h3>
          <p>{status.message}</p>
          
          <div className="status-timeline">
            <div className={`timeline-step ${props.elStarted || props.elEnded ? 'completed' : 'current'}`}>
              <div className="step-indicator"></div>
              <span className="step-label">Registration</span>
            </div>
            <div className={`timeline-step ${props.elStarted && !props.elEnded ? 'current' : props.elEnded ? 'completed' : ''}`}>
              <div className="step-indicator"></div>
              <span className="step-label">Voting</span>
            </div>
            <div className={`timeline-step ${props.elEnded ? 'current' : ''}`}>
              <div className="step-indicator"></div>
              <span className="step-label">Results</span>
            </div>
          </div>
          
          <div className="status-details">
            <div className="status-item">
              <span className="status-label">Started:</span>
              <span className={`status-value ${props.elStarted ? 'active' : 'inactive'}`}>
                {props.elStarted ? "Yes" : "No"}
              </span>
            </div>
            <div className="status-item">
              <span className="status-label">Ended:</span>
              <span className={`status-value ${props.elEnded ? 'active' : 'inactive'}`}>
                {props.elEnded ? "Yes" : "No"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElectionStatus;
