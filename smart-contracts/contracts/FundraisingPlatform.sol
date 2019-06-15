pragma solidity ^0.5.4;

import "./Ownable.sol";
import "./CampaignOwnership.sol";

contract FundraisingPlatform is CampaignOwnership, Ownable {

    uint private receivedDonation;

    function donateToPlatform() payable public {
        receivedDonation = receivedDonation.add(msg.value);
    }

    function getReceivedDonation() view public onlyOwner returns (uint) {
        return receivedDonation;
    }

    function withdrawReceivedDonation() public onlyOwner {
        msg.sender.transfer(receivedDonation);
        receivedDonation = 0;
    }
}