# Multi-Leader Replication: Write Conflicts and Resolution

**Diagram type:** `sequence` · **Source:** [`spec.sequence.json`](./spec.sequence.json) · **View:** [`diagram.html`](./diagram.html)

---

## English

### Summary

Shows how **multi-leader replication** lets two leaders in two regions accept writes to the same record at nearly the same moment — and how the system detects and resolves the resulting conflict once the leaders exchange writes.

### When It Happens

**When:** Any time more than one node can accept writes for the same piece of data independently, and those writes can happen concurrently before either node learns about the other's write.

**Where to spot it:** Multi-region active-active databases, offline-first mobile apps syncing changes made while disconnected, collaborative editing tools, and any "last write wins" field you've seen in a database's documentation.

### Scenario

1. **Client A** writes `title = 'Hello'` to **Leader A (EU)** at `14:00:00.001`.
2. At nearly the same instant, **Client B** writes `title = 'Hi'` to **Leader B (US)** at `14:00:00.004`. Neither leader knows about the other's write yet.
3. The leaders replicate to each other and each one now holds two conflicting values for the same key.
4. Both resolve the conflict the same deterministic way — Last-Write-Wins by timestamp — so they agree: `'Hi'` wins because its timestamp is later.
5. Both clients eventually see the same converged value, `title = 'Hi'` — Client A's write is silently gone.

Multi-leader replication trades a hard consistency guarantee for the ability to accept writes in more than one place at once — the price is that conflicts are a normal, expected event, not a bug.

### Root Cause

- Two leaders can each accept a write to the same key with neither aware of the other, since accepting writes locally is exactly the point of multi-leader replication
- By the time the writes are exchanged, both leaders have already told their own client the write succeeded
- Something has to pick one outcome deterministically so every replica ends up agreeing on the same final value

### Common Resolution Strategies

- **Last-Write-Wins (LWW):** keep the write with the latest timestamp, silently discard the other — simple, but the discarded write is gone for good
- **Merge:** for structures like sets or counters, combine both writes instead of picking one — this is what CRDTs (Conflict-free Replicated Data Types) are built for
- **Application-level resolution:** store both versions as siblings and let the application, or a human, decide — this is how Amazon Dynamo originally handled it

### Rebuild this diagram

```bash
git clone https://github.com/tt-a1i/archify.git
cd archify
node bin/archify.mjs validate sequence path/to/spec.sequence.json --quality showcase --json
node bin/archify.mjs deliver sequence path/to/spec.sequence.json path/to/diagram.html --quality showcase --json
```

---

## Tiếng Việt

### Tóm tắt

Minh họa cách **multi-leader replication** cho phép hai leader ở hai vùng nhận ghi vào cùng một record gần như đồng thời — và cách hệ thống phát hiện, giải quyết xung đột sau khi hai leader trao đổi dữ liệu ghi.

### Khi Nào Gặp

**Khi nào:** Bất cứ khi nào nhiều hơn một node có thể độc lập nhận ghi cho cùng một dữ liệu, và các lần ghi đó có thể xảy ra đồng thời trước khi node này biết về lần ghi của node kia.

**Ở đâu dễ gặp:** Database active-active đa vùng, ứng dụng mobile offline-first đồng bộ thay đổi thực hiện lúc mất kết nối, công cụ chỉnh sửa cộng tác, và bất kỳ field "last write wins" nào bạn từng thấy trong tài liệu database.

### Kịch bản

1. **Client A** ghi `title = 'Hello'` vào **Leader A (EU)** lúc `14:00:00.001`.
2. Gần như cùng lúc, **Client B** ghi `title = 'Hi'` vào **Leader B (US)** lúc `14:00:00.004`. Chưa leader nào biết về lần ghi của leader kia.
3. Hai leader replicate cho nhau và mỗi bên giờ có hai giá trị xung đột cho cùng một key.
4. Cả hai giải quyết xung đột theo cùng một cách tất định — Last-Write-Wins theo timestamp — nên đồng thuận: `'Hi'` thắng vì timestamp muộn hơn.
5. Cả hai client cuối cùng đều thấy cùng giá trị hội tụ, `title = 'Hi'` — lần ghi của Client A âm thầm biến mất.

Multi-leader replication đánh đổi đảm bảo consistency chặt chẽ để lấy khả năng nhận ghi ở nhiều nơi cùng lúc — cái giá là xung đột trở thành sự kiện bình thường, được lường trước, chứ không phải bug.

### Nguyên nhân

- Hai leader có thể mỗi bên nhận ghi vào cùng key mà không biết về nhau, vì nhận ghi tại chỗ chính là mục đích của multi-leader replication
- Đến lúc trao đổi dữ liệu ghi, cả hai leader đã báo client của mình rằng ghi thành công
- Phải có một cơ chế chọn ra kết quả cuối cùng một cách tất định để mọi replica đồng thuận cùng một giá trị

### Các chiến lược giải quyết phổ biến

- **Last-Write-Wins (LWW):** giữ lần ghi có timestamp muộn nhất, âm thầm bỏ lần còn lại — đơn giản, nhưng lần ghi bị bỏ mất vĩnh viễn
- **Merge:** với các cấu trúc như set hay counter, gộp cả hai lần ghi thay vì chọn một — đây chính là mục đích của CRDT (Conflict-free Replicated Data Types)
- **Giải quyết ở tầng ứng dụng:** lưu cả hai phiên bản như các sibling và để ứng dụng, hoặc con người, quyết định — cách Amazon Dynamo từng làm

### Sửa lại diagram này

```bash
git clone https://github.com/tt-a1i/archify.git
cd archify
node bin/archify.mjs validate sequence path/to/spec.sequence.json --quality showcase --json
node bin/archify.mjs deliver sequence path/to/spec.sequence.json path/to/diagram.html --quality showcase --json
```
