import React, { Component } from "react";
import { Link } from "react-router-dom";
import Navbar from "../Navbar/Navigation";
import NavbarAdmin from "../Navbar/NavigationAdmin";
import NotInit from "../NotInit";
import getWeb3 from "../../getWeb3";
import Election from "../../contracts/Election.json";
import "./Voting.css";

export default class Voting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ElectionInstance: undefined,
      account: null,
      web3: null,
      isAdmin: false,
      candidateCount: undefined,
      candidates: [],
      isElStarted: false,
      isElEnded: false,
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

      const candidateCount = await this.state.ElectionInstance.methods
        .getTotalCandidate()
        .call();
      this.setState({ candidateCount: candidateCount });

      const start = await this.state.ElectionInstance.methods.getStart().call();
      this.setState({ isElStarted: start });
      const end = await this.state.ElectionInstance.methods.getEnd().call();
      this.setState({ isElEnded: end });
      for (let i = 1; i <= this.state.candidateCount; i++) {
        const candidate = await this.state.ElectionInstance.methods
          .candidateDetails(i - 1)
          .call();
        this.state.candidates.push({
          id: candidate.candidateId,
          header: candidate.header,
          slogan: candidate.slogan,
        });
      }
      this.setState({ candidates: this.state.candidates });

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

      const admin = await this.state.ElectionInstance.methods.getAdmin().call();
      if (this.state.account === admin) {
        this.setState({ isAdmin: true });
      }
    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  renderCandidates = (candidate) => {
    const castVote = async (id) => {
      await this.state.ElectionInstance.methods
        .vote(id)
        .send({ from: this.state.account, gas: 1000000 });
      window.location.reload();
    };
    const confirmVote = (id, header) => {
      var r = window.confirm(
        "Vote for " + header + " with Id " + id + ".\nAre you sure?"
      );
      if (r === true) {
        castVote(id);
      }
    };
    return (
      <div className="candidate-card">
        <div className="candidate-card__content">
          <h3 className="candidate-card__name">
            {candidate.header}
            <span className="candidate-id">#{candidate.id}</span>
          </h3>
          <p className="candidate-card__party">{candidate.slogan}</p>
          <button
            onClick={() => confirmVote(candidate.id, candidate.header)}
            className="vote-button"
            disabled={
              !this.state.currentVoter.isRegistered ||
              !this.state.currentVoter.isVerified ||
              this.state.currentVoter.hasVoted
            }
          >
            {this.state.currentVoter.hasVoted ? "Voted" : "Vote"}
          </button>
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

    return (
      <>
        {this.state.isAdmin ? <NavbarAdmin /> : <Navbar />}
        <div>
          {!this.state.isElStarted && !this.state.isElEnded ? (
            <NotInit />
          ) : this.state.isElStarted && !this.state.isElEnded ? (
            <>
              <div className="container-main">
                <div className="welcome-box">
                  <h1>Secure Voting</h1>
                  <p className="welcome-subtitle">
                    Cast your secure vote using blockchain technology
                  </p>
                </div>

                {/* Voter Status Messages */}
                {this.state.currentVoter.isRegistered ? (
                  this.state.currentVoter.isVerified ? (
                    this.state.currentVoter.hasVoted ? (
                      <div className="container-item success">
                        <h3>Thank you for voting!</h3>
                        <p>Your vote has been recorded on the blockchain.</p>
                        <div className="form-actions">
                          <Link to="/Results">
                            <button>View Results</button>
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <div className="container-item info">
                        <h3>Ready to Vote</h3>
                        <p>Please select a candidate from the options below to cast your vote.</p>
                      </div>
                    )
                  ) : (
                    <div className="container-item attention">
                      <h3>Verification Pending</h3>
                      <p>Your registration is awaiting verification from the administrator.</p>
                      <p>You'll be able to vote once your identity is verified.</p>
                    </div>
                  )
                ) : (
                  <div className="container-item alert">
                    <h3>Registration Required</h3>
                    <p>You need to register before you can vote in this election.</p>
                    <div className="form-actions">
                      <Link to="/Registration">
                        <button>Register Now</button>
                      </Link>
                    </div>
                  </div>
                )}

                {/* Candidates Section */}
                <div className="container-main">
                  <h2 className="title">Candidates</h2>
                  <div className="info" style={{marginBottom: "1rem", textAlign: "center"}}>
                    <p>Total candidates: {this.state.candidates.length}</p>
                  </div>
                  
                  {this.state.candidates.length < 1 ? (
                    <div className="container-item attention">
                      <p>No candidates are available to vote for at this time.</p>
                    </div>
                  ) : (
                    <div className="card-grid">
                      {this.state.candidates.map(this.renderCandidates)}
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : !this.state.isElStarted && this.state.isElEnded ? (
            <>
              <div className="container-main">
                <div className="container-item attention">
                  <h3>Election Ended</h3>
                  <p>The voting period for this election has ended. Thank you for your participation.</p>
                  <div className="form-actions">
                    <Link to="/Results">
                      <button>See Results</button>
                    </Link>
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </>
    );
  }
}
