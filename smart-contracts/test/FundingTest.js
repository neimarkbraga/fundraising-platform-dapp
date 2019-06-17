const FundraisingPlatform = artifacts.require('FundraisingPlatform');
const { increaseTime } = require('./utils');

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
const DAY = 3600 * 12;

contract('Fundraising Platform', accounts => {
    const [firstAccount, secondAccount, thirdAccount] = accounts;
    let _contract;

    beforeEach(async() => {
        _contract = await FundraisingPlatform.new();
    });

    // Campaign Factory
    it('The contract should start with no campaigns.', async() => {
        try {
            await _contract.campaigns.call(0);
            assert.fail();
        }
        catch(error) {
            assert.ok(true);
        }
    });

    it('Does allow anyone to create a campaign.', async() => {
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


    // Campaign Donating
    it('Does accept donation for campaign before deadline.', async() => {
        let value = 100;

        await _contract.createCampaign('0x4e', '0x4e', '0x4e', 100, 100, {from: firstAccount});
        let raised_before_donate = (await _contract.campaigns.call(0)).raised.toNumber();
        let balance_before_donate = (await _contract.campaigns.call(0)).balance.toNumber();


        await _contract.donate(0, {from: secondAccount, value: value});
        let raised_after_donate = (await _contract.campaigns.call(0)).raised.toNumber();
        let balance_after_donate = (await _contract.campaigns.call(0)).raised.toNumber();

        assert.equal(raised_before_donate + value, raised_after_donate);
        assert.equal(balance_before_donate + value, balance_after_donate);
        assert.equal(raised_after_donate, balance_after_donate);
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


    // Campaign Helper
    it('Does allow campaign owner to claim/withdraw funds after deadline', async() => {
        await _contract.createCampaign('0x4e', '0x4e', '0x4e', 100, DAY, {from: firstAccount});
        await _contract.donate(0, {from: secondAccount, value: 100});
        await increaseTime(DAY);
        await _contract.claimRaised(0, {from: firstAccount});
        let campaign = await _contract.campaigns.call(0);
        assert.equal(campaign.balance.toNumber(), 0);
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

    it('Does allow campaign owner to update campaign story', async() => {
        let newStoryValue = '0x48656c6c6f20576f6c726421';
        await _contract.createCampaign('0x4e', '0x4e', '0x4e', 100, DAY, {from: firstAccount});
        await _contract.updateStory(0, newStoryValue, {from: firstAccount});
        let campaign = await _contract.campaigns.call(0);
        assert.equal(newStoryValue, campaign.story);
    });

    it('Does not allow non-owner of campaign to update campaign story', async() => {
        try {
            let newStoryValue = '0x48656c6c6f20576f6c726421';
            await _contract.createCampaign('0x4e', '0x4e', '0x4e', 100, DAY, {from: firstAccount});
            await _contract.updateStory(0, newStoryValue, {from: secondAccount});
            assert.fail();
        }
        catch(error) {
            assert.ok(/revert/.test(error.message));
        }
    });

    it('Does allow campaign owner to update campaign image', async() => {
        let newStoryValue = '0x48656c6c6f20576f6c726421';
        await _contract.createCampaign('0x4e', '0x4e', '0x4e', 100, DAY, {from: firstAccount});
        await _contract.updateImageHash(0, newStoryValue, {from: firstAccount});
        let campaign = await _contract.campaigns.call(0);
        assert.equal(newStoryValue, campaign.imageHash);
    });

    it('Does not allow non-owner of campaign to update campaign image', async() => {
        try {
            let newStoryValue = '0x48656c6c6f20576f6c726421';
            await _contract.createCampaign('0x4e', '0x4e', '0x4e', 100, DAY, {from: firstAccount});
            await _contract.updateImageHash(0, newStoryValue, {from: secondAccount});
            assert.fail();
        }
        catch(error) {
            assert.ok(/revert/.test(error.message));
        }
    });

    it('Does allow campaign owner to extend deadline before deadline', async() => {
        await _contract.createCampaign('0x4e', '0x4e', '0x4e', 100, DAY, {from: firstAccount});
        let deadline_before = (await _contract.campaigns.call(0)).deadline.toNumber();
        await _contract.extendDeadline(0, 100, {from: firstAccount});
        let deadline_after = (await _contract.campaigns.call(0)).deadline.toNumber();
        assert.equal(deadline_before + 100, deadline_after);
    });

    it('Does not allow campaign owner to extend deadline after deadline', async() => {
        try {
            await _contract.createCampaign('0x4e', '0x4e', '0x4e', 100, DAY, {from: firstAccount});
            await increaseTime(DAY);
            await _contract.extendDeadline(0, 100, {from: firstAccount});
            assert.fail();
        }
        catch(error) {
            assert.ok(/revert/.test(error.message));
        }
    });

    it('Does not allow non-owner of campaign to extend deadline', async() => {
        try {
            await _contract.createCampaign('0x4e', '0x4e', '0x4e', 100, DAY, {from: firstAccount});
            await _contract.extendDeadline(0, 100, {from: secondAccount});
            assert.fail();
        }
        catch(error) {
            assert.ok(/revert/.test(error.message));
        }
    });

    it('Can get the list of campaigns owned by an owner', async() => {
        await _contract.createCampaign('0x4e', '0x4e', '0x4e', 100, DAY, {from: firstAccount});
        await _contract.createCampaign('0x4e', '0x4e', '0x4e', 100, DAY, {from: secondAccount});
        let list = await _contract.getCampaignsByOwner.call(firstAccount, {from: secondAccount});
        assert.equal(list.length, 1);
    });

    it('Can get the finished status of each campaigns', async() => {
        await _contract.createCampaign('0x4e', '0x4e', '0x4e', 100, DAY, {from: firstAccount});
        await _contract.createCampaign('0x4e', '0x4e', '0x4e', 100, DAY * 2, {from: secondAccount});
        await _contract.createCampaign('0x4e', '0x4e', '0x4e', 100, DAY * 3, {from: thirdAccount});
        await increaseTime(DAY);
        let list = await _contract.getCampaignsFinishStatus.call({from: secondAccount});
        assert.equal(list.length, 3);
        assert.equal(list[0], true);
        assert.equal(list[1], false);
        assert.equal(list[2], false);
    });


    // Campaign Ownership
    it('Does allow anyone to see how many campaign does an owner have', async() => {
        await _contract.createCampaign('0x4e', '0x4e', '0x4e', 100, DAY, {from: firstAccount});
        let count = await _contract.balanceOf.call(firstAccount, {from: secondAccount});
        assert.equal(count, 1);
    });

    it('Does allow anyone to see the owner of campaign.', async() => {
        await _contract.createCampaign('0x4e', '0x4e', '0x4e', 100, 100, {from: firstAccount});
        let firstCreatedCampaignOwner = await _contract.ownerOf.call(0);
        assert.equal(firstCreatedCampaignOwner, firstAccount);
    });

    it('Does allow campaign owner to transfer campaign ownership', async() => {
        await _contract.createCampaign('0x4e', '0x4e', '0x4e', 100, DAY, {from: firstAccount});
        await _contract.transferFrom(firstAccount, secondAccount, 0, {from: firstAccount});
        let new_owner = await _contract.campaignToOwner.call(0);
        assert.equal(new_owner, secondAccount);
    });

    it('Does allow campaign owner approve an address to transfer campaign ownership', async() => {
        await _contract.createCampaign('0x4e', '0x4e', '0x4e', 100, DAY, {from: firstAccount});
        await _contract.approve(thirdAccount, 0, {from: firstAccount});
        await _contract.transferFrom(firstAccount, secondAccount, 0, {from: thirdAccount});
        let new_owner = await _contract.campaignToOwner.call(0);
        assert.equal(new_owner, secondAccount);

        try {
            await _contract.transferFrom(secondAccount, thirdAccount, 0, {from: thirdAccount});
            assert.fail();
        }
        catch(error) {
            assert.ok(/revert/.test(error.message));
        }
    });

    it('Does not allow non-owner of campaign approve an address to transfer campaign ownership', async() => {
        try {
            await _contract.createCampaign('0x4e', '0x4e', '0x4e', 100, DAY, {from: firstAccount});
            await _contract.approve(thirdAccount, 0, {from: secondAccount});
            assert.fail();
        }
        catch(error) {
            assert.ok(/revert/.test(error.message));
        }
    });

    it('Does not allow non-owner of campaign or not approved address to transfer campaign ownership', async() => {
        try {
            await _contract.createCampaign('0x4e', '0x4e', '0x4e', 100, DAY, {from: firstAccount});
            await _contract.transferFrom(firstAccount, secondAccount, 0, {from: thirdAccount});
            assert.fail();
        }
        catch(error) {
            assert.ok(/revert/.test(error.message));
        }
    });

    it('Does not allow transfer campaign ownership if token did not match from', async() => {
        try {
            await _contract.createCampaign('0x4e', '0x4e', '0x4e', 100, DAY, {from: firstAccount});
            await _contract.transferFrom(thirdAccount, secondAccount, 0, {from: firstAccount});
            assert.fail();
        }
        catch(error) {
            assert.ok(/revert/.test(error.message));
        }
    });

    it('Does not allow transfer campaign ownership to 0 address', async() => {
        try {
            await _contract.createCampaign('0x4e', '0x4e', '0x4e', 100, DAY, {from: firstAccount});
            await _contract.transferFrom(firstAccount, ZERO_ADDRESS, 0, {from: firstAccount});
            assert.fail();
        }
        catch(error) {
            assert.ok(/revert/.test(error.message));
        }
    });


    // Fundraising Platform
    it('Does accept donation to platform and allows platform owner to see received donations', async() => {
        _contract = await FundraisingPlatform.new({ from: firstAccount });
        await _contract.donateToPlatform({from: firstAccount, value: 100});
        await _contract.donateToPlatform({from: secondAccount, value: 100});
        let total_received = (await _contract.getReceivedDonation({from: firstAccount})).toNumber();
        assert.equal(total_received, 200);
    });

    it('Does not allow non-owner of platform to see received donations', async() => {
        try {
            _contract = await FundraisingPlatform.new({ from: firstAccount });
            await _contract.donateToPlatform({from: firstAccount, value: 100});
            await _contract.donateToPlatform({from: secondAccount, value: 100});
            await _contract.getReceivedDonation({from: secondAccount});
            assert.fail();
        }
        catch(error) {
            assert.ok(/revert/.test(error.message));
        }
    });

    it('Does allow platform owner to withdraw received donations', async() => {
        _contract = await FundraisingPlatform.new({ from: firstAccount });
        await _contract.donateToPlatform({from: firstAccount, value: 100});
        await _contract.donateToPlatform({from: secondAccount, value: 100});
        await _contract.withdrawReceivedDonation({from: firstAccount});
        let balance = (await _contract.getReceivedDonation({from: firstAccount})).toNumber();
        assert.equal(balance, 0);
    });

    it('Does not allow non-owner of platform to withdraw received donations', async() => {
        try {
            _contract = await FundraisingPlatform.new({ from: firstAccount });
            await _contract.donateToPlatform({from: firstAccount, value: 100});
            await _contract.donateToPlatform({from: secondAccount, value: 100});
            await _contract.withdrawReceivedDonation({from: secondAccount});
            assert.fail();
        }
        catch(error) {
            assert.ok(/revert/.test(error.message));
        }
    });


    // Ownable
    it('Does allow platform owner transfer ownership', async() => {
        _contract = await FundraisingPlatform.new({ from: firstAccount });
        await _contract.transferOwnership(secondAccount, {from: firstAccount});
        let new_owner = await _contract.owner.call();
        assert.equal(new_owner, secondAccount);
    });

    it('Does not allow non-owner of platform transfer ownership', async() => {
        try {
            _contract = await FundraisingPlatform.new({ from: firstAccount });
            await _contract.transferOwnership(secondAccount, {from: secondAccount});
            assert.fail();
        }
        catch(error) {
            assert.ok(/revert/.test(error.message));
        }
    });

    it('Does not allow platform owner transfer ownership to zero address', async() => {
        try {
            _contract = await FundraisingPlatform.new({ from: firstAccount });
            await _contract.transferOwnership(ZERO_ADDRESS, {from: firstAccount});
            assert.fail();
        }
        catch(error) {
            assert.ok(/revert/.test(error.message));
        }
    });
});