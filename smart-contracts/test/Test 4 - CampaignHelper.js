const FundraisingPlatform = artifacts.require('FundraisingPlatform');
const { units, increaseTime } = require('./utils');


contract('Campaign Helper', accounts => {
    let _contract;

    beforeEach(async() => {
        _contract = await FundraisingPlatform.new();
    });

    it('[TIME TRAVEL] Does allow campaign owner to claim/withdraw balance after deadline', async() => {
        await _contract.createCampaign('0x4e', 0, '0x4e', '0x4e', 100, units.DAY, {from: accounts[0]});
        await _contract.donateToCampaign(0, '0x4e', {from: accounts[1], value: 100});
        await increaseTime(units.DAY);
        await _contract.withdrawCampaignBalance(0, {from: accounts[0]});
        let campaign = await _contract.campaigns.call(0);
        assert.equal(campaign.balance.toNumber(), 0);
    });

    it('Does not allow campaign owner to claim/withdraw funds before deadline', async() => {
        try {
            await _contract.createCampaign('0x4e', 0, '0x4e', '0x4e', 100, units.DAY, {from: accounts[0]});
            await _contract.donateToCampaign(0, '0x4e', {from: accounts[1], value: 100});
            await _contract.withdrawCampaignBalance(0, {from: accounts[0]});
            assert.fail();
        }
        catch(error) {
            assert.ok(/revert/.test(error.message));
        }
    });

    it('[TIME TRAVEL] Does not allow non-owner of campaign to claim/withdraw funds', async() => {
        try {
            await _contract.createCampaign('0x4e', 0, '0x4e', '0x4e', 100, units.DAY, {from: accounts[0]});
            await _contract.donateToCampaign(0, '0x4e', {from: accounts[1], value: 100});
            await increaseTime(units.DAY);
            await _contract.withdrawCampaignBalance(0, {from: accounts[1]});
            assert.fail();
        }
        catch(error) {
            assert.ok(/revert/.test(error.message));
        }
    });

    it('Does allow campaign owner to update campaign story', async() => {
        let newStoryValue = '0x48656c6c6f20576f6c726421';
        await _contract.createCampaign('0x4e', 0, '0x4e', '0x4e', 100, units.DAY, {from: accounts[0]});
        await _contract.updateCampaignStory(0, newStoryValue, {from: accounts[0]});
        let campaign = await _contract.campaigns.call(0);
        assert.equal(newStoryValue, campaign.story);
    });

    it('Does not allow non-owner of campaign to update campaign story', async() => {
        try {
            let newStoryValue = '0x48656c6c6f20576f6c726421';
            await _contract.createCampaign('0x4e', 0, '0x4e', '0x4e', 100, units.DAY, {from: accounts[0]});
            await _contract.updateCampaignStory(0, newStoryValue, {from: accounts[1]});
            assert.fail();
        }
        catch(error) {
            assert.ok(/revert/.test(error.message));
        }
    });

    it('Does allow campaign owner to update campaign image', async() => {
        let newStoryValue = '0x48656c6c6f20576f6c726421';
        await _contract.createCampaign('0x4e', 0, '0x4e', '0x4e', 100, units.DAY, {from: accounts[0]});
        await _contract.updateCampaignImageHash(0, newStoryValue, {from: accounts[0]});
        let campaign = await _contract.campaigns.call(0);
        assert.equal(newStoryValue, campaign.imageHash);
    });

    it('Does not allow non-owner of campaign to update campaign image', async() => {
        try {
            let newStoryValue = '0x48656c6c6f20576f6c726421';
            await _contract.createCampaign('0x4e', 0, '0x4e', '0x4e', 100, units.DAY, {from: accounts[0]});
            await _contract.updateCampaignImageHash(0, newStoryValue, {from: accounts[1]});
            assert.fail();
        }
        catch(error) {
            assert.ok(/revert/.test(error.message));
        }
    });

    it('Does allow campaign owner to extend deadline before deadline', async() => {
        await _contract.createCampaign('0x4e', 0, '0x4e', '0x4e', 100, units.DAY, {from: accounts[0]});
        let deadline_before = (await _contract.campaigns.call(0)).deadline.toNumber();
        await _contract.extendCampaignDeadline(0, 100, {from: accounts[0]});
        let deadline_after = (await _contract.campaigns.call(0)).deadline.toNumber();
        assert.equal(deadline_before + 100, deadline_after);
    });

    it('[TIME TRAVEL] Does not allow campaign owner to extend deadline after deadline', async() => {
        try {
            await _contract.createCampaign('0x4e', 0, '0x4e', '0x4e', 100, units.DAY, {from: accounts[0]});
            await increaseTime(units.DAY);
            await _contract.extendCampaignDeadline(0, 100, {from: accounts[0]});
            assert.fail();
        }
        catch(error) {
            assert.ok(/revert/.test(error.message));
        }
    });

    it('Does not allow non-owner of campaign to extend deadline', async() => {
        try {
            await _contract.createCampaign('0x4e', 0, '0x4e', '0x4e', 100, units.DAY, {from: accounts[0]});
            await _contract.extendCampaignDeadline(0, 100, {from: accounts[1]});
            assert.fail();
        }
        catch(error) {
            assert.ok(/revert/.test(error.message));
        }
    });
});