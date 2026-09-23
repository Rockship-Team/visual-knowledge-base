# Two-Phase Commit: Atomic Commit Across Two Databases

**Diagram type:** `sequence` · **Source:** [`spec.sequence.json`](./spec.sequence.json) · **View:** [`diagram.html`](./diagram.html)

---

## English

### Summary

Shows how **Two-Phase Commit (2PC)** makes a transaction spanning two independent databases succeed or fail as a single atomic unit: a coordinator first asks every participant to *promise* it can commit, and only then tells everyone to actually commit.

### When It Happens

**When:** Whenever a single logical transaction must change data in more than one database, service, or partition, and all of them need to commit together or not at all.

**Where to spot it:** Cross-shard transactions, XA transactions in JTA/JMS, moving money between accounts that live in different database instances, and any "distributed transaction manager" library.

### Scenario

1. **Client** starts a transaction that debits an account in **Participant A** and credits one in **Participant B**.
2. **Phase 1 (Prepare):** the **Coordinator** sends `PREPARE` to both participants. Each one locks the relevant rows, writes its intent to disk, and votes `YES` — a durable promise that it can commit even after a crash.
3. **Phase 2 (Commit):** only after *both* vote yes does the coordinator send `COMMIT` to both. Each participant applies the change, releases its locks, and acknowledges.
4. The coordinator tells the client the transaction committed.

If either participant had voted `NO` during Prepare, the coordinator would send `ABORT` to both instead — the whole transaction rolls back, nothing is half-applied.

### Root Cause of the Design

- A transaction across two databases has no single log to make the change atomic — 2PC builds atomicity on top by adding a coordination round
- Splitting into Prepare/Commit means every participant learns everyone else's intent before anyone applies a real change
- The price is a hard dependency on the coordinator: if it disappears between the two phases, participants are stuck holding locks, unable to decide alone

### What to Watch Out For

- **The blocking window**: a coordinator crash after votes but before COMMIT/ABORT leaves participants holding locks until it recovers
- **Coordinator durability**: the coordinator must persist its decision before sending COMMIT, so it can resume correctly after its own crash
- **Prefer avoiding cross-node 2PC** when possible — model transactions to fit inside one partition, use a single consensus-backed log (Raft/Paxos), or use sagas with compensating actions instead

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

Minh họa cách **Two-Phase Commit (2PC)** giúp một transaction trải trên hai database độc lập thành công hoặc thất bại như một khối atomic duy nhất: coordinator trước tiên yêu cầu mọi participant *hứa* rằng có thể commit, rồi mới yêu cầu tất cả thực sự commit.

### Khi Nào Gặp

**Khi nào:** Bất cứ khi nào một transaction logic duy nhất cần thay đổi dữ liệu ở nhiều database, service, hoặc partition khác nhau, và tất cả phải cùng commit hoặc không commit gì cả.

**Ở đâu dễ gặp:** Transaction xuyên shard, XA transaction trong JTA/JMS, chuyển tiền giữa các tài khoản nằm ở các database instance khác nhau, và bất kỳ thư viện "distributed transaction manager" nào.

### Kịch bản

1. **Client** bắt đầu một transaction trừ tiền tài khoản ở **Participant A** và cộng tiền ở **Participant B**.
2. **Phase 1 (Prepare):** **Coordinator** gửi `PREPARE` tới cả hai participant. Mỗi bên khóa các dòng liên quan, ghi ý định xuống đĩa, và vote `YES` — một lời hứa bền vững rằng có thể commit ngay cả sau khi crash.
3. **Phase 2 (Commit):** chỉ khi *cả hai* vote yes, coordinator mới gửi `COMMIT` tới cả hai. Mỗi participant áp dụng thay đổi, giải phóng lock, và xác nhận.
4. Coordinator báo client transaction đã commit.

Nếu một trong hai participant vote `NO` lúc Prepare, coordinator sẽ gửi `ABORT` cho cả hai thay vì COMMIT — toàn bộ transaction rollback, không có gì bị áp dụng nửa vời.

### Nguyên nhân của thiết kế này

- Một transaction trải trên hai database không có chung một log duy nhất để đảm bảo atomic — 2PC xây dựng tính atomic bằng cách thêm một vòng phối hợp
- Tách thành Prepare/Commit nghĩa là mọi participant biết ý định của tất cả các bên khác trước khi ai đó thực sự áp dụng thay đổi
- Cái giá phải trả là phụ thuộc cứng vào coordinator: nếu nó biến mất giữa hai phase, các participant bị kẹt giữ lock, không thể tự quyết định

### Những điều cần lưu ý

- **Cửa sổ blocking**: coordinator crash sau khi nhận vote nhưng trước khi gửi COMMIT/ABORT khiến participant giữ lock cho tới khi coordinator hồi phục
- **Coordinator phải bền vững**: coordinator phải ghi quyết định xuống đĩa trước khi gửi COMMIT, để có thể tiếp tục đúng đắn sau khi tự crash
- **Ưu tiên tránh 2PC xuyên node** nếu có thể — thiết kế transaction nằm gọn trong một partition, dùng một log dựa trên consensus (Raft/Paxos), hoặc dùng saga với compensating action thay thế

### Sửa lại diagram này

```bash
git clone https://github.com/tt-a1i/archify.git
cd archify
node bin/archify.mjs validate sequence path/to/spec.sequence.json --quality showcase --json
node bin/archify.mjs deliver sequence path/to/spec.sequence.json path/to/diagram.html --quality showcase --json
```
