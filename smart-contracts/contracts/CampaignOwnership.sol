pragma solidity ^0.5.4;

import "./CampaignHelper.sol";
import "./ERC721.sol";

contract CampaignOwnership is CampaignHelper, ERC721 {

    mapping (uint => address) campaignApprovals;

    function balanceOf(address _owner) external view returns (uint256) {
        return ownerCampaignCount[_owner];
    }

    function ownerOf(uint256 _tokenId) external view returns (address) {
        return campaignToOwner[_tokenId];
    }

    function _transfer(address _from, address _to, uint256 _tokenId) private {
        ownerCampaignCount[_to] = ownerCampaignCount[_to].add(1);
        ownerCampaignCount[_from] = ownerCampaignCount[_from].sub(1);
        campaignToOwner[_tokenId] = _to;
        emit Transfer(_from, _to, _tokenId);
    }

    function transferFrom(address _from, address _to, uint256 _tokenId) external payable {
        require (campaignToOwner[_tokenId] == msg.sender || campaignApprovals[_tokenId] == msg.sender);
        _transfer(_from, _to, _tokenId);
    }

    function approve(address _approved, uint256 _tokenId) external payable onlyOwnerOf(_tokenId) {
        campaignApprovals[_tokenId] = _approved;
        emit Approval(msg.sender, _approved, _tokenId);
    }
}