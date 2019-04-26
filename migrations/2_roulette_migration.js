const Roulette = artifacts.require("RouletteContract");

module.exports = function(deployer) {
    deployer.deploy(Roulette);
};
