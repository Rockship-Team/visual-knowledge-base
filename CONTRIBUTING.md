# Đóng góp một chủ đề mới

1. Clone [archify](https://github.com/tt-a1i/archify) (công cụ tạo diagram) và đọc `SKILL.md` để biết cách viết spec JSON cho từng loại: `architecture`, `workflow`, `sequence`, `dataflow`, `lifecycle`.
2. Tạo thư mục `diagrams/<slug-chu-de>/`.
3. Viết `spec.<type>.json` theo schema tương ứng trong `archify/schemas/`.
4. Validate và render:

   ```bash
   node bin/archify.mjs validate <type> diagrams/<slug>/spec.<type>.json --quality showcase --json
   node bin/archify.mjs deliver <type> diagrams/<slug>/spec.<type>.json diagrams/<slug>/diagram.html --quality showcase --json
   ```

5. Viết `README.md` trong thư mục chủ đề: tóm tắt, kịch bản, nguyên nhân/giải pháp (nếu là bug/pattern), link tới `diagram.html` và `spec.*.json`.
6. Thêm một dòng vào bảng "Danh mục" trong `README.md` gốc.
7. Mở Pull Request.

## Quy ước

- Một thư mục = một chủ đề, đặt tên slug ngắn gọn bằng tiếng Anh (kebab-case).
- Luôn validate với `--quality showcase` trước khi deliver; không commit spec chưa pass.
- Giữ tiếng Việt cho phần giải thích, giữ nguyên thuật ngữ/API/code identifier bằng tiếng Anh.
