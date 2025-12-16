import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { WalletService } from './wallet.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { FundWalletDto } from './dto/fund-wallet.dto';
import { TransferWalletDto } from './dto/transfer-wallet.dto';
import { CurrencyEnum } from 'src/common/types/currency.type';
import { IdempotencyInterceptor } from 'src/common/interceptors/idempotency.interceptor';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post()
  create(@Body() dto: CreateWalletDto) {
    return this.walletService.createWallet(dto.currency as CurrencyEnum.USD);
  }

  @UseInterceptors(IdempotencyInterceptor)
  @Post(':id/fund')
  fund(@Param('id') id: string, @Body() dto: FundWalletDto) {
    return this.walletService.fundWallet(id, dto.amount);
  }

  @UseInterceptors(IdempotencyInterceptor)
  @Post(':id/transfer')
  transfer(@Param('id') fromId: string, @Body() dto: TransferWalletDto) {
    return this.walletService.transfer(fromId, dto.toWalletId, dto.amount);
  }

  @Get(':id')
  getWalletDetails(@Param('id') id: string) {
    return this.walletService.getWalletDetails(id);
  }

  @Get(':id/transactions')
  getWalletTransactions(@Param('id') id: string) {
    return this.walletService.getWalletTransactions(id);
  }
}
