# Eventual Consistency: Read-Your-Writes Anomaly

**Diagram type:** `dataflow` · **Source:** [`spec.dataflow.json`](./spec.dataflow.json) · **View:** [`diagram.html`](./diagram.html)

---

## English

### Summary

Illustrates the **read-your-writes anomaly** in a system using **eventual consistency**: a client writes successfully, but an immediate read can still see stale data, because replication between nodes is asynchronous and lags.

### Scenario

1. **Client** writes new data (`PUT /profile`) to the **Primary DB**. Primary ACKs immediately, without waiting for replication to finish.
2. Primary **replicates asynchronously** to **Replica 1** and **Replica 2**.
3. Replica 1 catches up in time → a client reading from Replica 1 **afterwards** sees the fresh data.
4. Replica 2 lags behind → if a client reads from Replica 2 **right after the write**, it gets stale data back.

This is called the **read-your-writes anomaly**: the write succeeded, but a read right after it doesn't see the change you just made — a side effect of replication lag, not a logic bug.

### Root Cause

- Asynchronous replication is a deliberate trade-off: it buys lower write latency and higher availability for the system
- Every replica converges to the same value after some delay (that's what "eventually consistent" means), but during that window replicas can disagree
- The problem shows up more often when a load balancer routes a client's consecutive read/write requests to different replicas

### How to Guarantee Read-Your-Writes

- **Sticky session**: after a client writes, route its subsequent reads back to Primary for a short window
- **Read from Primary** for the request immediately following a write, only switching to replica reads once the replication lag has surely passed
- **Session/causal consistency**: the server remembers the version the client just wrote; a replica only answers once it has caught up to that version
- **Versioned reads**: the client sends the version it wrote; the replica refuses/delays its answer until it has caught up

### Rebuild this diagram

```bash
git clone https://github.com/tt-a1i/archify.git
cd archify
node bin/archify.mjs validate dataflow path/to/spec.dataflow.json --quality showcase --json
node bin/archify.mjs deliver dataflow path/to/spec.dataflow.json path/to/diagram.html --quality showcase --json
```

---

## Tiếng Việt

### Tóm tắt

Minh họa hiện tượng **read-your-writes anomaly** trong một hệ thống dùng **eventual consistency**: client ghi xong nhưng đọc lại ngay lập tức có thể vẫn thấy dữ liệu cũ, vì replication giữa các node là bất đồng bộ và có độ trễ.

### Kịch bản

1. **Client** ghi dữ liệu mới (`PUT /profile`) vào **Primary DB**. Primary trả về ACK ngay lập tức, không đợi replicate xong.
2. Primary **replicate bất đồng bộ** dữ liệu mới sang **Replica 1** và **Replica 2**.
3. Replica 1 nhận kịp bản replicate → client đọc từ Replica 1 **sau đó** sẽ thấy dữ liệu mới.
4. Replica 2 nhận trễ hơn (còn đang lag) → nếu client đọc từ Replica 2 **ngay sau khi ghi**, sẽ nhận lại dữ liệu cũ.

Đây gọi là **read-your-writes anomaly**: ghi thành công rồi, nhưng đọc ngay sau đó lại không thấy chính thay đổi mình vừa tạo ra — do độ trễ replicate, không phải bug logic.

### Nguyên nhân

- Replication bất đồng bộ là một đánh đổi có chủ đích: đổi lấy write latency thấp hơn và availability cao hơn cho hệ thống
- Mỗi replica sẽ hội tụ về cùng một giá trị sau một khoảng thời gian (đó là ý nghĩa của "eventually consistent"), nhưng trong khoảng trễ đó các replica có thể trả về dữ liệu khác nhau
- Vấn đề càng dễ gặp khi có load balancer định tuyến các request đọc/ghi liên tiếp của cùng một client tới các replica khác nhau

### Cách đảm bảo Read-Your-Writes

- **Sticky session**: sau khi client ghi, định tuyến các lần đọc tiếp theo của chính client đó về Primary trong một khoảng thời gian
- **Đọc từ Primary** cho chính request theo sau ngay một lần ghi, chỉ chuyển sang đọc replica sau khi chắc chắn đã hết độ trễ replicate
- **Session/causal consistency**: server ghi nhớ version dữ liệu client vừa ghi, replica chỉ trả lời khi đã bắt kịp version đó
- **Versioned reads**: client gửi kèm version đã ghi, replica từ chối/hoãn trả lời nếu chưa bắt kịp

### Sửa lại diagram này

```bash
git clone https://github.com/tt-a1i/archify.git
cd archify
node bin/archify.mjs validate dataflow path/to/spec.dataflow.json --quality showcase --json
node bin/archify.mjs deliver dataflow path/to/spec.dataflow.json path/to/diagram.html --quality showcase --json
```
