import { AbstractEntity } from 'src/database/abstract.entity';
import { Entity, ManyToOne, Column, CreateDateColumn } from 'typeorm';
import { Wallet } from './wallet.entity';

export type TransactionType = 'FUND' | 'TRANSFER_IN' | 'TRANSFER_OUT';

@Entity('transaction')
export class Transaction extends AbstractEntity<Transaction> {
  @ManyToOne(() => Wallet, (wallet) => wallet.transactions)
  wallet: Wallet;

  @Column()
  walletId: string;

  @Column({ type: 'varchar' })
  type: TransactionType;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'json', nullable: true })
  metadata?: Record<string, any>;
}
