import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { truncate, useGlobalState } from "../store";
import { ethers } from "ethers";
import { BookStoreContractAddress } from "@/config";
import BookStore from "../utils/BookStore.json";

const Navbar = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [correctNetwork, setCorrectNetwork] = useState(false);
  const [owner, setOwner] = useState(false);

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Connected", accounts[0]);
      setCorrectNetwork(true);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };
  const checkOwner = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.BrowserProvider(ethereum);
        const signer = provider.getSigner();
        const BookStoreContract = new ethers.Contract(
          BookStoreContractAddress,
          BookStore.abi,
          await signer
        );
        window.ethereum.on("chainChanged", (chainId) => {
          window.location.reload();
        });
        window.ethereum.on("accountsChanged", async () => {
          setOwner(accounts[0]?.toLowerCase());
        });

        let address = await BookStoreContract.ownerAddress();
        console.log("Owner -- " + address);

        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });

        if (accounts[0] == address.toLowerCase()) {
          setOwner(true);
        } else {
          setOwner(false);
        }
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const checkIfWalletConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("make sure you have metamask");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }

    window.ethereum.on("chainChanged", (chainId) => {
      window.location.reload();
    });
    window.ethereum.on("accountsChanged", async () => {
      setCurrentAccount(accounts[0]?.toLowerCase());
      await checkIfWalletConnected();
    });

    const accounts = await ethereum.request({ method: "eth_requestAccounts" });

    if (accounts.length != 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCorrectNetwork(true);
      setCurrentAccount(account);
    } else {
      console.log("No authorized account found");
    }
  };

  useEffect(() => {
    checkIfWalletConnected();
    checkOwner();
  });

  return (
    <div class="fixed z-10 w-full bg-white">
      <nav class=" flex justify-between items-center px-10 my-5 ">
        <div class="flex items-center">
          <Image
            class="inline-block"
            src={"/logo.png"}
            alt={"Books image"}
            priority={true}
            width={"50"}
            height={"50"}
          />
          <h1 class="ml-2 bg-gradient-to-r from-purple-600 to-pink-500 font-bold text-lg text-transparent bg-clip-text">
            Pyramid
            <br />
            Books
          </h1>
          <Link class="navlist ml-10" href={"/"}>
            Home
          </Link>
          <Link class="navlist text-gray-400" href={"/books"}>
            Books
          </Link>
          <Link class="navlist text-gray-400" href={"/about"}>
            About
          </Link>
          {owner ? (
            <div></div>
          ) : (
            <div>
              <Link class="navlist text-red-500" href={"/yourCollection"}>
                Your collection
              </Link>
            </div>
          )}
        </div>
        <div>
          <button
            class="bg-clip-text text-transparent  bg-gradient-to-r from-purple-600 to-pink-500 font-semibold border-4  border-purple-400 rounded-full px-2 py-1 hover:border-purple-600 transition duration-300 ease-out"
            onClick={() => connectWallet()}
          >
            {currentAccount != ""
              ? truncate(currentAccount, 4, 4, 11)
              : "ConnectWallet"}
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
