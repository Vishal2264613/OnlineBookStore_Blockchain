import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { BookStoreContractAddress } from "@/config";
import BookStore from "../utils/BookStore.json";
import Link from "next/link";

const yourCollection = () => {
  const [books, setBooks] = useState([]);

  const [purchaseBookInfo, setPurchaseBookInfo] = useState([]);

  useEffect(() => {
    getCollection();
  }, []);

  const getCollection = async () => {
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

        let booksCollection = await BookStoreContract.getCollection();

        console.log(booksCollection);

        let bookCol = booksCollection[0];
        let purchaseDate = booksCollection[1];
        console.log(purchaseDate);
        setPurchaseBookInfo(purchaseDate);
        setBooks(bookCol);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div class="pt-24">
      <div class="flex flex-col justify-center items-center">
        <h1 class="font-sans text-gray-600 font-semibold text-4xl ">Books</h1>
        <div class="mt-4 h-1/2  text-center grid grid-cols-5 gap-10 px-5">
          {books.map((book, index) => (
            <Link href={`/bookDescription?id=${book.id}`}>
              <div class=" bg-white rounded overflow-hidden shadow-md px-8">
                <img class="h-[250px] w-[180px]" src={book.url} alt="logo" />

                <div class="mt-1">
                  <span class="font-bold">{book.name}</span>

                  <span class="block text-gray-500 text-sm">
                    <div>
                      <h1>{purchaseBookInfo[index].dateTime}</h1>
                    </div>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default yourCollection;
