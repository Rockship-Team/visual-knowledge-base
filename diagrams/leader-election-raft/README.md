# Leader Election: Raft Consensus Basics

**Diagram type:** `lifecycle` · **Source:** [`spec.lifecycle.json`](./spec.lifecycle.json) · **View:** [`diagram.html`](./diagram.html)

---

## English

### Summary

In a distributed system, multiple nodes need to agree on **a single leader** to avoid write conflicts. Raft solves this with a simple state machine: **Follower → Candidate → Leader**, driven by majority voting (quorum).

### When It Happens

**When:** Any distributed system that needs exactly one active coordinator to avoid conflicting decisions — schedulers, distributed locks themselves, and consensus-backed config stores.

**Where to spot it:** etcd/ZooKeeper/Consul clusters, Kafka controller election, a self-hosted job scheduler running on multiple replicas, and any primary/replica database setup that needs an automatic failover decision.

### Scenario

1. **Follower** is the default state: the node passively waits for heartbeats from the current leader
2. If the **election timeout** elapses with no heartbeat received, a Follower turns itself into a **Candidate**: it increments the term, votes for itself, and requests votes from the other nodes
3. If the Candidate **wins a majority of votes (quorum)**, it becomes **Leader** and starts sending periodic heartbeats to hold power
4. If a **split vote** happens (no one reaches a majority), the Candidate reverts to Follower, waits for a new randomized election timeout, and tries again
5. If a Leader discovers another node with a **higher term** (for example, after a network partition heals), it immediately **steps down** to Follower

There can be at most **one valid Leader per term**, because winning requires a majority of votes — this is exactly what makes Raft resistant to split-brain.

### Why Randomized Timeouts

- If every node used the same fixed election timeout, many nodes could become Candidates at the same moment and keep splitting the vote, never converging
- Raft draws a random timeout from a range for each node, so almost always one Candidate starts its election first and collects enough votes before any other node times out

### The Role of Heartbeats

- The Leader sends heartbeats (empty AppendEntries) periodically to every Follower
- As long as a Follower keeps receiving heartbeats regularly, it never times out and never starts a new election
- Heartbeats stopping (leader crashed, network lost, …) is the only signal the cluster needs to know a new election is required

### Rebuild this diagram

```bash
git clone https://github.com/tt-a1i/archify.git
cd archify
node bin/archify.mjs validate lifecycle path/to/spec.lifecycle.json --quality showcase --json
node bin/archify.mjs deliver lifecycle path/to/spec.lifecycle.json path/to/diagram.html --quality showcase --json
```

---

## Tiếng Việt

### Tóm tắt

Trong một hệ phân tán, nhiều node cần thống nhất chọn ra **một leader duy nhất** để tránh xung đột khi ghi dữ liệu. Raft giải quyết bài toán này bằng một state machine đơn giản: **Follower → Candidate → Leader**, dựa trên bỏ phiếu đa số (quorum).

### Khi Nào Cần

**Khi nào:** Bất kỳ hệ phân tán nào cần đúng một coordinator đang hoạt động để tránh các quyết định xung đột nhau — scheduler, chính distributed lock, và các config store dựa trên consensus.

**Ở đâu dễ gặp:** Cluster etcd/ZooKeeper/Consul, bầu controller trong Kafka, job scheduler tự host chạy trên nhiều replica, và mọi setup database primary/replica cần tự động quyết định failover.

### Kịch bản

1. **Follower** là trạng thái mặc định: node thụ động chờ heartbeat từ leader hiện tại
2. Nếu hết **election timeout** mà không nhận được heartbeat nào, Follower tự chuyển thành **Candidate**: tăng term, tự bỏ phiếu cho mình, gửi yêu cầu xin phiếu tới các node khác
3. Nếu Candidate **thắng đa số phiếu (quorum)**, nó trở thành **Leader** và bắt đầu gửi heartbeat định kỳ để giữ quyền
4. Nếu xảy ra **split vote** (chia phiếu, không ai đạt đa số), Candidate quay lại Follower, chờ một election timeout ngẫu nhiên khác rồi thử lại
5. Nếu Leader phát hiện một node khác có **term cao hơn** (ví dụ sau khi mạng phân vùng được nối lại), nó tự **step down** về Follower ngay lập tức

Chỉ có thể có tối đa **một Leader hợp lệ mỗi term**, vì việc thắng cử đòi hỏi đa số phiếu — đây chính là cơ chế chống split-brain của Raft.

### Vì sao cần random timeout

- Nếu mọi node dùng cùng một election timeout cố định, nhiều node có thể cùng trở thành Candidate một lượt và liên tục chia phiếu nhau, không bao giờ hội tụ
- Raft dùng timeout ngẫu nhiên trong một khoảng cho mỗi node, nên gần như luôn có một Candidate bắt đầu bầu cử trước, kịp xin đủ phiếu trước khi node khác kịp timeout

### Vai trò của heartbeat

- Leader gửi heartbeat (AppendEntries rỗng) định kỳ tới mọi Follower
- Chỉ cần Follower còn nhận heartbeat đều đặn, nó sẽ không timeout và không khởi động election mới
- Heartbeat dừng lại (leader chết, mất mạng...) là tín hiệu duy nhất khiến cluster biết cần bầu lại

### Sửa lại diagram này

```bash
git clone https://github.com/tt-a1i/archify.git
cd archify
node bin/archify.mjs validate lifecycle path/to/spec.lifecycle.json --quality showcase --json
node bin/archify.mjs deliver lifecycle path/to/spec.lifecycle.json path/to/diagram.html --quality showcase --json
```
