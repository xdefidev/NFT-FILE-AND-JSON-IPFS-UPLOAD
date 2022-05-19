import Web3 from "web3";
import React, { useEffect, useState } from "react";
import abi from "/src/";

export default function loadwallet() {
  let content;
  const [account, setAccount] = useState("");

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
    // Load GargToken
    const tokenData = "56";
    if (tokenData) {
      const tokenContract = await new web3.eth.Contract(abi, tokenData.address);
      const tokenBalance = await tokenContract.methods
        .balanceOf(accounts[0])
        .call();
      setTokenBalance(tokenBalance.toString());
    } else {
      window.alert("GargToken Network not detected");
    }
    // Load GargTokenSale
    const tokenSaleData = TokenSale.networks[networkId];
    if (tokenSaleData) {
      const tokenSaleContract = new web3.eth.Contract(
        TokenSale.abi,
        tokenSaleData.address
      );
      setTokenSale(tokenSaleContract);
      let tokenPrice = await tokenSaleContract.methods.tokenPrice().call();
      tokenPrice = await web3.utils.fromWei(tokenPrice.toString(), "ether");
      setTokenPrice(tokenPrice.toString());
      const _tokensSold = await tokenSaleContract.methods.tokensSold().call();
      setTokenSold(_tokensSold.toString());
    } else {
      window.alert("GargTokenSale Network not detected");
    }
    setLoading(false);
  };
}
