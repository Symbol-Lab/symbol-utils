import { Account, Address, Deadline, Mosaic, NamespaceId, NetworkType, PlainMessage, RepositoryFactoryHttp, TransactionService, TransferTransaction, UInt64 } from "symbol-sdk";
import { map, mergeMap } from 'rxjs/operators';
import * as config from './NetworkConfig';

export class TransactionUtil {
    public static async sendTransferTransaction(
        nodeUrl: string,
        networkType: NetworkType,
        privateKey: string,
        recipientAddress: string, 
        namespaceId: string, amount: number, 
        plainMessage: string, 
        maxFee: number
    ) {
        const aliasedMosaic = await this.getMosaicFromNamespace(namespaceId, amount);
        // const transferTransaction = await this.createTransferTransaction(networkType, recipientAddress, aliasedMosaic, plainMessage, maxFee);
        // console.log('transferTransaction: ', transferTransaction);
        // const account = Account.createFromPrivateKey(privateKey, networkType);
        const networkGenerationHash = config.networkConfig[networkType].networkConfigurationDefaults.generationHash;
        // const signedTransaction = account.sign(transferTransaction, networkGenerationHash);
        // console.log(signedTransaction.hash);
        const repositoryFactory = new RepositoryFactoryHttp(nodeUrl);
        // const receiptHttp = repositoryFactory.createReceiptRepository();
        const transactionHttp = repositoryFactory.createTransactionRepository();
        // const listener = repositoryFactory.createListener();
        // const transactionService = new TransactionService(transactionHttp, receiptHttp);

        // listener.open().then(() => {
        // transactionService
        //     .announce(signedTransaction, listener)
        //     .pipe(
        //         mergeMap((transaction) =>
        //             transactionService.resolveAliases([transaction.transactionInfo!.hash!]),
        //         ),
        //         map((transactions) => transactions[0] as TransferTransaction),
        //     )
        //     .subscribe(
        //         (transaction) => {
        //             console.log('Resolved MosaicId: ', transaction.mosaics[0].id.toHex());
        //             listener.close();
        //         },
        //         (err) => console.log(err),
        //     );
        // });

        const transferTransaction = await this.createTransferTransaction(networkType, recipientAddress, aliasedMosaic, plainMessage, maxFee);
        // replace with sender private key
        const account = Account.createFromPrivateKey(privateKey, networkType);
        const signedTransaction = account.sign(
        transferTransaction,
        networkGenerationHash,
        );
        console.log('Payload:', signedTransaction.payload);
        console.log('Transaction Hash:', signedTransaction.hash);

        const response = await transactionHttp
        .announce(signedTransaction)
        .toPromise();
        console.log(response);
    }

    public static async getMosaicFromNamespace(namespaceId: string, amount: number) {
        const aliasedMosaic = new Mosaic(
            new NamespaceId(namespaceId),
            UInt64.fromUint(amount),
        );
        return aliasedMosaic;
    }

    public static async createTransferTransaction(networkType: NetworkType, recipientAddress: string, aliasedMosaic: Mosaic, plainMessage: string, maxFee: number) {
        return TransferTransaction.create(
            Deadline.create(config.networkConfig[networkType].networkConfigurationDefaults.epochAdjustment),
            Address.createFromRawAddress(recipientAddress),
            [aliasedMosaic],
            PlainMessage.create(plainMessage),
            networkType,
            UInt64.fromUint(maxFee),
        );
    }
}