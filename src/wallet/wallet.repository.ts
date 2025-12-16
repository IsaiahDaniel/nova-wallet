import { InjectRepository } from '@nestjs/typeorm';
import { Wallet } from './entities/wallet.entity';
import { Injectable } from '@nestjs/common';
import { Transaction } from './entities/transaction.entity';
import { Repository } from 'typeorm';

@Injectable()
export class WalletRepository {
  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepo: Repository<Wallet>,

    @InjectRepository(Transaction)
    private readonly txRepo: Repository<Transaction>,
  ) {}

  createWallet(currency: 'USD') {
    const wallet = this.walletRepo.create({ currency, balance: 0 });
    return this.walletRepo.save(wallet);
  }

  findWallet(id: string) {
    return this.walletRepo.findOne({ where: { id } });
  }

  saveWallet(wallet: Wallet) {
    return this.walletRepo.save(wallet);
  }

  addTransaction(data: Partial<Transaction>) {
    return this.txRepo.save(this.txRepo.create(data));
  }

  findTransactions(walletId: string) {
    return this.txRepo.find({ where: { walletId } });
  }
}
