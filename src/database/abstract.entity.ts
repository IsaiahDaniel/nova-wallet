import { Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class AbstractEntity<T> {
    
  @PrimaryGeneratedColumn("uuid")
  id: string;

  constructor(item: Partial<T>) {
    Object.assign(this, item);
  }
}
