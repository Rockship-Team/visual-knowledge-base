# Message Queue Delivery Guarantees: At-Least-Once Means Duplicates

**Diagram type:** `sequence` · **Source:** [`spec.sequence.json`](./spec.sequence.json) · **View:** [`diagram.html`](./diagram.html)

---

## English

### Summary

Shows how a message broker's **at-least-once delivery** guarantee — retry until acked — can cause a consumer to process the same message twice, charging a customer's card two times for one order.

### When It Happens

**When:** Any time a consumer processes a message but crashes, hangs, or loses its connection before it can send the ack back to the broker.

**Where to spot it:** Payment processing consumers, order fulfillment pipelines, webhook delivery systems, and any "why was the customer charged twice" incident involving a message queue.

### Scenario

1. A **Producer** publishes `order.created` once. The **Broker** persists it and won't discard it until it gets an ack.
2. The broker delivers the message to the **Consumer**, which charges the customer's card through the **Payment Gateway** — successfully.
3. The consumer crashes right before it can send the ack back to the broker.
4. The broker's ack timeout fires. Since it has no way to know the charge already succeeded, it **redelivers** the same message.
5. The consumer processes it again and charges the card a second time.

The broker did exactly what it promised — at-least-once — the duplicate charge happened because the consumer wasn't built to handle it.

### Why "At-Least-Once" Means Duplicates Are Possible

- The broker's only guarantee is that the message gets delivered one or more times, never zero
- It has no way to tell "consumer crashed before processing" apart from "consumer crashed right after processing but before acking"
- So on any doubt — an ack timeout, a dropped connection — it resends

### The Three Delivery Guarantees

- **At-most-once:** send and forget — a message can be lost, but is never duplicated
- **At-least-once:** retry until acked — a message can be duplicated, but is never lost
- **Exactly-once (end-to-end)** isn't a transport-level guarantee — it's at-least-once plus an idempotent consumer or dedup layer on top

### How to Make the Consumer Safe

- Track processed message IDs in a dedup table or cache with a TTL, and skip anything already seen
- Make the side effect itself idempotent — "set status = charged" instead of "charge again"
- Where the broker supports it, use its native exactly-once feature (Kafka transactions, SQS FIFO with a deduplication ID)

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

Minh họa cách đảm bảo **at-least-once delivery** của message broker — retry cho tới khi được ack — có thể khiến consumer xử lý cùng một message hai lần, charge thẻ khách hàng hai lần cho một đơn hàng.

### Khi Nào Gặp

**Khi nào:** Bất cứ khi nào consumer đã xử lý xong một message nhưng crash, treo, hoặc mất kết nối trước khi kịp gửi ack về cho broker.

**Ở đâu dễ gặp:** Consumer xử lý thanh toán, pipeline hoàn tất đơn hàng, hệ thống gửi webhook, và bất kỳ sự cố "sao khách bị charge hai lần" nào liên quan tới message queue.

### Kịch bản

1. Một **Producer** publish `order.created` đúng một lần. **Broker** lưu bền vững và không xóa cho tới khi nhận được ack.
2. Broker gửi message tới **Consumer**, consumer charge thẻ khách hàng qua **Payment Gateway** — thành công.
3. Consumer crash ngay trước khi kịp gửi ack về broker.
4. Ack timeout của broker kích hoạt. Vì không có cách nào biết charge đã thành công, broker **gửi lại** cùng message.
5. Consumer xử lý lại và charge thẻ lần thứ hai.

Broker đã làm đúng như cam kết — at-least-once — việc charge trùng xảy ra vì consumer không được xây dựng để xử lý tình huống này.

### Vì sao "at-least-once" nghĩa là có thể trùng lặp

- Cam kết duy nhất của broker là message được gửi một lần hoặc nhiều hơn, không bao giờ là zero lần
- Broker không có cách nào phân biệt "consumer crash trước khi xử lý" với "consumer crash ngay sau khi xử lý nhưng trước khi ack"
- Nên bất cứ khi nào nghi ngờ — ack timeout, mất kết nối — broker sẽ gửi lại

### Ba mức đảm bảo delivery

- **At-most-once:** gửi rồi bỏ qua — message có thể mất, nhưng không bao giờ trùng lặp
- **At-least-once:** retry cho tới khi được ack — message có thể trùng lặp, nhưng không bao giờ mất
- **Exactly-once (end-to-end)** không phải là đảm bảo ở tầng transport — nó là at-least-once cộng thêm một consumer idempotent hoặc lớp dedup phía trên

### Làm sao để consumer an toàn

- Theo dõi message ID đã xử lý trong bảng dedup hoặc cache có TTL, bỏ qua bất cứ gì đã thấy
- Làm cho chính side effect trở thành idempotent — "set status = charged" thay vì "charge lại"
- Nếu broker hỗ trợ, dùng tính năng exactly-once gốc của nó (Kafka transaction, SQS FIFO với deduplication ID)

### Sửa lại diagram này

```bash
git clone https://github.com/tt-a1i/archify.git
cd archify
node bin/archify.mjs validate sequence path/to/spec.sequence.json --quality showcase --json
node bin/archify.mjs deliver sequence path/to/spec.sequence.json path/to/diagram.html --quality showcase --json
```
