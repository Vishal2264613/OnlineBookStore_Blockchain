import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { ethers } from "ethers";
import { BookStoreContractAddress } from "@/config";
import BookStore from "../utils/BookStore.json";
import EditBook from "@/comps/EditBook";
const bookDescription = ({ url }) => {
  const router = useRouter();
  const { id } = router.query;

  const [book, setBook] = useState("");
  const [owner, setOwner] = useState(false);
  const [editBook, setEditBook] = useState(false);

  const [bookName, setBookName] = useState("");
  const [bookAuthor, setBookAuthor] = useState("");
  const [bookYear, setBookYear] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [bookDescription, setBookDescription] = useState("");
  const [bookPrice, setBookPrice] = useState("");

  const editBookBtn = () => {
    if (editBook == false) {
      setEditBook(true);
    } else {
      setEditBook(false);
    }
  };

  useEffect(() => {
    getSpecificBooks(id);
  }, [id]);
  useEffect(() => {
    checkOwner();
  });
  const buyBook = async () => {
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

        let purchaseBook = await BookStoreContract.buyBook(
          `${new Date().toLocaleString() + ""}`,
          book.id
        );

        setBook(purchaseBook);
        getSpecificBooks(id);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const deleteBook = async () => {
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

        await BookStoreContract.setStatus(book.id, false);
        getSpecificBooks(id);
      }
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
  const getSpecificBooks = async () => {
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

        let booksAvailable = await BookStoreContract.getAvailableBooks();
        console.log("Owner " + booksAvailable[0].owner);
        let owner = booksAvailable[0].owner;

        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });

        if (accounts[0] == owner.toLowerCase()) {
          setOwner(true);
        } else {
          setOwner(false);
        }

        let book = await BookStoreContract.getSpecificBook(id);
        console.log("Book data--" + book);

        setBook(book);
        setBookName(book.name);
        setBookAuthor(book.author);
        setBookYear(book.year);
        setCoverUrl(book.url);
        setBookDescription(book.description);
        setBookPrice(book.price);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {editBook ? (
        <EditBook
          editBook={editBook}
          setEditBook={editBookBtn}
          bId={id}
          bAuthor={bookAuthor}
          bName={bookName}
          bYear={parseInt(book.year).toString()}
          bUrl={coverUrl}
          bDescription={bookDescription}
          bPrice={parseInt(book.price).toString()}
        />
      ) : (
        <div></div>
      )}

      <div class="pt-24">
        <div className="flex flex-col justify-center items-center px-20">
          <div class="grid grid-cols-3 gap-0">
            <div class="w-[100%] mr-8">
              <div class="w-[95%]  py-10 px-10 bg-gray-100/25 shadow-lg">
                <img class="shadow-md" src={book.url} alt="logo" />
              </div>
            </div>
            <div class="ml-0 col-span-2">
              <h1 class="font-sans font-bold text-5xl text-gray-700">
                {book.name}
              </h1>
              <h1 class="font-serif font-light text-xl mt-6 text-gray-500">
                {book.description}
              </h1>
              <h1 class="font-serif text-xl mt-8 text-gray-500">
                Published By - {book.author}
              </h1>

              <h1 class="font-serif text-xl mt-8 text-gray-500">
                Published year - {parseInt(book.year).toString()}
              </h1>

              <h1 class="font-serif text-xl mt-8 text-gray-500">
                Price - ${parseInt(book.price).toString()}
              </h1>

              <h1 class="font-serif text-xl mt-8 text-gray-500">
                {book.status ? "Available" : "Not available"}
              </h1>
              {owner ? (
                <div class="flex">
                  <div class="flex justify-bottom mt-10">
                    <button
                      onClick={editBookBtn}
                      class="  text-white  text-xl font-bold py-3 px-24 bg-gradient-to-r from-green-400 to-green-600 rounded-full drop-shadow-md hover:drop-shadow-xl  hover:scale-105 transition duration-500 ease-in-out"
                    >
                      Edit
                    </button>
                  </div>
                  <div class="flex justify-bottom mt-10 ml-10">
                    <button
                      onClick={deleteBook}
                      class="  text-white  text-xl font-bold py-3 px-24 bg-gradient-to-r from-red-400 to-red-600 rounded-full drop-shadow-md hover:drop-shadow-xl  hover:scale-105 transition duration-500 ease-in-out"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ) : (
                <div class="flex justify-bottom mt-10">
                  <button
                    onClick={buyBook}
                    class="  text-white  text-xl font-bold py-3 px-36 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full drop-shadow-md hover:drop-shadow-xl  hover:scale-105 transition duration-500 ease-in-out"
                  >
                    Buy
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default bookDescription;
