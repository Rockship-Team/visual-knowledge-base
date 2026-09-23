# LSM-Tree vs B-Tree: Write-Optimized Storage Engines

**Diagram type:** `workflow` · **Source:** [`spec.workflow.json`](./spec.workflow.json) · **View:** [`diagram.html`](./diagram.html)

---

## English

### Summary

Compares the **write path** of the two dominant storage engine designs: a **B-Tree** engine updates a page in place, while an **LSM-Tree** engine only ever appends — the difference explains why write-heavy systems increasingly reach for LSM-based storage.

### When It Happens

**When:** Every time a row is inserted or updated, the storage engine decides how that write reaches disk — this diagram shows the two dominant strategies side by side.

**Where to spot it:** Choosing a database for a write-heavy workload (logs, metrics, event streams, IoT ingestion), tuning compaction settings in RocksDB/Cassandra/LevelDB, or diagnosing why an OLTP database (Postgres, MySQL) struggles under a huge burst of random-key inserts.

### Scenario

1. A **Client** sends an `INSERT`/`UPDATE`; the choice of storage engine was already fixed when the database was set up.
2. **B-Tree path:** the engine seeks the exact leaf page on disk (random I/O), updates it in place, and eventually `fsync`s the dirty page.
3. **LSM-Tree path:** the engine appends the write to a write-ahead log (sequential I/O), then writes it into an in-memory sorted structure (the memtable). The memtable is only flushed to an immutable SSTable on disk later, in the background, along with compaction that merges old SSTables.
4. Either way, the client eventually receives the write acknowledgment.

The core difference: a B-Tree write always touches an existing page in place; an LSM-Tree write is always a brand-new sequential append. That's why LSM trees dominate write-heavy workloads.

### Root Cause

- Disks (spinning or SSD) are dramatically faster at sequential writes than random writes
- A B-Tree's "one copy of each key, in place" design guarantees fast, predictable reads — at the cost of a random seek on every write
- An LSM-Tree's "append now, reconcile later" design turns every write into a sequential append — at the cost of extra work later (compaction) and reads that may need to check multiple files

### How to Choose

- Pick an **LSM-Tree** engine (Cassandra, RocksDB, LevelDB, ScyllaDB) for write-heavy, append-mostly workloads like logging, metrics, and event ingestion
- Pick a **B-Tree** engine (PostgreSQL, MySQL/InnoDB, SQL Server) for classic OLTP workloads with frequent point reads on hot rows and moderate write volume
- Watch LSM compaction load in production — it competes with foreground reads/writes for disk I/O and can cause latency spikes if misconfigured

### Rebuild this diagram

```bash
git clone https://github.com/tt-a1i/archify.git
cd archify
node bin/archify.mjs validate workflow path/to/spec.workflow.json --quality showcase --json
node bin/archify.mjs deliver workflow path/to/spec.workflow.json path/to/diagram.html --quality showcase --json
```

---

## Tiếng Việt

### Tóm tắt

So sánh **đường đi của một lần ghi** giữa hai kiểu storage engine phổ biến nhất: engine **B-Tree** cập nhật trực tiếp tại chỗ (in-place) trên một page, còn engine **LSM-Tree** chỉ luôn luôn append — sự khác biệt này giải thích vì sao các hệ thống ghi nhiều ngày càng chọn storage dựa trên LSM.

### Khi Nào Gặp

**Khi nào:** Mỗi khi một dòng được insert hoặc update, storage engine phải quyết định lần ghi đó chạm tới đĩa như thế nào — diagram này đặt cạnh nhau hai chiến lược phổ biến nhất.

**Ở đâu dễ gặp:** Chọn database cho workload ghi nhiều (log, metrics, event stream, ingest dữ liệu IoT), tinh chỉnh cấu hình compaction trong RocksDB/Cassandra/LevelDB, hoặc chẩn đoán vì sao một database OLTP (Postgres, MySQL) ì ạch khi có đợt insert ồ ạt với key ngẫu nhiên.

### Kịch bản

1. **Client** gửi `INSERT`/`UPDATE`; storage engine đã được chọn cố định từ lúc thiết lập database.
2. **Đường B-Tree:** engine tìm đúng leaf page trên đĩa (random I/O), cập nhật tại chỗ, rồi cuối cùng `fsync` page đã thay đổi.
3. **Đường LSM-Tree:** engine append lần ghi vào write-ahead log (sequential I/O), rồi ghi vào một cấu trúc sắp xếp trong bộ nhớ (memtable). Memtable chỉ được flush thành SSTable bất biến trên đĩa sau đó, chạy nền, cùng với compaction gộp các SSTable cũ.
4. Dù theo đường nào, client cuối cùng cũng nhận được xác nhận ghi.

Khác biệt cốt lõi: một lần ghi B-Tree luôn chạm vào một page đã tồn tại tại chỗ; một lần ghi LSM-Tree luôn là một append tuần tự hoàn toàn mới. Đó là lý do LSM tree thống trị các workload ghi nhiều.

### Nguyên nhân

- Ổ đĩa (HDD hay SSD) đều nhanh hơn đáng kể ở ghi tuần tự so với ghi ngẫu nhiên
- Thiết kế "mỗi key một bản duy nhất, tại chỗ" của B-Tree đảm bảo đọc nhanh, dễ đoán — đổi lại mỗi lần ghi phải random seek
- Thiết kế "append trước, dọn dẹp sau" của LSM-Tree biến mọi lần ghi thành một append tuần tự — đổi lại phải làm thêm việc sau này (compaction) và việc đọc có thể phải kiểm tra nhiều file

### Cách lựa chọn

- Chọn engine **LSM-Tree** (Cassandra, RocksDB, LevelDB, ScyllaDB) cho workload ghi nhiều, chủ yếu append như logging, metrics, ingest event
- Chọn engine **B-Tree** (PostgreSQL, MySQL/InnoDB, SQL Server) cho workload OLTP kinh điển với nhiều lần đọc điểm (point read) trên các dòng hot và lượng ghi vừa phải
- Chú ý tải compaction của LSM trong production — nó cạnh tranh I/O đĩa với các lần đọc/ghi chính, và có thể gây tăng đột biến độ trễ nếu cấu hình sai

### Sửa lại diagram này

```bash
git clone https://github.com/tt-a1i/archify.git
cd archify
node bin/archify.mjs validate workflow path/to/spec.workflow.json --quality showcase --json
node bin/archify.mjs deliver workflow path/to/spec.workflow.json path/to/diagram.html --quality showcase --json
```
