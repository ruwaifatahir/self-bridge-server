# Getting Started

**Install the dependencies**

```bash
npm i
```

Create a new file named `.env`, copy the contents of `.env.example` into it, and populate it with appropriate values.

**Start the server**

```bash
 npm run start
```

**How it works**

This server is an essential part of the SELF bridge. Whenever someone moves their tokens from the source chain, this server facilitates the inbound transfer of tokens to the same person on the destination chain.

**_But how does it work?_**
<br>
Well, the server is always listening for outbound events on both the source and destination chains.

**_Hold on! Why is it listening for outbound events on both chains? Isn't it supposed to listen on the source chain only?_**

You're partially correct. Consider a scenario where someone moves their tokens from the source chain and later wants to move them back. That's why we need to listen to outbound events on both sides.

Let's continue. When this server detects an outbound emitted event, it generates an inbound transaction on the destination chain. Sounds simple, right?

Indeed, but in reality, it's generating a multisig transaction to transfer the tokens to the receiver, requiring validation by the validators.

So, once the multisig transaction is created, it needs approval from the validators to be executed.

We can have as many validators as needed, and the approval threshold can be customized.

For instance, with 5 validators (including the multisig transaction creator), we can specify how many approvals are required for the transaction to be executed:

- It could be 2 out of 5.
- It could be 5 out of 5, and so on.
