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
6. Tạo `diagrams/<slug>/index.html` — trang đọc trên site, dựa theo `diagrams/race-condition-lost-update/index.html` làm mẫu: copy file đó, đổi `<title>`, `topic-title`, `topic-meta` (badge loại + tag), nhúng lại đúng nội dung từ `README.md` vào khối `<div class="prose">`. Trang này dùng chung `assets/site.css` (đường dẫn `../../assets/site.css`) nên không cần style riêng.
7. Thêm một card vào `index.html` gốc, trong `#catalog-grid`:

   ```html
   <a class="card"
      href="diagrams/<slug>/"
      data-type="<loại: architecture|workflow|sequence|dataflow|lifecycle>"
      data-search="<các từ khóa để tìm kiếm, cách nhau bằng dấu cách>">
     <h2>Tên chủ đề</h2>
     <p class="desc">Mô tả một câu.</p>
     <div class="meta-row">
       <span class="badge">loại</span>
       <span class="tag">tag-1</span>
       <span class="tag">tag-2</span>
     </div>
   </a>
   ```

8. Thêm một dòng vào bảng "Danh mục" trong `README.md` gốc.
9. Mở Pull Request. Sau khi merge vào `main`, GitHub Pages tự rebuild trong khoảng 1 phút.

## Quy ước

- Một thư mục = một chủ đề, đặt tên slug ngắn gọn bằng tiếng Anh (kebab-case).
- Luôn validate với `--quality showcase` trước khi deliver; không commit spec chưa pass.
- Giữ tiếng Việt cho phần giải thích, giữ nguyên thuật ngữ/API/code identifier bằng tiếng Anh.
