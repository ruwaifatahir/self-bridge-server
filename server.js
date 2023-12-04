//----------------------------IMPORTS---------------------------------
import { Interface } from "ethers";
import { bridgeAbi } from "./abi/bridgeAbi.js";
import * as bsc from "./bsc.config.js";
import * as eth from "./eth.config.js";

//----------------------------MAIN ROUTINE---------------------------------
const main = async () => {
  console.log("Listening to outbound event...");

  // listen for outbound event on BSC and inbound tokens on ETH
  bsc.bridgeContract.on("tokensOutBound", (holder, amount) => {
    createInboundTx(
      holder,
      amount,
      eth.SAFE_ADDRESS,
      eth.BRIDGE_ADDRESS,
      eth.signer,
      eth.safeSdk,
      eth.safeApiKit
    );
  });

  // listen for outbound event on ETH and inbound tokens on BSC
  eth.bridgeContract.on("tokensOutBound", (holder, amount) => {
    createInboundTx(
      holder,
      amount,
      bsc.SAFE_ADDRESS,
      bsc.BRIDGE_ADDRESS,
      bsc.signer,
      bsc.safeSdk,
      bsc.safeApiKit
    );
  });
};

//----------------------------HELPER ROUTINES------------------------------
const createInboundTx = async (
  to,
  amount,
  safeAddress,
  bridgeAddress,
  signer,
  safeSdk,
  safeApiKit
) => {
  const safeTransactionData = createInboundTxData(to, amount, bridgeAddress);

  // Retrieve the nonce for the next transaction to prevent the occurrence of the same deterministic hash for multiple transactions
  const nextNonce = await safeApiKit.getNextNonce(safeAddress);

  // Create the transaction so that it can be signed and proposed to validators
  const safeTransaction = await safeSdk.createTransaction({
    transactions: [safeTransactionData],
    options: { nonce: nextNonce },
  });

  // Deterministic hash based on transaction parameters
  const safeTxHash = await safeSdk.getTransactionHash(safeTransaction);

  // Sign transaction to verify that the transaction is coming from owner
  const senderSignature = await safeSdk.signTransactionHash(safeTxHash);

  // Propose the transaction to let other validators sign it
  await safeApiKit.proposeTransaction({
    safeAddress: safeAddress,
    safeTransactionData: safeTransaction.data,
    safeTxHash,
    senderAddress: await signer.getAddress(),
    senderSignature: senderSignature.data,
  });

  console.log("Transaction proposed :)");
};

const createInboundTxData = (to, amount, bridgeAddress) => {
  // Creating the contract interface to interact with the bridge contract
  const contractInterface = new Interface(bridgeAbi);

  // Encoding function data for the 'inBound' method with specified parameters
  const data = contractInterface.encodeFunctionData("inBound", [to, amount]);

  // Returning transaction data so that it can be used to create a transaction
  return {
    to: bridgeAddress,
    value: "0",
    data,
  };
};

main().catch((err) => console.log(err));
