export abstract class DomainError extends Error {
  abstract readonly code: string;

  constructor(message: string) {
    super(message);
  }
}

export class WalletNotFoundError extends DomainError {
  readonly code = 'WALLET_NOT_FOUND';

  constructor(walletId: string) {
    super(`Wallet with id ${walletId} not found`);
  }
}

export class InsufficientBalanceError extends DomainError {
  readonly code = 'INSUFFICIENT_BALANCE';

  constructor(balance: number, amount: number) {
    super(
      `Insufficient balance. Available: ${balance}, Requested: ${amount}`,
    );
  }
}

export class InvalidTransferError extends DomainError {
  readonly code = 'INVALID_TRANSFER';

  constructor() {
    super('Cannot transfer to the same wallet');
  }
}

export class DuplicateOperationError extends DomainError {
  readonly code = 'DUPLICATE_OPERATION';

  constructor() {
    super('This operation has already been processed');
  }
}
