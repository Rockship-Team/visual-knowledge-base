# Eventual Consistency: Read-Your-Writes Anomaly

**Loại diagram:** `dataflow` · **Nguồn:** [`spec.dataflow.json`](./spec.dataflow.json) · **Xem:** [`diagram.html`](./diagram.html)

## Tóm tắt

Minh họa hiện tượng **read-your-writes anomaly** trong một hệ thống dùng **eventual consistency**: client ghi xong nhưng đọc lại ngay lập tức có thể vẫn thấy dữ liệu cũ, vì replication giữa các node là bất đồng bộ và có độ trễ.

## Kịch bản

1. **Client** ghi dữ liệu mới (`PUT /profile`) vào **Primary DB**. Primary trả về ACK ngay lập tức, không đợi replicate xong.
2. Primary **replicate bất đồng bộ** dữ liệu mới sang **Replica 1** và **Replica 2**.
3. Replica 1 nhận kịp bản replicate → client đọc từ Replica 1 **sau đó** sẽ thấy dữ liệu mới.
4. Replica 2 nhận trễ hơn (còn đang lag) → nếu client đọc từ Replica 2 **ngay sau khi ghi**, sẽ nhận lại dữ liệu cũ.

Đây gọi là **read-your-writes anomaly**: ghi thành công rồi, nhưng đọc ngay sau đó lại không thấy chính thay đổi mình vừa tạo ra — do độ trễ replicate, không phải bug logic.

## Nguyên nhân

- Replication bất đồng bộ là một đánh đổi có chủ đích: đổi lấy write latency thấp hơn và availability cao hơn cho hệ thống
- Mỗi replica sẽ hội tụ về cùng một giá trị sau một khoảng thời gian (đó là ý nghĩa của "eventually consistent"), nhưng trong khoảng trễ đó các replica có thể trả về dữ liệu khác nhau
- Vấn đề càng dễ gặp khi có load balancer định tuyến các request đọc/ghi liên tiếp của cùng một client tới các replica khác nhau

## Cách đảm bảo Read-Your-Writes

- **Sticky session**: sau khi client ghi, định tuyến các lần đọc tiếp theo của chính client đó về Primary trong một khoảng thời gian
- **Đọc từ Primary** cho chính request theo sau ngay một lần ghi, chỉ chuyển sang đọc replica sau khi chắc chắn đã hết độ trễ replicate
- **Session/causal consistency**: server ghi nhớ version dữ liệu client vừa ghi, replica chỉ trả lời khi đã bắt kịp version đó
- **Versioned reads**: client gửi kèm version đã ghi, replica từ chối/hoãn trả lời nếu chưa bắt kịp

## Sửa lại diagram này

```bash
git clone https://github.com/tt-a1i/archify.git
cd archify
node bin/archify.mjs validate dataflow path/to/spec.dataflow.json --quality showcase --json
node bin/archify.mjs deliver dataflow path/to/spec.dataflow.json path/to/diagram.html --quality showcase --json
```
