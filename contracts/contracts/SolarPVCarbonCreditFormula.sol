pragma solidity ^0.4.10;

contract CarbonCreditFormula {
    function calculateCarbonCredit(uint value) public pure returns (uint);
}

contract SolarPVCarbonCreditFormula is CarbonCreditFormula {
    function calculateCarbonCredit(uint value) public pure returns (uint) {
        // 0.5661 * value
        return 5661 * value;
    }
}