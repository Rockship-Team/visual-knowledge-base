# Idempotency Key: an toàn khi retry API

**Loại diagram:** `sequence` · **Nguồn:** [`spec.sequence.json`](./spec.sequence.json) · **Xem:** [`diagram.html`](./diagram.html)

## Tóm tắt

**Idempotency key** là một token duy nhất do client sinh ra và gửi kèm mỗi request có side effect (ví dụ tạo thanh toán). Nó giúp server phân biệt được "request mới" với "request retry của cùng một hành động", để một thao tác không vô tình bị thực hiện hai lần khi mạng không ổn định.

## Kịch bản

1. **Client** gọi `POST /charge` kèm header `Idempotency-Key: abc123`
2. **API** kiểm tra Idempotency Store, chưa thấy key này
3. API gọi **Payment Gateway** để charge thẻ, gateway trả về thành công
4. API lưu kết quả vào Idempotency Store, gắn với key `abc123`
5. API trả `200 OK` về client — nhưng response này **bị mất trên đường mạng** (timeout)
6. Client không biết request trước có thành công hay không, nên **gửi lại y hệt request** với cùng `Idempotency-Key: abc123`
7. API kiểm tra Idempotency Store, thấy key đã có kết quả — **trả thẳng kết quả cũ**, không gọi lại Payment Gateway

Kết quả: thẻ chỉ bị charge **đúng một lần**, dù client gửi request hai lần.

## Vấn đề nếu không có idempotency key

- Sau timeout, client không có cách nào biết chắc request trước đã xử lý xong hay chưa
- Retry một cách ngây thơ (gửi lại request giống hệt) có thể khiến side effect (charge, tạo đơn hàng, gửi email...) bị lặp lại
- Server không có cơ chế nào để nhận ra hai request đến từ cùng một hành động của người dùng

## Cách triển khai đúng

- Idempotency key do **client** sinh ra (thường là UUID) và gửi kèm trong header, không phải server tự tạo
- Server lưu `key` + hash của request body + kết quả xử lý vào một bảng riêng (Idempotency Store)
- Đặt **unique constraint** trên cột key để tránh ghi trùng khi có tranh chấp
- Nếu hai retry đến gần như đồng thời, cần thêm lock/transaction khi ghi vào Idempotency Store để tránh chính request retry lại tạo ra race condition mới
- Idempotency key nên có TTL hợp lý và gắn với payload hash để tránh bị tái sử dụng sai mục đích cho một request khác

## Sửa lại diagram này

```bash
git clone https://github.com/tt-a1i/archify.git
cd archify
node bin/archify.mjs validate sequence path/to/spec.sequence.json --quality showcase --json
node bin/archify.mjs deliver sequence path/to/spec.sequence.json path/to/diagram.html --quality showcase --json
```
