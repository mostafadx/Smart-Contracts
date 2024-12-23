import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano } from '@ton/core';
import { Main } from '../wrappers/Main';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';
import { KeyPair, mnemonicNew, mnemonicToPrivateKey, sign } from 'ton-crypto';

async function randomKp() {
    let mnemonics = await mnemonicNew();
    return mnemonicToPrivateKey(mnemonics);
}

describe('Main', () => {
    let code: Cell;
    let kp: KeyPair;

    beforeAll(async () => {
        code = await compile('Main');
    });

    let blockchain: Blockchain;
    let main: SandboxContract<Main>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();
        kp = await randomKp();

        main = blockchain.openContract(Main.createFromConfig({
          seqno: 0,
          subwallet: 0,
          publicKey: BigInt('0x' + kp.publicKey.toString('hex')),
        }, code));

        const deployer = await blockchain.treasury('deployer');

        const deployResult = await main.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: main.address,
            deploy: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and main are ready to use
    });

});
