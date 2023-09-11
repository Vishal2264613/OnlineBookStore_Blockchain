import { useState, useEffect } from "react";

import Image from "next/image";
import { Inter } from "next/font/google";
import { BookStoreContractAddress } from "../config.js";

import { ethers } from "ethers";

const inter = Inter({ subsets: ["latin"] });

import BookStore from "../utils/BookStore.json";
import AddBook from "@/comps/AddBook.js";

export default function Home() {
  const [addBook, setAddBook] = useState(false);
  const [owner, setOwner] = useState(false);

  const AddBookBtn = () => {
    if (addBook == false) {
      setAddBook(true);
    } else {
      setAddBook(false);
    }
  };
  const setSigner = async () => {
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
          console.log("Account address" + accounts[0]);
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
  useEffect(() => {
    setSigner();
  });

  return (
    <div>
      {addBook ? (
        <AddBook addBook={addBook} setAddBook={AddBookBtn} />
      ) : (
        <div></div>
      )}

      <div class=" flex justify-between  mx-8 mb-10 pt-24">
        <div class=" flex items-center w-3/4 ">
          <div class="w-full">
            <div class="flex">
              <Image
                class="absolute"
                src={"/shape.png"}
                alt={"Books image"}
                priority={true}
                width={"700"}
                height={"50"}
              />
              <div class="relative ml-10 mt-8 ">
                <h1 class="text-base font-sans font-bold bg-purple-500/25 text-center py-1 w-1/6 text-pink-600 rounded">
                  Best Offers
                </h1>

                <h1 class="text-gray-100 text-base font-mono mt-3 w-3/4 ">
                  We are providing the best disount over the thousand e-books
                  this month. The world best seller books are <br />
                  available now here on our website.It's first
                  <br /> time you can purchase books by using the <br />
                  crypto currencies.
                </h1>
                {owner ? (
                  <div>
                    <button
                      class="text-base font-sans font-bold border-4 border-purple-500/25 text-center mt-8 py-1 w-1/3 text-pink-600 rounded hover:border-purple-500/75 transition duration-300 ease-out"
                      onClick={AddBookBtn}
                    >
                      Add New Book
                    </button>
                  </div>
                ) : (
                  <div>
                    <button
                      class="text-base font-sans font-bold border-4 border-purple-500/25 text-center mt-8 py-1 w-1/3 text-pink-600 rounded hover:border-purple-500/75 transition duration-300 ease-out"
                      onClick={AddBookBtn}
                    >
                      Explore Books
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div class="mr-10">
            <Image
              class="mr-20"
              src={"/read3.jpg"}
              alt={"Books image"}
              priority={true}
              width={"300"}
              height={"300"}
            />
          </div>
        </div>

        <div class="h-50 w-1/5 mr-2 ">
          <h1 class="ml-2 mt-2 text-xl font-bold font-sans text-gray-400">
            Popular Authors
          </h1>
          <div class="flex justify-between items-center">
            <div class="flex mt-2">
              <Image
                class=" rounded-full border-purple-300 border-2"
                src={"/read1.jpg"}
                alt={"Books image"}
                priority={true}
                width={"50"}
                height={"50"}
              />
              <div>
                <h1 class=" ml-2 text-base font-bold font-sans text-gray-600">
                  J.K Rowling
                </h1>
                <h1 class="ml-2 text-sm font-light font-sans text-gray-400">
                  812 reads this week
                </h1>
              </div>
            </div>
            <div class="bg-pink-300 px-3 py-0.5 rounded">9.17</div>
          </div>
          <div class="flex justify-between items-center">
            <div class="flex mt-2">
              <Image
                class=" rounded-full border-purple-300 border-2"
                src={"/read2.jpg"}
                alt={"Books image"}
                priority={true}
                width={"50"}
                height={"50"}
              />
              <div>
                <h1 class=" ml-2 text-base font-bold font-sans text-gray-600">
                  Colleen Hoover
                </h1>
                <h1 class="ml-2 text-sm font-light font-sans text-gray-400">
                  1023 reads this week
                </h1>
              </div>
            </div>
            <div class="bg-pink-300 px-3 py-0.5 rounded">9.90</div>
          </div>
          <div class="flex justify-between items-center">
            <div class="flex mt-2">
              <Image
                class=" rounded-full border-purple-300 border-2"
                src={"/read1.jpg"}
                alt={"Books image"}
                priority={true}
                width={"50"}
                height={"50"}
              />
              <div>
                <h1 class=" ml-2 text-base font-bold font-sans text-gray-600">
                  Stephen King
                </h1>
                <h1 class="ml-2 text-sm font-light font-sans text-gray-400">
                  790 reads this week
                </h1>
              </div>
            </div>
            <div class="bg-pink-300 px-3 py-0.5 rounded">8.87</div>
          </div>
          <div class="flex justify-between items-center">
            <div class="flex mt-2">
              <Image
                class=" rounded-full border-purple-300 border-2"
                src={"/read1.jpg"}
                alt={"Books image"}
                priority={true}
                width={"50"}
                height={"50"}
              />
              <div>
                <h1 class=" ml-2 text-base font-bold font-sans text-gray-600">
                  Don Johanson
                </h1>
                <h1 class="ml-2 text-sm font-light font-sans text-gray-400">
                  345 reads this week
                </h1>
              </div>
            </div>
            <div class="bg-pink-300 px-3 py-0.5 rounded">6.54</div>
          </div>
        </div>
      </div>

      <div class="w-100 text-gray-600 text-center font-sans text-2xl font-semibold">
        <h1>
          Browse huge books catalogue
          <br />
          with world bestsellers
        </h1>
      </div>
      <div class="mt-4 h-1/2  text-center grid grid-cols-5 gap-10 px-10">
        <div class="bg-white rounded overflow-hidden shadow-md">
          <Image
            class="w-full h-32 sm:h-48 object-cover"
            src={"/read3.jpg"}
            alt={"Books image"}
            priority={true}
            width={"500"}
            height={"500"}
          />
          <div class="mt-1">
            <span class="font-bold">Harry Potter</span>
            <span class="block text-gray-500 text-sm">by JK Rowling</span>
          </div>
        </div>
        <div class="bg-white rounded overflow-hidden shadow-md">
          <Image
            class="w-full h-32 sm:h-48 object-cover"
            src={"/read1.jpg"}
            alt={"Books image"}
            priority={true}
            width={"500"}
            height={"500"}
          />
          <div class="mt-4">
            <span class="font-bold">Harry Potter</span>
            <span class="block text-gray-500 text-sm">by JK Rowling</span>
          </div>
        </div>
        <div class="bg-white rounded overflow-hidden shadow-md">
          <Image
            class="w-full h-32 sm:h-48 object-cover"
            src={"/read2.jpg"}
            alt={"Books image"}
            priority={true}
            width={"500"}
            height={"500"}
          />
          <div class="mt-4">
            <span class="font-bold ">Harry Potter</span>
            <span class="block text-gray-500 text-sm">by JK Rowling</span>
          </div>
        </div>
        <div class="bg-white rounded overflow-hidden shadow-md">
          <Image
            class="w-full h-32 sm:h-48 object-cover"
            src={"/read1.jpg"}
            alt={"Books image"}
            priority={true}
            width={"500"}
            height={"500"}
          />
          <div class="mt-4">
            <span class="font-bold ">Harry Potter</span>
            <span class="block text-gray-500 text-sm">by JK Rowling</span>
          </div>
        </div>
        <div class="bg-white rounded overflow-hidden shadow-md">
          <Image
            class=" sm:h-48 object-contain"
            width={"500"}
            height={"500"}
            src={
              "https://media-cldnry.s-nbcnews.com/image/upload/streams/2013/June/130628/6C8073164-tdy-130628-harry-potter-1.jpg"
            }
            alt={"Books image"}
            priority={true}
          />
          <div class="mt-4">
            <span class="font-bold ">Harry Potter</span>
            <span class="block text-gray-500 text-sm">by JK Rowling</span>
          </div>
        </div>
      </div>
    </div>
  );
}
