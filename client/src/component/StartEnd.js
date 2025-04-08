import React from "react";
import { Link } from "react-router-dom";

const StartEnd = (props) => {
  return (
    <div className="container-main">
      {!props.elStarted ? (
        <>
          {!props.elEnded ? (
            <>
              <div className="container-item info">
                <h3>Important Notice</h3>
                <p>
                  Remember to add candidates before starting the election.
                  You can add candidates in the{" "}
                  <Link
                    to="/AddCandidate"
                    style={{
                      color: "#3182ce",
                      textDecoration: "none",
                      fontWeight: "500",
                    }}
                  >
                    Add Candidates
                  </Link>{" "}
                  section.
                </p>
              </div>
              <div className="container-item" style={{ textAlign: "center" }}>
                <button 
                  type="submit"
                  className="start-button"
                >
                  {props.elEnded ? "Restart Election" : "Start Election"}
                </button>
              </div>
            </>
          ) : (
            <div className="container-item alert">
              <h3>Election Ended</h3>
              <p>To start a new election, you'll need to redeploy the contract.</p>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="container-item success">
            <h3>Election In Progress</h3>
            <p>The election is currently active and accepting votes.</p>
          </div>
          <div className="container-item" style={{ textAlign: "center" }}>
            <button
              type="button"
              onClick={props.endElFn}
              className="end-button"
            >
              End Election
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default StartEnd;
