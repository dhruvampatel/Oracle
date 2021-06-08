require('dotenv').config();
import React, { useEffect, useState } from 'react';
import './Home.css';
import Web3 from "web3";
import ABI from '../../ABI.json';

const Home = () => {

    const [addSymbol, setAddSymbol] = useState('');
    const [searchSymbol, setSearchSymbol] = useState('');
    const [result, setResult] = useState('');
    const [symbol, setSymbol] = useState();
    const [instance, setInstance] = useState();
    const [accounts, setAccounts] = useState();
    const [display, setDisplay] = useState({display: 'none'});
    const [web3, setWeb3] = useState();

    useEffect(() => {
        const createInstance = () => {
          if (window.ethereum) {
            let _web3 = new Web3(window.ethereum);
            let _instance = new _web3.eth.Contract(ABI, '0x871ccA27CBAe456FeAe3BA819BC0f1Cb7a0308CF');
            setInstance(_instance);
            setWeb3(_web3);

            window.ethereum.enable().then(async data => {
                let _accounts = await _web3.eth.getAccounts();
                setAccounts(_accounts);
            }).catch(console.error);
          }
        }
    
        createInstance();
      }, []);

    const addToSC = (e) => {
        e.preventDefault();

        setAddSymbol('');

        if(addSymbol === '') {
            alert('Field should not be null'); 
            return;
        }

        fetch(`http://127.0.0.1:3003?symbol=${addSymbol}`)
            .then(res => res.json())
            .then(async data => {
                if(Object.keys(data['Global Quote']).length == 0){
                    alert('No such stock exists!');
                    return;
                }

                let quote = data['Global Quote'];
                await instance.methods.setStocks(
                    web3.utils.fromAscii(addSymbol),
                    web3.utils.toBN(parseInt(quote['05. price'])), 
                    web3.utils.toBN(quote['06. volume'])
                ).send({from: accounts[0]});
            })
            .catch(err => console.error(err));
    }

    const getFromSC = async (e) => {
        e.preventDefault();

        setSymbol(searchSymbol);
        setSearchSymbol('');

        if(searchSymbol === '') {
            alert('Field should not be null'); 
            return;
        }

        const price = await instance.methods.getStockPrice(web3.utils.fromAscii(searchSymbol)).call();
        const volume = await instance.methods.getStockVolume(web3.utils.fromAscii(searchSymbol)).call();

        setDisplay({display: 'block'});

        if(price === 0) {
            setResult({
                price: 0,
                msg: 'Stock not added to smart contract yet!'
            });
            return;
        }

        setResult({
            price: price,
            volume: volume
        });
    }

    return(
        <div className='body'>
            <div className='container'>
                <div>
                    <span className='label'>Enter stock symbol to add it to smart contract</span>
                    <form className='form' onSubmit={addToSC}>
                        <input type='text' 
                            placeholder='Enter stock symbol' 
                            className='textbox'
                            value={addSymbol}
                            onChange={e => setAddSymbol(e.target.value)} />
                        <input type='submit' className='button' value='Add to smart contract'/>
                    </form>
                </div>
                <div style={{marginTop: '10px'}}>
                    <span className='label'>Enter stock symbol to get price and volume from smart contract</span>
                    <form className='form' onSubmit={getFromSC}>
                        <input type='text' 
                            placeholder='Enter stock symbol' 
                            className='textbox'
                            value={searchSymbol}
                            onChange={e => setSearchSymbol(e.target.value)} />
                        <input type='submit' value='Get price & volume' className='button'/>
                    </form>
                </div>
                <div style={display}>
                    <div className='label' style={{marginTop: '20px'}}>Result for {symbol}</div>
                    <div style={{marginTop: '5px', display: 'flex', flexDirection: 'column'}} className='output'>
                        <span className='result'>Price: {result.price}</span>
                        <span className='result'>Volume: {result.volume}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;