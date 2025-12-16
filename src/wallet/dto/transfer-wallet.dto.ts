import { IsUUID, IsPositive, IsNumber } from "class-validator";

export class TransferWalletDto {
  @IsUUID()
  toWalletId: string;

  @IsNumber()
  @IsPositive()
  amount: number;
}
