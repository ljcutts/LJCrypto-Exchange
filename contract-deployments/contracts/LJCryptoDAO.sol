//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";

/**
 * @dev This is to help establish governance in the LJCrypto-Exchange. Users can use the LJCryptoTokens and the Nfts from the LJCryptoNFTCollection to use as voting power to create, vote, and execute proposals. The tokens and nfts that are transferred to the DAO contract can maybe be distributed back to the DAO contributors or used for other purposes
 */


/**
 * @dev These interfaces are for LJCryptoNFTCollection and LJCryptoToken contract. Only these functions are needed from those contracts.
 */
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
    uint256 deadline; //deadline for user to be able to vote on proposal
    uint256 yes; //amount of yes's for proposal
    uint256 no; //amount of no's for proposal
    address proposalOwner; //owner of proposal
    bytes cidHash; //used to store the CID to fetch proposal from IPFS
    bool executed; //has proposal been executed
    bool proposalApproved; //has proposal been approved
    mapping(address => bool) votedYet; //makes sure that the user only votes once
}

mapping(address => uint) powerAmount; //Stores the voting power
mapping(address => bool) public powerAmountNotEmpty; //Makes sure the user cant increase voting power until the amount they have currently has been used
mapping(uint256 => Proposal) public proposals; //stores the proposals created
uint256 public numProposals; //The number of proposals created


/**
 * @dev Creates an instance of the LJCryptoNFTCollection and LJCryptoToken contracts and sets the deployer as the owner
 */
constructor(address _ljcryptoNFT, address _ljcryptoToken) payable {
     owner = msg.sender;
     LJCryptoNFT = ILJCryptoNFT(_ljcryptoNFT);
     LJCryptoToken = ILJCryptoToken(_ljcryptoToken);
}

/**
 * @dev Makes sure that the user has voting power before being able to interact with proposals
 */
modifier needPower() {
    require(powerAmount[msg.sender] > 0, "You don't have any power to create or vote on proposals");
    _;
}

/**
 * @dev Makes sure that the proposal is still active for user to be able to vote
   @param proposalIndex put in the specific proposal id
 */
modifier activeProposalOnly(uint256 proposalIndex) {
    _;
    require(
        proposals[proposalIndex].deadline > block.timestamp,
        "DEADLINE_EXCEEDED"
    );
   
}

/**
 * @dev Makes sure that the proposal is not active for owner of the proposal to be able to excute
   @param proposalIndex put in the specific proposal id
 */
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

/**
 * @dev The user can put in a tokenID to receive voting power through NFT
   @param _id put in the specific tokenId
 */
function receivePowerThroughNFT(uint _id) external {
  require(powerAmountNotEmpty[msg.sender] == false, "USE_POWER_FIRST");
  require(LJCryptoNFT.balanceOf(msg.sender, _id) > 0, "BALANCE_EMPTY");
  if(_id == 0) {
    //If the tokenID is zero, the user will receive one voting power
      powerAmount[msg.sender]++;
  } else {
    //User will receive voting power equal to the tokenID number
    powerAmount[msg.sender] += _id;
  }
  powerAmountNotEmpty[msg.sender] = true;
  LJCryptoNFT.safeTransferFrom(msg.sender, address(this), _id, 1, ""); //The NFT is sent to the Dao contract
}


/**
 * @dev The user can put in amount of LJCryptoTokens they want to transfer to receive voting power
   @param _amount put in amount of tokens to transfer
 */
function receivePowerThroughToken(uint _amount) external {
  require(powerAmountNotEmpty[msg.sender] == false, "USE_POWER_FIRST");
  require(LJCryptoToken.balanceOf(msg.sender) >= _amount, "AMOUNT_EXCEEDS_BALANCE");
  require(_amount % 1 ether == 0, "HAVE_TO_BE_DIVISIBLE_BY_1_MATIC");
  powerAmount[msg.sender] += _amount/1e18; //User receives power based on amount of tokens transferred, divided by 18 because token has 18 decimals
  powerAmountNotEmpty[msg.sender] = true;
  LJCryptoToken.transferFrom(msg.sender, address(this), _amount); //The tokens are transferred to the Dao contract
}


/**
 * @dev The user can use their voting power to create a proposal
   @param cid The CID of the proposal which is then encoded into bytes
 */
function createProposal(string memory cid)
    external
    needPower
    returns (uint256)
{
    Proposal storage proposal = proposals[numProposals];
    proposal.proposalOwner = msg.sender; //Sets the creater as the proposalOwner
    numProposals++;
    powerAmount[msg.sender]--; //Decreases voting power by one
    if(powerAmount[msg.sender] == 0) {
        //User will be able to obtain more voting power if it is empty after creating proposal
        powerAmountNotEmpty[msg.sender] = false;
    }
    bytes memory encodedCid = abi.encode(cid); //Encodes the CID to bytes and stores it in the struct
    proposal.cidHash = encodedCid;
    return numProposals - 1; //returns the proposal index
}


/**
 * @dev The user can use their voting power to vote on a proposal
   @param proposalIndex specific proposal id to vote on
   @param _vote 2 for yes/agree and 1 for no/disagree
 */
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


/**
 * @dev The user can use their voting power to execute a proposal
   @param proposalIndex specific proposal id to execute
 */
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

/**
 * @dev Returns the voting balance of the caller
 */
function powerBalance() external view returns(uint) {
    return powerAmount[msg.sender];
}

/**
 * @dev Owner of contract can withdraw tokens to their balance
 */
function withdrawTokens(uint _amount) external {
    require(msg.sender == owner, "NOT_OWNER");
     LJCryptoToken.transfer(msg.sender, _amount);
}

/**
 * @dev Owner of contract can withdraw nfts to their balance
 */
function withdrawNFTs(uint _id, uint _amount) external {
    require(msg.sender == owner, "NOT_OWNER");
    LJCryptoNFT.safeTransferFrom(address(this), msg.sender, _id, _amount, "");
}

receive() external payable {}

fallback() external payable {}
}