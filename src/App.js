import {useEffect, useRef, useState} from 'react';
import './App.css';
import ConfigForm from './Components/ConfigForm';
import TickerBlock from './Components/TickerBlock'

const App = () => {
  const [tickerData, setTickerData] = useState([]);
  const [delayState, setDelayState] = useState(false);
  const timer = useRef();;
  
  const [config, setConfig] = useState({
    pause: true,
    showAsk: true,
    showAskSize: true,
    showBeta: true,
    showBid: true,
    showBidSize: true,
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
        const weekDay = now.getDay();
        let dayOffset = 1;

        if (weekDay < 1 || weekDay > 6) {
          if (weekDay === 0) {
            const tomorrow = new Date(year, month, day + 1, 9, 30).getTime();
            setDelayState(true);
            delay = tomorrow - now.getTime();
            console.log(`Today is Sunday. Will retry on Monday${new Date(tomorrow).toString()}`);
          } else if (weekDay === 7) {
            const tomorrow = new Date(year, month, day + 2, 9, 30).getTime();
            setDelayState(true);
            delay = tomorrow - now.getTime();
            console.log(`Today is Saturday. Will retry on Monday${new Date(tomorrow).toString()}`);
          }
        } else if (now.getTime >= sod.getTime() && now.getTime() <= eod.getTime()) {
          delay = 9000;
          setDelayState(false)
        } else if (now.getTime() > eod.getTime()) {
          if (weekDay === 6) {
            dayOffset = 2;
          }
          const tomorrow = new Date(year, month, day + dayOffset, 9, 30).getTime();
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

  const updateConfig = target => {
    const eName = target.name;
    setConfig(currConfig => Object.assign({}, currConfig, {[eName]: target.checked}))
  }

  return (
    <div className="App">
      <div className="blocksContainer">
        <div className="tickerBlocks">
          {Object.keys(tickerData).length > 0 ? tickerData.map((item) => {
            return <TickerBlock
              item={item}
              config = {config}
              titleStockSymbol={Object.keys(tickerData[0])[0] || ''}
              delayState={delayState}
              key={`symbol1_${Object.keys(item)[0]}`}
            />
          }) : (<div>No ticker data available. Please stand by.</div>)}
        </div>
      </div>
      <div className="footNote">(*: Spread less than or equal to .03)</div>
      <ConfigForm
        config={config}
        updateConfig={updateConfig}
      />
    </div>
  );
}

export default App;
