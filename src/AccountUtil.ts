import { Account, Address, MosaicId, NetworkType, RepositoryFactoryHttp, TransactionGroup, TransactionType, TransferTransaction } from 'symbol-sdk';
import { map, mergeMap, filter, toArray } from 'rxjs/operators';
import { MosaicUtil } from './'

export class AccountUtil {
   public static generateAccount(networkType: NetworkType) {
        const account = Account.generateNewAccount(networkType);
        return account;
    }

    public static generateNewAccountWithPrivateKey(privateKey: string, networkType: NetworkType) {
        const account = Account.createFromPrivateKey(privateKey, networkType);
        return account;
    }

    public static async getAccountInfo(nodeUrl: string, rawAddress: string) {
        const address = Address.createFromRawAddress(rawAddress);
        const repositoryFactory = new RepositoryFactoryHttp(nodeUrl);
        const accountHttp = repositoryFactory.createAccountRepository();
        return await accountHttp.getAccountInfo(address).toPromise();
    }

    public static async getMosaicSent(options: {
        nodeUrl: string, signerPubKey: string, recipientRawAddress: string, mosaicIdHex: string
    }) {
        const signerPublicKey = options.signerPubKey;
        const recipientAddress = options.recipientRawAddress ? Address.createFromRawAddress(options.recipientRawAddress) : undefined;
        const mosaicInfo = await MosaicUtil.getMosaicInfo(options.nodeUrl, options.mosaicIdHex);
        const divisibility = mosaicInfo.divisibility;
        const mosaicId = options.mosaicIdHex ? new MosaicId(options.mosaicIdHex) : undefined;
        const repositoryFactory = new RepositoryFactoryHttp(options.nodeUrl);
        const transactionHttp = repositoryFactory.createTransactionRepository();

        const searchCriteria = {
            group: TransactionGroup.Confirmed,
            signerPublicKey,
            recipientAddress,
            pageSize: 100,
            pageNumber: 1,
            type: [TransactionType.TRANSFER],
        };

        transactionHttp
        .search(searchCriteria)
        .pipe(
        map((_) => _.data),
        // Process each transaction individually.
        mergeMap((_) => _),
        // Map transaction as transfer transaction.
        map((_) => _ as TransferTransaction),
        // Filter transactions containing a given mosaic
        filter((_) => mosaicId ? _.mosaics.length === 1 && _.mosaics[0].id.equals(mosaicId) : true),
        // Transform absolute amount to relative amount.
        map((_) => _.mosaics[0].amount.compact() / Math.pow(10, divisibility)),
        // Add all amounts into an array.
        toArray(),
        // Sum all the amounts.
        map((_) => _.reduce((a: any, b: any) => a + b, 0)),
        )
        .subscribe(
            (total) =>
                console.log(
                'Total:',
                total,
                ),
            (err) => console.error(err),
        );
    }

    public static async getTransactions(nodeUrl: string, group: TransactionGroup, rawAddress: string, pageNumber: number, pageSize: number, id?: string) {
        const address = Address.createFromRawAddress(rawAddress);
        const repositoryFactory = new RepositoryFactoryHttp(nodeUrl);
        const transactionHttp = repositoryFactory.createTransactionRepository();
        const searchCriteria = {
            group: group,
            address,
            pageNumber: pageNumber,
            pageSize: pageSize,
            id: id
        };
        const page = await transactionHttp.search(searchCriteria).toPromise();
        return page.data;
    }

    public static getWalletAddressFromPublicKey(publicKey: string, network: NetworkType) {
        return Address.createFromPublicKey(publicKey, network);
    }

    public static isAddressValid(rawAddress: string) {
        return Address.isValidRawAddress(rawAddress);
    }
}