# Race Condition: Lost Update

**Diagram type:** `sequence` · **Source:** [`spec.sequence.json`](./spec.sequence.json) · **View:** [`diagram.html`](./diagram.html)

---

## English

### Summary

Illustrates a **Lost Update** race condition on an account balance, where two clients read-modify-write concurrently with no synchronization mechanism.

### Scenario

1. **Client A** reads `balance = 100` → computes `100 + 50 = 150`
2. Before A writes, **Client B** also reads `balance = 100` (the old, not-yet-updated value) → also computes `150`
3. A writes `balance = 150` (correct at that moment)
4. B overwrites with `balance = 150` — it should have been `200`, since both deposits of 50 need to be counted

Final result: **150 instead of 200** — A's update is silently lost.

### Root Cause

- The "read → compute → write" operation is three separate steps, not atomic
- No lock or isolation control between the two concurrent transactions
- The interleaving order is decided by the scheduler and is unpredictable — the outcome depends on timing, not logic

### How to Fix It

- **Atomic update** at the DB: `UPDATE balance = balance + 50` instead of read-then-compute-then-write
- **Optimistic locking**: add a `version` column, only write if the version still matches, otherwise retry
- **Pessimistic locking**: `SELECT ... FOR UPDATE`, or a mutex/semaphore at the application layer
- **Serializable isolation level** so the DB detects and rejects the conflicting transaction itself

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

Minh họa race condition kiểu **Lost Update** trên số dư tài khoản, khi hai client cùng đọc-tính-ghi (read-modify-write) mà không có cơ chế đồng bộ.

### Kịch bản

1. **Client A** đọc `balance = 100` → tính `100 + 50 = 150`
2. Trước khi A kịp ghi, **Client B** cũng đọc `balance = 100` (giá trị cũ, chưa cập nhật) → cũng tính ra `150`
3. A ghi `balance = 150` (đúng tại thời điểm đó)
4. B ghi đè `balance = 150` — đáng lẽ phải là `200` vì cả hai lần nạp 50 đều phải được tính

Kết quả cuối: **150 thay vì 200** — mất trắng một lần cập nhật của A.

### Nguyên nhân gốc rễ

- Thao tác "đọc → tính → ghi" gồm 3 bước tách rời, không atomic
- Không có khóa (lock) hay kiểm soát isolation giữa 2 transaction chạy song song
- Thứ tự xen kẽ (interleaving) do scheduler quyết định, không đoán trước được — kết quả phụ thuộc timing chứ không phải logic

### Cách khắc phục

- **Atomic update** ở DB: `UPDATE balance = balance + 50` thay vì đọc rồi tính rồi ghi
- **Optimistic locking**: thêm cột `version`, chỉ ghi nếu version còn khớp, ngược lại retry
- **Pessimistic locking**: `SELECT ... FOR UPDATE`, hoặc mutex/semaphore ở tầng ứng dụng
- **Serializable isolation level** để DB tự phát hiện và từ chối transaction xung đột

### Sửa lại diagram này

```bash
git clone https://github.com/tt-a1i/archify.git
cd archify
node bin/archify.mjs validate sequence path/to/spec.sequence.json --quality showcase --json
node bin/archify.mjs deliver sequence path/to/spec.sequence.json path/to/diagram.html --quality showcase --json
```
