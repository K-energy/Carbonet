pragma solidity ^0.4.10;

contract Target {
    string private message;
    address public lastSetter;

    function set(string _msg) public {
        lastSetter = msg.sender;
        message = _msg;
    }

    function get() public view returns (string) {
        return message;
    }
}