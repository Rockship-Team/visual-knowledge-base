# Write-Ahead Log: Durability Before the Data Page Is Flushed

**Diagram type:** `sequence` · **Source:** [`spec.sequence.json`](./spec.sequence.json) · **View:** [`diagram.html`](./diagram.html)

---

## English

### Summary

Shows why a database engine writes to a **Write-Ahead Log (WAL)** before it acknowledges a commit, and how that log is what lets the engine **recover** a committed change that never made it to the actual data page before a crash.

### When It Happens

**When:** On every single write — the engine always has to decide what "durable" means before it can safely tell the client the transaction committed.

**Where to spot it:** Database crash recovery logs on startup, `fsync`-related tuning knobs (`synchronous_commit`, `innodb_flush_log_at_trx_commit`), and any incident postmortem asking "how did we not lose that write when the box died?"

### Scenario

1. A **Client** sends an update. The **DB Engine** appends the change to the **WAL** and waits for it to `fsync` to disk.
2. Only once the log entry is durable does the engine tell the client the write is committed — the actual data page hasn't been touched yet.
3. The engine starts flushing the dirty data page, but the process **crashes** right in the middle of it.
4. On restart, **recovery** replays the WAL from the last checkpoint, finds the committed-but-unflushed operation, and re-applies it to the data page.

The client's "committed" was true the whole time — durability came from the log being on disk, not from the data page being up to date.

### Why Log Before Touching the Data

- Appending to a sequential log is one fast, predictable disk operation — no seeking around a B-tree page
- Updating the actual data page can be deferred and batched, off the write's critical path, without risking durability
- The client's "committed" only needs the log entry to be on disk, not the final page layout

### What Recovery Actually Does

- On restart, the engine finds the last checkpoint and replays every WAL entry written after it
- Any operation the log says was committed, but whose data page never made it to disk, gets re-applied
- This is called redo recovery — it never has to ask the client to resend anything

### Where This Shows Up

- PostgreSQL's WAL and MySQL/InnoDB's redo log
- SQLite's WAL journal mode
- LSM-tree engines (RocksDB, Cassandra) still write a WAL before the write ever reaches the memtable

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

Minh họa vì sao một database engine ghi vào **Write-Ahead Log (WAL)** trước khi xác nhận commit, và vì sao chính log này giúp engine **khôi phục** một thay đổi đã commit nhưng chưa kịp ghi vào data page thực tế trước khi crash.

### Khi Nào Gặp

**Khi nào:** Ở mọi lần ghi — engine luôn phải quyết định "durable" nghĩa là gì trước khi có thể an toàn báo client rằng transaction đã commit.

**Ở đâu dễ gặp:** Log khôi phục sau crash lúc database khởi động, các tham số tinh chỉnh liên quan `fsync` (`synchronous_commit`, `innodb_flush_log_at_trx_commit`), và bất kỳ bản postmortem sự cố nào hỏi "sao máy chết mà không mất lần ghi đó?"

### Kịch bản

1. **Client** gửi một update. **DB Engine** append thay đổi vào **WAL** và đợi nó `fsync` xuống đĩa.
2. Chỉ khi log entry đã bền vững (durable), engine mới báo client ghi đã commit — data page thực tế vẫn chưa hề bị đụng đến.
3. Engine bắt đầu flush dirty data page, nhưng tiến trình **crash** ngay giữa chừng.
4. Khi khởi động lại, quá trình **recovery** replay WAL từ checkpoint gần nhất, tìm ra thao tác đã commit nhưng chưa flush, và áp dụng lại vào data page.

"Committed" mà client nhận được luôn đúng — durability đến từ việc log đã nằm trên đĩa, không phải từ việc data page đã cập nhật.

### Vì sao log trước khi đụng vào data

- Append vào một log tuần tự là một thao tác đĩa nhanh, dễ đoán — không cần seek quanh một page B-tree
- Việc cập nhật data page thực tế có thể trì hoãn và gộp lại, nằm ngoài đường găng của lần ghi, mà không đánh đổi durability
- "Committed" của client chỉ cần log entry nằm trên đĩa, không cần layout page cuối cùng đã đúng

### Recovery thực sự làm gì

- Khi khởi động lại, engine tìm checkpoint gần nhất và replay mọi WAL entry ghi sau đó
- Bất kỳ thao tác nào log nói là đã commit, nhưng data page chưa kịp ghi xuống đĩa, sẽ được áp dụng lại
- Đây gọi là redo recovery — không bao giờ cần yêu cầu client gửi lại bất cứ gì

### Ở đâu dễ gặp

- WAL của PostgreSQL và redo log của MySQL/InnoDB
- Chế độ WAL journal của SQLite
- Các engine LSM-tree (RocksDB, Cassandra) vẫn ghi WAL trước khi lần ghi chạm tới memtable

### Sửa lại diagram này

```bash
git clone https://github.com/tt-a1i/archify.git
cd archify
node bin/archify.mjs validate sequence path/to/spec.sequence.json --quality showcase --json
node bin/archify.mjs deliver sequence path/to/spec.sequence.json path/to/diagram.html --quality showcase --json
```
