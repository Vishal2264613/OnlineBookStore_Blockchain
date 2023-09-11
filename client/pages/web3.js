const Web3 = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [correctNetwork, setCorrectNetwork] = useState(false);

  const checkIfWalletConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("make sure you have metamask");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }

    const accounts = await ethereum.request({ method: "eth_account" });

    if (accounts.length != 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCorrectNetwork(true);
      setCurrentAccount(account);
    } else {
      console.log("No authorized account found");
    }
  };
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      /*
       * Fancy method to request access to account.
       */
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      /*
       * Boom! This should print out public address once we authorize Metamask.
       */
      console.log("Connected", accounts[0]);
      setCorrectNetwork(true);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };
};

export default Web3;
