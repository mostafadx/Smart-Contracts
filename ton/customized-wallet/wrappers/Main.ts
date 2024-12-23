import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type MainConfig = {
    seqno: number;
    subwallet: number; 
    publicKey: bigint;
};

export function mainConfigToCell(config: MainConfig): Cell {
    return beginCell()
        .storeUint(config.seqno, 32)
        .storeUint(config.subwallet, 32)
        .storeUint(config.publicKey, 256)
        .endCell();
}

export class Main implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new Main(address);
    }

    static createFromConfig(config: MainConfig, code: Cell, workchain = 0) {
        const data = mainConfigToCell(config);
        const init = { code, data };
        return new Main(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async getCurrentNValue(provider: ContractProvider) :Promise<number> {
        const result = await provider.get('get_current_n_value', []); 
        return result.stack.readNumber();
    }
}
