# Race Condition: Lost Update

**Loại diagram:** `sequence` · **Nguồn:** [`spec.sequence.json`](./spec.sequence.json) · **Xem:** [`diagram.html`](./diagram.html)

## Tóm tắt

Minh họa race condition kiểu **Lost Update** trên số dư tài khoản, khi hai client cùng đọc-tính-ghi (read-modify-write) mà không có cơ chế đồng bộ.

## Kịch bản

1. **Client A** đọc `balance = 100` → tính `100 + 50 = 150`
2. Trước khi A kịp ghi, **Client B** cũng đọc `balance = 100` (giá trị cũ, chưa cập nhật) → cũng tính ra `150`
3. A ghi `balance = 150` (đúng tại thời điểm đó)
4. B ghi đè `balance = 150` — đáng lẽ phải là `200` vì cả hai lần nạp 50 đều phải được tính

Kết quả cuối: **150 thay vì 200** — mất trắng một lần cập nhật của A.

## Nguyên nhân gốc rễ

- Thao tác "đọc → tính → ghi" gồm 3 bước tách rời, không atomic
- Không có khóa (lock) hay kiểm soát isolation giữa 2 transaction chạy song song
- Thứ tự xen kẽ (interleaving) do scheduler quyết định, không đoán trước được — kết quả phụ thuộc timing chứ không phải logic

## Cách khắc phục

- **Atomic update** ở DB: `UPDATE balance = balance + 50` thay vì đọc rồi tính rồi ghi
- **Optimistic locking**: thêm cột `version`, chỉ ghi nếu version còn khớp, ngược lại retry
- **Pessimistic locking**: `SELECT ... FOR UPDATE`, hoặc mutex/semaphore ở tầng ứng dụng
- **Serializable isolation level** để DB tự phát hiện và từ chối transaction xung đột

## Sửa lại diagram này

```bash
git clone https://github.com/tt-a1i/archify.git
cd archify
node bin/archify.mjs validate sequence path/to/spec.sequence.json --quality showcase --json
node bin/archify.mjs deliver sequence path/to/spec.sequence.json path/to/diagram.html --quality showcase --json
```
