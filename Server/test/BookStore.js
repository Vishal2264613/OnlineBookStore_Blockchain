const { expect } = require("chai");
const { ethers } = require("hardhat");

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

describe("BookStore Contract", function () {
  let BookStore;
  let bookStore;
  let owner;

  let NUM_NOTAVAILABLE_BOOK = 5;
  let NUM_AVAILABLE_BOOK = 3;
  let NUM_PURCHASED_BOOK = 2;

  let notAvailableBookList;
  let availableBookList;
  let purchasedBookList;

  function verifyBook(bookChain, book) {
    expect(book.name).to.equal(bookChain.name);
    expect(book.year.toString()).to.equal(bookChain.year.toString());
    expect(book.author).to.equal(bookChain.author);
    expect(book.url).to.equal(bookChain.url);
    expect(book.description).to.equal(bookChain.description);
    expect(book.price.toString()).to.equal(bookChain.price.toString());
  }

  function verifyBookList(booksFromChain, bookList) {
    expect(booksFromChain.length).to.not.equal(0);
    expect(booksFromChain.length).to.equal(bookList.length);
    for (let i = 0; i < bookList.length; i++) {
      const bookChain = booksFromChain[i];
      const book = bookList[i];
      verifyBook(bookChain, book);
    }
  }

  beforeEach(async function () {
    BookStore = await ethers.getContractFactory("BookStore");
    [owner] = await ethers.getSigners();
    bookStore = await BookStore.deploy();
    await bookStore.deployed();

    notAvailableBookList = [];
    availableBookList = [];
    purchasedBookList = [];

    for (let i = 0; i < NUM_NOTAVAILABLE_BOOK; i++) {
      let book = {
        name: getRandomInt(1, 1000).toString(),
        year: getRandomInt(1800, 2021),
        author: getRandomInt(1, 1000).toString(),
        url: getRandomInt(1, 2000).toString(),
        description: getRandomInt(1, 2000).toString(),
        price: getRandomInt(10, 200),
        status: false,
      };

      await bookStore.addBook(
        book.name,
        book.year,
        book.author,
        book.url,
        book.description,
        book.price,
        book.status
      );
      notAvailableBookList.push(book);
    }

    for (let i = 0; i < NUM_AVAILABLE_BOOK; i++) {
      let book = {
        name: getRandomInt(1, 1000).toString(),
        year: getRandomInt(1800, 2021),
        author: getRandomInt(1, 1000).toString(),
        url: getRandomInt(1, 2000).toString(),
        description: getRandomInt(1, 2000).toString(),
        price: getRandomInt(10, 200),
        status: true,
      };

      await bookStore.addBook(
        book.name,
        book.year,
        book.author,
        book.url,
        book.description,
        book.price,
        book.status
      );
      availableBookList.push(book);
    }

    for (let i = 0; i < NUM_PURCHASED_BOOK; i++) {
      let purchasedBook = {
        dateTime: getRandomInt(1, 1000).toString(),
        bookId: getRandomInt(1, 10),
      };

      await bookStore.buyBook(purchasedBook.dateTime, purchasedBook.bookId);
      purchasedBookList.push(purchasedBook);
    }
  });

  describe("Add Book", function () {
    it("should emit AddBook event", async function () {
      let book = {
        name: getRandomInt(1, 1000).toString(),
        year: getRandomInt(1800, 2021),
        author: getRandomInt(1, 1000).toString(),
        url: getRandomInt(1, 2000).toString(),
        description: getRandomInt(1, 2000).toString(),
        price: getRandomInt(10, 200),
        status: false,
      };
      await expect(
        await bookStore.addBook(
          book.name,
          book.year,
          book.author,
          book.url,
          book.description,
          book.price,
          book.status
        )
      )
        .to.emit(bookStore, "AddBook")
        .withArgs(owner.address, NUM_AVAILABLE_BOOK + NUM_NOTAVAILABLE_BOOK);
    });
  });

  describe("Buy Book", function () {
    it("should emit BuyBook event", async function () {
      let purchasedBook = {
        dateTime: getRandomInt(1, 1000).toString(),
        bookId: getRandomInt(1, 10),
      };
      await expect(
        await bookStore.buyBook(purchasedBook.dateTime, purchasedBook.bookId)
      )
        .to.emit(bookStore, "BuyBook")
        .withArgs(owner.address, NUM_PURCHASED_BOOK);
    });
  });

  describe("Get Collection", function () {
    it("should return the correct collection of books", async function () {
      const booksFromChain = await bookStore.getCollection();
      expect(booksFromChain[0].length).to.equal(NUM_PURCHASED_BOOK);
      expect(booksFromChain[1].length).to.equal(NUM_PURCHASED_BOOK);
    });
  });

  describe("Get Book", function () {
    it("should return the correct not available books", async function () {
      const booksFromChain = await bookStore.getNotAvailableBooks();
      expect(booksFromChain.length).to.equal(NUM_NOTAVAILABLE_BOOK);
      verifyBookList(booksFromChain, notAvailableBookList);
    });
    it("should return the correct available books", async function () {
      const booksFromChain = await bookStore.getAvailableBooks();
      expect(booksFromChain.length).to.equal(NUM_AVAILABLE_BOOK);
      verifyBookList(booksFromChain, availableBookList);
    });
  });

  describe("Get Specific Book", function () {
    it("should get a specific book", async function () {
      const BOOK_ID = 1;
      const bookId = 1;
      const booksFromChain = await bookStore.getSpecificBook(BOOK_ID);
      expect(booksFromChain.id).to.equal(bookId);
    });
  });

  describe("Set Status", function () {
    it("Should emit the status event", async function () {
      const BOOK_ID = 0;
      const BOOK_STATUS = true;

      await expect(bookStore.setStatus(BOOK_ID, BOOK_STATUS))
        .to.emit(bookStore, "SetStatus")
        .withArgs(BOOK_ID, BOOK_STATUS);
    });
  });

  describe("Edit Book", function () {
    it("Should emit the edit event", async function () {
      const BOOK_ID = 0;
      let book = {
        name: getRandomInt(1, 1000).toString(),
        year: getRandomInt(1800, 2023),
        author: getRandomInt(1, 1000).toString(),
        url: getRandomInt(1, 2000).toString(),
        description: getRandomInt(1, 2000).toString(),
        price: getRandomInt(10, 200),
      };

      await expect(
        bookStore.editBookInfo(
          BOOK_ID,
          book.name,
          book.year,
          book.author,
          book.url,
          book.description,
          book.price
        )
      )
        .to.emit(bookStore, "SetBookUpdate")
        .withArgs(owner.address, BOOK_ID);
    });
  });
});
