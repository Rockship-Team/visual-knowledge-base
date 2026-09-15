# Database Indexing: Index Scan vs Full Table Scan

**Diagram type:** `workflow` · **Source:** [`spec.workflow.json`](./spec.workflow.json) · **View:** [`diagram.html`](./diagram.html)

---

## English

### Summary

A database index (commonly a **B-tree**) lets the query planner jump almost directly to matching rows instead of scanning the whole table. Whether a query uses the index or not can be the difference between microseconds and seconds as a table grows.

### When It Happens

**When:** Any query with a `WHERE`, `JOIN`, `ORDER BY`, or `GROUP BY` on a column without a suitable index gets progressively slower as the table grows, because a full scan's cost grows linearly with row count.

**Where to spot it:** Slow query logs, `EXPLAIN ANALYZE` output showing "Seq Scan" on a large table, endpoints that were fast in development (small dataset) but slow in production (large dataset), and foreign-key columns used in `JOIN`s without an index.

### Scenario

1. A **Client** sends `SELECT * FROM users WHERE email = 'x@example.com'`
2. The **Query Planner** checks whether there's a usable, selective index on `email`
3. **No usable index**: **Full Table Scan** — read every page of the table sequentially, checking each row against the condition
4. **A selective B-tree index exists**: **Index Scan** — traverse the tree from root to branch to leaf, then follow the leaf's pointer to fetch the matching row from the table heap
5. Either way, matching rows are returned to the client

Cost comparison: a full table scan is **O(n)** — it gets linearly slower as the table grows. An index scan is **O(log n)** to find the leaf, plus a small constant-time hop to fetch the row — it barely slows down even at millions of rows.

### How a B-Tree Index Works

- Keys are stored sorted in a balanced tree; each node holds many keys (sized to a disk page, often hundreds), so the tree stays shallow — often just 3-4 levels even for a table with millions of rows
- A lookup walks root → branch → leaf, comparing keys at each level to narrow down the search
- The leaf node stores a pointer to the actual row in the table heap — that's the extra hop that makes this an "index scan" rather than a "covering" read, unless the index itself already contains every column the query needs

### Trade-Offs and When Not to Index

- An index isn't free: every `INSERT`/`UPDATE`/`DELETE` also has to update the index, and the index itself takes disk space
- Avoid indexing low-cardinality columns (e.g. a boolean flag) where a scan touches most rows anyway
- Skip indexing very small tables, where a full scan is already fast, and columns rarely used in filters/joins/sorts
- **Do** index foreign keys and columns in frequent `WHERE`/`JOIN`/`ORDER BY` clauses; consider a composite index when queries always filter on the same combination of columns together

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

Một index trong database (thường là **B-tree**) giúp query planner nhảy gần như thẳng tới các row khớp điều kiện thay vì phải quét toàn bộ bảng. Việc một query có dùng được index hay không có thể tạo ra khác biệt giữa vài micro giây và vài giây khi bảng lớn dần.

### Khi Nào Gặp

**Khi nào:** Bất kỳ query nào có `WHERE`, `JOIN`, `ORDER BY`, hoặc `GROUP BY` trên một cột không có index phù hợp sẽ chậm dần khi bảng lớn lên, vì chi phí full scan tăng tuyến tính theo số dòng.

**Ở đâu dễ gặp:** Slow query log, output `EXPLAIN ANALYZE` hiện "Seq Scan" trên bảng lớn, endpoint chạy nhanh lúc dev (dataset nhỏ) nhưng chậm ở production (dataset lớn), và cột foreign key dùng trong `JOIN` mà không có index.

### Kịch bản

1. **Client** gửi `SELECT * FROM users WHERE email = 'x@example.com'`
2. **Query Planner** kiểm tra xem có index nào dùng được và đủ selective trên `email` không
3. **Không có index phù hợp**: **Full Table Scan** — đọc tuần tự từng page của bảng, kiểm tra từng row với điều kiện
4. **Có B-tree index đủ selective**: **Index Scan** — duyệt cây từ root qua branch xuống leaf, rồi theo pointer ở leaf để lấy row tương ứng từ table heap
5. Dù theo nhánh nào, các row khớp điều kiện đều được trả về client

So sánh chi phí: full table scan là **O(n)** — chậm dần tuyến tính khi bảng lớn lên. Index scan là **O(log n)** để tìm tới leaf, cộng thêm một bước lấy row với chi phí gần như hằng số — gần như không chậm đi kể cả khi bảng có hàng triệu dòng.

### Cách B-Tree Index Hoạt Động

- Các key được lưu có thứ tự trong một cây cân bằng; mỗi node chứa nhiều key (kích thước bằng một disk page, thường hàng trăm key), nên cây luôn nông — thường chỉ 3-4 tầng dù bảng có hàng triệu dòng
- Một lần tra cứu đi từ root → branch → leaf, so sánh key ở mỗi tầng để thu hẹp phạm vi tìm kiếm
- Leaf node lưu một pointer trỏ tới row thật trong table heap — đây là bước phụ khiến nó gọi là "index scan" chứ không phải "covering read", trừ khi bản thân index đã chứa đủ mọi cột query cần

### Đánh Đổi và Khi Nào Không Nên Index

- Index không miễn phí: mỗi `INSERT`/`UPDATE`/`DELETE` cũng phải cập nhật index, và bản thân index chiếm thêm dung lượng đĩa
- Tránh index các cột có cardinality thấp (ví dụ một cờ boolean), vì scan vẫn phải chạm hầu hết các row
- Bỏ qua việc index bảng rất nhỏ, nơi full scan đã đủ nhanh, và các cột hiếm khi xuất hiện trong filter/join/sort
- **Nên** index foreign key và các cột thường xuất hiện trong `WHERE`/`JOIN`/`ORDER BY`; cân nhắc composite index khi query luôn lọc theo cùng một tổ hợp cột

### Sửa lại diagram này

```bash
git clone https://github.com/tt-a1i/archify.git
cd archify
node bin/archify.mjs validate workflow path/to/spec.workflow.json --quality showcase --json
node bin/archify.mjs deliver workflow path/to/spec.workflow.json path/to/diagram.html --quality showcase --json
```
