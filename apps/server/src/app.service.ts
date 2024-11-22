import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import { Chain, createWalletClient, http } from 'viem';
import { sepolia } from 'viem/chains';

export class AppService {
  private keysByEmailOrId: Record<
    string,
    { name: string; privateKey: `0x${string}`; chain: Chain }
  > = {};
  public async createWallet(name: string, storageKey: string) {
    if (this.keysByEmailOrId[storageKey]) {
      throw new Error('Wallet already exists');
    }
    const privateKey = generatePrivateKey();
    this.keysByEmailOrId[storageKey] = {
      name,
      privateKey,
      chain: sepolia,
    };
    const account = privateKeyToAccount(privateKey);

    return {
      address: account.address,
      name: name,
    };
  }

  public async getBalance(storageKey: string): Promise<`0x${string}`> {
    const { privateKey, chain } = this.keysByEmailOrId[storageKey];
    const account = privateKeyToAccount(privateKey);

    if (!account) {
      throw new Error('Wallet not found. Create a wallet first.');
    }
    const client = createWalletClient({
      account,
      chain,
      transport: http(),
    });

    const balance: `0x${string}` = await client.request({
      method: 'eth_getBalance',
      params: [account.address, 'latest'],
    });
    return balance;
  }

  public async signMessage(message: string, storageKey: string) {
    const { privateKey } = this.keysByEmailOrId[storageKey];
    const account = privateKeyToAccount(privateKey);
    const signature = await account.signMessage({
      message,
    });
    return signature;
  }

  public async sendTransaction(
    to: `0x${string}`,
    amount: bigint,
    storageKey: string,
  ) {
    const { privateKey, chain } = this.keysByEmailOrId[storageKey];
    const account = privateKeyToAccount(privateKey);
    const client = createWalletClient({
      transport: http(
        'https://sepolia.infura.io/v3/91de7ed3c17344cc95f8ea31bf6b3adf',
      ),
    });
    const tx = await client.sendTransaction({
      to,
      chain,
      account,
      value: amount,
      kzg: undefined,
    });
    return tx;
  }

  public getWallet(storageKey: string) {
    const { privateKey, name } = this.keysByEmailOrId[storageKey];
    const account = privateKeyToAccount(privateKey);
    return {
      address: account.address,
      name,
    };
  }
}
