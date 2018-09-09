// require the contract
var Token = artifacts.require('./Token.sol')
var Whitelist = artifacts.require('./Whitelist.sol')

var SolarPVCarbonCreditFormula = artifacts.require('./SolarPVCarbonCreditFormula.sol')
var SensorReading = artifacts.require('./SensorReading.sol')

module.exports = function(deployer, network) {
  // deploy the contract with the given constructor arguments
  if(network === 'develop') {
    deployer.deploy(Token, 4332, 'test token', 4, 'TST')
  } else if (network === 'deveth') {
    const source = '0x29f50810dc8749f91b1611c4f4f0333b1b2eabbd'
    web3.personal.unlockAccount(source, '', 600)
    web3.eth.isSyncing(console.log)
    deployer.deploy(Whitelist, {from: source}).then(() => {
        deployer.deploy(Token, 10000000000, 'carbon credits', 9, 'CBC', Whitelist.address, {from: source}).then(() => {
            deployer.deploy(SolarPVCarbonCreditFormula, {from: source}).then(() => {
                deployer.deploy(SensorReading, '0xaa9De66C07F9F6D57E0F488Fe9B7B5b209C87cDd', Token.address, SolarPVCarbonCreditFormula.address, {from: source})
            })
        })
    })
  }
}
