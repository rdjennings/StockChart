const express = require('express');
const app = express();
const yf = require('yahoo-finance');
const port = 3010;
const cors = require('cors');
const fs = require('fs');
const path = require('path');

app.use(cors());

let symbols = [];
let jsonPath = path.join(__dirname, '..', 'server', 'data', 'symbols.txt');
fs.readFile(jsonPath,  'utf8', (err, data) => {
  let words = data.split('\n');
  symbols = words.filter(word => word.length > 0 );
})

app.get('/', (req, res) => {
  const modules = [
    'price',
    'summaryDetail',
    'defaultKeyStatistics',
    // 'recommendationTrend'
  ]

  let response = {};

  try {
    yf.quote({
      symbols,
      modules
    }, {timeout: 9000}, (err, quote) => {
      if (err !== null) {
        console.error({err})
        response = {};
      } else if (quote === null || quote === undefined) {
        console.log('no quote data');
        response = {};
      } else {
      const keys = Object.keys(quote);
        response = keys.map(key => {
          if (key && quote[key]) {
            const q = quote[key];
            // console.log(q)
            // q.recommendationTrend.trend.forEach(item => console.log(item))
            return {[key]: {
              price: q.price.regularMarketPrice,
              bid: q.summaryDetail.bid,
              bidSize: q.summaryDetail.bidSize,
              ask: q.summaryDetail.ask,
              askSize: q.summaryDetail.askSize,
              prevClose: q.summaryDetail.previousClose,
              volume: q.summaryDetail.volume,
              averageVolume: q.summaryDetail.averageVolume,
              exchangeDataDelayedBy: q.price.exchangeDataDelayedBy,
              shortName: q.price.shortName,
              exchangeName: q.price.exchangeName,
              change: q.price.regularMarketChange,
              symbol: q.price.symbol,
              bookValue: q.defaultKeyStatistics.bookValue,
              open: q.summaryDetail.open,
              regularMarketChangePercent: q.price.regularMarketChangePercent,
              beta: q.summaryDetail.beta,
              SMA50: q.summaryDetail.fiftyDayAverage,
              SMA200: q.summaryDetail.twoHundredDayAverage
            }}
          }
          return {};
        })
      }
      res.send(response)
    })
  } catch (error) {
    console.error('YF error', {error});
    res.send({});
  }


})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
