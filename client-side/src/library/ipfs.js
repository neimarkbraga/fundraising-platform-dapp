import IpfsClient from 'ipfs-http-client';

const lsKey = 'ipfsClient';
const clients = {
    'localhost': IpfsClient('localhost', '5001'),
    'infura.io': IpfsClient('ipfs.infura.io', '5001', {protocol: 'https'})
};

let getSelectedClientName = () => {
    let name = window.localStorage.getItem(lsKey);
    if(!clients[name]) {
        name = Object.keys(clients)[0];
        setSelectedClientName(name);
    }
    return name;
};
let setSelectedClientName = (name) => {
    if(!clients[name]) throw new Error('Invalid IPFS client name');
    window.localStorage.setItem(lsKey, name);
};
let getSelectedClientInstance = () => {
    let name = getSelectedClientName();
    return clients[name];
};

export default {
    clients,
    getSelectedClientName,
    setSelectedClientName,
    getSelectedClientInstance
};