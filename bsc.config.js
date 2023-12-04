//----------------------------IMPORTS---------------------------------
import dotenv from "dotenv";
import SafeApiKit from "@safe-global/api-kit";
import Safe, { EthersAdapter } from "@safe-global/protocol-kit";
import { WebSocketProvider, ethers, Wallet, Contract } from "ethers";
import { bridgeAbi } from "./abi/bridgeAbi.js";
dotenv.config();

//Constants
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const RPC_URL = process.env.BSC_RPC_URL;
const SAFE_ADDRESS = process.env.BSC_SAFE_ADDRESS;
const BRIDGE_ADDRESS = process.env.BSC_BRIDGE_ADDRESS;
const CHAIN_ID = process.env.BSC_CHAIN_ID;

//Initiate necessary classes to be able to interact with Gnosis Safe SDK
const provider = new WebSocketProvider(RPC_URL);

const signer = new Wallet(PRIVATE_KEY, provider);

const bridgeContract = new Contract(BRIDGE_ADDRESS, bridgeAbi, provider);

const ethAdapter = new EthersAdapter({
  ethers,
  signerOrProvider: signer,
});

const safeSdk = await Safe.default.create({
  ethAdapter: ethAdapter,
  safeAddress: SAFE_ADDRESS,
});

const safeApiKit = new SafeApiKit.default({
  chainId: BigInt(CHAIN_ID),
});

export {
  SAFE_ADDRESS,
  BRIDGE_ADDRESS,
  signer,
  bridgeContract,
  safeSdk,
  safeApiKit,
};
