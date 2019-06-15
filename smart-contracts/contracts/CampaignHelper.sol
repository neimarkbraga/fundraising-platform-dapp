pragma solidity ^0.5.4;

import "./CampaignDonating.sol";

contract CampaignHelper is CampaignDonating {

    modifier onlyOwnerOf(uint _campaignId) {
        require(msg.sender == campaignToOwner[_campaignId]);
        _;
    }

    function claimRaised(uint _campaignId) external onlyOwnerOf(_campaignId) onlyFinished(_campaignId) {
        Campaign storage myCampaign = campaigns[_campaignId];
        msg.sender.transfer(myCampaign.raised);
        myCampaign.raised = 0;
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
}