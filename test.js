const centiva = require('./lib/cjs/index');

run();

async function run() {
    /**
     * create account
     */
    const acc = centiva.AccountUtil.generateAccount(104);
    console.log("Generated account's address: ", acc.address.address);
    console.log("Generated account's privKey: ", acc.privateKey.toString());

    // centiva.AccountUtil.getAccountInfo('TB6Q5EYACWBPCXKGILI6XWCHDRFLTBKUK34IYJQ', 'http://api-01.us-east-1.testnet.symboldev.network:3000');
    // centiva.AccountUtil.getMosaicSent();

    // const result = await centiva.AccountUtil.getTransactions(
    //     'http://api-01.us-east-1.testnet.symboldev.network:3000', 'confirmed', 'TCHBDE-NCLKEB-ILBPWP-3JPB2X-NY64OE-7PYHHE-32I', 1, 1, '2CF403E85507F39E'
    // );
    // console.log(result);

    // const result = await centiva.BlockUtil.getLatestBlock('http://api-01.us-east-1.testnet.symboldev.network:3000');
    // const result = await centiva.BlockchainUtil.getMosaicIdFromNamespace('http://api-01.us-east-1.testnet.symboldev.network:3000', 'symbol.xym');

    /**
     * create tx
     */
    // await centiva.TransactionUtil.sendTransferTransaction(
    //     'http://61.27.29.85:3000',
    //     152, '09E8303C4D6ECB45F8431A1C27380CB91C941F595A2E5AA6384C73F3AD907126',
    //     'TDG7K4QTI4Z6BDVM7LI2OWMCBS6IA5IKKHXXCGY', 'symbol.xym', 100000, 'test create transfer tx from sdk', 100000
    // ).catch(err => {
    //     console.log(err);
    // });

    // console.log(result);
}