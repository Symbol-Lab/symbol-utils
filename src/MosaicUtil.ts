import { Account, AggregateTransaction, Deadline, MosaicDefinitionTransaction, MosaicFlags, MosaicId, MosaicInfo, MosaicNonce, MosaicSupplyChangeAction, MosaicSupplyChangeTransaction, NetworkType, RepositoryFactoryHttp, UInt64 } from "symbol-sdk";
import { NetworkConfig } from './'

export class MosaicUtil {

  public static async createMosaic(
    networkType: NetworkType,
    privateKey: string,
    durationBlock: number,
    isSupplyMutable: boolean,
    isTransferable: boolean,
    isRestrictable: boolean,
    divisibility: number,
    supply: number
  ) {
    const account = Account.createFromPrivateKey(privateKey, networkType);
    // duration (in blocks)
    const duration = UInt64.fromUint(durationBlock);

    const nonce = MosaicNonce.createRandom();
    const mosaicDefinitionTransaction = MosaicDefinitionTransaction.create(
      Deadline.create(NetworkConfig.networkConfig[networkType].networkConfigurationDefaults.epochAdjustment),
      nonce,
      MosaicId.createFromNonce(nonce, account.address),
      MosaicFlags.create(isSupplyMutable, isTransferable, isRestrictable),
      divisibility,
      duration,
      networkType,
    );

    // replace with mosaic units to increase
    const delta = supply;

    const mosaicSupplyChangeTransaction = MosaicSupplyChangeTransaction.create(
      Deadline.create(NetworkConfig.networkConfig[networkType].networkConfigurationDefaults.epochAdjustment),
      mosaicDefinitionTransaction.mosaicId,
      MosaicSupplyChangeAction.Increase,
      UInt64.fromUint(delta * Math.pow(10, divisibility)),
      networkType,
    );

    const aggregateTransaction = AggregateTransaction.createComplete(
      Deadline.create(NetworkConfig.networkConfig[networkType].networkConfigurationDefaults.epochAdjustment),
      [
        mosaicDefinitionTransaction.toAggregate(account.publicAccount),
        mosaicSupplyChangeTransaction.toAggregate(account.publicAccount),
      ],
      networkType,
      [],
      UInt64.fromUint(2000000),
    );
    
    // replace with meta.networkGenerationHash (nodeUrl + '/node/info')
    const networkGenerationHash = NetworkConfig.networkConfig[networkType].networkConfigurationDefaults.generationHash;
    const signedTransaction = account.sign(
      aggregateTransaction,
      networkGenerationHash,
    );
    // replace with node endpoint
    const nodeUrl = NetworkConfig.networkConfig[networkType].nodes[0].url;
    // const nodeUrl = 'http://ngl-dual-101.testnet.symboldev.network:3000';
    const repositoryFactory = new RepositoryFactoryHttp(nodeUrl);
    const transactionHttp = repositoryFactory.createTransactionRepository();
    
    console.log('signedTransaction hash: ', signedTransaction.hash);
    transactionHttp.announce(signedTransaction).subscribe(
      (x) => console.log(x),
      (err) => console.error(err),
    );
  }

  public static async getMosaicInfo(nodeUrl: string, mosaicIdHex: string): Promise<MosaicInfo> {
    return new Promise((resolve, reject) => {
      const mosaicId = new MosaicId(mosaicIdHex);
      const repositoryFactory = new RepositoryFactoryHttp(nodeUrl);
      const mosaicHttp = repositoryFactory.createMosaicRepository();

      mosaicHttp.getMosaic(mosaicId).subscribe(
        (mosaicInfo) => resolve(mosaicInfo),
        (err) => reject(err),
      );
    })
  }
}
