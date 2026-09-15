# Visual Knowledge Base

🔗 **Xem trực tiếp:** https://rockship-team.github.io/visual-knowledge-base/

Kho tổng hợp kiến thức kỹ thuật dưới dạng diagram trực quan (architecture, sequence, workflow, dataflow, lifecycle), dùng [archify](https://github.com/tt-a1i/archify) để tạo HTML tương tác (dark/light theme, pan/zoom, search) từ một JSON spec gọn. Nội dung diagram luôn bằng **tiếng Anh**; trang đọc trên site hỗ trợ **song ngữ Anh/Việt** (toggle EN/VI ở góc trên).

Mỗi chủ đề nằm trong `diagrams/<slug>/` gồm:

- `index.html` — trang đọc trên site: diagram nhúng + giải thích song ngữ (EN/VI, toggle bằng `assets/i18n.js`)
- `README.md` — cùng nội dung giải thích, xếp chồng cả hai ngôn ngữ, hiển thị khi duyệt trên GitHub
- `spec.sequence.json` / `spec.architecture.json` / ... — JSON spec nguồn (tiếng Anh), sửa lại được
- `diagram.html` — bản diagram render sẵn (archify), có thể mở toàn màn hình

## Danh mục

### Concurrency & Distributed Systems

| Chủ đề | Loại | Link |
|---|---|---|
| Race Condition: Lost Update | sequence | [diagrams/race-condition-lost-update](./diagrams/race-condition-lost-update) |
| Deadlock: Circular Wait Between Two Transactions | sequence | [diagrams/deadlock-circular-wait](./diagrams/deadlock-circular-wait) |
| Distributed Lock | sequence | [diagrams/distributed-lock](./diagrams/distributed-lock) |
| Idempotency Key: Safe API Retries | sequence | [diagrams/idempotency-key](./diagrams/idempotency-key) |
| CAP Theorem: Consistency vs Availability During a Network Partition | workflow | [diagrams/cap-theorem](./diagrams/cap-theorem) |
| Leader Election: Raft Consensus Basics | lifecycle | [diagrams/leader-election-raft](./diagrams/leader-election-raft) |
| Eventual Consistency: Read-Your-Writes Anomaly | dataflow | [diagrams/eventual-consistency](./diagrams/eventual-consistency) |

## Đóng góp thêm chủ đề

Xem [CONTRIBUTING.md](./CONTRIBUTING.md).
