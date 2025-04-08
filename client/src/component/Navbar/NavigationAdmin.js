import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import WalletConnect from "../Wallet/WalletConnect";

import "./Navbar.css";

export default function NavbarAdmin() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="header-accent"></div>
      <nav className="navbar">
        <div className="navbar-container">
          <NavLink to="/" className="brand-logo">
            Vote<span>Secure</span> <small className="admin-badge">Admin</small>
          </NavLink>
          
          <ul className={`navbar-links ${open ? "active" : ""}`}>
            <li>
              <NavLink to="/AddCandidate" activeClassName="nav-active">
                Add Candidate
              </NavLink>
            </li>
            <li>
              <NavLink to="/Verification" activeClassName="nav-active">
                Verification
              </NavLink>
            </li>
            <li>
              <NavLink to="/Voting" activeClassName="nav-active">
                Voting
              </NavLink>
            </li>
            <li>
              <NavLink to="/Results" activeClassName="nav-active">
                Results
              </NavLink>
            </li>
          </ul>
          
          <div className="navbar-right">
            <WalletConnect />
            <button 
              className="menu-toggle" 
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
