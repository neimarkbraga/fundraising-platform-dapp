const FundraisingPlatform = artifacts.require('FundraisingPlatform');
const { units } = require('./utils');


contract('Fundraising Platform', accounts => {
    let _contract;

    beforeEach(async() => {
        _contract = await FundraisingPlatform.new();
    });

    it('Does accept donation to platform and allows platform owner to see received donations', async() => {
        _contract = await FundraisingPlatform.new({ from: accounts[0] });
        await _contract.donateToPlatform({from: accounts[0], value: 100});
        await _contract.donateToPlatform({from: accounts[1], value: 100});
        let total_received = (await _contract.getReceivedDonation({from: accounts[0]})).toNumber();
        assert.equal(total_received, 200);
    });

    it('Does not allow non-owner of platform to see received donations', async() => {
        try {
            _contract = await FundraisingPlatform.new({ from: accounts[0] });
            await _contract.donateToPlatform({from: accounts[0], value: 100});
            await _contract.donateToPlatform({from: accounts[1], value: 100});
            await _contract.getReceivedDonation({from: accounts[1]});
            assert.fail();
        }
        catch(error) {
            assert.ok(/revert/.test(error.message));
        }
    });

    it('Does allow platform owner to withdraw received donations', async() => {
        _contract = await FundraisingPlatform.new({ from: accounts[0] });
        await _contract.donateToPlatform({from: accounts[0], value: 100});
        await _contract.donateToPlatform({from: accounts[1], value: 100});
        await _contract.withdrawReceivedDonation({from: accounts[0]});
        let balance = (await _contract.getReceivedDonation({from: accounts[0]})).toNumber();
        assert.equal(balance, 0);
    });

    it('Does not allow non-owner of platform to withdraw received donations', async() => {
        try {
            _contract = await FundraisingPlatform.new({ from: accounts[0] });
            await _contract.donateToPlatform({from: accounts[0], value: 100});
            await _contract.donateToPlatform({from: accounts[1], value: 100});
            await _contract.withdrawReceivedDonation({from: accounts[1]});
            assert.fail();
        }
        catch(error) {
            assert.ok(/revert/.test(error.message));
        }
    });
});