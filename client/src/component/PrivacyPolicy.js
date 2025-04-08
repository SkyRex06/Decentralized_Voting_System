import React from "react";
import "./ModalContent.css";

function PrivacyPolicy() {
  return (
    <div className="modal-content-inner">
      <h2>Privacy Policy</h2>
      <p>
        This Privacy Policy explains how VoteSecure collects, uses, discloses, and safeguards your information when you use our platform.
      </p>
      <h3>Information We Collect</h3>
      <p>
        We may collect personal information such as your name, email address, wallet address, and voting preferences.
      </p>
      <h3>How We Use Your Information</h3>
      <p>
        Your information is used to facilitate secure voting, improve our services, and comply with legal obligations.
      </p>
      <h3>Sharing Your Information</h3>
      <p>
        We do not sell or rent your personal information. We may share data with trusted third parties to provide services on our behalf.
      </p>
      <h3>Security</h3>
      <p>
        We implement industry-standard security measures to protect your data.
      </p>
      <h3>Changes to This Policy</h3>
      <p>
        We may update this Privacy Policy from time to time. Changes will be posted on this page.
      </p>
      <h3>Contact Us</h3>
      <p>
        If you have questions about this Privacy Policy, please contact us at support@votesecure.com.
      </p>
    </div>
  );
}

export default PrivacyPolicy;