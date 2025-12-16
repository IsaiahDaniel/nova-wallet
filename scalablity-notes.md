# Production Scalability Notes

This document outlines how the Wallet Service would scale and operate in a real-world production environment.

---

## Architecture Overview

In production, the system would be deployed as a stateless NestJS service behind a load balancer:

* **API Layer**: NestJS (Dockerized)
* **Database**: PostgreSQL (Primary + Read Replicas)
* **Cache / Messaging**: Redis
* **Infrastructure**: Kubernetes / ECS

---

## Database Scaling (PostgreSQL)

* Use **PostgreSQL** as the source of truth for wallets and transactions.
* Enable **row-level locking** during transfers to ensure balance integrity.
* Add **indexes** on:

  * `wallet.id`
  * `transaction.walletId`
  * `transaction.createdAt`
* Introduce **read replicas** for heavy read endpoints (wallet details, history).

---

## Redis Usage

Redis would be introduced for:

### 1. Idempotency

* Store idempotency keys with a TTL.
* Prevent duplicate fund / transfer requests.
* Example key:

  ```
  idempotency:{key} -> response
  ```

### 2. Distributed Locks

* Use Redis locks (e.g. Redlock) during transfers to prevent race conditions.
* Ensures wallet balance consistency across multiple instances.

### 3. Caching

* Cache wallet read responses (short TTL).
* Reduce load on PostgreSQL for high-traffic wallets.

---

## Horizontal Scaling

* Run multiple NestJS instances.
* Use a load balancer (NGINX / ALB).
* Stateless services allow easy scaling.

---

## Transactions & Consistency

* Use database transactions for fund and transfer operations.
* Ensure atomic updates to sender and receiver wallets.
* Rollback automatically on failure.

---

## Observability

* Structured logging (Winston / Pino).
* Metrics via Prometheus.
* Distributed tracing with OpenTelemetry.

---

## Security

* Input validation using DTOs.
* Rate limiting on wallet operations.
* Authentication & authorization layer (JWT / OAuth).

---

## Future Improvements

* Event-driven architecture using Kafka / SNS.
* CQRS for separating reads and writes.
* Background processing for analytics.
