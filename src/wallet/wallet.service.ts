import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { WalletRepository } from './wallet.repository';
import { CurrencyEnum } from 'src/common/types/currency.type';
import { SuccessResponse } from 'src/common/response/SuccessReponse';
// import { WalletNotFoundError } from 'src/common/errors/wallet-errors';

@Injectable()
export class WalletService {
  constructor(private readonly walletRepo: WalletRepository) {}

  async createWallet(currency: CurrencyEnum.USD) {
    return this.walletRepo.createWallet(currency);
  }

  async fundWallet(walletId: string, amount: number) {
    const wallet = await this.getWalletOrFail(walletId);

    wallet.balance = Number(wallet.balance) + amount;
    await this.walletRepo.saveWallet(wallet);

    await this.walletRepo.addTransaction({
      walletId: wallet.id,
      type: 'FUND',
      amount,
    });

    return wallet;
  }

  async transfer(fromId: string, toId: string, amount: number) {
    if (fromId === toId) {
      throw new BadRequestException('Cannot transfer to same wallet');
    }

    const sender = await this.getWalletOrFail(fromId);
    const receiver = await this.getWalletOrFail(toId);

    if (Number(sender.balance) < amount) {
      throw new BadRequestException('Insufficient balance');
    }

    sender.balance = Number(sender.balance) - amount;
    receiver.balance = Number(receiver.balance) + amount;

    await this.walletRepo.saveWallet(sender);
    await this.walletRepo.saveWallet(receiver);

    await this.walletRepo.addTransaction({
      walletId: sender.id,
      type: 'TRANSFER_OUT',
      amount,
      metadata: { toWalletId: toId },
    });

    await this.walletRepo.addTransaction({
      walletId: receiver.id,
      type: 'TRANSFER_IN',
      amount,
      metadata: { fromWalletId: fromId },
    });

    return SuccessResponse.create('Transfer completed successfully', {
      fromWalletId: fromId,
      toWalletId: toId,
      amount,
    });
  }

  async getWalletDetails(walletId: string) {
    const wallet = await this.getWalletOrFail(walletId);

    return wallet;
  }

  async getWalletTransactions(walletId: string) {
    const transactions = await this.walletRepo.findTransactions(walletId);

    return transactions;
  }

  private async getWalletOrFail(id: string) {
    const wallet = await this.walletRepo.findWallet(id);

    if (!wallet) throw new NotFoundException('Wallet not found');

    // using custome error handler
    // if (!wallet) {
    //   throw new WalletNotFoundError(id);
    // }

    return wallet;
  }
}
