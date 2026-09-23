# Snapshot Isolation via MVCC: Readers Never Block Writers

**Diagram type:** `sequence` · **Source:** [`spec.sequence.json`](./spec.sequence.json) · **View:** [`diagram.html`](./diagram.html)

---

## English

### Summary

Shows how **Multi-Version Concurrency Control (MVCC)** gives a long-running transaction a consistent **Snapshot Isolation** view of the database, even while another transaction writes and commits a change to the exact row it's reading — without either transaction ever blocking the other.

### When It Happens

**When:** Every time a transaction reads a row while another transaction concurrently updates and commits a change to that same row.

**Where to spot it:** Long-running reports or exports running alongside live traffic, PostgreSQL's default `REPEATABLE READ` (which is actually Snapshot Isolation), and any "why did my report show old numbers even though the dashboard already updated" question.

### Scenario

1. **Transaction A** begins and takes a snapshot — from this point on, it will only ever see the version of each row as it existed at this moment (`v1`).
2. A reads `balance = 100` (`v1`).
3. **Transaction B** begins, updates the same row to `150`, and commits — this creates a new version, `v2`, without taking any lock that would block A.
4. A reads the same row again, using the same snapshot: it still sees `balance = 100`, `v1` — never `v2`.

A never blocked B, and B never blocked A — they simply operated on different versions of the same row, each one consistent with the moment it started.

### How Snapshot Isolation Avoids Blocking

- Every transaction reads the version of each row that was committed at the moment its own snapshot was taken
- Writers never block readers and readers never block writers, because they simply operate on different versions of the same row
- No read locks are needed — this is why MVCC scales so much better than lock-based isolation under mixed read/write load

### The Trade-off: Write Skew

- Snapshot Isolation prevents dirty reads and non-repeatable reads, but not **Write Skew**
- Two transactions can each read overlapping data, both pass a check that looked safe, and both commit — together violating an invariant neither one alone would have broken
- Serializable Snapshot Isolation (SSI) closes this gap by detecting the dangerous read/write pattern and aborting one transaction

### Old Versions Have a Cost

- A row version can't be deleted the instant it's superseded — some other transaction's snapshot might still need it
- A background process (e.g. PostgreSQL's `VACUUM`) reclaims versions only once no active snapshot could possibly reference them
- Long-running transactions delay this cleanup and are a common cause of table bloat

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

Minh họa cách **Multi-Version Concurrency Control (MVCC)** cho một transaction chạy lâu một góc nhìn **Snapshot Isolation** nhất quán về database, ngay cả khi một transaction khác ghi và commit thay đổi vào đúng dòng nó đang đọc — mà không transaction nào phải chặn transaction kia.

### Khi Nào Gặp

**Khi nào:** Mỗi khi một transaction đọc một dòng trong lúc một transaction khác đồng thời cập nhật và commit thay đổi vào chính dòng đó.

**Ở đâu dễ gặp:** Báo cáo hoặc export chạy lâu song song với traffic thực, mức isolation mặc định `REPEATABLE READ` của PostgreSQL (thực chất là Snapshot Isolation), và câu hỏi kiểu "sao báo cáo của em vẫn hiện số cũ dù dashboard đã cập nhật rồi".

### Kịch bản

1. **Transaction A** bắt đầu và lấy một snapshot — từ giờ trở đi, nó chỉ thấy phiên bản của mỗi dòng đúng như tại thời điểm này (`v1`).
2. A đọc `balance = 100` (`v1`).
3. **Transaction B** bắt đầu, cập nhật cùng dòng thành `150`, rồi commit — tạo ra phiên bản mới `v2`, không cần khóa nào có thể chặn A.
4. A đọc lại cùng dòng, vẫn dùng snapshot cũ: vẫn thấy `balance = 100`, `v1` — không bao giờ thấy `v2`.

A không hề chặn B, và B cũng không hề chặn A — cả hai đơn giản là thao tác trên hai phiên bản khác nhau của cùng một dòng, mỗi phiên bản nhất quán với thời điểm nó bắt đầu.

### Cách Snapshot Isolation Tránh Blocking

- Mỗi transaction đọc đúng phiên bản của mỗi dòng đã được commit tại thời điểm snapshot của chính nó được lấy
- Writer không bao giờ chặn reader và reader không bao giờ chặn writer, vì chúng đơn giản thao tác trên các phiên bản khác nhau của cùng một dòng
- Không cần read lock nào cả — đây là lý do MVCC scale tốt hơn hẳn so với isolation dựa trên lock khi tải đọc/ghi trộn lẫn

### Đánh Đổi: Write Skew

- Snapshot Isolation ngăn được dirty read và non-repeatable read, nhưng không ngăn được **Write Skew**
- Hai transaction có thể mỗi bên đọc dữ liệu chồng lấn nhau, đều pass một kiểm tra tưởng như an toàn, rồi cùng commit — kết hợp lại vi phạm một ràng buộc mà một mình mỗi transaction không hề vi phạm
- Serializable Snapshot Isolation (SSI) đóng lỗ hổng này bằng cách phát hiện pattern đọc/ghi nguy hiểm và abort một trong hai transaction

### Phiên bản cũ cũng có chi phí

- Một phiên bản dòng không thể bị xóa ngay khi bị thay thế — transaction khác có thể vẫn cần đến nó qua snapshot của mình
- Một tiến trình chạy nền (ví dụ `VACUUM` của PostgreSQL) chỉ dọn dẹp phiên bản khi không còn snapshot đang hoạt động nào có thể tham chiếu tới nó
- Transaction chạy lâu làm trì hoãn việc dọn dẹp này và là nguyên nhân phổ biến gây phình bảng (table bloat)

### Sửa lại diagram này

```bash
git clone https://github.com/tt-a1i/archify.git
cd archify
node bin/archify.mjs validate sequence path/to/spec.sequence.json --quality showcase --json
node bin/archify.mjs deliver sequence path/to/spec.sequence.json path/to/diagram.html --quality showcase --json
```
