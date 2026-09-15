# TCP and TLS Handshake: What Happens Before Your First Byte

**Diagram type:** `sequence` · **Source:** [`spec.sequence.json`](./spec.sequence.json) · **View:** [`diagram.html`](./diagram.html)

---

## English

### Summary

Before a single byte of an HTTPS request or response can flow, the client and server first negotiate a reliable connection (**TCP**) and then a secure, authenticated, encrypted channel (**TLS**) — both are round trips that add latency before "your" data ever moves.

### When It Happens

**When:** Literally every fresh HTTPS connection starts with this exchange — the practical question for backend developers isn't how to avoid it, it's how to minimize how *often* it happens, by reusing connections instead of opening a new one per request.

**Where to spot it:** Time-to-first-byte (TTFB) latency breakdowns in profiling tools, HTTP client connection-pool/keep-alive settings, TLS termination configuration on load balancers and reverse proxies, and "why is the very first request always slower" investigations.

### Scenario

1. **Client** → **Server**: `SYN (seq=x)`
2. **Server** → **Client**: `SYN-ACK (seq=y, ack=x+1)`
3. **Client** → **Server**: `ACK (ack=y+1)` — TCP connection established
4. **Client** → **Server**: `ClientHello` (supported ciphers, random)
5. **Server** → **Client**: `ServerHello + Certificate` (chosen cipher, random, cert)
6. **Client** verifies the certificate, then sends key-exchange material so both sides can derive a shared symmetric session key
7. **Server** → **Client**: `Finished` (encrypted handshake confirmation)
8. **Client** → **Server**: `Finished` (confirms)
9. **Client** → **Server**: `Encrypted: GET /api/data`
10. **Server** → **Client**: `Encrypted: 200 JSON`

3 round trips happened — 1 for TCP, roughly 2 for a classic TLS 1.2-style handshake — before the actual API request in step 9 was even sent.

### What Each Phase Actually Buys You

- The **TCP handshake** establishes a reliable, ordered, two-way byte stream and synchronizes sequence numbers so lost or out-of-order packets can be detected and retransmitted
- The **TLS handshake** authenticates the server's identity via its certificate (so the client knows it's really talking to the right server) and negotiates a shared symmetric session key so all following traffic is encrypted and tamper-evident
- Neither side needs to exchange a shared secret in advance — the handshake derives one on the fly

### Reducing Handshake Overhead

- **TLS 1.3** collapses the handshake to a single round trip (1-RTT) versus TLS 1.2's roughly two round trips shown here, and supports **0-RTT resumption** for a client reconnecting to a server it already has a session with
- **HTTP keep-alive and connection pooling** reuse an already-established connection across many requests instead of paying the handshake cost every time
- **HTTP/2** multiplexes many requests over one connection for the same reason

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

Trước khi một byte dữ liệu HTTPS nào được gửi đi, client và server phải đàm phán một kết nối tin cậy (**TCP**) rồi tới một kênh bảo mật, có xác thực, mã hóa (**TLS**) — cả hai đều là các round trip cộng thêm độ trễ trước khi dữ liệu "thật sự" của bạn được gửi.

### Khi Nào Gặp

**Khi nào:** Đúng nghĩa là mọi kết nối HTTPS mới đều bắt đầu bằng chuỗi trao đổi này — câu hỏi thực tế với backend developer không phải là làm sao để tránh nó, mà là làm sao giảm *tần suất* nó xảy ra, bằng cách tái sử dụng kết nối thay vì mở mới cho mỗi request.

**Ở đâu dễ gặp:** Phân tích độ trễ time-to-first-byte (TTFB) trong các công cụ profiling, cấu hình connection-pool/keep-alive của HTTP client, cấu hình TLS termination trên load balancer và reverse proxy, và các buổi điều tra kiểu "tại sao request đầu tiên luôn chậm hơn".

### Kịch bản

1. **Client** → **Server**: `SYN (seq=x)`
2. **Server** → **Client**: `SYN-ACK (seq=y, ack=x+1)`
3. **Client** → **Server**: `ACK (ack=y+1)` — kết nối TCP đã thiết lập
4. **Client** → **Server**: `ClientHello` (danh sách cipher hỗ trợ, random)
5. **Server** → **Client**: `ServerHello + Certificate` (cipher được chọn, random, chứng chỉ)
6. **Client** xác thực chứng chỉ, rồi gửi dữ liệu trao đổi khóa để cả hai bên tính ra cùng một session key đối xứng
7. **Server** → **Client**: `Finished` (xác nhận handshake đã mã hóa)
8. **Client** → **Server**: `Finished` (xác nhận lại)
9. **Client** → **Server**: `Encrypted: GET /api/data`
10. **Server** → **Client**: `Encrypted: 200 JSON`

3 round trip đã diễn ra — 1 cho TCP, khoảng 2 cho TLS handshake kiểu TLS 1.2 cổ điển — trước khi request API thật sự ở bước 9 được gửi đi.

### Mỗi Giai Đoạn Mang Lại Gì

- **TCP handshake** thiết lập một luồng byte hai chiều, tin cậy, đúng thứ tự, và đồng bộ sequence number để phát hiện và truyền lại gói tin bị mất hoặc sai thứ tự
- **TLS handshake** xác thực danh tính server qua chứng chỉ (để client chắc chắn đang nói chuyện đúng với server thật), và thỏa thuận một session key đối xứng dùng chung để toàn bộ traffic sau đó được mã hóa và chống giả mạo
- Cả hai bên không cần trao đổi trước một secret dùng chung — handshake tự tính ra secret đó ngay tại chỗ

### Giảm Chi Phí Handshake

- **TLS 1.3** rút gọn handshake xuống còn 1 round trip (1-RTT) so với khoảng 2 round trip của TLS 1.2 trong diagram này, và hỗ trợ **0-RTT resumption** khi client kết nối lại với server đã từng có session trước đó
- **HTTP keep-alive và connection pooling** tái sử dụng một kết nối đã thiết lập cho nhiều request, thay vì trả phí handshake mỗi lần
- **HTTP/2** ghép nhiều request chạy chung trên một kết nối vì cùng lý do đó

### Sửa lại diagram này

```bash
git clone https://github.com/tt-a1i/archify.git
cd archify
node bin/archify.mjs validate sequence path/to/spec.sequence.json --quality showcase --json
node bin/archify.mjs deliver sequence path/to/spec.sequence.json path/to/diagram.html --quality showcase --json
```
