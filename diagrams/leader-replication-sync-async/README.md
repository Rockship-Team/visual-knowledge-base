# Leader-Based Replication: Synchronous vs Asynchronous Followers

**Diagram type:** `sequence` · **Source:** [`spec.sequence.json`](./spec.sequence.json) · **View:** [`diagram.html`](./diagram.html)

---

## English

### Summary

Shows what happens on a single write in **leader-based replication** when one follower is **synchronous** (the leader waits for its ack before confirming the write) and another is **asynchronous** (it gets the copy in the background, with no guarantee it has landed before the client moves on).

### When It Happens

**When:** On every write to a leader-based replicated database — the leader always has to decide, per follower, whether to wait for the replica to confirm before it tells the client the write succeeded.

**Where to spot it:** PostgreSQL streaming replication configuration, MySQL semi-sync replication, MongoDB write concern, Kafka producer `acks` settings — anywhere a system exposes a durability-vs-latency knob for replicas.

### Scenario

1. **Client** sends a write to the **Leader**.
2. Leader replicates to the **synchronous follower** and **waits** for its acknowledgment.
3. Leader also sends the same data to the **asynchronous follower**, but does not wait for it.
4. As soon as the sync follower acks, the leader tells the client the write is committed — the async follower is still catching up.
5. The async follower's acknowledgment arrives later, well after the client already moved on.

Only the leader and the **synchronous** follower have the data at the moment of "committed" — the async follower is temporarily behind, and would lose that write if the leader crashed before replicating to it.

### Root Cause

- Replication factor doesn't guarantee immediate consistency — each follower can be configured with a different durability guarantee
- A synchronous follower trades write latency for durability: the leader can't confirm faster than its slowest sync follower
- An asynchronous follower trades durability for latency: it never blocks the leader, but can silently lag or lose the most recent writes on leader failure

### How to Choose

- Use at least one **synchronous** follower when losing the last few writes on leader failure is unacceptable (payments, inventory, financial ledgers)
- Keep the rest **asynchronous** to avoid one slow replica stalling every write — this is called semi-synchronous replication
- If a synchronous follower goes down, most systems either block writes or automatically fail over to treating another follower as synchronous — know which one your database does

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

Minh họa điều gì xảy ra với một lần ghi trong **leader-based replication** khi một follower là **đồng bộ (synchronous)** — leader đợi ack rồi mới xác nhận ghi — và một follower khác là **bất đồng bộ (asynchronous)** — nhận bản sao ở nền, không đảm bảo đã cập nhật kịp trước khi client tiếp tục.

### Khi Nào Gặp

**Khi nào:** Ở mọi lần ghi vào một database dùng leader-based replication — leader luôn phải quyết định, với từng follower, có đợi replica xác nhận trước khi báo client ghi thành công hay không.

**Ở đâu dễ gặp:** Cấu hình streaming replication của PostgreSQL, semi-sync replication của MySQL, write concern của MongoDB, cấu hình `acks` của Kafka producer — bất cứ đâu hệ thống cho phép chỉnh nút đánh đổi durability-vs-latency cho replica.

### Kịch bản

1. **Client** gửi yêu cầu ghi tới **Leader**.
2. Leader replicate sang **follower đồng bộ** và **đợi** ack từ follower đó.
3. Leader cũng gửi cùng dữ liệu sang **follower bất đồng bộ**, nhưng không đợi.
4. Ngay khi follower đồng bộ ack, leader báo client ghi đã commit — follower bất đồng bộ vẫn đang bắt kịp.
5. Ack của follower bất đồng bộ đến sau đó, khi client đã tiếp tục xử lý việc khác.

"Committed" mà client nhận được chỉ có nghĩa là leader và follower **đồng bộ** đã có dữ liệu — follower bất đồng bộ tạm thời bị trễ, và sẽ mất luôn lần ghi đó nếu leader crash trước khi kịp replicate sang nó.

### Nguyên nhân

- Số lượng bản sao (replication factor) không đảm bảo consistency tức thời — mỗi follower có thể cấu hình mức đảm bảo durability khác nhau
- Follower đồng bộ đánh đổi write latency lấy durability: leader không thể xác nhận nhanh hơn follower đồng bộ chậm nhất
- Follower bất đồng bộ đánh đổi durability lấy latency: không bao giờ chặn leader, nhưng có thể âm thầm bị trễ hoặc mất các ghi gần nhất khi leader chết

### Cách lựa chọn

- Dùng ít nhất một follower **đồng bộ** khi việc mất vài ghi gần nhất lúc leader chết là không chấp nhận được (thanh toán, tồn kho, sổ cái tài chính)
- Giữ các follower còn lại **bất đồng bộ** để một replica chậm không làm nghẽn mọi lần ghi — gọi là semi-synchronous replication
- Nếu follower đồng bộ bị down, hầu hết hệ thống hoặc chặn ghi, hoặc tự động chuyển một follower khác thành đồng bộ — cần biết rõ database của mình xử lý theo cách nào

### Sửa lại diagram này

```bash
git clone https://github.com/tt-a1i/archify.git
cd archify
node bin/archify.mjs validate sequence path/to/spec.sequence.json --quality showcase --json
node bin/archify.mjs deliver sequence path/to/spec.sequence.json path/to/diagram.html --quality showcase --json
```
