import { Module } from '@nestjs/common';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { WalletRepository } from './wallet.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from './entities/wallet.entity';
import { Transaction } from './entities/transaction.entity';

@Module({
  controllers: [WalletController],
  exports: [WalletService],
  imports: [TypeOrmModule.forFeature([Wallet, Transaction])],
  providers: [WalletService, WalletRepository],
})
export class WalletModule {}
