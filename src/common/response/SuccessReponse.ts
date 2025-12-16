export class SuccessResponse {
  static create<T>(message: string, data?: T) {
    return {
      success: true,
      message,
      ...(data && { data }),
    };
  }
}
