const express = require('express');
const cors = require('cors');
const Web3 = require('web3');
const app = express();

let web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
let contractBuild = require('../smart-contracts/build/contracts/FundraisingPlatform');
let contractAbi = contractBuild.abi;
let contractAddress = contractBuild.networks["5777"].address;
let TheContract = new web3.eth.Contract(contractAbi, contractAddress);


// enable cross origin
app.use(cors());


// get list of all campaigns
app.get('/campaign', async(req, res, next) => {
    try {
        let query = req.query;
        query.finished = query.finished || null;
        query.sort = query.sort || 'latest';

        let campaignStatuses = await TheContract.methods.getCampaignsFinishStatus.call();
        let result = [];

        for(let i = 0; i < campaignStatuses.length; i++) {
            let includeToResult = true;
            if(query.finished === 'true') includeToResult = campaignStatuses[i] === true;
            else if(query.finished === 'false') includeToResult = campaignStatuses[i] === false;

            if(includeToResult) {
                let campaign = await TheContract.methods.campaigns(i).call();
                result.push({
                    id: i,
                    name: web3.utils.hexToString(campaign.name),
                    story: web3.utils.hexToString(campaign.story),
                    imageHash: web3.utils.hexToString(campaign.imageHash),
                    goal: campaign.goal.toString(),
                    deadline: campaign.deadline.toString(),
                    end_date: new Date(campaign.deadline.toNumber() * 1000).toLocaleString(),
                    raised: campaign.raised.toString(),
                    finished: campaignStatuses[i]
                });
            }
        }
        if(query.sort === 'latest') result.reverse();
        res.json(result);
    } catch(error) {
        next(error);
    }
});


// get profile of campaign
app.get('/campaign/:id', async(req, res, next) => {
    try {
        let params = req.params;
        params.id = parseInt(params.id);

        let campaign = await TheContract.methods.campaigns(params.id).call();
        res.json({
            id: params.id,
            name: web3.utils.hexToString(campaign.name),
            story: web3.utils.hexToString(campaign.story),
            imageHash: web3.utils.hexToString(campaign.imageHash),
            goal: campaign.goal.toString(),
            deadlineEpoch: campaign.deadline.toString(),
            deadlineDate: new Date(campaign.deadline.toNumber() * 1000),
            raised: campaign.raised.toString(),
            finished: campaign.deadline.toNumber() <= Math.floor(new Date().getTime() / 1000),
            owner: await TheContract.methods.campaignToOwner(params.id).call()
        });
    } catch(error) {
        if(/invalid opcode/.test(error.message)) next(new Error('ID does not exist.'));
        else next(error);
    }
});


// get info of participant
app.get('/participant/:address', async(req, res, next) => {
    try {
        let params = req.params;
        let ownedCampaigns = await TheContract.methods.getCampaignsByOwner(params.address).call();
        let platformOwner = await TheContract.methods.owner.call();

        res.json({
            ownedCampaigns: ownedCampaigns.map(a => a.toNumber()),
            isPlatformOwner: platformOwner === params.address
        });
    }
    catch (error) {
        next(error);
    }
});


// handle error
app.use((error, req, res, next) => {
    res.status(500);
    res.json({
        message: error.message || 'An unknown error occurred.'
    });
});


let server = app.listen(86, () => {
    console.log('=================================================');
    console.log(`Server is running @ port ${server.address().port}`);
    console.log('=================================================');
});


/*
(async() => {
    let campaignStatuses = await TheContract.methods.getCampaignsFinishStatus.call();
    for(let i = 0; i < campaignStatuses.length; i++) {
        let campaign = await TheContract.methods.campaigns(i).call();
        console.log({
            name: web3.utils.hexToString(campaign.name),
            story: web3.utils.hexToString(campaign.story),
            imageHash: web3.utils.hexToString(campaign.imageHash),
            goal: campaign.goal.toString(),
            deadline: campaign.deadline.toString(),
            raised: campaign.raised.toString()
        });
    }

})();*/
