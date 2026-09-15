# Load Balancing: Routing Around Unhealthy Instances

**Diagram type:** `architecture` · **Source:** [`spec.architecture.json`](./spec.architecture.json) · **View:** [`diagram.html`](./diagram.html)

---

## English

### Summary

A **load balancer** distributes client traffic across multiple backend instances and continuously monitors their health, automatically routing around any instance that's failing so a single bad instance doesn't take down the whole service.

### When It Happens

**When:** Any service running more than one instance behind a single entry point needs to keep serving traffic even when one instance crashes, hangs, or degrades.

**Where to spot it:** Any horizontally-scaled deployment (Kubernetes Service/Ingress, a cloud load balancer, an nginx/HAProxy upstream pool), incidents where a single bad pod caused elevated error rates until it was drained from rotation, and API gateways routing around a downed dependency.

### Topology

1. **Client** sends requests to the **Load Balancer**
2. The Load Balancer routes traffic to **Instance A** and **Instance C** — both healthy
3. The Load Balancer also continuously health-checks every instance, including **Instance B**
4. Instance B is currently failing its health check, so it receives *no* routed traffic — only the health probe still reaches it

Instance B keeps failing health checks and is silently excluded from traffic — clients never see the failure, they're just served by A and C instead.

### Load Balancing Algorithms

- **Round robin**: cycle through instances in order
- **Least connections**: send to whichever instance currently has the fewest active connections — better when requests have very different costs
- **Weighted round robin**: send more traffic to more powerful instances

"Load balancing" and "health checking" are two separate concerns that are usually bundled into the same component.

### Active vs Passive Health Checks

- **Active health checks**: the load balancer periodically calls a dedicated `/health` endpoint on each instance and removes it from rotation after N consecutive failures
- **Passive health checks**: the load balancer watches real traffic and marks an instance unhealthy after it returns too many errors or times out, without a dedicated probe
- A recovered instance is normally re-added **gradually** (a "slow start") rather than getting its full traffic share instantly, to avoid overwhelming it right after recovery

### Rebuild this diagram

```bash
git clone https://github.com/tt-a1i/archify.git
cd archify
node bin/archify.mjs validate architecture path/to/spec.architecture.json --quality showcase --json
node bin/archify.mjs deliver architecture path/to/spec.architecture.json path/to/diagram.html --quality showcase --json
```

---

## Tiếng Việt

### Tóm tắt

Một **load balancer** phân phối traffic của client tới nhiều backend instance và liên tục theo dõi sức khỏe của chúng, tự động định tuyến tránh instance nào đang lỗi để một instance hỏng không kéo sập cả dịch vụ.

### Khi Nào Gặp

**Khi nào:** Bất kỳ service nào chạy nhiều hơn một instance đằng sau một entry point duy nhất cần tiếp tục phục vụ traffic ngay cả khi một instance crash, treo, hoặc suy giảm hiệu năng.

**Ở đâu dễ gặp:** Mọi deployment scale ngang (Kubernetes Service/Ingress, load balancer trên cloud, upstream pool của nginx/HAProxy), các incident mà một pod hỏng làm tăng error rate cho tới khi bị loại khỏi vòng xoay, và API gateway định tuyến tránh một dependency đang sập.

### Cấu Trúc

1. **Client** gửi request tới **Load Balancer**
2. Load Balancer định tuyến traffic tới **Instance A** và **Instance C** — cả hai đều khỏe mạnh
3. Load Balancer cũng liên tục health-check mọi instance, kể cả **Instance B**
4. Instance B đang fail health check, nên nó *không* nhận traffic — chỉ còn health probe vẫn tới được nó

Instance B liên tục fail health check và bị âm thầm loại khỏi traffic — client không bao giờ thấy lỗi, chỉ đơn giản là được A và C phục vụ thay thế.

### Các Thuật Toán Load Balancing

- **Round robin**: xoay vòng qua các instance theo thứ tự
- **Least connections**: gửi tới instance nào đang có ít connection đang hoạt động nhất — tốt hơn khi các request có chi phí rất khác nhau
- **Weighted round robin**: gửi nhiều traffic hơn cho instance mạnh hơn

"Load balancing" và "health checking" là hai mối quan tâm tách biệt nhưng thường được gộp chung vào một component.

### Health Check Chủ Động vs Bị Động

- **Active health check**: load balancer định kỳ gọi một endpoint riêng `/health` trên mỗi instance và loại nó khỏi vòng xoay sau N lần thất bại liên tiếp
- **Passive health check**: load balancer quan sát traffic thật và đánh dấu instance không khỏe mạnh sau khi nó trả về quá nhiều lỗi hoặc timeout, không cần probe riêng
- Một instance vừa hồi phục thường được thêm lại **từ từ** ("slow start") thay vì nhận ngay toàn bộ phần traffic của nó, để tránh làm quá tải instance vừa hồi phục

### Sửa lại diagram này

```bash
git clone https://github.com/tt-a1i/archify.git
cd archify
node bin/archify.mjs validate architecture path/to/spec.architecture.json --quality showcase --json
node bin/archify.mjs deliver architecture path/to/spec.architecture.json path/to/diagram.html --quality showcase --json
```
