pragma solidity ^0.5.4;

import "./SafeMath.sol";

contract CampaignFactory {

    using SafeMath for uint;

    event NewCampaign(uint campaignId, bytes32 name);

    enum CampaignCategory {
        Animals,
        ArtsAndCulture,
        CommunityAndSocialAction,
        CrisisRelief,
        Education,
        Environment,
        Faith,
        FuneralAndLoss,
        HealthAndMedical,
        PersonalEmergency,
        Sports
    }

    struct Campaign {
        bytes32 name;
        CampaignCategory category;
        bytes story;
        bytes imageHash;
        uint goal;
        uint deadline;
        uint raised;
        uint balance;
    }

    Campaign[] public campaigns;

    mapping (uint => address) public campaignToOwner;
    mapping (address => uint) public ownerCampaignCount;

    function createCampaign(bytes32 _name, CampaignCategory _category, bytes memory _story, bytes memory _imageHash, uint _targetAmount, uint _duration) public {
        require(_name[0] != 0);
        require(_targetAmount > 0);
        require(_duration > 0);
        uint id = campaigns.push(Campaign(_name, _category, _story, _imageHash, _targetAmount, now + _duration, 0, 0)) - 1;
        campaignToOwner[id] = msg.sender;
        ownerCampaignCount[msg.sender] = ownerCampaignCount[msg.sender].add(1);
        emit NewCampaign(id, _name);
    }
}