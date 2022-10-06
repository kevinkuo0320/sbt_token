import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { ethers } from "ethers";
///import "./form.css";
import ConnectWallet from "./ConnectWallet";

import ABI from "./abi.json";

const contractAddress = "0x5d7bb48482271b6d1a2c629f2a2bccb8fd7dc509";

function Form(props) {
  const [value, setValue] = useState(1);
  const [currentAccount, setCurrentAccount] = useState("");
  const [totalMinted, setTotalMinted] = useState(0);
  const [minting, setMinting] = useState(false);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [ownerBalance, setOwnerBalance] = useState(0);
  const [sellOpen, setSellOpen] = useState(false);
  
  const [addressCheck, setAddressCheck] = useState(""); 
  const [id, setId] = useState(0); 
  const [SBTBalance, setSBTBalance] = useState(0); 
  const [addressTo,setAddressTo] =useState("");

  useEffect(() => {
    checkIfWalletIsConnected();
    if (window.ethereum) {
      getCount();
      getOwnerBalance();
      window.ethereum.on("accountsChanged", checkIfWalletIsConnected);
      window.ethereum.on("disconnect", checkIfWalletIsConnected);
    }
  }, []);

  const connectWallet = async () => {
    const { ethereum } = window;
    const networkId = await ethereum.request({
      method: "net_version",
    });
    if (networkId === 5) {
      toast("Make sure you are in polygon network!");
      return;
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    await signer.getAddress();
  };

  //check connected
  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;
    console.log(currentAccount, "account");

    if (!ethereum) {
      toast("Make sure you have metamask!");
      return;
    }

    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      setIsOpen(false);
      const account = accounts[0];
      setCurrentAccount(account);
    } else {
      setCurrentAccount("");
      toast("No authorized account found");
    }
  };

  //view lock 
  const viewLock = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(contractAddress, ABI, provider);
    const count = await contract.viewLockStatus(0);
    console.log(count);
    setTotalMinted(count);
  };

  //view balance of SBT Token
  const viewBalance = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(contractAddress, ABI, provider);
    const count = await contract.balanceOf(addressCheck, id);
    console.log(count);
    setSBTBalance(count);
  };

    //transfer SBT Token
    const transfer = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, ABI, signer);
      const ownerAddrerss = signer.getAddress();
      await contract.safeTransferFrom(ownerAddrerss ,addressTo, id, 1,"");
      //console.log(count);
      //setSBTBalance(count);
    };

  //lock token 
  const lockToken = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const connectedContract = new ethers.Contract(contractAddress, ABI, signer);
    await connectedContract.unlock(id);
  };

   //unlock token 
   const unlockToken = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const connectedContract = new ethers.Contract(contractAddress, ABI, signer);
    await connectedContract.lock(id);
  };

  

  //get supply
  const getCount = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(contractAddress, ABI, provider);
    const count = await contract.totalSupply();
    const convert = count.toNumber();
    console.log(convert);
    //setTotalMinted(convert);
  };

  //get balance
  const getOwnerBalance = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(contractAddress, ABI, provider);
    const ownerBalance = await contract.balanceOf(
      "0xEaE204Fe72C0F4394C4590283DCC0a3E89A69388"
    );
    const convertBalance = ownerBalance.toNumber();
    console.log(convertBalance);
    setOwnerBalance(convertBalance);
  };

  //mint NFT
  const mintToken = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const connectedContract = new ethers.Contract(contractAddress, ABI, signer);
    const cost = await connectedContract.ticketPrice();
    try {
      const result = await connectedContract.safeMint(currentAccount, {
        value: cost.mul(value),
      });
      setMinting(true);
      await result.wait();
      setMinting(false);
      toast.success("Mint Successful.", { position: "bottom-right" });
      getCount();
    } catch (err) {
      console.log(err);
      toast.error("Mint unsuccessful", { position: "bottom-right" });
    }
  };

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <div>
      <label className="heading">SBT Token Page</label>

      <ConnectWallet
        modalIsOpen={modalIsOpen}
        closeModal={closeModal}
        connectWallet={connectWallet}
      />
      <div
        className="info"
        style={{
          marginBottom: "20px",
        }}
      >
        <p className="sub-text">
          check SBT token of the input address
          <p>
            <input placeholder="input address" 
            //value = {value}
            onChange={e => setAddressCheck(e.target.value)}
            style={{
          width: "200px",
        }}/> 
          </p>
          <p>
            <input placeholder="id" 
            //value = {value}
            onChange={e => setId(e.target.value)}
            style={{
          width: "200px",
        }}/> <button onClick={viewBalance}>submit</button>
          </p>
          {SBTBalance > 0 ? <p>the address owns the token</p> : <p>the address doesnt own the token</p>}  
        </p>

        <p className="sub-text">
          transfer SBT token
          <p>
            <input placeholder="transfer to" 
            onChange={e => setAddressTo(e.target.value)}
            style={{
          width: "200px",
        }}/> 
          </p>
          <p>
            <input placeholder="id" 
            onChange={e => setId(e.target.value)}
            style={{
          width: "200px",
        }}/> <button>submit</button>
          </p>
        </p>

        <p className="sub-text">
          Locked/Unlocked
          <p>
            <input placeholder="lock id" onChange={e => setId(e.target.value)}/> <button onClick={lockToken}>lock</button>  <button onClick={unlockToken}>unlock</button>
          </p>
          <p>
            <input placeholder="view lock status"/> <button type="submit" onClick={viewLock}>view lock status</button>
            <p> {totalMinted == false ? <p>false</p> : <p>true</p>} </p>
          </p>
        </p>

        {/* <p className="sub-text">
          您已購買 <span className="focus">{ownerBalance} 張</span>
        </p>*/}
      </div>
      {/* <p className="sub-text">請選擇購票數量</p> */}

      {/* <input className="email" type="text" placeholder="請輸入數量" />*/}
      {/* <div
        className="counter"
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItem: "center",
          fontSize: "30px",
        }}
      >
        <div className="row">
          <span
            onClick={() => handleCountDecre()}
            className="c-btn btn-1"
            style={{
              marginRight: "20px",
              cursor: "pointer",
              borderRadius: "8px",
              background: "#ffe169",
              height: "50px",
              width: "50px",
            }}
          >
            <p
              style={{
                textAlign: "center",
              }}
            >
              -
            </p>
          </span>
          <div className="count">{value}</div>
          <span
            onClick={() => handleCountIncre()}
            className="c-btn btn-2"
            style={{
              marginLeft: "20px",
              cursor: "pointer",
              borderRadius: "8px",
              background: "#ffe169",
              height: "50px",
              width: "50px",
            }}
          >
            <p
              style={{
                textAlign: "center",
              }}
            >
              +
            </p>
          </span>
        </div>
      </div> */}

      {/*  <input id="agree" type="checkbox" />
      <label className="check" htmlFor="agree">
        我已閱讀相關條例
      </label>*/}

      {sellOpen ? (
        <button className="submit" type="submit">
          尚未開放購買
        </button>
      ) : currentAccount ? (
        <button className="submit" type="submit" onClick={mintToken}>
          
        </button>
      ) : (
        <button
          className="submit"
          onClick={openModal}
          disabled={currentAccount}
        >
          <div>{currentAccount ? "Connected" : "Connect to metamask wallet"}</div>
        </button>
      )}

      {/*  {currentAccount ? (
        <button className="submit" type="submit" onClick={mintToken}>
          購買
        </button>
      ) : (
        <button
          className="submit"
          onClick={openModal}
          disabled={currentAccount}
        >
          <div>{currentAccount ? "Connected" : "連接錢包"}</div>
        </button>
      )}*/}
    </div>
  );
}

export default Form;
