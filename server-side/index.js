const express = require('express');
const cors = require('cors');
const Web3 = require('web3');
const app = express();

let dappConfig = require('../dapp.config');
let web3 = new Web3(new Web3.providers.HttpProvider(dappConfig.web3HttpProvider));
let TheContract = new web3.eth.Contract(dappConfig.contractABI, dappConfig.contractAddress);

let campaignCategories = [
    {
        name: 'Animals',
        description: 'Support animals and pets, humane societies, veterinary organizations and more.'
    },
    {
        name: 'Arts and Culture',
        description: 'Support art, theater, music, film and more.'
    },
    {
        name: 'Community and Social Action',
        description: 'Support community improvement projects, volunteer efforts, hunger relief, human and civil rights organizations and more.'
    },
    {
        name: 'Crisis Relief',
        description: 'Support people recovering from public crises or natural disasters. Help with supplies, medical bills and other needs.'
    },
    {
        name: 'Education',
        description: 'Help with school supplies, books, tuition and scholarships. You can also support education nonprofits promoting student organizations, job training, literacy programs and more.'
    },
    {
        name: 'Environment',
        description: 'Support environmental nonprofits to help preserve and protect natural resources.'
    },
    {
        name: 'Faith',
        description: 'Support religious nonprofits and organizations dedicated to interfaith issues.'
    },
    {
        name: 'Funeral and Loss',
        description: 'Support people experiencing the loss of a loved one by helping with burial, cremation or other end-of-life costs.'
    },
    {
        name: 'Health and Medical',
        description: 'Help with the costs of medical treatments, surgeries and injuries. You can also support health nonprofits funding disease research, treatment programs and more.'
    },
    {
        name: 'Personal Emergency',
        description: 'Support people recovering from personal emergencies like house fires, theft, or car accidents.'
    },
    {
        name: 'Sports',
        description: 'Support people and teams raising money for sports equipment, uniforms, travel costs related to competitions or camps and more.'
    }
];


// enable cross origin
app.use(cors());


// get list of all campaigns
app.get('/campaign', async(req, res, next) => {
    try {
        let query = req.query;
        query.finished = query.finished || null;
        query.owned_by = query.owned_by || null;
        query.category = query.category || null;
        query.sort = query.sort || 'latest';

        let campaignStatuses = await TheContract.methods.getCampaignsFinishStatus.call();
        let allowedIds = null;
        let result = [];

        if(query.owned_by) {
            allowedIds = {};
            try {
                let ids = await TheContract.methods.getCampaignsByOwner(query.owned_by).call();
                for(let i = 0; i < ids.length; i++) allowedIds[ids[i].toNumber()] = true;
            }
            catch (error) {}
        }

        for(let i = 0; i < campaignStatuses.length; i++) {
            let includeToResult = true;

            // finished filter
            if(query.finished === 'true') includeToResult = campaignStatuses[i] === true;
            else if(query.finished === 'false') includeToResult = campaignStatuses[i] === false;

            // owned_by filter
            if(allowedIds && !allowedIds[i]) includeToResult = false;


            if(includeToResult) {
                let campaign = await TheContract.methods.campaigns(i).call();
                let item = {
                    id: i,
                    name: web3.utils.hexToString(campaign.name),
                    category: {
                        id: campaign.category,
                        ...(campaignCategories[campaign.category] || {})
                    },
                    //story: web3.utils.hexToString(campaign.story),
                    imageHash: web3.utils.hexToString(campaign.imageHash),
                    goal: campaign.goal.toString(),
                    deadline: campaign.deadline.toString(),
                    end_date: new Date(campaign.deadline.toNumber() * 1000).toLocaleString(),
                    raised: campaign.raised.toString(),
                    finished: campaignStatuses[i]
                };

                // category filter
                if(query.category && Number(query.category) !== Number(campaign.category)) includeToResult = false;

                if(includeToResult) result.push(item);
            }
        }


        // sort option
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
            category: {
                id: campaign.category,
                ...(campaignCategories[campaign.category] || {})
            },
            story: web3.utils.hexToString(campaign.story),
            imageHash: web3.utils.hexToString(campaign.imageHash),
            goal: campaign.goal.toString(),
            deadlineEpoch: campaign.deadline.toString(),
            deadlineDate: new Date(campaign.deadline.toNumber() * 1000),
            raised: campaign.raised.toString(),
            balance: campaign.balance.toString(),
            finished: campaign.deadline.toNumber() <= Math.floor(new Date().getTime() / 1000),
            owner: await TheContract.methods.campaignToOwner(params.id).call()
        });
    } catch(error) {
        if(/invalid opcode/.test(error.message)) next(new Error('ID does not exist.'));
        else next(error);
    }
});


// get campaign donations
app.get('/campaign/:id/donation', async(req, res, next) => {
    try {
        let params = req.params;
        params.id = parseInt(params.id);

        let donations = await TheContract.methods.getCampaignDonations(params.id).call();

        res.json(donations.donors.map((donor, index) => {
            return {
                donor,
                message: web3.utils.hexToString(donations.messages[index]),
                value: donations.values[index].toString()
            };
        }).reverse());
    } catch(error) {
        if(/invalid opcode/.test(error.message)) next(new Error('ID does not exist.'));
        else next(error);
    }
});


// get list of all categories
app.get('/category', async(req, res) => {
    res.json(campaignCategories.map((category, id) => {
        return {
            id,
            ...category
        };
    }));
});


// get platform details
app.get('/platform/info', async(req, res, next) => {
    try {
        res.json({
            owner: await TheContract.methods.owner.call()
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
