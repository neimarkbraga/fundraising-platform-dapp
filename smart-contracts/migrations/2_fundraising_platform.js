const FundraisingPlatform = artifacts.require("FundraisingPlatform");

const MINUTE = 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

module.exports = function(deployer, network, accounts) {
    deployer.deploy(FundraisingPlatform).then(async function(contract) {


        let getRandomNumberIn = (min, max) => {
            return Math.floor(Math.random() * (max - min)) + min;
        };
        let getRandomGoal = () => {
            let min = 0.001;
            let max = 50;
            return Number((Math.random() * (max - min) + min).toFixed(3));
        };

        let uploadedImages = [
            'QmcBgiRY5LSHPe8v7i6Ma2QfeLMErWMyAoR3GCHV5KvdgM',
            'Qmc634GS8RoHm8eBpYSaBx5gJFveXmr2oG4XTdMUbtaj84',
            'QmUDgdPfttmjtSCyDpiZh9RXygZJHW5VzW8iZVdhquQ6Ko',
            'QmZSLcgcdTxNxkfEmGQk8UD2MdKTirKH6iVikqUnVFkTnJ',
            'QmZjPHZXj4eVowVEt8QtzjoyiWP1zi9vxb3Zis18fMUA1p',
            'Qmd4Fz51YoJeA78oRFWydGKRTsmzDeuQaALb4FRcdbkwVK',
            'QmRm41kZtsKW4Q8yegCb3fcDUCp9KbawHzn5Z5m55QenNA',
            'QmWhzXgFBp69YvtnA7U8dTPzJxXPKA782zUAqVWv1L551r',
            'QmWgngdqBdmiXdGxJLcs7UB3LyFhk1EDfmkpYZCf9MXkFz',
            'QmQakzMNwrmBjDfMZZyD6rzRsn4vVUSziZRn5QSpHtwSUZ'
        ];
        for(let i = 0; i < uploadedImages.length; i++) {
            await contract.createCampaign(
                web3.utils.stringToHex(`Test Campaign #${i + 1}`),
                getRandomNumberIn(1, 8),
                web3.utils.stringToHex(`Some story of test campaign #${i + 1}`),
                web3.utils.stringToHex(uploadedImages[i]),
                web3.utils.toWei(getRandomGoal().toString(), 'ether'),
                getRandomNumberIn(1, 10) * HOUR,
                {from: accounts[getRandomNumberIn(0, accounts.length)]});
            console.log(`Created campaign ${i + 1}`);
        }

    });
};