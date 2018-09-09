pragma solidity ^0.4.10;

contract owned {
    address public owner;

    constructor () public {
        owner = msg.sender;
    }

    modifier onlyOwner {
        require(msg.sender == owner, "onlyOwner");
        _;
    }

    function transferOwnership(address newOwner) public onlyOwner {
        owner = newOwner;
    }
}

contract TokenInterface {
    function mintToken(address target, uint256 mintedAmount) public;
}

contract CarbonCreditFormula {
    function calculateCarbonCredit(uint value) public pure returns (uint);
}

contract SensorReading is owned {
    address target;
    TokenInterface token;
    CarbonCreditFormula formula;

    constructor (address _target, address _token, address _formula) public {
        target = _target;
        token = TokenInterface(_token);
        formula = CarbonCreditFormula(_formula);
    }

    function receiveSensorReading(uint value) public {
        token.mintToken(target, formula.calculateCarbonCredit(value));
    }
}