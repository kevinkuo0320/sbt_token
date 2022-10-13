import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { ethers } from "ethers";
///import "./form.css";
import ConnectWallet from "./ConnectWallet";
import Divider from '@material-ui/core/Divider';

import ABI from "./abi.json";

const contractAddress = "0x5638BBb2BFb879a367aE63B224631DeEC8ee2693";

function User() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [totalMinted, setTotalMinted] = useState(0);
  const [modalIsOpen, setIsOpen] = useState(false);
  
  const [addressCheck, setAddressCheck] = useState(""); 
  const [id, setId] = useState(0); 
  const [SBTBalance, setSBTBalance] = useState(0); 
  const [addressTo,setAddressTo] =useState("");
  const [mintTo,setMintTo] =useState("");

  const [clickBalance, setClickBalance] = useState(true); 
  const [lockStatus, setLockStatus] = useState(true); 
  const [mintId, setMintId] = useState(-1); 
  const [minting, setMinting] = useState(false); 
  const [minted, setMinted] = useState(false); 

  const[transfered, setTransfered] = useState(false); 
  const[transfering, setTransfering] = useState(false); 
  const[transferError, setTransferError] = useState(false); 

  const[traitAccId, setTraitAccId] = useState(-1); 
  const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
  const signer = provider.getSigner();

  useEffect(() => {
    checkIfWalletIsConnected();
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", checkIfWalletIsConnected);
      window.ethereum.on("disconnect", checkIfWalletIsConnected);
    }
    signer.getAddress().then((address) => {
      getTest(address); 
    }); 
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
      getTest(); 
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

  //mint SBT Token
  const mint = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, ABI, signer);
    try{
      const res = await contract.mint(mintTo, mintId);
      setMinted(false); 
      setMinting(true); 
      await res.wait(); 
      setMinting(false); 
      setMinted(true); 
    } catch (err) {
      console.log(err); 
    }
  };

    //transfer SBT Token
    const transfer = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, ABI, signer);
      const ownerAddrerss = signer.getAddress();
      try {
        const res = await contract.safeTransferFrom(ownerAddrerss, addressTo, id, 1, 0x0);
        setTransfered(false); 
        setTransfering(true); 
        await res.wait(); 
        setTransfering(false); 
        setTransfered(true); 
      } catch(err) {
        // console.log(err); 
        // const code = err.data.replace('Reverted ','');
        // console.log({err});
        // let reason = ethers.utils.toUtf8String('0x' + code.substr(138));
        // console.log('revert reason:', reason);
        setTransferError(true); 
      }
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

  const getTest = async (address) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(contractAddress, ABI, provider);
    const a = await contract.viewCert(address);
    const convertId = a.toNumber(); 
    setTraitAccId(convertId); 
    console.log(convertId); 
  }


  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <div>
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
          User info : {currentAccount}
          </p>
          SBT Token contract address: {contractAddress}
          <p>

          <p>
            Token Trait: {traitAccId == -1 ? <p> loading...</p> : 
            traitAccId == 0 ? 
            <>id: {traitAccId} => NUS</> : 
            traitAccId == 1 ? 
            <>NTU</> :
            <>SMU</>} 
            
          </p>
           
          <Divider style={{background:"white"}} />

        
        <>{minting ? <p>minting...</p> : <></>} </>
        <>{minted ? <p>minting successful</p> : <></>} </>

          <Divider style={{background:"white"}} />

           </p>
        <p className="sub-text">
          check SBT token of the input address
          <p>
            <input placeholder="input address" 
            onChange={e => setAddressCheck(e.target.value)}
            style={{
          width: "200px",
        }}/> 
          </p>
          <p>
            <input placeholder="id" 
            onChange={e => setId(e.target.value)}
            style={{
          width: "200px",
        }}/> 
        {
          clickBalance ? <></> : 
          <p>
          {SBTBalance > 0 ? <p>the address owns the token</p> : <p> the address doesnt own the token</p>}  
          </p>
        }
            <button onClick={()=> {viewBalance();setClickBalance();}}>submit</button>
             </p>
        </p>

        <Divider style={{background:"white"}} />

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
        }}/>
          </p>
          <button onClick={transfer} >transfer</button>
        </p>

        <>{transfering ? <p>transfering...</p> : <></>} </>
        <>{transfered ? <p>transfered successful</p> : <></>} </>
        <>{transferError ? <p>Token is locked!</p> : <></>} </>
        <Divider style={{background:"white"}} />
       
      </div>
        <button
          className="submit"
          onClick={openModal}
          disabled={currentAccount}
        >
          <div>{currentAccount ? "Wallet Connected" : "Connect to metamask wallet"}</div>
        </button>
    </div>
  );
}

export default User;
