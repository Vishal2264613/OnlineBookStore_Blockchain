pragma solidity ^0.8.8;

contract BookStore {

    event AddBook(address recipent,uint bookId);
    event BuyBook(address recipent,uint bookId);
    event SetStatus(uint bookId,bool status);
    event SetBookUpdate(address recipent,uint bookId);

    address contractOwner = msg.sender;

    struct Book{
        uint id;
        address owner;
        string name;
        uint year;
        string author;
        string url;
        string description;
        uint price;
        bool status;
    }
    struct PurchasedBook{
        uint id;
        string dateTime;
        uint bookId;
    }

    Book[] private bookList;
    PurchasedBook[] private purchasedBook;
    mapping(uint256 => address) bookToOwner;

    function ownerAddress() external view returns(address){
        
        return contractOwner;
    }

    function addBook(string memory name,uint16 year, string memory author,string memory url,string memory description,uint16 price,bool status) external{
        uint bookId = bookList.length;
        bookList.push(Book(bookId,msg.sender,name,year,author,url,description,price,status));
        emit AddBook(msg.sender,bookId);
    }

    function buyBook(string memory dateTime,uint bookId) external {
        uint purchasedBookId = purchasedBook.length;
        purchasedBook.push(PurchasedBook(purchasedBookId,dateTime,bookId));
        bookToOwner[purchasedBookId] = msg.sender;
        emit BuyBook(msg.sender,purchasedBookId);
    }

    function getCollection() external view returns(Book[] memory,PurchasedBook[] memory){
        PurchasedBook[] memory temporary = new PurchasedBook[](purchasedBook.length);
        uint counter = 0;
        for(uint i = 0; i<purchasedBook.length; i++){
            if(bookToOwner[i] == msg.sender){
                temporary[counter] = purchasedBook[i];
                counter++;
            }
        }
        Book[] memory booksCollection = new Book[](counter);
        PurchasedBook[] memory result = new PurchasedBook[](counter);
        for(uint i=0; i<counter; i++){
            uint id = temporary[i].bookId;
            booksCollection[i]=bookList[id];
            result[i] = temporary[i];
        }
        return (booksCollection,result);
    }

    function _getBookList(bool status) private view returns(Book[] memory){
        Book[] memory temporary = new Book[](bookList.length);
        uint counter = 0;
        for(uint i = 0; i<bookList.length;i++){
            if(bookList[i].status == status){
                temporary[counter] = bookList[i];
                counter++;
            }
        }
        Book[] memory result = new Book[](counter);
        for(uint i=0; i<counter;i++){
            result[i] = temporary[i];
        }
        return result;
    }

    function getSpecificBook(uint id) external view returns(Book memory){
        Book memory book;
        
        for(uint i = 0; i<bookList.length;i++){
            if(bookList[i].id == id){
                book = bookList[i];
            }
        }
        return book;
    }

    function getAvailableBooks() external view returns (Book[] memory){
        return _getBookList(true);
    }

     function getNotAvailableBooks() external view returns (Book[] memory){
        return _getBookList(false);
    }

    function setStatus(uint bookId,bool status) external{
        if( bookList[bookId].owner == msg.sender){
            bookList[bookId].status = status;
            emit SetStatus(bookId,status);
        }
    }

    function editBookInfo(uint bookId,string memory name,uint16 year, string memory author,string memory url,string memory description,uint16 price) external{
        if( bookList[bookId].owner == msg.sender){
            bookList[bookId].name = name;
            bookList[bookId].year = year;
            bookList[bookId].author = author;
            bookList[bookId].url = url;
            bookList[bookId].description = description;
            bookList[bookId].price = price;
            emit SetBookUpdate(msg.sender,bookId);
        }
        
    }
 
}