import {useEffect, useState} from 'react';
import './App.css';
import ConfigForm from './Components/ConfigForm';

let speed = 10;
let pause = false;

let scrollTicker= () => {
  const ticker = document.querySelector('.tickerContainer');
  const region = ticker.getBoundingClientRect();
  const tickerLine = document.querySelector('.tickerLine');
  tickerLine.style.left = region.width + 'px';
  handleScroll(region, tickerLine);
}

let handleScroll = (region, tickerLine) => {
  if (pause) {
    console.log('pause')
    setTimeout(() => {
      handleScroll();
    }, 5000);
  } else {
    if (region.x < tickerLine.getBoundingClientRect().x + tickerLine.getBoundingClientRect().width) {
      tickerLine.style.left = (parseInt(tickerLine.style.left) - 1) + 'px';
      setTimeout(() => {
        handleScroll(region, tickerLine);
      }, speed);
    } else {
      scrollTicker();
    }
  }
}

const App = () => {
  const [tickerData, setTickerData] = useState([]);
  
  const [config, setConfig] = useState({
    pause: true,
    showAsk: true,
    showBid: true,
    showChange: true,
    showDelay: true,
    showExchange: true,
    showPrevClose: true,
    showSpread: true,
    showVolume: true,
    speed: 10
  });

  useEffect(() => {
    const fetchTicker = () =>fetch('http://localhost:3010')
      .then(response => response.json())
      .then(data => {
        setTickerData(data);
        setTimeout(() => {
          fetchTicker();
        }, 5000);
      })
      fetchTicker()
      scrollTicker()
  }, [])

  const tickerLine = item => {
    const key = Object.keys(item)[0];
    const data = item[key];
    let spreadClass = '';
    let dirImage = null;
    let posNeg = '';
    let dirChange = null;

    let spread = '--'
    if (data.bid === 0 || data.bid === null || data.ask === 0 || data.ask === 0) {
      spread = '--'
    } else {
      const numBid = data.bid * 1;
      const numAsk = data.ask * 1;
      spread = (Math.round((Math.abs(numBid - numAsk)) * 1000))/1000
    }

    if (!isNaN(spread) && spread <= .03) {
      spreadClass = 'spreadBold';
    } else if (isNaN(spread)) {
      spreadClass = 'spreadGold';
    } else {
      spreadClass = 'spreadDim'
    }

    if (config.showChange) {
      if ((data.change + '').indexOf('-') > -1) {
        dirImage = (<img src="/assets/images/spacer.png" alt="" className="dirArrow down" />);
        posNeg = 'negative';
      } else if (data.change * 1 === 0) {
        dirImage = null;
        posNeg = '';
      } else {
        dirImage = (<img src="/assets/images/spacer.png" alt="" className="dirArrow up" />);
        posNeg = 'positive';
      }
      dirChange = (<span className={posNeg}>{(data.change + '').replace(/-|\+/,"")}</span> );
    }

    const itemName =  (<span>{data.shortName} Price: {data.price}</span>);
    const itemChange = config.showChange ? (<span className={posNeg}>&nbsp;&nbsp;&nbsp;{dirImage}Change: {dirChange}</span>) : null;
    const itemBid = config.showBid ? (<span>&nbsp;&nbsp;&nbsp;Bid: {data.bid}</span>) : null;
    const itemAsk = config.showAsk ? (<span>&nbsp;&nbsp;&nbsp;Ask: {data.ask}</span>) : null;
    const itemSpread = config.showSpread ? (<span>&nbsp;&nbsp;&nbsp;Spread: {spread}</span>) : null;
    const itemVolume = config.showVolume ? (<span>&nbsp;&nbsp;&nbsp;Volume: {data.averageVolume}</span>) : null;
    const itemPrevClose = config.showPrevClose ? (<span>&nbsp;&nbsp;&nbsp;PrevClose: {data.prevClose}</span>) : null;
    const itemExchange = config.showExchange ? (<span>&nbsp;&nbsp;&nbsp;Exchange: {data.exchangeName}</span>) : null;
    const itemEDelay = config.showDelay ? (<span>&nbsp;&nbsp;&nbsp;Exch Delay: {data.exchangeDataDelayedBy}</span>) : null;
    return (<span className={spreadClass} key={`symbol_${key}`}>{itemName}{itemChange}{itemBid}{itemAsk}{itemSpread}{itemVolume}{itemPrevClose}{itemExchange}{itemEDelay}</span>)
  }

  const tickerBlocks = item => {
    const key = Object.keys(item)[0];
    const data = item[key];
    let spreadClass = '';
    let dirImage = null;
    let posNeg = '';
    let dirChange = null;

    let spread = '--'
    if (data.bid === 0 || data.bid === null || data.ask === 0 || data.ask === 0) {
      spread = '--'
    } else {
      const numBid = data.bid * 1;
      const numAsk = data.ask * 1;
      spread = (Math.round((Math.abs(numBid - numAsk)) * 1000))/1000
    }

    if (!isNaN(spread) && spread <= .03) {
      spreadClass = 'spreadBold';
    } else if (isNaN(spread)) {
      spreadClass = 'spreadGold';
    } else {
      spreadClass = 'spreadDim'
    }

    if (config.showChange) {
      if ((data.change + '').indexOf('-') > -1) {
        dirImage = (<img src="/assets/images/spacer.png" alt="" className="dirArrow down" />);
        posNeg = 'negative';
      } else if (data.change * 1 === 0) {
        dirImage = null;
        posNeg = '';
      } else {
        dirImage = (<img src="/assets/images/spacer.png" alt="" className="dirArrow up" />);
        posNeg = 'positive';
      }
      dirChange = (<span className={posNeg}>{(data.change + '').replace(/-|\+/,"")}</span> );
    }

    const itemName =  (<div>{data.shortName} Price: {data.price}</div>);
    const itemChange = config.showChange ? (<div className={posNeg}>{dirImage}Change: {dirChange}</div>) : null;
    const itemBid = config.showBid ? (<div>Bid: {data.bid}</div>) : null;
    const itemAsk = config.showAsk ? (<div>Ask: {data.ask}</div>) : null;
    const itemSpread = config.showSpread ? (<div>Spread: {spread}</div>) : null;
    const itemVolume = config.showVolume ? (<div>Volume: {data.averageVolume}</div>) : null;
    const itemPrevClose = config.showPrevClose ? (<div>PrevClose: {data.prevClose}</div>) : null;
    const itemExchange = config.showExchange ? (<div>Exchange: {data.exchangeName}</div>) : null;
    const itemEDelay = config.showDelay ? (<div>Exch Delay: {data.exchangeDataDelayedBy}</div>) : null;
    return (<div className={spreadClass} key={`symbol_${key}`}>{itemName}{itemChange}{itemBid}{itemAsk}{itemSpread}{itemVolume}{itemPrevClose}{itemExchange}{itemEDelay}</div>)
  }

  const updateConfig = target => {
    const eName = target.name;
    if (target.type === "checkbox") {
      setConfig(currConfig => Object.assign({}, currConfig, {[eName]: target.checked}))
    } else {
      if (eName === 'speed') {
        speed = target.value;
      } else {
        if (eName === 'pause') {
          pause = target.value;
        }
      }
      setConfig(
        currConfig =>Object.assign({}, currConfig, {[eName]: target.value})
      )
    }
  }

  return (
    <div className="App">
      <div className="tickerContainer">
        <div className="tickerLine">
          {tickerData.map((item) => {
            return tickerLine(item)
          })}
          &nbsp;... ...
        </div>
      </div>
      <div className="blocksContainer">
        <div className="tickerBlocks">
          {tickerData.map((item) => {
            return tickerBlocks(item)
          })}
        </div>
      </div>
      <ConfigForm
        config={config}
        updateConfig={updateConfig}
      />
    </div>
  );
}

export default App;
