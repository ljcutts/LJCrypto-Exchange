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
    //users can create one propsal per NFT
    //also can maybe use their LJCryptoToken and maybe do a transfer?
    //users can only vote on a proposal one time
    //once a propsal is created, users have a day to vote on it
ILJCryptoNFT LJCryptoNFT;
ILJCryptoToken LJCryptoToken;
address immutable owner;
struct Proposal {
    uint256 deadline;
    uint256 yes;
    uint256 no;
    address proposalOwner;
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


function receivePowerThroughNFT(uint _id) public {
  require(powerAmountNotEmpty[msg.sender] == false, "You need to use up your proposal power first");
  require(LJCryptoNFT.balanceOf(msg.sender, _id) > 0, "Your balance for this tokenId is 0");
  if(_id == 0) {
      powerAmount[msg.sender] += 1;
  } else {
    powerAmount[msg.sender] += _id;
  }
  powerAmountNotEmpty[msg.sender] = true;
  LJCryptoNFT.safeTransferFrom(msg.sender, address(this), _id, 1, ""); //maybe do transfer instead for the DAO contract to be able to hold  NFTS
}

function receivePowerThroughToken(uint _amount) public {
  require(powerAmountNotEmpty[msg.sender] == false, "You need to use up your proposal power first");
  require(LJCryptoToken.balanceOf(msg.sender) >= _amount, "You don't own this many tokens");
  powerAmount[msg.sender] += _amount;
  powerAmountNotEmpty[msg.sender] = true;
  LJCryptoToken.transferFrom(msg.sender, address(this), _amount); //maybe do transfer instead for the DAO contract to be able to hold tokens
}

//maybe the token can be used to be able to create a proposal
//The one who created the Propsal cannot vote on it
function createProposal()
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
    return numProposals - 1;
}


function voteOnProposal(uint256 proposalIndex, uint _vote)
    external
    needPower
    activeProposalOnly(proposalIndex)
{
    require(_vote == 1 || _vote == 2, "Type in 1 for Yes or type in 2 for No");
    Proposal storage proposal = proposals[proposalIndex];
    require(proposal.votedYet[msg.sender] == false, "You cannot vote again");
    require(msg.sender != proposal.proposalOwner, "You can't vote on your own propsal");
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
    require(msg.sender == proposal.proposalOwner, "Only the creator of the proposal can execute this proposal");
    if (proposal.yes > proposal.no) {
       proposal.proposalApproved = true;
    } 
     proposal.executed = true;
}

function powerBalance() public view returns(uint) {
    return powerAmount[msg.sender];
}

function withdrawTokens(uint _amount) external {
    require(msg.sender == owner, "You are not the owner");
     LJCryptoToken.transfer(msg.sender, _amount);
}

function withdrawNFTs(uint _id, uint _amount) external {
    require(msg.sender == owner, "You are not the owner");
    LJCryptoNFT.safeTransferFrom(address(this), msg.sender, _id, _amount, "");
}


receive() external payable {}

fallback() external payable {}
}