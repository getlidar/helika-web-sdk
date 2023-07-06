import { Base } from "./base";
import { NFT } from "./nft";
import { applyMixins } from "./utils";

class NFTInternal extends Base {}
interface NFTInternal extends NFT {}
applyMixins(NFTInternal, [NFT]);

export default { NFT: NFTInternal }

export enum BaseURLOptions {
  LOCAL,
  TESTNET,
  MAINNET,
}