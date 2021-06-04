import classNames from 'classnames';
import {useState} from 'react';
const ConfigForm = ({config, updateConfig}) => {

  const [showOptions, setShowOptions] = useState(false)
  const handleUpdateValue = e => {
    updateConfig(e.target)
  }

  const showHiddenOptions = (e) => {
    e.preventDefault();
    setShowOptions(showOptions => !showOptions);
  }

  return (
    <div className="configForm">
      <form>
        <a href="." className="showHideLabel" onClick={showHiddenOptions} role="button">Show/hide options:
          <span className={classNames('showHideOptions', {'up': !showOptions}, {'down': showOptions})}> </span>
        </a>
        <ul className={classNames('configList', {'hidden' : !showOptions})}>
          <li>
            <label>
              Symbol:
              <input type="checkbox" name="showSymbol" onChange={handleUpdateValue} checked={config.showSymbol} />
            </label>
          </li>
          <li>
            <label>
              Change:
              <input type="checkbox" name="showChange" onChange={handleUpdateValue} checked={config.showChange} />
            </label>
          </li>
          <li>
            <label>
              Open:
              <input type="checkbox" name="showOpen" onChange={handleUpdateValue} checked={config.showOpen} />
            </label>
          </li>
          <li>
            <label>
              % Change:
              <input type="checkbox" name="showRegularMarketChangePercent" onChange={handleUpdateValue} checked={config.showRegularMarketChangePercent} />
            </label>
          </li>
          <li>
            <label>
              Bid:
              <input type="checkbox" name="showBid" onChange={handleUpdateValue} checked={config.showBid} />
            </label>
          </li>
          <li>
            <label>
              Bid Size:
              <input type="checkbox" name="showBidSize" onChange={handleUpdateValue} checked={config.showBidSize} />
            </label>
          </li>
          <li>
            <label>
              Asked:
              <input type="checkbox" name="showAsk" onChange={handleUpdateValue} checked={config.showAsk} />
            </label>
          </li>
          <li>
            <label>
              Asked Size:
              <input type="checkbox" name="showAskSize" onChange={handleUpdateValue} checked={config.showAskSize} />
            </label>
          </li>
          <li>
            <label>
              Spread:
              <input type="checkbox" name="showSpread" onChange={handleUpdateValue} checked={config.showSpread} />
            </label>
          </li>
          <li>
            <label>
              Volume:
              <input type="checkbox" name="showVolume" onChange={handleUpdateValue} checked={config.showVolume} />
            </label>
          </li>
          <li>
            <label>
              Previous Close:
              <input type="checkbox" name="showPrevClose" onChange={handleUpdateValue} checked={config.showPrevClose} />
            </label>
          </li>
          <li>
            <label>
              Beta:
              <input type="checkbox" name="showBeta" onChange={handleUpdateValue} checked={config.showBeta} />
            </label>
          </li>
          <li>
            <label>
              Book Value:
              <input type="checkbox" name="showBookValue" onChange={handleUpdateValue} checked={config.showBookValue} />
            </label>
          </li>
          <li>
            <label>
              Exchange Name:
              <input type="checkbox" name="showExchange" onChange={handleUpdateValue} checked={config.showExchange} />
            </label>
          </li>
          <li>
            <label>
              Delay:
              <input type="checkbox" name="showDelay" onChange={handleUpdateValue} checked={config.showDelay} />
            </label>
          </li>
        </ul>
      </form>
    </div>
  )
}

export default ConfigForm;
