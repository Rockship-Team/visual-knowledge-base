# Distributed Lock

**Loại diagram:** `sequence` · **Nguồn:** [`spec.sequence.json`](./spec.sequence.json) · **Xem:** [`diagram.html`](./diagram.html)

## Tóm tắt

Distributed lock (dùng Redis `SET NX PX`) là cách khắc phục đúng cho race condition kiểu [Lost Update](../race-condition-lost-update/README.md): đảm bảo chỉ một instance được chạy critical section tại một thời điểm.

## Kịch bản

1. **Instance A** gửi `SET lock token=A NX PX 5000` tới Redis → thành công, giữ khóa
2. **Instance B** cũng thử `SET lock token=B NX` → Redis từ chối vì key đã tồn tại → B retry (backoff)
3. A chạy critical section (`UPDATE balance = balance + 50`), xong thì giải phóng khóa bằng script chỉ xóa **nếu token còn khớp token=A**
4. B retry lần nữa, lần này acquire thành công → B mới được chạy critical section của mình

Kết quả: hai instance không bao giờ chạy critical section cùng lúc — không còn đọc-tính-ghi chồng chéo.

## Yêu cầu đúng của distributed lock

- **TTL/PX bắt buộc**: nếu instance giữ khóa bị crash, khóa tự động hết hạn thay vì khóa vĩnh viễn (deadlock)
- **Token duy nhất** cho mỗi lần acquire: chỉ xóa khóa nếu token còn khớp, tránh xóa nhầm khóa của instance khác sau khi TTL của mình đã hết hạn
- **Atomic check-and-delete**: thao tác "kiểm tra token rồi xóa" phải chạy trong một Lua script, nếu không tự nó lại thành một race condition mới

## Hạn chế cần biết

- Redlock (dùng nhiều Redis node để tăng độ tin cậy) vẫn bị tranh cãi về tính an toàn khi đồng hồ hệ thống hoặc network không lý tưởng (Martin Kleppmann, "How to do distributed locking", 2016)
- Với yêu cầu correctness cao (ví dụ tài chính), nên kết hợp thêm **fencing token** ở phía tài nguyên được bảo vệ, không chỉ dựa vào lock
- Với một Redis instance đơn, đây vẫn là giải pháp đơn giản và đủ dùng cho phần lớn use case thực tế

## Sửa lại diagram này

```bash
git clone https://github.com/tt-a1i/archify.git
cd archify
node bin/archify.mjs validate sequence path/to/spec.sequence.json --quality showcase --json
node bin/archify.mjs deliver sequence path/to/spec.sequence.json path/to/diagram.html --quality showcase --json
```
