import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { BookStoreContractAddress } from "@/config";
import BookStore from "../utils/BookStore.json";
import Link from "next/link";
import Image from "next/image";

const Books = () => {
  const [books, setBooks] = useState([]);
  useEffect(() => {
    getBooks();
  }, []);
  const getBooks = async () => {
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

        let booksAvailable = await BookStoreContract.getAvailableBooks();

        // let booksNotAvailable = await BookStoreContract.getNotAvailableBooks();

        // console.log(booksAvailable);
        // console.log("Books:- ");
        // console.log(booksNotAvailable);

        let books = booksAvailable;
        setBooks(books);
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
          {books.map((book) => (
            <Link href={`/bookDescription?id=${book.id}`}>
              <div class=" bg-white rounded overflow-hidden shadow-md px-8">
                <img class="h-[250px] w-[180px]" src={book.url} alt="logo" />

                <div class="mt-1">
                  <span class="font-bold">{book.name}</span>
                  <span class="block text-gray-500 text-sm">
                    by {book.author} | ${parseInt(book.price).toString()}
                  </span>
                  <span class="block text-gray-500 text-sm">
                    {book.status ? "Available" : "Not available"}
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

export default Books;
