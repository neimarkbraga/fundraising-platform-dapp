// source: https://github.com/OpenZeppelin/zeppelin-solidity/blob/master/test/helpers/increaseTime.js
module.exports.increaseTime = function increaseTime(duration) {
    const id = Date.now();

    return new Promise((resolve, reject) => {
        web3.currentProvider.send(
            {
                jsonrpc: "2.0",
                method: "evm_increaseTime",
                params: [duration],
                id: id
            },
            err1 => {
                if (err1) return reject(err1);

                web3.currentProvider.send(
                    {
                        jsonrpc: "2.0",
                        method: "evm_mine",
                        id: id + 1
                    },
                    (err2, res) => {
                        return err2 ? reject(err2) : resolve(res);
                    }
                );
            }
        );
    });
};


const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
const MINUTE = 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;
module.exports.units = {
    ZERO_ADDRESS,
    MINUTE,
    HOUR,
    DAY
};