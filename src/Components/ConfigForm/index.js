const ConfigForm = ({config, updateConfig}) => {
  const handleUpdateValue = e => {
    updateConfig(e.target)
  }

  return (
    <div className="configForm">
      <form>
        <div className="showHideLabel">Show/hide options:</div>
        <ul className="configList">
          <li>
            <label>
              Change:
              <input type="checkbox" name="showChange" onChange={handleUpdateValue} checked={config.showChange} />
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
              Asked:
              <input type="checkbox" name="showAsk" onChange={handleUpdateValue} checked={config.showAsk} />
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
        <div className="speedWrapper">
          <div className="currentSpeed">Rotation Speed: {config.speed} ('standard' value is 10 ... lower numbers rotate faster)</div>
          <input className="rotationSpeed" type="RANGE" min="0" max="50" step="10" defaultValue={config.speed} name="speed" onChange={handleUpdateValue}/>
        </div>
        <div>
          <label>
            Pause:
            <input type="checkbox" name="pause" onChange={handleUpdateValue} checked={config.pause} />
          </label>
        </div>
      </form>
    </div>
  )
}

export default ConfigForm;
