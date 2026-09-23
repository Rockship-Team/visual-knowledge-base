# Change Data Capture: Streaming Database Changes

**Diagram type:** `dataflow` · **Source:** [`spec.dataflow.json`](./spec.dataflow.json) · **View:** [`diagram.html`](./diagram.html)

---

## English

### Summary

Shows how **Change Data Capture (CDC)** turns every row-level change in a database into a stream of events, by tailing the database's own transaction log instead of polling tables — letting a search index, a cache, and a data warehouse all stay in sync independently.

### When It Happens

**When:** Whenever data written to one system needs to reach other systems (search, cache, analytics) in near real time, without adding query load to the source database.

**Where to spot it:** Keeping a search index in sync with a primary database, invalidating a cache the moment the underlying row changes, and streaming ETL pipelines that replace nightly batch jobs (Debezium, AWS DMS, Maxwell).

### Scenario

1. An **Application** performs an `INSERT`/`UPDATE`/`DELETE` against the **Primary DB**.
2. The change is already recorded in the database's own **transaction log** (WAL / binlog) — this happens regardless of CDC, since it's how the database guarantees durability.
3. A **CDC Connector** (e.g. Debezium) tails that log and turns each committed row change into an event.
4. The connector publishes the event onto an **Event Stream**, one topic per table.
5. **Downstream consumers** — a search index, a cache, a data warehouse — each read the same stream independently, at their own pace.

The database never has to know CDC exists — the connector just reads a log the engine was already writing for its own durability guarantees.

### Why Tail the Log Instead of Polling

- Reading the transaction log captures every change, including deletes, with no extra query load on the production database
- It never misses a row that changed and changed back between two poll intervals
- Each downstream consumer reads the same stream independently, at its own pace

### What CDC Guarantees (and What It Doesn't)

- Changes are delivered in commit order per row — but at-least-once, so a connector restart can redeliver the same event
- Downstream consumers must apply changes idempotently, exactly like any other message-queue consumer
- CDC doesn't rewrite your data model — it mirrors whatever the source table's schema already is

### Where It Breaks Down

- Schema changes (DDL) need special handling so the connector adapts without silently dropping events
- A connector that falls too far behind can be evicted from the log's retention window, forcing a full table resnapshot
- High-churn tables can produce more change events than downstream consumers can keep up with

### Rebuild this diagram

```bash
git clone https://github.com/tt-a1i/archify.git
cd archify
node bin/archify.mjs validate dataflow path/to/spec.dataflow.json --quality showcase --json
node bin/archify.mjs deliver dataflow path/to/spec.dataflow.json path/to/diagram.html --quality showcase --json
```

---

## Tiếng Việt

### Tóm tắt

Minh họa cách **Change Data Capture (CDC)** biến mọi thay đổi cấp dòng trong database thành một luồng event, bằng cách tail chính transaction log của database thay vì poll bảng — cho phép search index, cache, và data warehouse đều tự đồng bộ độc lập.

### Khi Nào Gặp

**Khi nào:** Bất cứ khi nào dữ liệu ghi vào một hệ thống cần đến các hệ thống khác (search, cache, analytics) gần như tức thời, mà không thêm tải query lên database nguồn.

**Ở đâu dễ gặp:** Giữ search index đồng bộ với database chính, invalidate cache ngay khi dòng dữ liệu gốc thay đổi, và pipeline streaming ETL thay thế batch job chạy đêm (Debezium, AWS DMS, Maxwell).

### Kịch bản

1. Một **Application** thực hiện `INSERT`/`UPDATE`/`DELETE` vào **Primary DB**.
2. Thay đổi đã được ghi vào **transaction log** (WAL / binlog) của chính database — điều này xảy ra bất kể có CDC hay không, vì đó là cách database đảm bảo durability.
3. Một **CDC Connector** (ví dụ Debezium) tail log đó và biến mỗi thay đổi dòng đã commit thành một event.
4. Connector publish event lên **Event Stream**, mỗi bảng một topic.
5. **Các consumer** — search index, cache, data warehouse — mỗi bên đọc cùng luồng đó một cách độc lập, theo tốc độ riêng.

Database không bao giờ cần biết CDC tồn tại — connector chỉ đọc một log mà engine vốn đã ghi cho chính đảm bảo durability của nó.

### Vì sao tail log thay vì poll

- Đọc transaction log bắt được mọi thay đổi, kể cả delete, mà không thêm tải query lên database production
- Không bao giờ bỏ sót một dòng thay đổi rồi đổi lại giữa hai lần poll
- Mỗi consumer downstream đọc cùng luồng một cách độc lập, theo tốc độ riêng của nó

### CDC đảm bảo gì (và không đảm bảo gì)

- Thay đổi được gửi theo đúng thứ tự commit trên mỗi dòng — nhưng là at-least-once, nên connector restart có thể gửi lại cùng event
- Consumer downstream phải áp dụng thay đổi một cách idempotent, giống hệt bất kỳ consumer message-queue nào khác
- CDC không viết lại data model của bạn — nó phản chiếu đúng schema của bảng nguồn

### Ở đâu dễ gãy

- Thay đổi schema (DDL) cần xử lý đặc biệt để connector thích ứng mà không âm thầm bỏ sót event
- Một connector bị trễ quá xa có thể bị đẩy ra khỏi cửa sổ retention của log, buộc phải resnapshot toàn bộ bảng
- Bảng có tần suất thay đổi cao có thể tạo ra nhiều event hơn khả năng consumer downstream theo kịp

### Sửa lại diagram này

```bash
git clone https://github.com/tt-a1i/archify.git
cd archify
node bin/archify.mjs validate dataflow path/to/spec.dataflow.json --quality showcase --json
node bin/archify.mjs deliver dataflow path/to/spec.dataflow.json path/to/diagram.html --quality showcase --json
```
