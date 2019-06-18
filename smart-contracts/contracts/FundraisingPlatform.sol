pragma solidity ^0.5.4;

import "./Ownable.sol";
import "./CampaignOwnership.sol";

contract FundraisingPlatform is CampaignOwnership, Ownable {

    event NewPlatformDonation(uint value, uint totalReceived);
    event WithdrawPlaformDonation(uint value);

    uint private receivedDonation;

    function donateToPlatform() payable public {
        receivedDonation = receivedDonation.add(msg.value);
        emit NewPlatformDonation(msg.value, receivedDonation);
    }

    function getReceivedDonation() view public onlyOwner returns (uint) {
        return receivedDonation;
    }

    function withdrawReceivedDonation() public onlyOwner {
        msg.sender.transfer(receivedDonation);
        emit WithdrawPlaformDonation(receivedDonation);
        receivedDonation = 0;
    }
}