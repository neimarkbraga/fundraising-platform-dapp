const CampaignHelper = artifacts.require('CampaignHelper');
const { increaseTime } = require('./utils');

const DAY = 3600 * 12;

contract('Fundraising Platform', accounts => {
    const [firstAccount, secondAccount, thirdAccount] = accounts;
    let _contract;

    beforeEach(async() => {
        _contract = await CampaignHelper.new();
    });

    it('The contract should start with no campaigns.', async() => {
        try {
            await _contract.campaigns.call(0);
            assert.fail();
        }
        catch(error) {
            assert.ok(true);
        }
    });

    it('Anyone can create a campaign.', async() => {
        let beforeCount = (await _contract.ownerCampaignCount.call(secondAccount)).toNumber();
        await _contract.createCampaign('0x4e', '0x4e', '0x4e', 100, 100, {from: secondAccount});
        let afterCount = (await _contract.ownerCampaignCount.call(secondAccount)).toNumber();
        assert.ok(afterCount > beforeCount);
    });

    it('Does not allow to create campaign with empty name.', async() => {
        try {
            await _contract.createCampaign('0x', '0x4e', '0x4e', 100, 100, {from: firstAccount});
            assert.fail();
        }
        catch(error) {
            assert.ok(/revert/.test(error.message));
        }
    });

    it('Does not allow to create campaign with 0 target amount.', async() => {
        try {
            await _contract.createCampaign('0x4e', '0x4e', '0x4e', 0, 100, {from: firstAccount});
            assert.fail();
        }
        catch(error) {
            assert.ok(/revert/.test(error.message));
        }
    });

    it('Does not allow to create campaign with 0 duration.', async() => {
        try {
            await _contract.createCampaign('0x4e', '0x4e', '0x4e', 100, 0, {from: firstAccount});
            assert.fail();
        }
        catch(error) {
            assert.ok(/revert/.test(error.message));
        }
    });

    it('Does keep track owner of each campaign.', async() => {
        await _contract.createCampaign('0x4e', '0x4e', '0x4e', 100, 100, {from: firstAccount});
        let firstCreatedCampaignOwner = await _contract.campaignToOwner.call(0);
        assert.equal(firstCreatedCampaignOwner, firstAccount);
    });

    it('Does keep track campaign count of each owner.', async() => {
        let a_before = (await _contract.ownerCampaignCount.call(firstAccount)).toNumber();
        let b_before = (await _contract.ownerCampaignCount.call(secondAccount)).toNumber();
        await _contract.createCampaign('0x4e', '0x4e', '0x4e', 100, 100, {from: firstAccount});
        await _contract.createCampaign('0x4e', '0x4e', '0x4e', 100, 100, {from: firstAccount});
        let a_after = (await _contract.ownerCampaignCount.call(firstAccount)).toNumber();
        assert.equal(a_before + 2, a_after);

        await _contract.createCampaign('0x4e', '0x4e', '0x4e', 100, 100, {from: secondAccount});
        let b_after = (await _contract.ownerCampaignCount.call(secondAccount)).toNumber();
        assert.equal(b_before + 1, b_after);
    });

    it('Does accept donation for campaign before deadline.', async() => {
        let value = 100;

        await _contract.createCampaign('0x4e', '0x4e', '0x4e', 100, 100, {from: firstAccount});
        let raised_before_donate = (await _contract.campaigns.call(0)).raised.toNumber();

        await _contract.donate(0, {from: secondAccount, value: value});
        let raised_after_donate = (await _contract.campaigns.call(0)).raised.toNumber();

        assert.equal(raised_before_donate + value, raised_after_donate);
    });

    it('Does not accept donation for campaign after deadline.', async() => {
        try {
            await _contract.createCampaign('0x4e', '0x4e', '0x4e', 100, DAY, {from: firstAccount});
            await increaseTime(DAY);
            await _contract.donate(0, {from: secondAccount, value: 100});
            assert.fail();
        }
        catch(error) {
            assert.ok(/revert/.test(error.message));
        }
    });

    it('Does allow campaign owner to claim/withdraw funds after deadline', async() => {
        await _contract.createCampaign('0x4e', '0x4e', '0x4e', 100, DAY, {from: firstAccount});
        await _contract.donate(0, {from: secondAccount, value: 100});
        await increaseTime(DAY);
        await _contract.claimRaised(0, {from: firstAccount});
        let campaign = await _contract.campaigns.call(0);
        assert.equal(campaign.raised.toNumber(), 0);
    });

    it('Does not allow campaign owner to claim/withdraw funds before deadline', async() => {
        try {
            await _contract.createCampaign('0x4e', '0x4e', '0x4e', 100, DAY, {from: firstAccount});
            await _contract.donate(0, {from: secondAccount, value: 100});
            await _contract.claimRaised(0, {from: firstAccount});
            assert.fail();
        }
        catch(error) {
            assert.ok(/revert/.test(error.message));
        }
    });

    it('Does not allow non-owner of campaign to claim/withdraw funds', async() => {
        try {
            await _contract.createCampaign('0x4e', '0x4e', '0x4e', 100, DAY, {from: firstAccount});
            await _contract.donate(0, {from: secondAccount, value: 100});
            await increaseTime(DAY);
            await _contract.claimRaised(0, {from: secondAccount});
            assert.fail();
        }
        catch(error) {
            assert.ok(/revert/.test(error.message));
        }
    });
});