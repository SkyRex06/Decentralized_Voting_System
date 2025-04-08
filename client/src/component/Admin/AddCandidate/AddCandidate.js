import React, { Component } from "react";

import Navbar from "../../Navbar/Navigation";
import NavbarAdmin from "../../Navbar/NavigationAdmin";

import getWeb3 from "../../../getWeb3";
import Election from "../../../contracts/Election.json";

import AdminOnly from "../../AdminOnly";

import "./AddCandidate.css";

export default class AddCandidate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ElectionInstance: undefined,
      web3: null,
      accounts: null,
      isAdmin: false,
      header: "",
      slogan: "",
      candidates: [],
      candidateCount: undefined,
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
      const candidateCount = await this.state.ElectionInstance.methods
        .getTotalCandidate()
        .call();
      this.setState({ candidateCount: candidateCount });

      const admin = await this.state.ElectionInstance.methods.getAdmin().call();
      if (this.state.account === admin) {
        this.setState({ isAdmin: true });
      }

      for (let i = 0; i < this.state.candidateCount; i++) {
        const candidate = await this.state.ElectionInstance.methods
          .candidateDetails(i)
          .call();
        this.state.candidates.push({
          id: candidate.candidateId,
          header: candidate.header,
          slogan: candidate.slogan,
        });
      }

      this.setState({ candidates: this.state.candidates });
    } catch (error) {
      console.error(error);
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
    }
  };
  updateHeader = (event) => {
    this.setState({ header: event.target.value });
  };
  updateSlogan = (event) => {
    this.setState({ slogan: event.target.value });
  };

  addCandidate = async () => {
    await this.state.ElectionInstance.methods
      .addCandidate(this.state.header, this.state.slogan)
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
    
    if (!this.state.isAdmin) {
      return (
        <>
          <Navbar />
          <AdminOnly page="Add Candidate Page." />
        </>
      );
    }
    
    return (
      <>
        <NavbarAdmin />
        <div className="container-main">
          <div className="welcome-box">
            <h1>Candidate Management</h1>
            <p className="welcome-subtitle">
              Add new candidates to the election ballot
            </p>
          </div>
          
          <div className="container-item">
            <h2 className="title">Add New Candidate</h2>
            <div className="info" style={{marginBottom: "1.5rem"}}>
              <p>Current candidates: {this.state.candidateCount}</p>
            </div>
            
            <form className="candidate-form">
              <div className="form-group">
                <label>
                  Candidate Name
                  <input
                    type="text"
                    placeholder="Enter candidate name"
                    value={this.state.header}
                    onChange={this.updateHeader}
                  />
                </label>
                {this.state.header.length > 0 && this.state.header.length < 3 && (
                  <small className="input-error">Name is too short</small>
                )}
                {this.state.header.length > 21 && (
                  <small className="input-error">Name is too long (max 21 characters)</small>
                )}
              </div>
              
              <div className="form-group">
                <label>
                  Campaign Slogan
                  <input
                    type="text"
                    placeholder="Enter campaign slogan"
                    value={this.state.slogan}
                    onChange={this.updateSlogan}
                  />
                </label>
              </div>
              
              <div className="form-actions">
                <button
                  disabled={
                    this.state.header.length < 3 || this.state.header.length > 21
                  }
                  onClick={this.addCandidate}
                >
                  Add Candidate
                </button>
              </div>
            </form>
          </div>
        </div>
        
        {this.renderCandidatesList()}
      </>
    );
  }

  renderCandidatesList = () => {
    if (this.state.candidates.length === 0) {
      return (
        <div className="container-main">
          <div className="container-item attention">
            <h3>No Candidates Yet</h3>
            <p>Add candidates using the form above to get started.</p>
          </div>
        </div>
      );
    }
    
    return (
      <div className="container-main">
        <h2 className="title">Current Candidates</h2>
        <div className="card-grid">
          {this.state.candidates.map((candidate) => (
            <div key={candidate.id} className="candidate-card">
              <div className="candidate-card__content">
                <h3 className="candidate-card__name">
                  {candidate.header}
                  <span className="candidate-id">#{candidate.id}</span>
                </h3>
                <p className="candidate-card__party">{candidate.slogan}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
