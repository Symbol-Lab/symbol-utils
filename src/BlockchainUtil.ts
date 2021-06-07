import { NamespaceId, RepositoryFactoryHttp, UInt64 } from 'symbol-sdk';

export class BlockchainUtil {
    public static async getBlockByHeight(nodeUrl: string, height: number) {
        const repositoryFactory = new RepositoryFactoryHttp(nodeUrl);
        const blockHttp = repositoryFactory.createBlockRepository();
        return await blockHttp.getBlockByHeight(UInt64.fromUint(height)).toPromise();
    }

    public static async getGenesisBlock(nodeUrl: string) {
        return await this.getBlockByHeight(nodeUrl, 1);
    }

    public static async getLatestBlockHeight(nodeUrl: string) {
        const repositoryFactory = new RepositoryFactoryHttp(nodeUrl);
        const chainHttp = repositoryFactory.createChainRepository();
        const info = await chainHttp.getChainInfo().toPromise();
        return info.height.compact();
    }

    public static async getLatestBlock(nodeUrl: string) {
        const blockheight = await this.getLatestBlockHeight(nodeUrl);
        return await this.getBlockByHeight(nodeUrl, blockheight);
    }

    public static async getMosaicIdFromNamespace(nodeUrl: string, namespace: string) {
        const namespaceId = new NamespaceId(namespace);
        const repositoryFactory = new RepositoryFactoryHttp(nodeUrl);
        const namespaceHttp = repositoryFactory.createNamespaceRepository();
        const mosaicId = await namespaceHttp.getLinkedMosaicId(namespaceId).toPromise();
        return mosaicId?.toHex();
    }
}