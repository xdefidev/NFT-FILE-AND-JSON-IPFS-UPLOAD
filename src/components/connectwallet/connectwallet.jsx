import React, { useState, useEffect } from "react";
import "./connectwallet.css";
import Web3 from "web3";
import abi from "./abi";
const tokenaddress = "0xe16beA631e4a7C94D0893EA68D686d9DCD56a400";

export default function Body(props) {
  const URI = props.URI;
  const [address, setAddress] = useState(
    "0xa8Fc8be78bb8eC23ac9d9b72e113785c3D182E31"
  );
  const [bunnyId, setBunnyId] = useState("1");
  const [account, setAccount] = useState("Connect Wallet");
  const [tokenContract, setTokenContract] = useState({});

  const handleSubmit = async (event) => {
    event.preventDefault();
    await mint(address, URI, bunnyId);
  };

  const handleChange = (event) => {
    setAddress(event.target.value);
  };

  const handlebunnyChange = (event) => {
    setBunnyId(event.target.value);
  };

  const handleURIChange = (event) => {
    event.preventDefault();
  };

  const connect = async (event) => {
    event.preventDefault();
    await loadWeb3();
    if (window.web3) await loadBlockchainData();
  };

  useEffect(() => {
    loadWeb3();
    if (window.web3) loadBlockchainData();
  }, []);

  async function loadWeb3() {
    // Modern dapp browsers...
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      try {
        await window.ethereum.enable();
      } catch (error) {
        console.log("Error:", error);
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    }
    // Non-dapp browsers...
    else {
      window.alert(
        "ATTENTION! Application will not load. Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  }

  const loadBlockchainData = async () => {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    setAccount(accounts[0]);
    const networkId = await web3.eth.net.getId();
    console.log(networkId);
    // Load
    const tokenData = "56";
    if (tokenData) {
      const tokenContract = await new web3.eth.Contract(abi, tokenaddress);
      setTokenContract(tokenContract);
    } else {
      window.alert("Network not detected, switch to the BSC MAINNET");
    }

    if (tokenData == networkId) {
      console.log("connected to bnb");
    } else {
      console.log("you are on the wrong network, switch to bnb mainnet");
      window.alert("Switch your wallet Network to BNB mainnet");
    }
  };

  const mint = async (address, URI, bunnyId) => {
    await tokenContract.methods
      .mint(address, URI, bunnyId)
      .send({
        from: account
      })
      .on("transactionHash", (hash) => {});
  };

  return (
    <>
      <div>
        <button onClick={connect}>Connect Wallet</button>
      </div>
      <div>
        <p>{account}</p>
      </div>
      <div>
        <form onSubmit={handleSubmit}>
          <input
            className="address"
            placeholder="Mint to Address"
            value={address}
            onChange={handleChange}
          ></input>
          <input
            className="tokenURI"
            placeholder="tokenURI"
            value={URI}
            onChange={handleURIChange}
          ></input>
          <input
            className="bunnyId"
            placeholder="bunnyId"
            type="number"
            value={props.bunnyId}
            onChange={handlebunnyChange}
          ></input>
          <button type="submit">MINT</button>
        </form>
      </div>
    </>
  );
}
