const FundraisingPlatform = artifacts.require("FundraisingPlatform");

const MINUTE = 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

module.exports = function(deployer, network, accounts) {
    deployer.deploy(FundraisingPlatform).then(async function(contract) {


        let getRandomNumberIn = (min, max) => {
            return Math.floor(Math.random() * (max - min)) + min;
        };
        let uploadedImages = [
            'QmYF5hdefacCZMwEYGH3hroiYpCWEehaq6azygLEHzUDtz',
            'QmYJqcZF9kssfvwguN131Unu4yKmxLzKfEKtwSULkpMaa5',
            'QmPPpQ39pPhyX7fmAKgviYYK2ajjHZs8VHAxtYVdim1sGJ',
            'QmZbF6BdmNkhqCaxwvu8ZnVuPNddcg5u29jRo5UJbMzsry',
            'QmfLijdgjvfoP5rcCMh7ktkAcUXRyNj39kvKiGWrT99Q9B',
            'QmWqbVev7DodVif3Cm7awebekX6f1fsW4Lr51ZESybshJT',
            'QmaTwAxqU7NZ2Y5KQ8Zf5qK5DsGEUiDNYyvXBjoA26YHeb'
        ];
        for(let i = 0; i < uploadedImages.length; i++) {
            await contract.createCampaign(
                web3.utils.stringToHex(`My Campaign #${i + 1}`),
                web3.utils.stringToHex(`Some story of campaign #${i + 1}`),
                web3.utils.stringToHex(uploadedImages[i]),
                web3.utils.toWei(getRandomNumberIn(1, 100).toString(), 'finney'),
                getRandomNumberIn(1, 10) * HOUR,
                {from: accounts[getRandomNumberIn(0, accounts.length)]});
            console.log(`Created campaign ${i + 1}`);
        }

    });
};