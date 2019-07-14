pragma solidity ^0.5.6;

import "./EmojiToken.sol";

contract EmojiContest is EmojiToken {
    
    uint256 private INIT_AMOUNT = 6;
    uint256 private VOTE_AMOUNT = 1;
    
    address public owner;
    address[] private _entries;
    
    constructor(string memory name, string memory symbol, uint8 decimals) EmojiToken(name, symbol, decimals) public {
        owner = msg.sender;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }
    
    function getEntries() public view returns (address[] memory) {
        return _entries;
    }
    
    // TODO: 중복 등록 막기
    function registerEntry(address entry) external onlyOwner returns (uint256) {
        _entries.push(entry);
        
        return _entries.length - 1;  // return id
    }
    
    function setInitialToken(address user) external onlyOwner {
        // TODO: status 분리
        // 0: 초기상태, 1: 소진상태, 2이상: 투표가능
        require(balanceOf(user) == 0, "This user has been already initialized.");
        
        _transfer(msg.sender, user, INIT_AMOUNT);
    }
    
    function vote(uint256 id) external {
        // 0: 초기상태, 1: 소진상태, 2이상: 투표가능
        require(balanceOf(msg.sender) >= 2, "There is no enough token.");
        
        _transfer(msg.sender, _entries[id], VOTE_AMOUNT);
    }

}