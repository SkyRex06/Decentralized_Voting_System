# Voting System 🗳️

A blockchain-based decentralized voting system built using **React, Solidity, and Web3.js** to ensure secure and transparent elections.

---

## 🔗 Features
✅ **Secure Voting:** Uses blockchain to prevent tampering.  
✅ **Decentralized:** No central authority controls the votes.  
✅ **Real-time Verification:** Admin can verify registered voters.  
✅ **Transparent Results:** Anyone can verify the election outcome.  
✅ **User-Friendly Interface:** Simple UI for voters and admins.  

---

## 💁️ Project Structure
```
Voting_System/
│── public/                 # Static assets
│── src/                    # Main source code
│   ├── components/         # Reusable UI components
│   ├── contracts/          # Solidity smart contracts
│   ├── pages/              # Main pages (Registration, Voting, Verification)
│   ├── utils/              # Helper functions & Web3 setup
│── .gitignore
│── package.json
│── README.md
│── truffle-config.js       # Truffle configuration for deploying smart contracts
```

---

## 🛠️ Tech Stack
- **Frontend:** React, CSS  
- **Backend:** Solidity (Ethereum Smart Contracts)  
- **Blockchain Integration:** Web3.js  
- **Development Framework:** Truffle  

---

## 🚀 Installation & Setup

### **1️⃣ Clone the Repository**
```bash
git clone https://github.com/yourusername/Voting_System.git
cd Voting_System
```

### **2️⃣ Install Dependencies**
```bash
npm install
```

### **3️⃣ Start Local Blockchain (Ganache)**
- Download & install [Ganache](https://www.trufflesuite.com/ganache).  
- Open Ganache and start a new workspace.  

### **4️⃣ Compile & Deploy Smart Contracts**
```bash
truffle compile
truffle migrate --network development
```

### **5️⃣ Start the React Application**
```bash
npm start

```


## 📉 Smart Contract Functions
| Function  | Description  |
|-----------|-------------|
| `registerVoter(address, name, phone)`  | Registers a new voter  |
| `getTotalVoter()`  | Returns the total number of voters  |
| `verifyVoter(address)`  | Admin verifies a voter  |
| `vote(candidateId)`  | Voter casts their vote  |
| `getResults()`  | Fetches election results  |

---

## 📌 Future Improvements
🔹 Add **biometric authentication** for voter verification.  
🔹 Improve **UI/UX** with animations and better accessibility.  
🔹 Deploy on **Ethereum Mainnet** instead of local blockchain.  

---

## 🐝 License
This project is **open-source** under the MIT License.  


