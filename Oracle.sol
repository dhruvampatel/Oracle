// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

contract MyOracle {
    //Quote structure
    struct Stock {
        uint price;
        uint volume;
    }
    //Quotes my symbol
    mapping(bytes => Stock) public stockQuote;
    //Onwer of smart contract
    address public oracleOwner;
    
    constructor() {
        oracleOwner = msg.sender;
    }
    
    function setStocks(bytes memory symbol, uint price, uint volume) public {
        Stock memory stock = Stock(price, volume);
        stockQuote[symbol] = stock;
    }
    
    function getStockPrice(bytes memory symbol) public view returns(uint){
        return stockQuote[symbol].price;
    }
    
    function getStockVolume(bytes memory symbol) public view returns(uint){
        return stockQuote[symbol].volume;
    }
}