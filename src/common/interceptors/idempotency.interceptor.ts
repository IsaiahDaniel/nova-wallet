import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable, of, tap } from "rxjs";

@Injectable()
export class IdempotencyInterceptor implements NestInterceptor {
  private readonly store = new Map<string, any>();

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const key = request.headers['idempotency-key'];

    if (!key) {
      return next.handle();
    }

    if (this.store.has(key)) {
      return of(this.store.get(key));
    }

    return next.handle().pipe(
      tap(response => {
        this.store.set(key, response);
      }),
    );
  }
}
