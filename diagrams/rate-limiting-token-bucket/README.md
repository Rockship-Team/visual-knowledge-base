# Rate Limiting: The Token Bucket Algorithm

**Diagram type:** `sequence` · **Source:** [`spec.sequence.json`](./spec.sequence.json) · **View:** [`diagram.html`](./diagram.html)

---

## English

### Summary

The **token bucket** algorithm rate-limits a client by giving it a bucket of tokens that drains one per request and refills at a steady rate. It allows short bursts up to the bucket's capacity while still enforcing a long-term average rate.

### When It Happens

**When:** Any public or shared API needs to protect itself from being overwhelmed by a single client — an accidental retry loop, a buggy client, or deliberate abuse — because without a limit, one client can starve capacity from everyone else.

**Where to spot it:** Public API tiers with free/paid request limits, login/auth endpoints, third-party APIs you integrate with (and their limits on you), and `429` responses with a `Retry-After` header in API documentation.

### Scenario

1. **Client** sends `Request A` — the bucket has tokens available, consumes 1, forwarded to the **API Server**, returns `200 OK`
2. Client sends a **burst of requests** that exceeds the remaining tokens — the bucket is now empty
3. Rate Limiter returns `429 Too Many Requests` — this request is rejected and never reaches the API Server
4. A refill interval elapses: the bucket regains tokens over time at a fixed rate
5. Client sends `Request B` after the bucket has refilled — consumes 1 token, forwarded, returns `200 OK` again

The rejected burst never even reached the API server — the rate limiter protects the backend, not just the client's experience.

### How the Token Bucket Works

- **Capacity** sets the maximum burst size a client can send instantly
- **Refill rate** sets the sustained long-term average rate the bucket settles to
- Each request costs 1 token (or more, for weighted endpoints) and is rejected once the bucket is empty, until it refills

### Choosing Rate-Limiting Parameters

- Apply buckets **per-user, per-IP, or per-API-key** rather than one global bucket, so one abusive client can't starve everyone
- Always return a `Retry-After` header on `429` so well-behaved clients back off correctly instead of retrying immediately
- Compared to sliding-window and fixed-window counters, the token bucket is generally preferred because it naturally smooths bursts

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

Thuật toán **token bucket** giới hạn tốc độ của client bằng cách cấp một bucket chứa token, mỗi request tiêu tốn 1 token và bucket được nạp lại (refill) đều đặn theo thời gian. Nó cho phép burst ngắn hạn tối đa bằng capacity của bucket, nhưng vẫn đảm bảo tốc độ trung bình dài hạn.

### Khi Nào Gặp

**Khi nào:** Bất kỳ API công khai hoặc dùng chung nào cũng cần tự bảo vệ khỏi bị một client duy nhất làm quá tải — một vòng lặp retry lỗi, client có bug, hoặc lạm dụng có chủ đích — vì nếu không giới hạn, một client có thể chiếm hết capacity của những người khác.

**Ở đâu dễ gặp:** Các tier API công khai có giới hạn request free/paid, endpoint login/auth, các API bên thứ ba bạn tích hợp vào (và giới hạn của họ áp lên bạn), và response `429` kèm header `Retry-After` trong tài liệu API.

### Kịch bản

1. **Client** gửi `Request A` — bucket còn token, tiêu 1 token, chuyển tới **API Server**, trả về `200 OK`
2. Client gửi một **burst request** vượt quá số token còn lại — bucket đã cạn
3. Rate Limiter trả về `429 Too Many Requests` — request này bị từ chối và không bao giờ tới được API Server
4. Một khoảng refill trôi qua: bucket được nạp lại token theo thời gian với tốc độ cố định
5. Client gửi `Request B` sau khi bucket đã refill — tiêu 1 token, được chuyển tiếp, trả về `200 OK`

Burst bị từ chối không hề chạm tới API server — rate limiter bảo vệ backend, chứ không chỉ trải nghiệm của client.

### Cách Token Bucket Hoạt Động

- **Capacity** quy định kích thước burst tối đa client có thể gửi ngay lập tức
- **Refill rate** quy định tốc độ trung bình dài hạn mà bucket ổn định về
- Mỗi request tốn 1 token (hoặc nhiều hơn với endpoint có trọng số), bị từ chối khi bucket cạn cho tới khi refill

### Chọn Tham Số Rate Limiting

- Áp dụng bucket **theo user, theo IP, hoặc theo API key** thay vì một bucket toàn cục, để một client lạm dụng không thể chiếm hết capacity của người khác
- Luôn trả header `Retry-After` khi trả `429` để client tuân thủ đúng có thể lùi lại thay vì retry ngay lập tức
- So với fixed-window hoặc sliding-window counter, token bucket thường được ưu tiên vì nó làm mượt burst tự nhiên hơn

### Sửa lại diagram này

```bash
git clone https://github.com/tt-a1i/archify.git
cd archify
node bin/archify.mjs validate sequence path/to/spec.sequence.json --quality showcase --json
node bin/archify.mjs deliver sequence path/to/spec.sequence.json path/to/diagram.html --quality showcase --json
```
