# Deadlock: Circular Wait Between Two Transactions

**Diagram type:** `sequence` · **Source:** [`spec.sequence.json`](./spec.sequence.json) · **View:** [`diagram.html`](./diagram.html)

---

## English

### Summary

Illustrates a classic deadlock between two database transactions: each holds a lock the other needs, forming a **circular wait**, and both would block forever without a deadlock detector stepping in.

### When It Happens

**When:** When two or more transactions acquire the same set of locks in a different order under high write concurrency on the same tables or rows.

**Where to spot it:** Batch jobs and API requests updating related rows in reverse order (e.g. transferring between two accounts), ORMs that lock rows implicitly through foreign-key updates, and long-running transactions that touch many tables.

### Scenario

1. **Transaction A** locks `Row 1` successfully
2. **Transaction B** locks `Row 2` successfully
3. A requests a lock on `Row 2` → blocked because B holds it
4. B requests a lock on `Row 1` → blocked because A holds it → **closed wait cycle**
5. The DB's deadlock detector spots the cycle, picks B as the "victim", aborts and rolls it back, releasing B's locks
6. A gets the lock on `Row 2`, proceeds, and commits normally

Outcome: Transaction B fails (must retry at the application layer), Transaction A completes — neither waits forever thanks to the deadlock detector.

### Root Cause

- No consistent lock ordering across transactions — each locks rows in a different order
- All four Coffman conditions are met: mutual exclusion, hold-and-wait, no preemption, circular wait
- The longer a transaction runs and the more rows it locks, the higher the odds of a deadlock

### How to Fix It

- **Enforce a single global lock order** across every transaction (e.g. always lock by ascending id) — this breaks the circular-wait condition
- **Keep transactions short**, commit early to minimize lock hold time
- `SELECT ... FOR UPDATE NOWAIT` or `SKIP LOCKED` to fail fast instead of blocking indefinitely
- Let the database detect the deadlock, abort the victim transaction, and retry at the application layer

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

Minh họa deadlock kinh điển giữa hai transaction database: mỗi transaction giữ một khóa mà transaction kia đang cần, tạo thành **vòng chờ (circular wait)** và cả hai bị block vĩnh viễn nếu không có deadlock detector can thiệp.

### Khi Nào Gặp

**Khi nào:** Khi hai hay nhiều transaction lấy cùng một tập lock nhưng theo thứ tự khác nhau, dưới tải ghi cao trên cùng bảng hoặc dòng dữ liệu.

**Ở đâu dễ gặp:** Batch job và API cùng update các dòng liên quan theo thứ tự ngược nhau (ví dụ chuyển tiền giữa hai tài khoản), ORM khóa ngầm qua update foreign key, và transaction chạy dài động vào nhiều bảng.

### Kịch bản

1. **Transaction A** khóa `Row 1` thành công
2. **Transaction B** khóa `Row 2` thành công
3. A xin khóa `Row 2` → bị block vì B đang giữ
4. B xin khóa `Row 1` → bị block vì A đang giữ → **vòng chờ khép kín**
5. Deadlock detector của DB phát hiện chu trình, chọn B làm "nạn nhân", abort và rollback B, giải phóng khóa của B
6. A nhận được khóa `Row 2`, tiếp tục và commit bình thường

Kết quả: Transaction B bị lỗi (phải retry ở tầng ứng dụng), Transaction A hoàn tất — không có transaction nào chờ mãi mãi nhờ deadlock detector.

### Nguyên nhân gốc rễ

- Không có thứ tự khóa nhất quán (lock ordering) giữa các transaction — mỗi transaction khóa các row theo thứ tự khác nhau
- Thỏa mãn đủ 4 điều kiện Coffman: mutual exclusion, hold-and-wait, no preemption, circular wait
- Transaction chạy càng lâu, càng khóa nhiều row thì xác suất xảy ra deadlock càng cao

### Cách khắc phục

- **Áp đặt thứ tự khóa toàn cục** giống nhau cho mọi transaction (ví dụ luôn khóa theo id tăng dần) — phá vỡ điều kiện circular wait
- **Giữ transaction ngắn**, commit sớm để giảm thời gian giữ khóa
- `SELECT ... FOR UPDATE NOWAIT` hoặc `SKIP LOCKED` để không bị block vô hạn, thất bại nhanh thay vì chờ
- Để DB tự phát hiện deadlock, abort transaction nạn nhân và retry ở tầng ứng dụng

### Sửa lại diagram này

```bash
git clone https://github.com/tt-a1i/archify.git
cd archify
node bin/archify.mjs validate sequence path/to/spec.sequence.json --quality showcase --json
node bin/archify.mjs deliver sequence path/to/spec.sequence.json path/to/diagram.html --quality showcase --json
```
