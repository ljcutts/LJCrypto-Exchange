//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";


interface ILJCryptoNFT {
    function balanceOf(address account, uint256 id) external view returns (uint256);
    function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes memory data) external;
}

interface ILJCryptoToken {
   function balanceOf(address account) external view returns (uint256);
   function transferFrom(address from, address to, uint256 amount) external returns (bool);
   function transfer(address to, uint256 amount) external returns (bool);
} 

contract LJCryptoDAO is ERC1155Holder {
ILJCryptoNFT LJCryptoNFT;
ILJCryptoToken LJCryptoToken;
address immutable owner;
struct Proposal {
    uint256 deadline;
    uint256 yes;
    uint256 no;
    address proposalOwner;
    bytes cidHash;
    bool executed;
    bool proposalApproved;
    mapping(address => bool) votedYet;
}

mapping(address => uint) powerAmount;
mapping(address => bool) public powerAmountNotEmpty;
mapping(uint256 => Proposal) public proposals;
uint256 public numProposals;


constructor(address _ljcryptoNFT, address _ljcryptoToken) payable {
     owner = msg.sender;
     LJCryptoNFT = ILJCryptoNFT(_ljcryptoNFT);
     LJCryptoToken = ILJCryptoToken(_ljcryptoToken);
}

modifier needPower() {
    require(powerAmount[msg.sender] > 0, "You don't have any power to create or vote on proposals");
    _;
}


modifier activeProposalOnly(uint256 proposalIndex) {
    _;
    require(
        proposals[proposalIndex].deadline > block.timestamp,
        "DEADLINE_EXCEEDED"
    );
   
}

modifier inactiveProposalOnly(uint256 proposalIndex) {
    require(
        proposals[proposalIndex].deadline <= block.timestamp,
        "DEADLINE_NOT_EXCEEDED"
    );
    require(
        proposals[proposalIndex].executed == false,
        "PROPOSAL_ALREADY_EXECUTED"
    );
    _;
}


function receivePowerThroughNFT(uint _id) external {
  require(powerAmountNotEmpty[msg.sender] == false, "USE_POWER_FIRST");
  require(LJCryptoNFT.balanceOf(msg.sender, _id) > 0, "BALANCE_EMPTY");
  if(_id == 0) {
      powerAmount[msg.sender]++;
  } else {
    powerAmount[msg.sender] += _id;
  }
  powerAmountNotEmpty[msg.sender] = true;
  LJCryptoNFT.safeTransferFrom(msg.sender, address(this), _id, 1, "");
}

function receivePowerThroughToken(uint _amount) external {
  require(powerAmountNotEmpty[msg.sender] == false, "USE_POWER_FIRST");
  require(LJCryptoToken.balanceOf(msg.sender) >= _amount, "AMOUNT_EXCEEDS_BALANCE");
  require(_amount % 1 ether == 0, "HAVE_TO_BE_DIVISIBLE_BY_1_MATIC");
  powerAmount[msg.sender] += _amount/1e18;
  powerAmountNotEmpty[msg.sender] = true;
  LJCryptoToken.transferFrom(msg.sender, address(this), _amount); 
}

function createProposal(string memory cid)
    external
    needPower
    returns (uint256)
{
    Proposal storage proposal = proposals[numProposals];
    proposal.proposalOwner = msg.sender;
    numProposals++;
    powerAmount[msg.sender]--;
    if(powerAmount[msg.sender] == 0) {
        powerAmountNotEmpty[msg.sender] = false;
    }
    bytes memory encodedCid = abi.encode(cid);
    proposal.cidHash = encodedCid;
    return numProposals - 1;
}


function voteOnProposal(uint256 proposalIndex, uint _vote)
    external
    needPower
    activeProposalOnly(proposalIndex)
{
    require(_vote == 1 || _vote == 2, "1_FOR_YES_2_FOR_NO");
    Proposal storage proposal = proposals[proposalIndex];
    require(proposal.votedYet[msg.sender] == false, "ALREADY_VOTED");
    require(msg.sender != proposal.proposalOwner, "PROPOSAL_OWNER_CANT_VOTE");
    if(_vote == 1) {
        proposal.yes++;
    } else {
        proposal.no++;
    }
    if(proposal.deadline == 0) {
      proposal.deadline = block.timestamp + 24 hours;
    }
    powerAmount[msg.sender]--;
    if(powerAmount[msg.sender] == 0) {
        powerAmountNotEmpty[msg.sender] = false;
    }
    proposal.votedYet[msg.sender] = true;
}

function executeProposal(uint256 proposalIndex)
    external
    inactiveProposalOnly(proposalIndex)
{
    Proposal storage proposal = proposals[proposalIndex];
    require(msg.sender == proposal.proposalOwner, "NOT_CREATOR");
    if (proposal.yes > proposal.no) {
       proposal.proposalApproved = true;
    } 
     proposal.executed = true;
}

function powerBalance() external view returns(uint) {
    return powerAmount[msg.sender];
}

function withdrawTokens(uint _amount) external {
    require(msg.sender == owner, "NOT_OWNER");
     LJCryptoToken.transfer(msg.sender, _amount);
}

function withdrawNFTs(uint _id, uint _amount) external {
    require(msg.sender == owner, "NOT_OWNER");
    LJCryptoNFT.safeTransferFrom(address(this), msg.sender, _id, _amount, "");
}


receive() external payable {}

fallback() external payable {}
}