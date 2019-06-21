pragma solidity ^0.5.4;

import "./SafeMath.sol";

contract CampaignFactory {

    // libraries
    using SafeMath for uint;


    // events
    event NewCampaign(uint campaignId, bytes32 name);


    // structs
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


    // enums
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


    // variables
    Campaign[] public campaigns;
    mapping (uint => address) public campaignToOwner;
    mapping (address => uint) public ownerCampaignCount;


    // functions
    function createCampaign(bytes32 _name, CampaignCategory _category, bytes memory _story, bytes memory _imageHash, uint _targetAmount, uint _duration) public {
        require(_name[0] != 0);
        require(_targetAmount > 0);
        require(_duration > 0);
        uint id = campaigns.push(Campaign(_name, _category, _story, _imageHash, _targetAmount, now + _duration, 0, 0)) - 1;
        campaignToOwner[id] = msg.sender;
        ownerCampaignCount[msg.sender] = ownerCampaignCount[msg.sender].add(1);
        emit NewCampaign(id, _name);
    }

    function isCampaignFinished(uint _campaignId) view public returns (bool) {
        return (campaigns[_campaignId].deadline <= now);
    }

    function getCampaignsCount() view external returns (uint) {
        return campaigns.length;
    }

    function getCampaignsByOwner(address _owner) view external returns (uint[] memory) {
        uint[] memory result = new uint[](ownerCampaignCount[_owner]);
        uint counter = 0;
        for (uint i = 0; i < campaigns.length; i++) {
            if (campaignToOwner[i] == _owner) {
                result[counter] = i;
                counter++;
            }
        }
        return result;
    }

    function getCampaignsFinishStatus() view external returns (bool[] memory) {
        bool[] memory result = new bool[](campaigns.length);
        for (uint i = 0; i < campaigns.length; i++) {
            result[i] = isCampaignFinished(i);
        }
        return result;
    }
}