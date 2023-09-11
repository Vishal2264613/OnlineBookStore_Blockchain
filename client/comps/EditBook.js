import Image from "next/image";
import { useState } from "react";
import { ethers, id } from "ethers";
import { BookStoreContractAddress } from "@/config";
import BookStore from "../utils/BookStore.json";
const EditBook = ({
  addBook,
  setEditBook,
  bId,
  bAuthor,
  bName,
  bYear,
  bUrl,
  bDescription,
  bPrice,
}) => {
  const [bookAuthor, setBookAuthor] = useState(bAuthor);
  const [bookName, setBookName] = useState(bName);
  const [bookYear, setBookYear] = useState(bYear);
  const [coverUrl, setCoverUrl] = useState(bUrl);
  const [bookDescription, setBookDescription] = useState(bDescription);
  const [bookPrice, setBookPrice] = useState(bPrice);

  const submitBook = async () => {
    let book = {
      bookId: bId,
      name: bookName,
      year: parseInt(bookYear),
      author: bookAuthor,
      url: coverUrl,
      description: bookDescription,
      price: parseInt(bookPrice),
      status: true,
    };

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

        let bookTx = await BookStoreContract.editBookInfo(
          book.bookId,
          book.name,
          book.year,
          book.author,
          book.url,
          book.description,
          book.price
        );

        console.log(bookTx);
        setEditBook(false);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log("Error Submitting new Book", error);
    }
  };
  return (
    <div class="absolute z-20 bg-gray-900/50 h-screen w-screen flex items-center justify-center transition ease-out delay-300">
      <div class="h-[650px] w-1/2 bg-white rounded-lg flex">
        <div class=" w-full">
          <div class=" flex justify-end">
            <button onClick={setEditBook}>
              <Image
                src={"/close.png"}
                alt={"Books image"}
                priority={true}
                width={"30"}
                height={"30"}
              />
            </button>
          </div>
          <div class="flex justify-center ">
            <h1 class="font-sans text-gray-600 font-semibold text-4xl ">
              Edit Book
            </h1>
          </div>
          <div class="flex justify-center  ">
            <div class="text-xl w-3/4 px-10 font-semibold mt-2 ">
              <div class="flex justify-center">
                <img
                  class="h-[60px] w-[50px]"
                  src={coverUrl ? coverUrl : "bookLogo.png"}
                  alt="logo"
                />
              </div>
              <div class="flex justify-center">
                <input
                  class="bookInput "
                  type="text"
                  placeholder="Book Name"
                  value={bookName}
                  onChange={(e) => setBookName(e.target.value)}
                />
              </div>

              <div class="flex justify-center">
                <input
                  class="bookInput "
                  type="text"
                  placeholder="Book Author"
                  value={bookAuthor}
                  onChange={(e) => setBookAuthor(e.target.value)}
                />
              </div>

              <div class="flex justify-center">
                <input
                  class="bookInput "
                  type="text"
                  placeholder="Book Year"
                  value={bookYear}
                  onChange={(e) => setBookYear(e.target.value)}
                />
              </div>

              <div class="flex justify-center">
                <input
                  class="bookInput "
                  type="text"
                  placeholder="Cover url"
                  value={coverUrl}
                  onChange={(e) => setCoverUrl(e.target.value)}
                />
              </div>

              <div class="flex justify-center">
                <input
                  class="bookInput "
                  type="text"
                  placeholder="Book description"
                  value={bookDescription}
                  onChange={(e) => setBookDescription(e.target.value)}
                />
              </div>

              <div class="flex justify-center">
                <input
                  class="bookInput "
                  type="text"
                  placeholder="Book Price"
                  value={bookPrice}
                  onChange={(e) => setBookPrice(e.target.value)}
                />
              </div>

              <div class="flex justify-center">
                <button
                  onClick={submitBook}
                  class=" flex justify-center text-white mt-2 text-xl font-bold py-3 px-24 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full drop-shadow-md hover:drop-shadow-xl  hover:scale-105 transition duration-500 ease-in-out"
                >
                  Update Book
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditBook;
