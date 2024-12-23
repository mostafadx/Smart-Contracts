import { toNano } from '@ton/core';
import { Main } from '../wrappers/Main';
import { compile, NetworkProvider } from '@ton/blueprint';
import { mnemonicToWalletKey } from '@ton/crypto';
import { entropyToMnemonic } from 'bip39';
import { randomBytes } from 'crypto';

export async function run(provider: NetworkProvider) {
    // init the wallet
    const main = provider.open(Main.createFromConfig({
        seqno: 0,         
        subwallet: 0,     
        publicKey: BigInt('0x' + keypair.publicKey.toString('hex')),    // Convert Buffer to BigInt
    }, await compile('Main')));

    await main.sendDeploy(provider.sender(), toNano('0.01'));

    await provider.waitForDeploy(main.address);
}
