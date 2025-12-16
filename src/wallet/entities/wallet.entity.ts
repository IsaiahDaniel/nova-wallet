import { AbstractEntity } from 'src/database/abstract.entity';
import { Entity, Column, OneToMany } from 'typeorm';
import { Transaction } from './transaction.entity';

@Entity('wallet')
export class Wallet extends AbstractEntity<Wallet> {
  @Column({ type: 'varchar', length: 3 })
  currency: 'USD';

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  balance: number;

  @OneToMany(() => Transaction, (tx) => tx.wallet)
  transactions: Transaction[];
}
