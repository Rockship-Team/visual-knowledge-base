# Visual Knowledge Base

🔗 **Xem trực tiếp:** https://rockship-team.github.io/visual-knowledge-base/

Kho tổng hợp kiến thức kỹ thuật dưới dạng diagram trực quan (architecture, sequence, workflow, dataflow, lifecycle), dùng [archify](https://github.com/tt-a1i/archify) để tạo HTML tương tác (dark/light theme, pan/zoom, search) từ một JSON spec gọn.

Mỗi chủ đề nằm trong `diagrams/<slug>/` gồm:

- `index.html` — trang đọc trên site: diagram nhúng + giải thích được style đẹp
- `README.md` — cùng nội dung giải thích, hiển thị khi duyệt trên GitHub
- `spec.sequence.json` / `spec.architecture.json` / ... — JSON spec nguồn, sửa lại được
- `diagram.html` — bản diagram render sẵn (archify), có thể mở toàn màn hình

## Danh mục

### Concurrency & Distributed Systems

| Chủ đề | Loại | Link |
|---|---|---|
| Race Condition: Lost Update | sequence | [diagrams/race-condition-lost-update](./diagrams/race-condition-lost-update) |
| Deadlock: Circular Wait giữa 2 Transaction | sequence | [diagrams/deadlock-circular-wait](./diagrams/deadlock-circular-wait) |
| Distributed Lock | sequence | [diagrams/distributed-lock](./diagrams/distributed-lock) |
| Idempotency Key: an toàn khi retry API | sequence | [diagrams/idempotency-key](./diagrams/idempotency-key) |
| CAP Theorem: Consistency vs Availability khi Network Partition | workflow | [diagrams/cap-theorem](./diagrams/cap-theorem) |
| Leader Election: Raft Consensus cơ bản | lifecycle | [diagrams/leader-election-raft](./diagrams/leader-election-raft) |
| Eventual Consistency: Read-Your-Writes Anomaly | dataflow | [diagrams/eventual-consistency](./diagrams/eventual-consistency) |

## Đóng góp thêm chủ đề

Xem [CONTRIBUTING.md](./CONTRIBUTING.md).
