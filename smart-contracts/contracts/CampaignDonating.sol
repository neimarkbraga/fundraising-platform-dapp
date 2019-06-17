pragma solidity ^0.5.4;

import "./CampaignFactory.sol";

contract CampaignDonating is CampaignFactory {

    modifier onlyFinished(uint _campaignId) {
        require(_isFinished(_campaignId));
        _;
    }

    modifier onlyNotFinished(uint _campaignId) {
        require(!_isFinished(_campaignId));
        _;
    }

    function _isFinished(uint _campaignId) view internal returns (bool) {
        return (campaigns[_campaignId].deadline <= now);
    }

    function donate(uint _campaignId) payable public onlyNotFinished(_campaignId) {
        Campaign storage myCampaign = campaigns[_campaignId];
        myCampaign.raised = myCampaign.raised.add(msg.value);
        myCampaign.balance = myCampaign.balance.add(msg.value);
    }
}