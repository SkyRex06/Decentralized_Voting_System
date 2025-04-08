import React, { Component } from "react";
import Navbar from "../../Navbar/Navigation";
import NavbarAdmin from "../../Navbar/NavigationAdmin";
import AdminOnly from "../../AdminOnly";
import getWeb3 from "../../../getWeb3";
import Election from "../../../contracts/Election.json";
import "./Verification.css";

export default class Registration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ElectionInstance: undefined,
      account: null,
      web3: null,
      isAdmin: false,
      voterCount: undefined,
      voters: [],
    };
  }

  componentDidMount = async () => {
    if (!window.location.hash) {
      window.location = window.location + "#loaded";
      window.location.reload();
    }
    try {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = Election.networks[networkId];
      const instance = new web3.eth.Contract(
        Election.abi,
        deployedNetwork && deployedNetwork.address
      );

      this.setState({ web3, ElectionInstance: instance, account: accounts[0] });
      const candidateCount = await this.state.ElectionInstance.methods
        .getTotalCandidate()
        .call();
      this.setState({ candidateCount: candidateCount });
      const admin = await this.state.ElectionInstance.methods.getAdmin().call();
      if (this.state.account === admin) {
        this.setState({ isAdmin: true });
      }
      const voterCount = await this.state.ElectionInstance.methods
        .getTotalVoter()
        .call();
      this.setState({ voterCount: voterCount });
      for (let i = 0; i < this.state.voterCount; i++) {
        const voterAddress = await this.state.ElectionInstance.methods
          .voters(i)
          .call();
        const voter = await this.state.ElectionInstance.methods
          .voterDetails(voterAddress)
          .call();
        this.state.voters.push({
          address: voter.voterAddress,
          name: voter.name,
          phone: voter.phone,
          hasVoted: voter.hasVoted,
          isVerified: voter.isVerified,
          isRegistered: voter.isRegistered,
        });
      }
      this.setState({ voters: this.state.voters });
    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  renderUnverifiedVoters = (voter, index) => {
    const verifyVoter = async (verifiedStatus, address) => {
      await this.state.ElectionInstance.methods
        .verifyVoter(verifiedStatus, address)
        .send({ from: this.state.account, gas: 1000000 });
      window.location.reload();
    };
    
    if (voter.isVerified) {
      return (
        <div key={index} className="container-item success">
          <h4>{voter.name}</h4>
          <div className="verification-status verified">
            <span className="status-dot active"></span>Verified
          </div>
          <div className="voter-details">
            <p className="voter-address">{voter.address}</p>
            <div className="voter-info">
              <div className="info-row">
                <span className="info-label">Phone:</span>
                <span className="info-value">{voter.phone}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Vote Status:</span>
                <span className="info-value">{voter.hasVoted ? "Vote Cast" : "Not Voted"}</span>
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    return (
      <div key={index} className="container-item pending">
        <h3 className="verification-header">Pending Verification</h3>
        <div className="verification-status pending">
          <span className="status-dot pending"></span>Awaiting Approval
        </div>
        
        <div className="voter-details">
          <div className="voter-name">{voter.name}</div>
          <p className="voter-address">{voter.address}</p>
          
          <table className="verification-table">
            <tbody>
              <tr>
                <th>Phone</th>
                <td>{voter.phone}</td>
              </tr>
              <tr>
                <th>Registration Status</th>
                <td>{voter.isRegistered ? "Registered" : "Not Registered"}</td>
              </tr>
              <tr>
                <th>Voted</th>
                <td>{voter.hasVoted ? "Yes" : "No"}</td>
              </tr>
            </tbody>
          </table>
          
          <div className="verification-actions">
            <button
              className="verify-button"
              onClick={() => verifyVoter(true, voter.address)}
            >
              Approve Voter
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  render() {
    if (!this.state.web3) {
      return (
        <>
          {this.state.isAdmin ? <NavbarAdmin /> : <Navbar />}
          <div className="container-main">
            <div className="welcome-box">
              <h1>Loading VoteSecure</h1>
              <p className="welcome-subtitle">
                Connecting to the blockchain network...
              </p>
              <div className="loading-spinner"></div>
            </div>
          </div>
        </>
      );
    }
    
    if (!this.state.isAdmin) {
      return (
        <>
          <Navbar />
          <AdminOnly page="Verification Page" />
        </>
      );
    }
    
    // Get counts of verified and unverified voters
    const verifiedVoters = this.state.voters.filter(voter => voter.isVerified);
    const pendingVoters = this.state.voters.filter(voter => !voter.isVerified && voter.isRegistered);
    
    return (
      <>
        <NavbarAdmin />
        <div className="container-main">
          <div className="welcome-box">
            <h1>Voter Verification</h1>
            <p className="welcome-subtitle">
              Review and verify registered voters
            </p>
          </div>
          
          <div className="verification-stats">
            <div className="stat-box">
              <div className="stat-value">{this.state.voters.length}</div>
              <div className="stat-label">Total Voters</div>
            </div>
            <div className="stat-box">
              <div className="stat-value">{verifiedVoters.length}</div>
              <div className="stat-label">Verified</div>
            </div>
            <div className="stat-box">
              <div className="stat-value">{pendingVoters.length}</div>
              <div className="stat-label">Pending</div>
            </div>
          </div>
          
          {this.state.voters.length < 1 ? (
            <div className="container-item attention">
              <h3>No Registered Voters</h3>
              <p>There are no voters registered in the system yet.</p>
            </div>
          ) : (
            <>
              {pendingVoters.length > 0 && (
                <div className="section">
                  <h2 className="title">Pending Verification</h2>
                  <div className="info" style={{marginBottom: "1.5rem"}}>
                    <p>The following voters need to be verified before they can participate in the election.</p>
                  </div>
                  <div className="card-grid">
                    {pendingVoters.map(this.renderUnverifiedVoters)}
                  </div>
                </div>
              )}
              
              {verifiedVoters.length > 0 && (
                <div className="section">
                  <h2 className="title">Verified Voters</h2>
                  <div className="info" style={{marginBottom: "1.5rem"}}>
                    <p>These voters have been approved and can participate in the election.</p>
                  </div>
                  <div className="card-grid">
                    {verifiedVoters.map(this.renderUnverifiedVoters)}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </>
    );
  }
}
