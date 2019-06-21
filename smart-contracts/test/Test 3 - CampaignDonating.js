const FundraisingPlatform = artifacts.require('FundraisingPlatform');
const { units, increaseTime } = require('./utils');


contract('Campaign Donating', accounts => {
    let _contract;

    beforeEach(async() => {
        _contract = await FundraisingPlatform.new();
    });

    it('Does accept donation to campaign before deadline.', async() => {
        let value = 100;

        await _contract.createCampaign('0x4e', 0, '0x4e', '0x4e', 100, 100, {from: accounts[0]});
        let raised_before_donate = (await _contract.campaigns.call(0)).raised.toNumber();
        let balance_before_donate = (await _contract.campaigns.call(0)).balance.toNumber();


        await _contract.donateToCampaign(0, '0x4e', {from: accounts[1], value: value});
        let raised_after_donate = (await _contract.campaigns.call(0)).raised.toNumber();
        let balance_after_donate = (await _contract.campaigns.call(0)).raised.toNumber();

        assert.equal(raised_before_donate + value, raised_after_donate);
        assert.equal(balance_before_donate + value, balance_after_donate);
        assert.equal(raised_after_donate, balance_after_donate);
    });

    it('[TIME TRAVEL] Does not accept donation to campaign after deadline.', async() => {
        try {
            await _contract.createCampaign('0x4e', 0, '0x4e', '0x4e', 100, units.DAY, {from: accounts[0]});
            await increaseTime(units.DAY);
            await _contract.donateToCampaign(0, '0x4e', {from: accounts[1], value: 100});
            assert.fail();
        }
        catch(error) {
            assert.ok(/revert/.test(error.message));
        }
    });

    it('Can get campaign donations with the value and message of donors.', async() => {
        await _contract.createCampaign('0x4e', 0, '0x4e', '0x4e', 100, 100, {from: accounts[0]});
        await _contract.donateToCampaign(0, '0x4e', {from: accounts[0], value: 50});
        await _contract.donateToCampaign(0, '0xCA35', {from: accounts[1], value: 100});

        let donations = await _contract.getCampaignDonations.call(0);

        assert.equal(donations.donors[0], accounts[0]);
        assert.equal(donations.donors[1], accounts[1]);
        assert.equal(donations.values[0].toNumber(), 50);
        assert.equal(donations.values[1].toNumber(), 100);
        assert.ok(/^0x4e/i.test(donations.messages[0]));
        assert.ok(/^0xCA35/i.test(donations.messages[1]));
    });
});