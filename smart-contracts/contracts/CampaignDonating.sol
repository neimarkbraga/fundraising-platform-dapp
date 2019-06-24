pragma solidity ^0.5.4;

import "./CampaignOwnership.sol";

contract CampaignDonating is CampaignOwnership {

    // events
    event NewCampaignDonation(uint campaignId, address donor, bytes32 message, uint value, uint timestamp,  uint totalRaised);


    // structs
    struct CampaignDonation {
        address donor;
        bytes32 message;
        uint value;
        uint timestamp;
    }


    // modifiers
    modifier onlyCampaignNotFinished(uint _campaignId) {
        require(!isCampaignFinished(_campaignId));
        _;
    }


    // variables
    mapping(uint => CampaignDonation[]) public campaignDonations;


    // functions
    function donateToCampaign(uint _campaignId, bytes32 _message) payable external onlyCampaignNotFinished(_campaignId) {
        Campaign storage myCampaign = campaigns[_campaignId];
        myCampaign.raised = myCampaign.raised.add(msg.value);
        myCampaign.balance = myCampaign.balance.add(msg.value);
        campaignDonations[_campaignId].push(CampaignDonation(msg.sender, _message, msg.value, now));
        emit NewCampaignDonation(_campaignId, msg.sender, _message, msg.value, now, myCampaign.raised);
    }

    function getCampaignDonations(uint _campaignId) view external returns (address[] memory donors, bytes32[] memory  messages, uint[] memory values, uint[] memory timestamps) {
        CampaignDonation[] storage donations = campaignDonations[_campaignId];
        address[] memory donors_result = new address[](donations.length);
        bytes32[] memory messages_result = new bytes32[](donations.length);
        uint[] memory values_result = new uint[](donations.length);
        uint[] memory timestamps_result = new uint[](donations.length);
        for(uint i = 0; i < donations.length; i++) {
            donors_result[i] = donations[i].donor;
            messages_result[i] = donations[i].message;
            values_result[i] = donations[i].value;
            timestamps_result[i] = donations[i].timestamp;
        }
        return (donors_result, messages_result, values_result, timestamps_result);
    }
}