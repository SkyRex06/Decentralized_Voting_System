import React, { Component } from "react";
import Navbar from "../../Navbar/Navigation";
import NavbarAdmin from "../../Navbar/NavigationAdmin";
import AdminOnly from "../../AdminOnly";
import getWeb3 from "../../../getWeb3";
import Election from "../../../contracts/Election.json";
import "./StartEnd.css";

export default class StartEnd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ElectionInstance: undefined,
      web3: null,
      accounts: null,
      isAdmin: false,
      elStarted: false,
      elEnded: false,
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
      this.setState({ elStarted: start });
      const end = await this.state.ElectionInstance.methods.getEnd().call();
      this.setState({ elEnded: end });
    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  startElection = async () => {
    await this.state.ElectionInstance.methods
      .startElection()
      .send({ from: this.state.account, gas: 1000000 });
    window.location.reload();
  };
  endElection = async () => {
    await this.state.ElectionInstance.methods
      .endElection()
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
          <AdminOnly page="Election Control Panel" />
        </>
      );
    }
    
    return (
      <>
        <NavbarAdmin />
        <div className="container-main">
          <div className="welcome-box">
            <h1>Election Control Panel</h1>
            <p className="welcome-subtitle">
              Manage the entire election lifecycle
            </p>
          </div>
          
          <div className="election-status-panel">
            <div className="status-section">
              <h2>Current Status</h2>
              <div className="status-indicators">
                <div className="status-indicator">
                  <span className={`status-dot ${this.state.elStarted ? 'active' : 'inactive'}`}></span>
                  <span className="status-text">Election Started</span>
                </div>
                <div className="status-indicator">
                  <span className={`status-dot ${this.state.elEnded ? 'active' : 'inactive'}`}></span>
                  <span className="status-text">Election Ended</span>
                </div>
              </div>
            </div>
            
            <div className="action-section">
              {!this.state.elStarted ? (
                <div className="container-item">
                  <h3>Election Not Started</h3>
                  <p>Start the election to allow voters to cast their votes.</p>
                  <div className="form-actions">
                    <button 
                      onClick={this.startElection} 
                      className="start-button"
                    >
                      {this.state.elEnded ? "Restart Election" : "Start Election"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="container-item">
                  <h3>Election In Progress</h3>
                  <p>The election is currently active and voters can cast their votes.</p>
                  <div className="form-actions">
                    <button 
                      onClick={this.endElection} 
                      className="end-button"
                    >
                      End Election
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="info-cards">
            <div className="info-card">
              <h3>Before Starting</h3>
              <p>Make sure you have added all candidates and verified registered voters before starting the election.</p>
            </div>
            
            <div className="info-card">
              <h3>After Ending</h3>
              <p>Once an election is ended, the results will be available, but no more votes can be cast.</p>
            </div>
          </div>
        </div>
      </>
    );
  }
}
