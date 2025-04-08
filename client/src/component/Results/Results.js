import React, { Component } from "react";
import { Link } from "react-router-dom";
import Navbar from "../Navbar/Navigation";
import NavbarAdmin from "../Navbar/NavigationAdmin";
import NotInit from "../NotInit";
import getWeb3 from "../../getWeb3";
import Election from "../../contracts/Election.json";
import "./Results.css";

export default class Result extends Component {
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

      // Get start and end values
      const start = await this.state.ElectionInstance.methods.getStart().call();
      this.setState({ isElStarted: start });
      const end = await this.state.ElectionInstance.methods.getEnd().call();
      this.setState({ isElEnded: end });

      // Loadin Candidates detials
      for (let i = 1; i <= this.state.candidateCount; i++) {
        const candidate = await this.state.ElectionInstance.methods
          .candidateDetails(i - 1)
          .call();
        this.state.candidates.push({
          id: candidate.candidateId,
          header: candidate.header,
          slogan: candidate.slogan,
          voteCount: candidate.voteCount,
        });
      }

      this.setState({ candidates: this.state.candidates });
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
            <div className="container-main">
              <div className="welcome-box">
                <h1>Election In Progress</h1>
                <p className="welcome-subtitle">
                  Results will be available once the election has concluded
                </p>
              </div>
              <div className="container-item info">
                <h3>Election Status: Active</h3>
                <p>The voting process is currently ongoing. Results will be displayed after the election ends.</p>
                <div className="form-actions">
                  <Link to="/Voting">
                    <button>Go to Voting</button>
                  </Link>
                </div>
              </div>
            </div>
          ) : !this.state.isElStarted && this.state.isElEnded ? (
            displayResults(this.state.candidates)
          ) : null}
        </div>
      </>
    );
  }
}

function displayWinner(candidates) {
  const getWinner = (candidates) => {
    let maxVoteRecived = 0;
    let winnerCandidate = [];
    for (let i = 0; i < candidates.length; i++) {
      if (candidates[i].voteCount > maxVoteRecived) {
        maxVoteRecived = candidates[i].voteCount;
        winnerCandidate = [candidates[i]];
      } else if (candidates[i].voteCount === maxVoteRecived) {
        winnerCandidate.push(candidates[i]);
      }
    }
    return winnerCandidate;
  };
  
  const renderWinner = (winner) => {
    return (
      <div className="winner-card">
        <div className="winner-badge">Winner</div>
        <h2 className="winner-name">{winner.header}</h2>
        <p className="winner-slogan">{winner.slogan}</p>
        <div className="winner-votes">
          <span className="vote-count">{winner.voteCount}</span>
          <span className="vote-label">votes</span>
        </div>
      </div>
    );
  };
  
  const winnerCandidate = getWinner(candidates);
  return (
    <div className="winners-section">
      <h2 className="title">Election Winner</h2>
      <div className={winnerCandidate.length > 1 ? "winners-grid" : "winner-single"}>
        {winnerCandidate.map(renderWinner)}
      </div>
    </div>
  );
}

export function displayResults(candidates) {
  const renderResults = (candidate) => {
    return (
      <tr key={candidate.id}>
        <td>{candidate.id}</td>
        <td>{candidate.header}</td>
        <td>
          <div className="vote-bar-container">
            <div 
              className="vote-bar" 
              style={{ 
                width: `${calculatePercentage(candidate.voteCount, getTotalVotes(candidates))}%`
              }}
            ></div>
            <span className="vote-number">{candidate.voteCount}</span>
          </div>
        </td>
      </tr>
    );
  };

  const getTotalVotes = (candidates) => {
    return candidates.reduce((acc, candidate) => acc + parseInt(candidate.voteCount), 0);
  };

  const calculatePercentage = (votes, totalVotes) => {
    if (totalVotes === 0) return 0;
    return (votes / totalVotes) * 100;
  };

  const totalVotes = getTotalVotes(candidates);

  return (
    <>
      <div className="container-main">
        <div className="welcome-box">
          <h1>Election Results</h1>
          <p className="welcome-subtitle">
            The final results of the secure blockchain voting
          </p>
        </div>

        {candidates.length > 0 ? (
          displayWinner(candidates)
        ) : null}

        <div className="container-item">
          <h2 className="title">Vote Distribution</h2>
          <div className="info" style={{marginBottom: "1rem"}}>
            <p>Total votes: {totalVotes} | Candidates: {candidates.length}</p>
          </div>

          {candidates.length < 1 ? (
            <div className="container-item attention">
              <p>No candidates participated in this election.</p>
            </div>
          ) : (
            <div className="results-table">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Candidate</th>
                    <th>Vote Count</th>
                  </tr>
                </thead>
                <tbody>
                  {candidates.map(renderResults)}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
