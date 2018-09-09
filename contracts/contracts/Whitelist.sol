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

contract Whitelist is owned {
    mapping (address => bool) private whitelist;

    constructor () public {
        whitelist[owner] = true;
    }

    function addToWhitelist(address _addr) public onlyOwner {
        whitelist[_addr] = true;
    }

    function removeFromWhitelist(address _addr) public onlyOwner {
        whitelist[_addr] = false;
    }

    function isOnWhitelist(address _addr) public view returns (bool) {
        return whitelist[_addr];
    }
}