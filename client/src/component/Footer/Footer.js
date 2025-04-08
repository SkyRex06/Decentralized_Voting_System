import React, { useState } from "react";
import "./Footer.css";
import PrivacyPolicy from "../PrivacyPolicy";
import TermsAndConditions from "../TermsAndConditions";

function Footer() {
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  const openModal = (contentType) => {
    if (contentType === "privacy") {
      setModalContent(<PrivacyPolicy />);
    } else if (contentType === "terms") {
      setModalContent(<TermsAndConditions />);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalContent(null);
  };

  return (
    <>
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-copyright">
            © {new Date().getFullYear()} VoteSecure. All rights reserved.
          </div>
          <div className="footer-links">
            <button className="footer-link" onClick={() => openModal("privacy")}>
              Privacy Policy
            </button>
            <button className="footer-link" onClick={() => openModal("terms")}>
              Terms of Service
            </button>
            <a href="#" className="footer-link">Support</a>
          </div>
        </div>
      </footer>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              &times;
            </button>
            {modalContent}
          </div>
        </div>
      )}
    </>
  );
}

export default Footer;
