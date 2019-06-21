pragma solidity ^0.5.4;

import "./CampaignFactory.sol";
import "./ERC721.sol";

contract CampaignOwnership is CampaignFactory, ERC721 {

    // variables
    mapping (uint => address) campaignApprovals;


    // modifiers
    modifier onlyOwnerOf(uint _campaignId) {
        require(msg.sender == campaignToOwner[_campaignId]);
        _;
    }


    // functions
    function _clearApproval(uint256 tokenId) private {
        if (campaignApprovals[tokenId] != address(0)) {
            campaignApprovals[tokenId] = address(0);
        }
    }

    function _transfer(address _from, address _to, uint256 _tokenId) private {
        require(campaignToOwner[_tokenId] == _from, "ERC721: transfer of token that is not own");
        require(_to != address(0), "ERC721: transfer to the zero address");

        _clearApproval(_tokenId);

        ownerCampaignCount[_to] = ownerCampaignCount[_to].add(1);
        ownerCampaignCount[_from] = ownerCampaignCount[_from].sub(1);
        campaignToOwner[_tokenId] = _to;
        emit Transfer(_from, _to, _tokenId);
    }

    function balanceOf(address _owner) external view returns (uint256) {
        return ownerCampaignCount[_owner];
    }

    function ownerOf(uint256 _tokenId) external view returns (address) {
        return campaignToOwner[_tokenId];
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