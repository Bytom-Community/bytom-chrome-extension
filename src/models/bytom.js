import Bytom from 'bytom-js-sdk'

var networks = {
  testnet: 'https://api-dev.bycoin.im:8000/',
  mainnet: 'https://api.bycoin.im:8000/'
}

var bytom = new Bytom(networks, chrome.runtime.getURL('wasm/main.wasm'))

bytom.sdk.networks = function() {
  return bytom.getNetType()
}

bytom.sdk.setupNet = function(network) {
  bytom.setNetType(network)
}

export default bytom.sdk
