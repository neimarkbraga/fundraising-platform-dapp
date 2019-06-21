const FundraisingPlatform = artifacts.require('FundraisingPlatform');
const { units, increaseTime } = require('./utils');

contract('Campaign Factory', accounts => {
    let _contract;

    beforeEach(async() => {
        _contract = await FundraisingPlatform.new();
    });

    it('The contract should start with no campaigns.', async() => {
        let count = await _contract.getCampaignsCount.call();
        assert.equal(count.toNumber(), 0);
    });

    it('Does allow anyone to create a campaign.', async() => {
        let beforeCount = (await _contract.ownerCampaignCount.call(accounts[1])).toNumber();
        await _contract.createCampaign('0x4e', 0, '0x4e', '0x4e', 100, 100, {from: accounts[1]});
        let afterCount = (await _contract.ownerCampaignCount.call(accounts[1])).toNumber();
        assert.ok(afterCount > beforeCount);
    });

    it('Does not allow to create campaign with empty name.', async() => {
        try {
            await _contract.createCampaign('0x', 0, '0x4e', '0x4e', 100, 100, {from: accounts[0]});
            assert.fail();
        }
        catch(error) {
            assert.ok(/revert/.test(error.message));
        }
    });

    it('Does not allow to create campaign with 0 target amount.', async() => {
        try {
            await _contract.createCampaign('0x4e', 0, '0x4e', '0x4e', 0, 100, {from: accounts[0]});
            assert.fail();
        }
        catch(error) {
            assert.ok(/revert/.test(error.message));
        }
    });

    it('Does not allow to create campaign with 0 duration.', async() => {
        try {
            await _contract.createCampaign('0x4e', 0, '0x4e', '0x4e', 100, 0, {from: accounts[0]});
            assert.fail();
        }
        catch(error) {
            assert.ok(/revert/.test(error.message));
        }
    });

    it('Does count campaigns of each user', async() => {
        let a_before = (await _contract.ownerCampaignCount.call(accounts[0])).toNumber();
        await _contract.createCampaign('0x4e', 0, '0x4e', '0x4e', 100, 100, {from: accounts[0]});
        await _contract.createCampaign('0x4e', 0, '0x4e', '0x4e', 100, 100, {from: accounts[0]});
        let a_after = (await _contract.ownerCampaignCount.call(accounts[0])).toNumber();
        assert.equal(a_before + 2, a_after);


        let b_before = (await _contract.ownerCampaignCount.call(accounts[1])).toNumber();
        await _contract.createCampaign('0x4e', 0, '0x4e', '0x4e', 100, 100, {from: accounts[1]});
        let b_after = (await _contract.ownerCampaignCount.call(accounts[1])).toNumber();
        assert.equal(b_before + 1, b_after);
    });

    it('Does keep track owner of campaigns', async() => {
        await _contract.createCampaign('0x4e', 0, '0x4e', '0x4e', 100, 100, {from: accounts[0]});
        let owner = await _contract.campaignToOwner.call(0);
        assert.equal(accounts[0], owner);
    });

    it('[TIME TRAVEL] Can check if a campaign has already finished', async() => {
        await _contract.createCampaign('0x4e', 0, '0x4e', '0x4e', 100, units.DAY, {from: accounts[0]});
        assert.equal(await _contract.isCampaignFinished.call(0), false);
        await increaseTime(units.DAY);
        assert.equal(await _contract.isCampaignFinished.call(0), true);
    });

    it('Can get the list of campaigns owned by a user', async() => {
        await _contract.createCampaign('0x4e', 0, '0x4e', '0x4e', 100, 100, {from: accounts[0]});
        await _contract.createCampaign('0x4e', 0, '0x4e', '0x4e', 100, 100, {from: accounts[1]});
        let list = await _contract.getCampaignsByOwner.call(accounts[0], {from: accounts[1]});
        assert.equal(list.length, 1);
    });

    it('[TIME TRAVEL] Can get the finished status of each campaigns', async() => {
        await _contract.createCampaign('0x4e', 0, '0x4e', '0x4e', 100, units.DAY, {from: accounts[0]});
        await _contract.createCampaign('0x4e', 0, '0x4e', '0x4e', 100, units.DAY * 2, {from: accounts[0]});
        await _contract.createCampaign('0x4e', 0, '0x4e', '0x4e', 100, units.DAY * 3, {from: accounts[0]});
        await increaseTime(units.DAY);
        let list = await _contract.getCampaignsFinishStatus.call();
        assert.equal(list.length, 3);
        assert.equal(list[0], true);
        assert.equal(list[1], false);
        assert.equal(list[2], false);
    });
});