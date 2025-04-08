import React, { Component } from "react";
import Navbar from "../Navbar/Navigation";
import NavbarAdmin from "../Navbar/NavigationAdmin";
import NotInit from "../NotInit";
import "./Registration.css";
import getWeb3 from "../../getWeb3";
import Election from "../../contracts/Election.json";

export default class Registration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ElectionInstance: undefined,
      web3: null,
      account: null,
      isAdmin: false,
      isElStarted: false,
      isElEnded: false,
      voterCount: undefined,
      voterName: "",
      voterPhone: "",
      voters: [],
      currentVoter: {
        address: undefined,
        name: null,
        phone: null,
        hasVoted: false,
        isVerified: false,
        isRegistered: false,
      },
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

      this.setState({
        web3: web3,
        ElectionInstance: instance,
        account: accounts[0],
      });
      const admin = await this.state.ElectionInstance.methods.getAdmin().call();
      if (this.state.account === admin) {
        this.setState({ isAdmin: true });
      }

      const start = await this.state.ElectionInstance.methods.getStart().call();
      this.setState({ isElStarted: start });
      const end = await this.state.ElectionInstance.methods.getEnd().call();
      this.setState({ isElEnded: end });

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

      const voter = await this.state.ElectionInstance.methods
        .voterDetails(this.state.account)
        .call();
      this.setState({
        currentVoter: {
          address: voter.voterAddress,
          name: voter.name,
          phone: voter.phone,
          hasVoted: voter.hasVoted,
          isVerified: voter.isVerified,
          isRegistered: voter.isRegistered,
        },
      });
    } catch (error) {
      console.error(error);
      alert(
        `Failed to load web3, accounts, or contract. Check console for details (f12).`
      );
    }
  };
  updateVoterName = (event) => {
    this.setState({ voterName: event.target.value });
  };
  updateVoterPhone = (event) => {
    this.setState({ voterPhone: event.target.value });
  };
  registerAsVoter = async () => {
    await this.state.ElectionInstance.methods
      .registerAsVoter(this.state.voterName, this.state.voterPhone)
      .send({ from: this.state.account, gas: 1000000 });
    window.location.reload();
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
    return (
      <>
        {this.state.isAdmin ? <NavbarAdmin /> : <Navbar />}
        {!this.state.isElStarted && !this.state.isElEnded ? (
          <NotInit />
        ) : (
          <>
            <div className="container-main">
              <div className="welcome-box">
                <h1>Voter Registration</h1>
                <p className="welcome-subtitle">
                  Register to participate in the secure blockchain voting process.
                </p>
                <div className="info" style={{textAlign: "center", marginTop: "1rem"}}>
                  <p>Total registered voters: {this.state.voters.length}</p>
                </div>
              </div>

              <div className="container-item">
                <h3 className="title">Registration Form</h3>
                <form>
                  <div className="form-group">
                    <label>
                      Account Address
                      <input
                        type="text"
                        value={this.state.account}
                        readOnly
                      />
                    </label>
                  </div>
                  <div className="form-group">
                    <label>
                      Full Name
                      <input
                        type="text"
                        placeholder="Enter your full name"
                        value={this.state.voterName}
                        onChange={this.updateVoterName}
                      />
                    </label>
                  </div>
                  <div className="form-group">
                    <label>
                      Phone Number <span className="required">*</span>
                      <input
                        type="number"
                        placeholder="10-digit phone number"
                        value={this.state.voterPhone}
                        onChange={this.updateVoterPhone}
                      />
                    </label>
                  </div>
                  <div className="container-item info">
                    <p>
                      <strong>Important:</strong> Please ensure your account address and phone number are correct. 
                      Your registration may not be approved if the phone number doesn't match records.
                    </p>
                  </div>
                  <div className="form-actions">
                    <button
                      disabled={
                        this.state.voterPhone.length !== 10 ||
                        this.state.currentVoter.isVerified
                      }
                      onClick={this.registerAsVoter}
                    >
                      {this.state.currentVoter.isRegistered
                        ? "Update Registration"
                        : "Register to Vote"}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Current Voter Information */}
            <div className="container-main">
              {loadCurrentVoter(
                this.state.currentVoter,
                this.state.currentVoter.isRegistered
              )}
            </div>

            {/* Admin Section: All Voters */}
            {this.state.isAdmin ? (
              <div className="container-main">
                <h3 className="title">All Voters</h3>
                <div className="info" style={{marginBottom: "1rem"}}>
                  <p>Total registered voters: {this.state.voters.length}</p>
                </div>
                {loadAllVoters(this.state.voters)}
              </div>
            ) : null}
          </>
        )}
      </>
    );
  }
}

export function loadCurrentVoter(voter, isRegistered) {
  const statusClass = isRegistered ? "success" : "attention";
  
  return (
    <>
      <h3 className="title">Your Registration Status</h3>
      <div className={`container-item ${statusClass}`}>
        <table>
          <tbody>
            <tr>
              <th>Account Address</th>
              <td><code>{voter.address}</code></td>
            </tr>
            <tr>
              <th>Name</th>
              <td>{voter.name || "Not registered"}</td>
            </tr>
            <tr>
              <th>Phone</th>
              <td>{voter.phone || "Not registered"}</td>
            </tr>
            <tr>
              <th>Status</th>
              <td>
                {voter.isVerified ? (
                  <span className="status-badge active">
                    <span className="status-dot active"></span>Verified
                  </span>
                ) : voter.isRegistered ? (
                  <span className="status-badge pending">
                    <span className="status-dot pending"></span>Pending Verification
                  </span>
                ) : (
                  <span className="status-badge ended">
                    <span className="status-dot ended"></span>Not Registered
                  </span>
                )}
              </td>
            </tr>
            <tr>
              <th>Voting Status</th>
              <td>{voter.hasVoted ? "Vote Cast" : "Not Voted"}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

export function loadAllVoters(voters) {
  if (voters.length === 0) {
    return (
      <div className="container-item attention">
        <p>No voters have registered yet.</p>
      </div>
    );
  }
  
  return (
    <div className="card-grid">
      {voters.map((voter, index) => (
        <div key={index} className="container-item">
          <h4>{voter.name || "Unnamed Voter"}</h4>
          <div style={{fontSize: "0.9rem", marginBottom: "0.5rem"}}>
            <code style={{fontSize: "0.8rem"}}>{voter.address.substring(0,10)}...{voter.address.substring(32)}</code>
          </div>
          <table>
            <tbody>
              <tr>
                <th>Phone</th>
                <td>{voter.phone}</td>
              </tr>
              <tr>
                <th>Status</th>
                <td>
                  {voter.isVerified ? (
                    <span className="status-badge active">Verified</span>
                  ) : voter.isRegistered ? (
                    <span className="status-badge pending">Pending</span>
                  ) : (
                    <span className="status-badge ended">Unregistered</span>
                  )}
                </td>
              </tr>
              <tr>
                <th>Vote</th>
                <td>{voter.hasVoted ? "Cast" : "Not Cast"}</td>
              </tr>
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
