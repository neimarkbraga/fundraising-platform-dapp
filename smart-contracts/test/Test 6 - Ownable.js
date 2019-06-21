const FundraisingPlatform = artifacts.require('FundraisingPlatform');
const { units } = require('./utils');


contract('Ownable', accounts => {
    let _contract;

    beforeEach(async() => {
        _contract = await FundraisingPlatform.new();
    });

    it('Does allow platform owner transfer ownership', async() => {
        _contract = await FundraisingPlatform.new({ from: accounts[0] });
        await _contract.transferOwnership(accounts[1], {from: accounts[0]});
        let new_owner = await _contract.owner.call();
        assert.equal(new_owner, accounts[1]);
    });

    it('Does not allow non-owner of platform transfer ownership', async() => {
        try {
            _contract = await FundraisingPlatform.new({ from: accounts[0] });
            await _contract.transferOwnership(accounts[1], {from: accounts[1]});
            assert.fail();
        }
        catch(error) {
            assert.ok(/revert/.test(error.message));
        }
    });

    it('Does not allow platform owner transfer ownership to zero address', async() => {
        try {
            _contract = await FundraisingPlatform.new({ from: accounts[0] });
            await _contract.transferOwnership(units.ZERO_ADDRESS, {from: accounts[0]});
            assert.fail();
        }
        catch(error) {
            assert.ok(/revert/.test(error.message));
        }
    });

    it('Does allow platform owner to renounce ownership', async() => {
        _contract = await FundraisingPlatform.new({ from: accounts[0] });
        await _contract.renounceOwnership({from: accounts[0]});
        let new_owner = await _contract.owner.call();
        assert.equal(new_owner, units.ZERO_ADDRESS);

    });

    it('Does not allow non-owner of platform to renounce ownership', async() => {
        try {
            _contract = await FundraisingPlatform.new({ from: accounts[0] });
            await _contract.renounceOwnership({from: accounts[1]});
            assert.fail();
        }
        catch(error) {
            assert.ok(/revert/.test(error.message));
        }
    });
});