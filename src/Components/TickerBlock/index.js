const TickerBlock = ({item, config, titleStockSymbol, delayState}) => {
  const formatMoney = (amt) => {
    let price = amt + '';
    const [dollars, cents] = price.split('.');
    if (!cents) {
      return `${dollars}.00`; 
    } else if (cents.length === 1) {
      return `${dollars}.${cents}0`; 
    }
    return price;
  }
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

  const price = formatMoney(data.price);

  // put the price of the first security in the document title (tab)
  let title = data.symbol === titleStockSymbol ?  `Securities Quotes (${data.symbol}: ${price})` : document.title;
  let wasDelayed = false;
  if (title[0] === '*') {
    title = title.substring(1);
    wasDelayed = true;
  };
  if (delayState) {
    title = '*' + title;
    const beep = document.getElementById('beep');
    beep.play().catch((err) => 
      console.log(`Off hours tone did not play as user has not inteacted with the page (${err.message})`)
    );
  } else {
    if (wasDelayed) {
      const beep = document.getElementById('beep');
      beep.play().catch((err) => 
        console.log(`Open hours tone did not play as user has not inteacted with the page (${err.message})`)
      );
    }
  }
  document.title = title;

  const itemName =  (<div>{data.shortName} {config.showSymbol && `(${data.symbol})`}: {price}</div>);
  const itemChange = config.showChange ? (<div className={posNeg}>{dirImage}Change: {dirChange}</div>) : null;
  const itemBid = config.showBid ? (<div>Bid: {formatMoney(data.bid)}</div>) : null;
  const itemBidSize = config.showBidSize ? (<div>Bid Size: {data.bidSize}</div>) : null;
  const itemAsk = config.showAsk ? (<div>Ask: {formatMoney(data.ask)}</div>) : null;
  const itemAskSize = config.showAskSize ? (<div>Ask Size: {data.askSize}</div>) : null;
  const itemSpread = config.showSpread ? (<div>Spread: {spread} {label}</div>) : null;
  const itemVolume = config.showVolume ? (<div>Volume: {data.averageVolume}</div>) : null;
  const itemPrevClose = config.showPrevClose ? (<div>PrevClose: {formatMoney(data.prevClose)}</div>) : null;
  const itemBeta = config.showBeta ? (<div>Beta: {data.beta}</div>) : null;
  const itemExchange = config.showExchange ? (<div>Exchange: {data.exchangeName}</div>) : null;
  const itemDelay = config.showDelay ? (<div>Exch Delay: {data.exchangeDataDelayedBy}</div>) : null;
  const itemBookValue = config.showBookValue ? (<div>Book Value: {formatMoney(data.bookValue)}</div>) : null;
  const itemOpen = config.showOpen ? (<div>Open: {formatMoney(data.open)}</div>) : null;
  const itemRegularMarketChangePercent = config.showRegularMarketChangePercent ? (<div>% Change : {Number( (data.regularMarketChangePercent * 100).toPrecision(2))}%</div>) : null;
  return (<div className={spreadClass}>
    {itemName}
    {itemChange}
    {itemOpen}
    {itemPrevClose}
    {itemRegularMarketChangePercent}
    {itemBid}
    {itemBidSize}
    {itemAsk}
    {itemAskSize}
    {itemSpread}
    {itemVolume}
    {itemBeta}
    {itemBookValue}
    {itemExchange}
    {itemDelay}
  </div>)
}

export default TickerBlock;
