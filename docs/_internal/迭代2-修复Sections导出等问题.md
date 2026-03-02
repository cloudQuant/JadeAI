1. 我简历预览的时候Sections是英文的，但是pdf导出的时候就是中文的，这个需要和简历预览的时候保持一致，简历预览的时候是英文，最终也就是英文；简历预览的时候是中文，最终也就是中文；
2. SKILLS里面的排版不太好看，需要调整一下，需要美化，对齐一下
3. Projects中网址前面增加一个Website，和下面一行Tech保持一致.

---

## 修复记录

### Issue 1: 导出Section标题语言与预览一致

**根因**: 导出API (`localizeSectionTitles`) 使用 `resume.language`（数据库存储的语言，如 'zh'）来本地化Section标题，而预览页面使用 `useLocale()`（当前UI语言，如 'en'）。当用户在 `/en/editor/...` 预览时看到英文标题，但导出时Section标题变成中文。

**修复方案**: 前端传递当前UI locale到导出API，API再传递给 `localizeSectionTitles`。

**修改文件**:
- `src/components/editor/export-dialog.tsx` — 添加 `useLocale()`，在导出URL中传递 `&locale=${locale}`
- `src/hooks/use-pdf-export.ts` — 同上，传递 locale 参数
- `src/app/api/resume/[id]/export/route.ts` — 读取 `locale` query参数并传递给 generateHtml/generatePlainText/generateDocx
- `src/app/api/resume/[id]/export/builders.ts` — `generateHtml()` 添加 `locale?` 参数
- `src/app/api/resume/[id]/export/plain-text.ts` — `generatePlainText()` 添加 `locale?` 参数
- `src/app/api/resume/[id]/export/docx.ts` — `generateDocx()` 添加 `locale?` 参数
- `src/app/api/resume/[id]/export/utils.ts` — `localizeSectionTitles()` 添加 `localeOverride?` 参数，优先使用

### Issue 2: SKILLS排版优化

**问题**: 原来使用 `w-32`（128px）固定宽度的两列flex布局，长类别名（如 "Liquidity Risk Management"）会被截断。

**修复**: 改为 inline flow 布局，类别名和技能自然换行，不再固定宽度。

**修改文件**:
- `src/components/preview/templates/professional.tsx` — SKILLS section 布局
- `src/app/api/resume/[id]/export/templates/professional.ts` — 同步修改

### Issue 3: Projects中URL前添加"Website:"标签

**修复**: 在所有50个preview模板和50个export模板中，将 `<a href={item.url}>` 包裹在 `<p>` 中并添加 `<span>Website: </span>` 前缀，与 `Tech:` 标签保持一致。

**修改文件**: 所有 `src/components/preview/templates/*.tsx` 和 `src/app/api/resume/[id]/export/templates/*.ts`

### 附加修复（迭代1遗留）

- `src/app/api/resume/[id]/export/utils.ts` — font-family 中添加 `'Noto Sans SC'` 解决Puppeteer中文字体渲染缺失问题