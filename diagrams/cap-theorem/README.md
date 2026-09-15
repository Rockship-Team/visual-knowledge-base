# CAP Theorem: Consistency vs Availability During a Network Partition

**Diagram type:** `workflow` · **Source:** [`spec.workflow.json`](./spec.workflow.json) · **View:** [`diagram.html`](./diagram.html)

---

## English

### Summary

The **CAP theorem** says a distributed data system cannot simultaneously guarantee all three properties: **C**onsistency (every node returns the same, most recent data), **A**vailability (every request still gets a response, no error), and **P**artition tolerance (the system keeps working when the network between nodes is split). In practice, Partition tolerance is essentially unavoidable — the network will fail sometimes — so the real question isn't "pick one of three", it's **choosing C or A when a partition happens**.

### When It Happens

**When:** Whenever a system spans more than one node and the network between them can fail or slow down — at scale, that's a matter of "when", not "if".

**Where to spot it:** Multi-region databases, service meshes with cross-AZ calls, any replicated datastore (Postgres with read replicas, Cassandra, DynamoDB, etcd), and design reviews where someone asks "what happens if this node can't reach that one?"

### Scenario

1. Normally: the client reads/writes through **Node A** and **Node B**, and the two nodes stay continuously in sync
2. A **Network Partition** happens: Node A and Node B lose connection to each other, but both still receive requests from the client
3. The client sends a read request to Node B during the partition — the system must pick one of two branches:
4. **CP branch**: Node B refuses to answer or returns an error because it can't confirm it has the latest data from Node A → stays Consistent, sacrifices Availability
5. **AP branch**: Node B answers anyway with its local data, which may be stale → stays Available, sacrifices Consistency
6. Once the partition is fixed, the two nodes re-sync (reconcile)

P isn't a choice — the network will partition eventually. What engineers actually decide is what the system does **when** it happens: refuse to serve to stay correct, or serve anyway with data that might be stale.

### Real-World Examples

- Systems leaning **CP**: consensus-based systems like etcd, ZooKeeper, or RDBMSs with strong consistency — prioritize correct data over always answering
- Systems leaning **AP**: Cassandra, DynamoDB-style eventual consistency — prioritize always responding, accepting data that may briefly disagree across nodes
- Many modern systems let you tune consistency per-operation (e.g. per-query consistency level in Cassandra) instead of locking the whole system to one side

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

**CAP theorem** nói rằng một hệ thống dữ liệu phân tán không thể đồng thời đảm bảo cả 3 tính chất: **C**onsistency (mọi node trả về dữ liệu mới nhất giống nhau), **A**vailability (mọi request đều nhận được response, không lỗi), và **P**artition tolerance (hệ thống vẫn hoạt động khi mạng giữa các node bị chia cắt). Trong thực tế, Partition tolerance gần như bắt buộc phải chấp nhận — mạng sẽ luôn có lúc lỗi — nên câu hỏi thật sự không phải "chọn cái nào trong 3 cái", mà là **chọn C hay A khi partition xảy ra**.

### Khi Nào Cần Quan Tâm

**Khi nào:** Bất cứ khi nào hệ thống trải trên nhiều hơn một node và mạng giữa chúng có thể lỗi hoặc chậm — ở quy mô lớn, đây là chuyện "khi nào" chứ không phải "có xảy ra hay không".

**Ở đâu dễ gặp:** Database multi-region, service mesh gọi cross-AZ, mọi datastore có replication (Postgres kèm read replica, Cassandra, DynamoDB, etcd), và trong các buổi design review khi có người hỏi "nếu node này không gọi được tới node kia thì sao?"

### Kịch bản

1. Bình thường: Client đọc/ghi qua **Node A** và **Node B**, hai node đồng bộ liên tục
2. **Network Partition** xảy ra: Node A và Node B mất kết nối với nhau, nhưng cả hai vẫn nhận được request từ client
3. Client gửi một request đọc tới Node B trong lúc partition — hệ thống phải chọn một trong hai nhánh:
4. **Nhánh CP**: Node B từ chối trả lời hoặc trả lỗi vì không xác nhận được nó đang có dữ liệu mới nhất từ Node A → giữ Consistency, hy sinh Availability
5. **Nhánh AP**: Node B vẫn trả lời bằng dữ liệu cục bộ, có thể đã cũ (stale) → giữ Availability, hy sinh Consistency
6. Khi partition được khắc phục, hai node đồng bộ lại (reconcile)

P không phải là lựa chọn — mạng chắc chắn sẽ partition. Điều engineer thực sự quyết định là hệ thống làm gì **khi** nó xảy ra: từ chối phục vụ để giữ đúng, hay phục vụ tạm với dữ liệu có thể cũ.

### Ứng dụng thực tế

- Hệ thiên về **CP**: các hệ dùng consensus như etcd, ZooKeeper, hoặc RDBMS với strong consistency — ưu tiên đúng dữ liệu hơn là luôn trả lời được
- Hệ thiên về **AP**: Cassandra, DynamoDB kiểu eventual consistency — ưu tiên luôn phản hồi, chấp nhận dữ liệu có thể tạm thời không khớp giữa các node
- Nhiều hệ thống hiện đại cho phép tune per-operation (ví dụ mức consistency theo từng query trong Cassandra) thay vì cố định toàn hệ thống vào một phía

### Sửa lại diagram này

```bash
git clone https://github.com/tt-a1i/archify.git
cd archify
node bin/archify.mjs validate workflow path/to/spec.workflow.json --quality showcase --json
node bin/archify.mjs deliver workflow path/to/spec.workflow.json path/to/diagram.html --quality showcase --json
```
