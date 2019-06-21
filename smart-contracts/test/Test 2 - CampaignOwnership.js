const FundraisingPlatform = artifacts.require('FundraisingPlatform');
const { units } = require('./utils');


contract('Campaign Ownership', accounts => {
    let _contract;

    beforeEach(async() => {
        _contract = await FundraisingPlatform.new();
    });

    it('Does allow anyone to see how many campaigns does a user have', async() => {
        await _contract.createCampaign('0x4e', 0, '0x4e', '0x4e', 100, units.DAY, {from: accounts[0]});
        let count = await _contract.balanceOf.call(accounts[0], {from: accounts[1]});
        assert.equal(count, 1);
    });

    it('Does allow anyone to see the owner of campaign.', async() => {
        await _contract.createCampaign('0x4e', 0, '0x4e', '0x4e', 100, 100, {from: accounts[0]});
        let firstCreatedCampaignOwner = await _contract.ownerOf.call(0);
        assert.equal(firstCreatedCampaignOwner, accounts[0]);
    });

    it('Does allow campaign owner to transfer campaign ownership', async() => {
        await _contract.createCampaign('0x4e', 0, '0x4e', '0x4e', 100, units.DAY, {from: accounts[0]});
        await _contract.transferFrom(accounts[0], accounts[1], 0, {from: accounts[0]});
        let new_owner = await _contract.campaignToOwner.call(0);
        assert.equal(new_owner, accounts[1]);
    });

    it('Does allow campaign owner approve an address to transfer campaign ownership', async() => {
        await _contract.createCampaign('0x4e', 0, '0x4e', '0x4e', 100, units.DAY, {from: accounts[0]});
        await _contract.approve(accounts[2], 0, {from: accounts[0]});
        await _contract.transferFrom(accounts[0], accounts[1], 0, {from: accounts[2]});
        let new_owner = await _contract.campaignToOwner.call(0);
        assert.equal(new_owner, accounts[1]);

        try {
            await _contract.transferFrom(accounts[1], accounts[2], 0, {from: accounts[2]});
            assert.fail();
        }
        catch(error) {
            assert.ok(/revert/.test(error.message));
        }
    });

    it('Does not allow non-owner of campaign approve an address to transfer campaign ownership', async() => {
        try {
            await _contract.createCampaign('0x4e', 0, '0x4e', '0x4e', 100, units.DAY, {from: accounts[0]});
            await _contract.approve(accounts[2], 0, {from: accounts[1]});
            assert.fail();
        }
        catch(error) {
            assert.ok(/revert/.test(error.message));
        }
    });

    it('Does not allow non-owner of campaign or not approved address to transfer campaign ownership', async() => {
        try {
            await _contract.createCampaign('0x4e', 0, '0x4e', '0x4e', 100, units.DAY, {from: accounts[0]});
            await _contract.transferFrom(accounts[0], accounts[1], 0, {from: accounts[2]});
            assert.fail();
        }
        catch(error) {
            assert.ok(/revert/.test(error.message));
        }
    });

    it('Does not allow transfer campaign ownership if token did not match from', async() => {
        try {
            await _contract.createCampaign('0x4e', 0, '0x4e', '0x4e', 100, units.DAY, {from: accounts[0]});
            await _contract.transferFrom(accounts[2], accounts[1], 0, {from: accounts[0]});
            assert.fail();
        }
        catch(error) {
            assert.ok(/revert/.test(error.message));
        }
    });

    it('Does not allow transfer campaign ownership to 0 address', async() => {
        try {
            await _contract.createCampaign('0x4e', 0, '0x4e', '0x4e', 100, units.DAY, {from: accounts[0]});
            await _contract.transferFrom(accounts[0], units.ZERO_ADDRESS, 0, {from: accounts[0]});
            assert.fail();
        }
        catch(error) {
            assert.ok(/revert/.test(error.message));
        }
    });
});