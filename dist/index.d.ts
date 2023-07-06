import { Base } from "./base";
import { NFT } from "./nft";
declare class NFTInternal extends Base {
}
interface NFTInternal extends NFT {
}
declare const _default: {
    NFT: typeof NFTInternal;
};
export default _default;
export declare enum BaseURLOptions {
    LOCAL = 0,
    TESTNET = 1,
    MAINNET = 2
}
