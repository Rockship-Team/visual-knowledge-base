# Transaction Isolation Levels: Preventing the Non-Repeatable Read

**Diagram type:** `sequence` · **Source:** [`spec.sequence.json`](./spec.sequence.json) · **View:** [`diagram.html`](./diagram.html)

---

## English

### Summary

A transaction's **isolation level** controls what it can see of another transaction's uncommitted or committed changes. The SQL standard defines four levels — Read Uncommitted, Read Committed, Repeatable Read, Serializable — each trading off correctness against concurrency and performance.

### When It Happens

**When:** Every database transaction runs at some isolation level whether you picked it explicitly or not — the risk shows up any time a transaction reads the same data more than once, or when two transactions can interleave.

**Where to spot it:** Reports/dashboards computing a value from multiple queries inside one transaction, financial reconciliation logic, "read a total then act on it" patterns, and bugs where the same page shows inconsistent numbers within a single request.

### Scenario

1. **Transaction A**: `BEGIN`
2. A: `SELECT balance FROM accounts WHERE id = 1` → returns `100`
3. **Transaction B**: `BEGIN`
4. B: `UPDATE accounts SET balance = 150 WHERE id = 1`
5. B: `COMMIT`
6. A (same still-open transaction) runs the **exact same query again**: `SELECT balance FROM accounts WHERE id = 1` → this time returns `150`
7. A: `COMMIT`

Under Read Committed, the same query returned two different values inside one transaction — a **non-repeatable read**. Under Repeatable Read or Serializable, step 6 would still return `100`.

### The Four Isolation Levels

- **Read Uncommitted**: allows dirty reads, non-repeatable reads, and phantom reads — rarely used in practice
- **Read Committed**: prevents dirty reads, but still allows non-repeatable reads and phantom reads — this is the scenario above, and the default in Postgres
- **Repeatable Read**: prevents dirty reads and non-repeatable reads; whether phantom reads are also prevented depends on the engine — Postgres's snapshot-based Repeatable Read happens to prevent phantom reads too, going beyond the SQL standard's minimum guarantee. This is the default in MySQL/InnoDB.
- **Serializable**: prevents all three anomalies, but transactions may fail with a serialization error and need an application-level retry

### How to Choose

- **Read Committed** for most everyday CRUD — good performance, good enough correctness for most operations
- **Repeatable Read** when a single transaction needs a consistent view across multiple reads, e.g. generating a report
- **Serializable** for correctness-critical logic (e.g. financial transfers), combined with retry-on-conflict logic at the application layer
- Or skip raising the isolation level altogether and use explicit row locking (`SELECT ... FOR UPDATE`) on just the hot rows instead

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

**Isolation level** của một transaction quyết định nó nhìn thấy được gì từ thay đổi (chưa commit hoặc đã commit) của transaction khác. Chuẩn SQL định nghĩa 4 mức — Read Uncommitted, Read Committed, Repeatable Read, Serializable — mỗi mức đánh đổi giữa tính đúng đắn với khả năng chạy đồng thời và hiệu năng.

### Khi Nào Gặp

**Khi nào:** Mọi transaction database đều chạy ở một isolation level nào đó, dù bạn có chọn tường minh hay không — rủi ro xuất hiện bất cứ khi nào một transaction đọc cùng một dữ liệu nhiều hơn một lần, hoặc khi hai transaction có thể xen kẽ nhau.

**Ở đâu dễ gặp:** Report/dashboard tính giá trị từ nhiều query trong cùng một transaction, logic đối soát tài chính, pattern "đọc tổng rồi hành động dựa trên đó", và bug kiểu cùng một trang hiển thị số liệu không nhất quán trong một request.

### Kịch bản

1. **Transaction A**: `BEGIN`
2. A: `SELECT balance FROM accounts WHERE id = 1` → trả về `100`
3. **Transaction B**: `BEGIN`
4. B: `UPDATE accounts SET balance = 150 WHERE id = 1`
5. B: `COMMIT`
6. A (vẫn cùng transaction đang mở) chạy lại **đúng query đó**: `SELECT balance FROM accounts WHERE id = 1` → lần này trả về `150`
7. A: `COMMIT`

Dưới Read Committed, cùng một query trả về hai giá trị khác nhau trong một transaction — đây gọi là **non-repeatable read**. Dưới Repeatable Read hoặc Serializable, bước 6 vẫn sẽ trả về `100`.

### Bốn Mức Isolation

- **Read Uncommitted**: cho phép dirty read, non-repeatable read, và phantom read — hiếm khi dùng trong thực tế
- **Read Committed**: ngăn dirty read, nhưng vẫn cho phép non-repeatable read và phantom read — đây chính là kịch bản ở trên, và là mặc định của Postgres
- **Repeatable Read**: ngăn dirty read và non-repeatable read; có ngăn được phantom read hay không tùy engine — Repeatable Read dựa trên snapshot của Postgres tình cờ ngăn luôn cả phantom read, vượt quá mức tối thiểu của chuẩn SQL. Đây là mặc định của MySQL/InnoDB.
- **Serializable**: ngăn cả ba loại anomaly, nhưng transaction có thể fail với lỗi serialization và cần retry ở tầng ứng dụng

### Cách Lựa Chọn

- **Read Committed** cho phần lớn CRUD hàng ngày — hiệu năng tốt, độ đúng đắn đủ dùng cho hầu hết thao tác
- **Repeatable Read** khi một transaction cần nhìn thấy một view nhất quán xuyên suốt nhiều lần đọc, ví dụ khi tạo report
- **Serializable** cho logic đòi hỏi tính đúng đắn cao (ví dụ chuyển tiền), kết hợp với retry-on-conflict ở tầng ứng dụng
- Hoặc không cần nâng isolation level, chỉ cần khóa tường minh (`SELECT ... FOR UPDATE`) đúng những row "nóng"

### Sửa lại diagram này

```bash
git clone https://github.com/tt-a1i/archify.git
cd archify
node bin/archify.mjs validate sequence path/to/spec.sequence.json --quality showcase --json
node bin/archify.mjs deliver sequence path/to/spec.sequence.json path/to/diagram.html --quality showcase --json
```
