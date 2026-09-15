# CAP Theorem: Consistency vs Availability khi Network Partition

**Loại diagram:** `workflow` · **Nguồn:** [`spec.workflow.json`](./spec.workflow.json) · **Xem:** [`diagram.html`](./diagram.html)

## Tóm tắt

**CAP theorem** nói rằng một hệ thống dữ liệu phân tán không thể đồng thời đảm bảo cả 3 tính chất: **C**onsistency (mọi node trả về dữ liệu mới nhất giống nhau), **A**vailability (mọi request đều nhận được response, không lỗi), và **P**artition tolerance (hệ thống vẫn hoạt động khi mạng giữa các node bị chia cắt). Trong thực tế, Partition tolerance gần như bắt buộc phải chấp nhận — mạng sẽ luôn có lúc lỗi — nên câu hỏi thật sự không phải "chọn cái nào trong 3 cái", mà là **chọn C hay A khi partition xảy ra**.

## Kịch bản

1. Bình thường: Client đọc/ghi qua **Node A** và **Node B**, hai node đồng bộ liên tục
2. **Network Partition** xảy ra: Node A và Node B mất kết nối với nhau, nhưng cả hai vẫn nhận được request từ client
3. Client gửi một request đọc tới Node B trong lúc partition — hệ thống phải chọn một trong hai nhánh:
4. **Nhánh CP**: Node B từ chối trả lời hoặc trả lỗi vì không xác nhận được nó đang có dữ liệu mới nhất từ Node A → giữ Consistency, hy sinh Availability
5. **Nhánh AP**: Node B vẫn trả lời bằng dữ liệu cục bộ, có thể đã cũ (stale) → giữ Availability, hy sinh Consistency
6. Khi partition được khắc phục, hai node đồng bộ lại (reconcile)

P không phải là lựa chọn — mạng chắc chắn sẽ partition. Điều engineer thực sự quyết định là hệ thống làm gì **khi** nó xảy ra: từ chối phục vụ để giữ đúng, hay phục vụ tạm với dữ liệu có thể cũ.

## Ứng dụng thực tế

- Hệ thiên về **CP**: các hệ dùng consensus như etcd, ZooKeeper, hoặc RDBMS với strong consistency — ưu tiên đúng dữ liệu hơn là luôn trả lời được
- Hệ thiên về **AP**: Cassandra, DynamoDB kiểu eventual consistency — ưu tiên luôn phản hồi, chấp nhận dữ liệu có thể tạm thời không khớp giữa các node
- Nhiều hệ thống hiện đại cho phép tune per-operation (ví dụ mức consistency theo từng query trong Cassandra) thay vì cố định toàn hệ thống vào một phía

## Sửa lại diagram này

```bash
git clone https://github.com/tt-a1i/archify.git
cd archify
node bin/archify.mjs validate workflow path/to/spec.workflow.json --quality showcase --json
node bin/archify.mjs deliver workflow path/to/spec.workflow.json path/to/diagram.html --quality showcase --json
```
