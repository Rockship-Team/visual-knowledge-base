# Deadlock: Circular Wait giữa 2 Transaction

**Loại diagram:** `sequence` · **Nguồn:** [`spec.sequence.json`](./spec.sequence.json) · **Xem:** [`diagram.html`](./diagram.html)

## Tóm tắt

Minh họa deadlock kinh điển giữa hai transaction database: mỗi transaction giữ một khóa mà transaction kia đang cần, tạo thành **vòng chờ (circular wait)** và cả hai bị block vĩnh viễn nếu không có deadlock detector can thiệp.

## Kịch bản

1. **Transaction A** khóa `Row 1` thành công
2. **Transaction B** khóa `Row 2` thành công
3. A xin khóa `Row 2` → bị block vì B đang giữ
4. B xin khóa `Row 1` → bị block vì A đang giữ → **vòng chờ khép kín**
5. Deadlock detector của DB phát hiện chu trình, chọn B làm "nạn nhân", abort và rollback B, giải phóng khóa của B
6. A nhận được khóa `Row 2`, tiếp tục và commit bình thường

Kết quả: Transaction B bị lỗi (phải retry ở tầng ứng dụng), Transaction A hoàn tất — không có transaction nào chờ mãi mãi nhờ deadlock detector.

## Nguyên nhân gốc rễ

- Không có thứ tự khóa nhất quán (lock ordering) giữa các transaction — mỗi transaction khóa các row theo thứ tự khác nhau
- Thỏa mãn đủ 4 điều kiện Coffman: mutual exclusion, hold-and-wait, no preemption, circular wait
- Transaction chạy càng lâu, càng khóa nhiều row thì xác suất xảy ra deadlock càng cao

## Cách khắc phục

- **Áp đặt thứ tự khóa toàn cục** giống nhau cho mọi transaction (ví dụ luôn khóa theo id tăng dần) — phá vỡ điều kiện circular wait
- **Giữ transaction ngắn**, commit sớm để giảm thời gian giữ khóa
- `SELECT ... FOR UPDATE NOWAIT` hoặc `SKIP LOCKED` để không bị block vô hạn, thất bại nhanh thay vì chờ
- Để DB tự phát hiện deadlock, abort transaction nạn nhân và retry ở tầng ứng dụng

## Sửa lại diagram này

```bash
git clone https://github.com/tt-a1i/archify.git
cd archify
node bin/archify.mjs validate sequence path/to/spec.sequence.json --quality showcase --json
node bin/archify.mjs deliver sequence path/to/spec.sequence.json path/to/diagram.html --quality showcase --json
```
