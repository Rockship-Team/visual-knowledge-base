# Leader Election: Raft Consensus cơ bản

**Loại diagram:** `lifecycle` · **Nguồn:** [`spec.lifecycle.json`](./spec.lifecycle.json) · **Xem:** [`diagram.html`](./diagram.html)

## Tóm tắt

Trong một hệ phân tán, nhiều node cần thống nhất chọn ra **một leader duy nhất** để tránh xung đột khi ghi dữ liệu. Raft giải quyết bài toán này bằng một state machine đơn giản: **Follower → Candidate → Leader**, dựa trên bỏ phiếu đa số (quorum).

## Kịch bản

1. **Follower** là trạng thái mặc định: node thụ động chờ heartbeat từ leader hiện tại
2. Nếu hết **election timeout** mà không nhận được heartbeat nào, Follower tự chuyển thành **Candidate**: tăng term, tự bỏ phiếu cho mình, gửi yêu cầu xin phiếu tới các node khác
3. Nếu Candidate **thắng đa số phiếu (quorum)**, nó trở thành **Leader** và bắt đầu gửi heartbeat định kỳ để giữ quyền
4. Nếu xảy ra **split vote** (chia phiếu, không ai đạt đa số), Candidate quay lại Follower, chờ một election timeout ngẫu nhiên khác rồi thử lại
5. Nếu Leader phát hiện một node khác có **term cao hơn** (ví dụ sau khi mạng phân vùng được nối lại), nó tự **step down** về Follower ngay lập tức

Chỉ có thể có tối đa **một Leader hợp lệ mỗi term**, vì việc thắng cử đòi hỏi đa số phiếu — đây chính là cơ chế chống split-brain của Raft.

## Vì sao cần random timeout

- Nếu mọi node dùng cùng một election timeout cố định, nhiều node có thể cùng trở thành Candidate một lượt và liên tục chia phiếu nhau, không bao giờ hội tụ
- Raft dùng timeout ngẫu nhiên trong một khoảng cho mỗi node, nên gần như luôn có một Candidate bắt đầu bầu cử trước, kịp xin đủ phiếu trước khi node khác kịp timeout

## Vai trò của heartbeat

- Leader gửi heartbeat (AppendEntries rỗng) định kỳ tới mọi Follower
- Chỉ cần Follower còn nhận heartbeat đều đặn, nó sẽ không timeout và không khởi động election mới
- Heartbeat dừng lại (leader chết, mất mạng...) là tín hiệu duy nhất khiến cluster biết cần bầu lại

## Sửa lại diagram này

```bash
git clone https://github.com/tt-a1i/archify.git
cd archify
node bin/archify.mjs validate lifecycle path/to/spec.lifecycle.json --quality showcase --json
node bin/archify.mjs deliver lifecycle path/to/spec.lifecycle.json path/to/diagram.html --quality showcase --json
```
