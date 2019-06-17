pragma solidity ^0.5.4;

import "./CampaignDonating.sol";

contract CampaignHelper is CampaignDonating {

    modifier onlyOwnerOf(uint _campaignId) {
        require(msg.sender == campaignToOwner[_campaignId]);
        _;
    }

    function claimRaised(uint _campaignId) external onlyOwnerOf(_campaignId) onlyFinished(_campaignId) {
        Campaign storage myCampaign = campaigns[_campaignId];
        msg.sender.transfer(myCampaign.balance);
        myCampaign.balance = 0;
    }

    function updateStory(uint _campaignId, bytes memory _newStory) public onlyOwnerOf(_campaignId) {
        Campaign storage myCampaign = campaigns[_campaignId];
        myCampaign.story = _newStory;
    }

    function updateImageHash(uint _campaignId, bytes memory _newImageHash) public onlyOwnerOf(_campaignId) {
        Campaign storage myCampaign = campaigns[_campaignId];
        myCampaign.imageHash = _newImageHash;
    }

    function extendDeadline(uint _campaignId, uint _duration) public onlyOwnerOf(_campaignId) onlyNotFinished(_campaignId) {
        Campaign storage myCampaign = campaigns[_campaignId];
        myCampaign.deadline = myCampaign.deadline.add(_duration);
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
            result[i] = _isFinished(i);
        }
        return result;
    }
}