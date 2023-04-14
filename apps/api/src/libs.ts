import { DirectSecp256k1HdWallet, coins, parseCoins } from "@cosmjs/proto-signing";
import { DeliverTxResponse, GasPrice, SigningStargateClient } from "@cosmjs/stargate";
import { MsgCreateVestingAccount } from "cosmjs-types/cosmos/vesting/v1beta1/tx";
import Long from "long";

// Authenticate user IP address. Returns true if allowed, false if not
export const authenticate = (ip: string): boolean => {

    const allowed_ip = process.env.ALLOWED_IP;

    if (allowed_ip === "*") {
        return true;
    }

    return allowed_ip === ip
}

// Create a new vesting account
export const createVestingAccount = async (address: string): Promise<DeliverTxResponse> => {

    // Open wallet
    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(process.env.FAUCET_MNEMONIC ?? "", { prefix: process.env.BECH32_PREFIX });
    const accounts = await wallet.getAccounts()

    // Setup client with default gas price and rpc
    const client = await SigningStargateClient.connectWithSigner(process.env.RPC ?? "http://127.0.0.1:26657", wallet, {
        gasPrice: GasPrice.fromString(process.env.GAS_PRICE ?? "0.001ujuno")
    })

    const vestingMsg = {
        typeUrl: "/cosmos.vesting.v1beta1.MsgCreateVestingAccount",
        value: MsgCreateVestingAccount.fromPartial({
          fromAddress: accounts[0].address,
          toAddress: address,
          amount: parseCoins(process.env.AMOUNT ?? "1ujuno"),
          endTime: process.env.VESTING_END ?? 1682294400,
          delayed: false,
        })
    };

    return await client.signAndBroadcast(accounts[0].address, [vestingMsg], "auto", "Donated by MiB 👽");
}