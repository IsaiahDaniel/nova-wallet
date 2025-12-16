import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from './entities/wallet.entity';
import { Transaction } from './entities/transaction.entity';
import { WalletService } from './wallet.service';
import { WalletRepository } from './wallet.repository';
import { CurrencyEnum } from 'src/common/types/currency.type';

describe('WalletService', () => {
  let walletService: WalletService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          dropSchema: true,
          entities: [Wallet, Transaction],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([Wallet, Transaction]),
      ],
      providers: [WalletService, WalletRepository],
    }).compile();

    walletService = moduleRef.get(WalletService);
  });

  it('should create a wallet with zero balance', async () => {
    const wallet = await walletService.createWallet(CurrencyEnum.USD);

    expect(wallet).toBeDefined();
    expect(wallet.currency).toBe(CurrencyEnum.USD);
    expect(Number(wallet.balance)).toBe(0);
  });

  it('should fund wallet successfully', async () => {
    const wallet = await walletService.createWallet(CurrencyEnum.USD);

    const updated = await walletService.fundWallet(wallet.id, 100);

    expect(Number(updated.balance)).toBe(100);
  });

  it('should reject negative funding', async () => {
    const wallet = await walletService.createWallet(CurrencyEnum.USD);

    await expect(walletService.fundWallet(wallet.id, -50)).rejects.toThrow();
  });

  it('should transfer funds between wallets', async () => {
    const sender = await walletService.createWallet(CurrencyEnum.USD);
    const receiver = await walletService.createWallet(CurrencyEnum.USD);

    await walletService.fundWallet(sender.id, 200);
    await walletService.transfer(sender.id, receiver.id, 50);

    const senderWallet = await walletService.getWalletDetails(sender.id);
    const receiverWallet = await walletService.getWalletDetails(receiver.id);

    expect(Number(senderWallet.balance)).toBe(150);
    expect(Number(receiverWallet.balance)).toBe(50);

    const senderTransactions = await walletService.getWalletTransactions(sender.id);
    const receiverTransactions = await walletService.getWalletTransactions(receiver.id);

    expect(senderTransactions.some(tx => tx.type === 'TRANSFER_OUT')).toBe(true);
    expect(receiverTransactions.some(tx => tx.type === 'TRANSFER_IN')).toBe(true);
  });

  it('should fail if balance is insufficient', async () => {
    const sender = await walletService.createWallet(CurrencyEnum.USD);
    const receiver = await walletService.createWallet(CurrencyEnum.USD);

    await walletService.fundWallet(sender.id, 30);

    await expect(
      walletService.transfer(sender.id, receiver.id, 100),
    ).rejects.toThrow('Insufficient balance');
  });

  it('should return wallet with transaction history', async () => {
    const wallet = await walletService.createWallet(CurrencyEnum.USD);
    await walletService.fundWallet(wallet.id, 100);

    const walletDetails = await walletService.getWalletDetails(wallet.id);
    const transactions = await walletService.getWalletTransactions(wallet.id);

    expect(walletDetails).toBeDefined();
    expect(transactions.length).toBe(1);
    expect(transactions[0].type).toBe('FUND');
  });
});
