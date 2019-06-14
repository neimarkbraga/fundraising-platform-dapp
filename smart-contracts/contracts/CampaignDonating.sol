pragma solidity ^0.5.4;

import "./CampaignFactory.sol";

contract CampaignDonating is CampaignFactory {

    function _isActive(Campaign storage _campaign) view internal returns (bool) {
        return (now < _campaign.deadline);
    }

    function donate(uint _campaignId) payable public {
        Campaign storage myCampaign = campaigns[_campaignId];
        require(_isActive(myCampaign));
        myCampaign.raised = myCampaign.raised.add(msg.value);
    }
}