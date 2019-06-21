pragma solidity ^0.5.4;

import "./CampaignDonating.sol";

contract CampaignHelper is CampaignDonating {

    // events
    event WithdrawCampaignBalance(uint campaignId, uint value);
    event UpdateCampaignStory(uint campaignId, bytes newStory);
    event UpdateCampaignImageHash(uint campaignId, bytes newImageHash);
    event ExtendCampaignDeadline(uint campaignId, uint duration, uint newDeadline);


    // modifiers
    modifier onlyCampaignFinished(uint _campaignId) {
        require(isCampaignFinished(_campaignId));
        _;
    }


    // functions
    function withdrawCampaignBalance(uint _campaignId) external onlyOwnerOf(_campaignId) onlyCampaignFinished(_campaignId) {
        Campaign storage myCampaign = campaigns[_campaignId];
        msg.sender.transfer(myCampaign.balance);
        emit WithdrawCampaignBalance(_campaignId, myCampaign.balance);
        myCampaign.balance = 0;
    }

    function updateCampaignStory(uint _campaignId, bytes memory _newStory) public onlyOwnerOf(_campaignId) {
        Campaign storage myCampaign = campaigns[_campaignId];
        myCampaign.story = _newStory;
        emit UpdateCampaignStory(_campaignId, _newStory);
    }

    function updateCampaignImageHash(uint _campaignId, bytes memory _newImageHash) public onlyOwnerOf(_campaignId) {
        Campaign storage myCampaign = campaigns[_campaignId];
        myCampaign.imageHash = _newImageHash;
        emit UpdateCampaignImageHash(_campaignId, _newImageHash);
    }

    function extendCampaignDeadline(uint _campaignId, uint _duration) external onlyOwnerOf(_campaignId) onlyCampaignNotFinished(_campaignId) {
        Campaign storage myCampaign = campaigns[_campaignId];
        myCampaign.deadline = myCampaign.deadline.add(_duration);
        emit ExtendCampaignDeadline(_campaignId, _duration, myCampaign.deadline);

    }
}