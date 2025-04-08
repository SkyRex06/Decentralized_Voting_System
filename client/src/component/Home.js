import React, { Component } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import Navbar from "./Navbar/Navigation";
import NavbarAdmin from "./Navbar/NavigationAdmin";
import UserHome from "./UserHome";
import StartEnd from "./StartEnd";
import ElectionStatus from "./ElectionStatus";
import getWeb3 from "../getWeb3";
import Election from "../contracts/Election.json";
import "./Home.css";

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ElectionInstance: undefined,
      account: null,
      web3: null,
      isAdmin: false,
      elStarted: false,
      elEnded: false,
      elDetails: {},
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

      const electionDetails = await this.state.ElectionInstance.methods
      .getElectionDetails()
      .call();
      
      this.setState({
        elDetails: {
          adminName: electionDetails.adminName,
          adminEmail: electionDetails.adminEmail,
          adminTitle: electionDetails.adminTitle,
          electionTitle: electionDetails.electionTitle,
          organizationTitle: electionDetails.organizationTitle,
        },
      });
    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  endElection = async () => {
    await this.state.ElectionInstance.methods
      .endElection()
      .send({ from: this.state.account, gas: 1000000 });
    window.location.reload();
  };

  registerElection = async (data) => {
    await this.state.ElectionInstance.methods
      .setElectionDetails(
        data.adminFName.toLowerCase() + " " + data.adminLName.toLowerCase(),
        data.adminEmail.toLowerCase(),
        data.adminTitle.toLowerCase(),
        data.electionTitle.toLowerCase(),
        data.organizationTitle.toLowerCase()
      )
      .send({ from: this.state.account, gas: 1000000 });
    window.location.reload();
  };

  render() {
    if (!this.state.web3) {
      return (
        <>
          <Navbar />
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
        <div className="container-main">
          <div className="account-box">
            <div className="account-label">Your Account:</div>
            <div className="account-address">{this.state.account}</div>
          </div>
          
          {!this.state.elStarted & !this.state.elEnded ? (
            <div className="container-item info">
              <center>
                <h3>The election has not been initialized</h3>
                {this.state.isAdmin ? (
                  <p>Complete the form below to set up the election.</p>
                ) : (
                  <p>Please wait for the administrator to initialize the election.</p>
                )}
              </center>
            </div>
          ) : null}
        </div>
        {this.state.isAdmin ? (
          <>
            <this.renderAdminHome />
          </>
        ) : this.state.elStarted ? (
          <>
            <UserHome el={this.state.elDetails} />
          </>
        ) : !this.state.elStarted && this.state.elEnded ? (
          <>
            <div className="container-main">
              <div className="container-item attention">
                <center>
                  <h3>The Election has ended.</h3>
                  <p>Thank you for participating in secure blockchain voting.</p>
                  <Link
                    to="/Results"
                    style={{ color: "#3182ce", textDecoration: "none", fontWeight: "500" }}
                  >
                    <button>See Results</button>
                  </Link>
                </center>
              </div>
            </div>
          </>
        ) : null}
      </>
    );
  }

  renderAdminHome = () => {
    const EMsg = (props) => {
      return <span style={{ color: "#e53e3e", fontSize: "0.8rem", marginLeft: "0.5rem" }}>{props.msg}</span>;
    };

    const AdminHome = () => {
      const {
        handleSubmit,
        register,
        formState: { errors },
      } = useForm();

      const onSubmit = (data) => {
        this.registerElection(data);
      };

      return (
        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            {!this.state.elStarted & !this.state.elEnded ? (
              <div className="container-main">
                <div className="welcome-box">
                  <h1>Set Up Election</h1>
                  <p className="welcome-subtitle">
                    Configure your secure blockchain voting event with the details below.
                  </p>
                </div>
                
                <div className="admin-form-container">
                  {/* about-admin */}
                  <div className="about-admin">
                    <h3>Administrator Information</h3>
                    <div className="container-item">
                      <div>
                        <label className="label-home">
                          Full Name {errors.adminFName && <EMsg msg="*required" />}
                        </label>
                        <div style={{ display: "flex", gap: "1rem" }}>
                          <input
                            className="input-home"
                            type="text"
                            placeholder="First Name"
                            {...register("adminFName", {
                              required: true,
                            })}
                          />
                          <input
                            className="input-home"
                            type="text"
                            placeholder="Last Name"
                            {...register("adminLName")}
                          />
                        </div>

                        <label className="label-home">
                          Email {errors.adminEmail && <EMsg msg={errors.adminEmail.message} />}
                          <input
                            className="input-home"
                            placeholder="administrator@votsecure.com"
                            name="adminEmail"
                            {...register("adminEmail", {
                              required: "*Required",
                              pattern: {
                                value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                                message: "*Invalid email format",
                              },
                            })}
                          />
                        </label>

                        <label className="label-home">
                          Position {errors.adminTitle && <EMsg msg="*required" />}
                          <input
                            className="input-home"
                            type="text"
                            placeholder="e.g. Election Commissioner"
                            {...register("adminTitle", {
                              required: true,
                            })}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  {/* about-election */}
                  <div className="about-election">
                    <h3>Election Details</h3>
                    <div className="container-item">
                      <div>
                        <label className="label-home">
                          Election Title {errors.electionTitle && <EMsg msg="*required" />}
                          <input
                            className="input-home"
                            type="text"
                            placeholder="e.g. Student Council Election"
                            {...register("electionTitle", {
                              required: true,
                            })}
                          />
                        </label>
                        <label className="label-home">
                          Organization Name {errors.organizationName && <EMsg msg="*required" />}
                          <input
                            className="input-home"
                            type="text"
                            placeholder="e.g. Central University"
                            {...register("organizationTitle", {
                              required: true,
                            })}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div style={{ marginTop: "2rem", textAlign: "center" }}>
                  <button type="submit">Save Election Details</button>
                </div>
              </div>
            ) : this.state.elStarted ? (
              <UserHome el={this.state.elDetails} />
            ) : null}
            <StartEnd
              elStarted={this.state.elStarted}
              elEnded={this.state.elEnded}
              endElFn={this.endElection}
            />
            <ElectionStatus
              elStarted={this.state.elStarted}
              elEnded={this.state.elEnded}
            />
          </form>
        </div>
      );
    };
    return <AdminHome />;
  };
}
