const centiva = require('./lib/cjs/index');

run();

async function run() {
    /**
     * create account
     */
    // const acc = centiva.AccountUtil.generateAccount(152);
    // console.log("Generated account's address: ", acc.address.address);
    // console.log("Generated account's privKey: ", acc.privateKey.toString());

    /**
     * Get Account info
     */
    // const result = await centiva.AccountUtil.getAccountInfo('https://api-01.dhealth.dev:3001', 'TBEFN3SSXFFEIUOJQLXSZBRJGN56G4XHW647OQQ');
    // console.log(result);
    // centiva.AccountUtil.getMosaicSent({
    //     nodeUrl: 'https://api-01.dhealth.dev:3001',
    //     recipientRawAddress: 'TBEFN3SSXFFEIUOJQLXSZBRJGN56G4XHW647OQQ',
    //     mosaicIdHex: '5A4935C1D66E6AC4'
    // });
    centiva.AccountUtil.getMosaicSent({
        nodeUrl: 'http://61.27.29.85:3000',
        recipientRawAddress: 'TDG7K4QTI4Z6BDVM7LI2OWMCBS6IA5IKKHXXCGY',
        mosaicIdHex: '091F837E059AE13C'
    });

    /**
     * Get mosaic info
     */
    // const result = await centiva.MosaicUtil.getMosaicInfo('https://api-01.dhealth.dev:3001', '5A4935C1D66E6AC4');
    // console.log(result);

    // const result = await centiva.AccountUtil.getTransactions(
    //     'https://api-01.dhealth.dev:3001', 'confirmed', 'TBEFN3SSXFFEIUOJQLXSZBRJGN56G4XHW647OQQ', 1, 1, '5A4935C1D66E6AC4'
    // );
    // const result = await centiva.AccountUtil.getTransactions(
    //     'http://61.27.29.85:3000', 'confirmed', 'TDG7K4QTI4Z6BDVM7LI2OWMCBS6IA5IKKHXXCGY', 1, 2, '091F837E059AE13C'
    // );
    // console.log(JSON.stringify(result));

    // const result = await centiva.BlockchainUtil.getLatestBlock('https://api-01.dhealth.dev:3001');
    // const result = await centiva.BlockchainUtil.getMosaicIdFromNamespace('https://api-01.dhealth.dev:3001', 'dhealth.dhp');
    // console.log(result);

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

    /**
     * Create mosaic
     */
    //  await centiva.MosaicUtil.createMosaic(
    //     152,
    //     '09E8303C4D6ECB45F8431A1C27380CB91C941F595A2E5AA6384C73F3AD907126',
    //     0,
    //     false,
    //     true,
    //     false,
    //     6,
    //     100000000
    // )
}