pragma solidity ^0.5.4;

import "./Ownable.sol";
import "./SafeMath.sol";

contract CampaignFactory is Ownable {

    using SafeMath for uint;

    event NewCampaign(uint campaignId, bytes32 name);

    struct Campaign {
        bytes32 name;
        bytes description;
        bytes imageHash;
        uint targetAmount;
        uint deadline;
        uint raised;
    }

    Campaign[] public campaigns;

    mapping (uint => address) public campaignToOwner;
    mapping (address => uint) public ownerCampaignCount;

    function createCampaign(bytes32 name, bytes memory description, bytes memory imageHash, uint targetAmount, uint duration) public {
        uint id = campaigns.push(Campaign(name, description, imageHash, targetAmount, now + duration, 0)) - 1;
        campaignToOwner[id] = msg.sender;
        ownerCampaignCount[msg.sender] = ownerCampaignCount[msg.sender].add(1);
        emit NewCampaign(id, name);
    }
}