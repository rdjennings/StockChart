import {useEffect, useRef, useState} from 'react';
import './App.css';
import ConfigForm from './Components/ConfigForm';

const App = () => {
  const [tickerData, setTickerData] = useState([]);
  const [delayState, setDelayState] = useState(false);
  const timer = useRef();;
  
  const [config, setConfig] = useState({
    pause: true,
    showAsk: true,
    showBeta: true,
    showBid: true,
    showBookValue: false,
    showChange: true,
    showDelay: false,
    showExchange: false,
    showOpen: true,
    showPrevClose: true,
    showRegularMarketChangePercent: true,
    showSpread: true,
    showSymbol: true,
    showVolume: true,
  });

  useEffect(() => {
    const fetchTicker = () =>fetch('http://localhost:3010')
      .then(response => {
        const x =response.json();
        return x;
      })
      .then(data => {
        setTickerData(data);
        let delay = 9000;
        let now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        const day = now.getDate();
        let sod = new Date(year, month, day, 9, 30);
        let eod = new Date(year, month, day, 16, 30);

        if (now.getTime >= sod.getTime() && now.getTime() <= eod.getTime()) {
          delay = 9000;
          setDelayState(false)
        } else if (now.getTime() > eod.getTime()) {
          const tomorrow = new Date(year, month, day + 1, 9, 30).getTime();
          setDelayState(true);
          delay = tomorrow - now.getTime();
          console.log(`Will retry on ${new Date(tomorrow).toString()}`);
        } else if (now.getTime() < sod.getTime()) {
          delay = sod.getTime() - now.getTime();
          console.log(`Will retry on ${new Date(sod.getTime()).toString()}`);
          setDelayState(true);
        } else {
          setDelayState(false);
        }
        
        timer.current = setTimeout(() => {
          fetchTicker();
        }, delay);
      })
      .catch(err => {
        console.error('App.js fetch error', {err});
        timer.current = setTimeout(() => {
          console.warn('attempting restart', fetchTicker);
          fetchTicker();
        }, 9000);
      })
      fetchTicker()
      return () => {
        console.log('killing timer');
        clearTimeout(timer.current);
      }
  }, [])

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

    let label = '';

    if (!isNaN(spread) && spread <= .03) {
      spreadClass = 'spreadBold';
      label = '*';
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

    let price = data.price + '';
    const parts = price.split('.');
    if (parts.length < 2 || parts[1].length === 0) {
      price += '.00'; 
    } else if (parts[1].length === 1) {
      price += '0';
    } 

    let title = data.symbol === 'G' ?  `Securities Quotes (G: ${price})` : document.title;
    if (title[0] === '*') title = title.substring(1);
    if (delayState) title = '*' + title;
    document.title = title;

    const itemName =  (<div>{data.shortName} {config.showSymbol && `(${data.symbol})`}: {price}</div>);
    const itemChange = config.showChange ? (<div className={posNeg}>{dirImage}Change: {dirChange}</div>) : null;
    const itemBid = config.showBid ? (<div>Bid: {data.bid}</div>) : null;
    const itemAsk = config.showAsk ? (<div>Ask: {data.ask}</div>) : null;
    const itemSpread = config.showSpread ? (<div>Spread: {spread} {label}</div>) : null;
    const itemVolume = config.showVolume ? (<div>Volume: {data.averageVolume}</div>) : null;
    const itemPrevClose = config.showPrevClose ? (<div>PrevClose: {data.prevClose}</div>) : null;
    const itemBeta = config.showBeta ? (<div>Beta: {data.beta}</div>) : null;
    const itemExchange = config.showExchange ? (<div>Exchange: {data.exchangeName}</div>) : null;
    const itemDelay = config.showDelay ? (<div>Exch Delay: {data.exchangeDataDelayedBy}</div>) : null;
    const itemBookValue = config.showBookValue ? (<div>Book Value: {data.bookValue}</div>) : null;
    const itemOpen = config.showOpen ? (<div>Open: {data.open}</div>) : null;
    const itemRegularMarketChangePercent = config.showRegularMarketChangePercent ? (<div>% Change : {Number( (data.regularMarketChangePercent * 100).toPrecision(2))}%</div>) : null;
    return (<div className={spreadClass} key={`symbol_${key}`}>
      {itemName}
      {itemChange}
      {itemOpen}
      {itemRegularMarketChangePercent}
      {itemBid}
      {itemAsk}
      {itemSpread}
      {itemVolume}
      {itemPrevClose}
      {itemBeta}
      {itemBookValue}
      {itemExchange}
      {itemDelay}
    </div>)
  }

  const updateConfig = target => {
    const eName = target.name;
    setConfig(currConfig => Object.assign({}, currConfig, {[eName]: target.checked}))
  }

  return (
    <div className="App">
      <div className="blocksContainer">
        <div className="tickerBlocks">
          {Object.keys(tickerData).length > 0 ? tickerData.map((item) => {
            return tickerBlocks(item)
          }) : (<div>No ticker data available. Please stand by.</div>)}
        </div>
      </div>
      <ConfigForm
        config={config}
        updateConfig={updateConfig}
      />
      <div className="footNote">(*: Spread less than or equal to .03)</div>
    </div>
  );
}

export default App;
