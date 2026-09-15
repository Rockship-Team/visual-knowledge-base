# The N+1 Query Problem

**Diagram type:** `sequence` · **Source:** [`spec.sequence.json`](./spec.sequence.json) · **View:** [`diagram.html`](./diagram.html)

---

## English

### Summary

The **N+1 query problem** happens when fetching a list of N parent records triggers 1 query for the list, plus N additional queries — one per item — for related data, instead of fetching everything in a constant number of queries.

### When It Happens

**When:** Any time you loop over a list and, for each item, trigger a separate query to fetch related data — most ORMs make this invisible because the query fires lazily the moment you access the related property.

**Where to spot it:** List endpoints that include nested/related resources (orders+items, posts+comments, users+roles), GraphQL resolvers that fetch a field per node, and APM/query-log traces showing dozens or hundreds of near-identical queries for a single request.

### Scenario

1. **Client** calls `GET /orders`
2. **API** runs `SELECT * FROM orders` → gets back 3 order rows
3. Looping over the 3 orders, the ORM lazily fires `SELECT * FROM order_items WHERE order_id = 1`, then `= 2`, then `= 3` — one query per order
4. API assembles the orders with their items and returns `200 JSON` to the client

1 query for the order list + 3 queries for items (N = 3) = 4 queries for this small example. With 1,000 orders, that becomes **1,001 queries for a single request**.

### Root Cause

- Most ORMs lazy-load associations by default, so `order.items` inside a loop silently fires a new query on first access
- This is invisible in code review and invisible with small dev datasets, so it only becomes a visible problem once the table grows in production

### How to Fix It

- **Eager loading**: a SQL `JOIN`, or the ORM's `include`/`with`/`preload` option, to fetch orders and items together in one or two queries
- **Batch loading**: `WHERE order_id IN (...)` instead of one query per row
- **DataLoader pattern** for GraphQL resolvers — batches and dedupes requests per tick
- **Query logging / APM** in development or CI to catch N+1 patterns before they reach production

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

**N+1 query problem** xảy ra khi lấy danh sách N bản ghi cha kích hoạt 1 query cho danh sách, cộng thêm N query nữa — mỗi bản ghi một query — để lấy dữ liệu liên quan, thay vì lấy tất cả chỉ với một số lượng query cố định.

### Khi Nào Gặp

**Khi nào:** Bất cứ khi nào bạn lặp qua một danh sách và, với mỗi phần tử, kích hoạt một query riêng để lấy dữ liệu liên quan — hầu hết ORM khiến điều này vô hình vì query được bắn ra lazy ngay khi bạn truy cập property liên quan.

**Ở đâu dễ gặp:** Endpoint trả danh sách có kèm resource liên quan (orders+items, posts+comments, users+roles), GraphQL resolver lấy một field cho từng node, và trace APM/query-log cho thấy hàng chục hoặc hàng trăm query gần giống hệt nhau cho một request.

### Kịch bản

1. **Client** gọi `GET /orders`
2. **API** chạy `SELECT * FROM orders` → nhận về 3 dòng order
3. Lặp qua 3 order, ORM lazy bắn ra `SELECT * FROM order_items WHERE order_id = 1`, rồi `= 2`, rồi `= 3` — mỗi order một query
4. API ghép các order với item của chúng và trả `200 JSON` về client

1 query cho danh sách order + 3 query cho item (N = 3) = 4 query cho ví dụ nhỏ này. Với 1.000 order, con số đó trở thành **1.001 query cho một request**.

### Nguyên nhân gốc rễ

- Hầu hết ORM lazy-load association theo mặc định, nên `order.items` bên trong vòng lặp âm thầm bắn ra một query mới ngay lần truy cập đầu tiên
- Điều này vô hình khi code review và vô hình với dataset dev nhỏ, nên chỉ trở thành vấn đề rõ ràng khi bảng dữ liệu lớn dần trên production

### Cách khắc phục

- **Eager loading**: dùng SQL `JOIN`, hoặc option `include`/`with`/`preload` của ORM, để lấy order và item cùng lúc trong một hoặc hai query
- **Batch loading**: dùng `WHERE order_id IN (...)` thay vì một query cho mỗi dòng
- **DataLoader pattern** cho GraphQL resolver — gộp và loại trùng request trong cùng một tick
- **Query logging / APM** ở môi trường dev hoặc CI để bắt các pattern N+1 trước khi chúng lên production

### Sửa lại diagram này

```bash
git clone https://github.com/tt-a1i/archify.git
cd archify
node bin/archify.mjs validate sequence path/to/spec.sequence.json --quality showcase --json
node bin/archify.mjs deliver sequence path/to/spec.sequence.json path/to/diagram.html --quality showcase --json
```
