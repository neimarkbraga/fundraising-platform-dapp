pragma solidity ^0.5.4;

import "./CampaignDonating.sol";

contract CampaignHelper is CampaignDonating {

    event WithdrawCampaignBalance(uint campaignId, uint value);
    event UpdateCampaignStory(uint campaignId, bytes newStory);
    event UpdateCampaignImageHash(uint campaignId, bytes newImageHash);
    event ExtendCampaignDeadline(uint campaignId, uint duration, uint newDeadline);

    modifier onlyOwnerOf(uint _campaignId) {
        require(msg.sender == campaignToOwner[_campaignId]);
        _;
    }

    function withdrawBalance(uint _campaignId) external onlyOwnerOf(_campaignId) onlyFinished(_campaignId) {
        Campaign storage myCampaign = campaigns[_campaignId];
        msg.sender.transfer(myCampaign.balance);
        emit WithdrawCampaignBalance(_campaignId, myCampaign.balance);
        myCampaign.balance = 0;
    }

    function updateStory(uint _campaignId, bytes memory _newStory) public onlyOwnerOf(_campaignId) {
        Campaign storage myCampaign = campaigns[_campaignId];
        myCampaign.story = _newStory;
        emit UpdateCampaignStory(_campaignId, _newStory);
    }

    function updateImageHash(uint _campaignId, bytes memory _newImageHash) public onlyOwnerOf(_campaignId) {
        Campaign storage myCampaign = campaigns[_campaignId];
        myCampaign.imageHash = _newImageHash;
        emit UpdateCampaignImageHash(_campaignId, _newImageHash);
    }

    function extendDeadline(uint _campaignId, uint _duration) public onlyOwnerOf(_campaignId) onlyNotFinished(_campaignId) {
        Campaign storage myCampaign = campaigns[_campaignId];
        myCampaign.deadline = myCampaign.deadline.add(_duration);
        emit ExtendCampaignDeadline(_campaignId, _duration, myCampaign.deadline);

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