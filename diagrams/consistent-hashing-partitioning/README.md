# Partitioning: Consistent Hashing vs Modulo Hashing

**Diagram type:** `workflow` · **Source:** [`spec.workflow.json`](./spec.workflow.json) · **View:** [`diagram.html`](./diagram.html)

---

## English

### Summary

Compares what happens to a cluster's keys when it scales from 3 to 4 nodes under two partitioning strategies: **modulo hashing** (`key % N`), which reshuffles almost everything, versus **consistent hashing** (a hash ring), which only moves the keys that belong to the new node.

### When It Happens

**When:** Every time a distributed data store adds or removes a node — the partitioning scheme decides how much data has to move as a result.

**Where to spot it:** Scaling out a sharded cache or database, evaluating a client-side sharding library, or explaining why one system handles rebalancing gracefully while another needs a maintenance window.

### Scenario

1. A **3-node cluster** holding millions of keys needs to scale out to 4 nodes.
2. **Modulo hashing path:** each key's owner is `hash(key) % N`. The moment N changes from 3 to 4, almost every key's assigned position shifts — roughly 75% of keys move.
3. **Consistent hashing path:** nodes and keys share one hash ring; a key belongs to the first node clockwise from its position. Adding node N4 only steals the arc of keys between it and its clockwise neighbor — roughly 25% of keys move, and only from one node.

Same operation, wildly different blast radius: consistent hashing turns "add one node" into a local, bounded change instead of a cluster-wide rehash.

### Root Cause

- Modulo hashing bakes the total node count N directly into every key's placement formula — change N, and the formula's output changes for nearly every key
- Consistent hashing decouples key placement from the node count: a key's ring position never changes, only which node currently owns the arc containing it
- Virtual nodes (multiple ring positions per physical node) smooth out uneven load from an unlucky hash distribution

### How to Choose

- Use **consistent hashing** whenever the cluster is expected to grow, shrink, or fail over nodes while staying online
- Modulo hashing can still be fine for a fixed-size cluster that's never expected to be resized live
- Watch load distribution after rebalancing — a poor hash function or too few virtual nodes can still leave some nodes hotter than others

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

So sánh điều gì xảy ra với các key của một cluster khi mở rộng từ 3 lên 4 node theo hai chiến lược partitioning: **modulo hashing** (`key % N`), làm xáo trộn gần như toàn bộ, so với **consistent hashing** (hash ring), chỉ di chuyển đúng các key thuộc về node mới.

### Khi Nào Gặp

**Khi nào:** Mỗi khi một hệ thống lưu trữ phân tán thêm hoặc bớt node — cách partitioning quyết định bao nhiêu dữ liệu phải di chuyển theo.

**Ở đâu dễ gặp:** Mở rộng một cache/database được shard, đánh giá thư viện client-side sharding, hoặc giải thích vì sao hệ thống này rebalance êm ru trong khi hệ thống khác cần cửa sổ bảo trì.

### Kịch bản

1. Một **cluster 3 node** chứa hàng triệu key cần mở rộng lên 4 node.
2. **Đường modulo hashing:** chủ sở hữu mỗi key là `hash(key) % N`. Ngay khi N đổi từ 3 sang 4, vị trí gán của gần như mọi key đều thay đổi — khoảng 75% key phải di chuyển.
3. **Đường consistent hashing:** node và key cùng nằm trên một hash ring; một key thuộc về node đầu tiên gặp theo chiều kim đồng hồ từ vị trí của nó. Thêm node N4 chỉ lấy đi phần cung giữa nó và hàng xóm liền kề theo chiều kim đồng hồ — khoảng 25% key di chuyển, và chỉ từ một node.

Cùng một thao tác, phạm vi ảnh hưởng khác nhau hoàn toàn: consistent hashing biến "thêm một node" thành một thay đổi cục bộ, có giới hạn, thay vì rehash toàn cluster.

### Nguyên nhân

- Modulo hashing gắn chặt tổng số node N vào công thức tính vị trí của mọi key — đổi N, kết quả công thức thay đổi với gần như mọi key
- Consistent hashing tách rời vị trí key khỏi số lượng node: vị trí của key trên ring không bao giờ đổi, chỉ có node nào đang sở hữu phần cung chứa nó là thay đổi
- Virtual node (nhiều vị trí trên ring cho mỗi node vật lý) giúp san đều tải khi hàm hash phân bố không may mắn

### Cách lựa chọn

- Dùng **consistent hashing** bất cứ khi nào cluster dự kiến sẽ tăng, giảm, hoặc failover node trong lúc vẫn online
- Modulo hashing vẫn ổn cho cluster kích thước cố định, không bao giờ resize khi đang chạy
- Theo dõi phân bố tải sau khi rebalance — hàm hash kém hoặc quá ít virtual node vẫn có thể khiến vài node nóng hơn hẳn

### Sửa lại diagram này

```bash
git clone https://github.com/tt-a1i/archify.git
cd archify
node bin/archify.mjs validate workflow path/to/spec.workflow.json --quality showcase --json
node bin/archify.mjs deliver workflow path/to/spec.workflow.json path/to/diagram.html --quality showcase --json
```
