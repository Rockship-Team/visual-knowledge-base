# Đóng góp một chủ đề mới

1. Clone [archify](https://github.com/tt-a1i/archify) (công cụ tạo diagram) và đọc `SKILL.md` để biết cách viết spec JSON cho từng loại: `architecture`, `workflow`, `sequence`, `dataflow`, `lifecycle`.
2. Tạo thư mục `diagrams/<slug-chu-de>/`.
3. Viết `spec.<type>.json` theo schema tương ứng trong `archify/schemas/`. **Toàn bộ text hiển thị trong diagram (label, sublabel, note, card title/items, meta.title) phải viết bằng tiếng Anh** — archify không tự dịch nội dung, `meta.locale` chỉ đổi UI chrome của Viewer chứ không dịch nội dung tác giả.
4. Validate và render:

   ```bash
   node bin/archify.mjs validate <type> diagrams/<slug>/spec.<type>.json --quality showcase --json
   node bin/archify.mjs deliver <type> diagrams/<slug>/spec.<type>.json diagrams/<slug>/diagram.html --quality showcase --json
   ```

5. Tạo `diagrams/<slug>/index.html` — copy `diagrams/race-condition-lost-update/index.html` làm mẫu (đã có sẵn bilingual toggle EN/VI dùng chung `assets/i18n.js`). Giữ nguyên các phần dùng chung, chỉ đổi nội dung theo chủ đề:
   - `<title>`, `.topic-title`, `.topic-meta` (badge loại + tag): **tiếng Anh**, không cần bản VI (đây là thuật ngữ kỹ thuật).
   - Header: giữ nguyên khối `.lang-switch` (EN/VI buttons) và breadcrumb/GitHub-link đã bọc `data-lang="en"` / `data-lang="vi" hidden`, chỉ đổi URL GitHub tree cho đúng slug.
   - Phần giải thích: dùng **hai khối `.prose` đầy đủ** thay vì một:

     ```html
     <div class="prose" data-lang="en">
       <!-- Summary / Scenario / Root Cause / How to Fix / Rebuild this diagram -->
     </div>
     <div class="prose" data-lang="vi" hidden>
       <!-- Tóm tắt / Kịch bản / Nguyên nhân gốc rễ / Cách khắc phục / Sửa lại diagram này -->
     </div>
     ```

   - Trước `</body>` phải có `<script src="../../assets/i18n.js"></script>` (không cần sửa file này, nó đọc `data-lang` tự động và nhớ lựa chọn ngôn ngữ qua `localStorage`).
6. Viết `diagrams/<slug>/README.md` — dùng cho khi duyệt trên GitHub (không có JS toggle), nên xếp chồng cả hai ngôn ngữ: heading `## English` với bản dịch đầy đủ, dấu `---`, rồi `## Tiếng Việt` với nội dung gốc.
7. Thêm một card vào `index.html` gốc, bên trong `.grid` của đúng category (xem bước 8 nếu category chưa tồn tại):

   ```html
   <a class="card"
      href="diagrams/<slug>/"
      data-type="<loại: architecture|workflow|sequence|dataflow|lifecycle>"
      data-search="<từ khóa tìm kiếm, cách nhau bằng dấu cách>">
     <h2>Tên chủ đề (tiếng Anh)</h2>
     <p class="desc" data-lang="en">Mô tả một câu — tiếng Anh.</p>
     <p class="desc" data-lang="vi" hidden>Mô tả một câu — tiếng Việt.</p>
     <div class="meta-row">
       <span class="badge">loại</span>
       <span class="tag">tag-1</span>
       <span class="tag">tag-2</span>
     </div>
   </a>
   ```

8. Nếu chủ đề thuộc một category chưa có trên trang chủ, thêm một `<section class="category-section" id="<slug-category>" data-category-label="<Tên category>">` mới vào `index.html` gốc (copy cấu trúc section "Concurrency & Distributed Systems" đang có: `.category-head` + `h2.category-title` + `p.category-desc data-lang="en"` + `p.category-desc data-lang="vi" hidden` + `div.grid`). `assets/site.js` tự đọc các `.category-section` để dựng nav và tự ẩn category rỗng khi lọc; `assets/i18n.js` tự đọc mọi `[data-lang]` mới thêm vào — không cần sửa JS cho cả hai.
9. Thêm một dòng vào bảng "Danh mục" trong `README.md` gốc (dưới đúng heading category, tạo heading mới nếu cần).
10. Mở Pull Request. Sau khi merge vào `main`, GitHub Pages tự rebuild trong khoảng 1 phút.

## Quy ước

- Một thư mục = một chủ đề, đặt tên slug ngắn gọn bằng tiếng Anh (kebab-case).
- Luôn validate với `--quality showcase` trước khi deliver; không commit spec chưa pass (9/9 checks, 0 errors, 0 warnings).
- **Nội dung diagram (archify JSON) luôn bằng tiếng Anh.** Nội dung trang đọc (`index.html` prose, homepage card `.desc`, category `.desc`) phải song ngữ Anh/Việt theo pattern `data-lang="en"` / `data-lang="vi" hidden`; bản Anh là mặc định hiển thị. `README.md` mỗi chủ đề xếp chồng cả hai ngôn ngữ vì GitHub không chạy JS. Các nhãn UI chung ngắn (search placeholder, pill "All", nav "GitHub") có thể để tiếng Anh, không bắt buộc song ngữ.
- Giữ nguyên thuật ngữ/API/code identifier bằng tiếng Anh trong cả hai ngôn ngữ.
