# Distributed Lock

**Diagram type:** `sequence` · **Source:** [`spec.sequence.json`](./spec.sequence.json) · **View:** [`diagram.html`](./diagram.html)

---

## English

### Summary

A distributed lock (using Redis `SET NX PX`) is the correct fix for the [Lost Update](../race-condition-lost-update/README.md) race condition: it guarantees only one instance runs the critical section at a time.

### Scenario

1. **Instance A** sends `SET lock token=A NX PX 5000` to Redis → succeeds, holds the lock
2. **Instance B** also tries `SET lock token=B NX` → Redis rejects it because the key already exists → B retries (backoff)
3. A runs the critical section (`UPDATE balance = balance + 50`), then releases the lock with a script that only deletes it **if the token still matches token=A**
4. B retries again, this time acquires successfully → only now does B run its own critical section

Result: the two instances never run the critical section at the same time — no more overlapping read-modify-write.

### Requirements for a Correct Distributed Lock

- **TTL/PX is mandatory**: if the lock holder crashes, the lock expires automatically instead of blocking forever (deadlock)
- **Unique token per acquire**: only delete the lock if the token still matches, to avoid deleting another instance's lock after its own TTL has expired
- **Atomic check-and-delete**: the "check token, then delete" operation must run inside a Lua script, otherwise it becomes a race condition of its own

### Known Limitations

- Redlock (using multiple Redis nodes for extra reliability) is still debated for safety when system clocks or the network aren't ideal (Martin Kleppmann, "How to do distributed locking," 2016)
- For high-correctness requirements (e.g. finance), combine it with a **fencing token** on the protected resource, not just the lock
- With a single Redis instance, this remains a simple solution that's good enough for most real-world use cases

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

Distributed lock (dùng Redis `SET NX PX`) là cách khắc phục đúng cho race condition kiểu [Lost Update](../race-condition-lost-update/README.md): đảm bảo chỉ một instance được chạy critical section tại một thời điểm.

### Kịch bản

1. **Instance A** gửi `SET lock token=A NX PX 5000` tới Redis → thành công, giữ khóa
2. **Instance B** cũng thử `SET lock token=B NX` → Redis từ chối vì key đã tồn tại → B retry (backoff)
3. A chạy critical section (`UPDATE balance = balance + 50`), xong thì giải phóng khóa bằng script chỉ xóa **nếu token còn khớp token=A**
4. B retry lần nữa, lần này acquire thành công → B mới được chạy critical section của mình

Kết quả: hai instance không bao giờ chạy critical section cùng lúc — không còn đọc-tính-ghi chồng chéo.

### Yêu cầu đúng của distributed lock

- **TTL/PX bắt buộc**: nếu instance giữ khóa bị crash, khóa tự động hết hạn thay vì khóa vĩnh viễn (deadlock)
- **Token duy nhất** cho mỗi lần acquire: chỉ xóa khóa nếu token còn khớp, tránh xóa nhầm khóa của instance khác sau khi TTL của mình đã hết hạn
- **Atomic check-and-delete**: thao tác "kiểm tra token rồi xóa" phải chạy trong một Lua script, nếu không tự nó lại thành một race condition mới

### Hạn chế cần biết

- Redlock (dùng nhiều Redis node để tăng độ tin cậy) vẫn bị tranh cãi về tính an toàn khi đồng hồ hệ thống hoặc network không lý tưởng (Martin Kleppmann, "How to do distributed locking", 2016)
- Với yêu cầu correctness cao (ví dụ tài chính), nên kết hợp thêm **fencing token** ở phía tài nguyên được bảo vệ, không chỉ dựa vào lock
- Với một Redis instance đơn, đây vẫn là giải pháp đơn giản và đủ dùng cho phần lớn use case thực tế

### Sửa lại diagram này

```bash
git clone https://github.com/tt-a1i/archify.git
cd archify
node bin/archify.mjs validate sequence path/to/spec.sequence.json --quality showcase --json
node bin/archify.mjs deliver sequence path/to/spec.sequence.json path/to/diagram.html --quality showcase --json
```
