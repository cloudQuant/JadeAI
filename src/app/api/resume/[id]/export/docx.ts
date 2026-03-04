import type {
  PersonalInfoContent,
  WorkExperienceContent,
  EducationContent,
  SkillsContent,
  ProjectsContent,
  CertificationsContent,
  LanguagesContent,
  SummaryContent,
  CustomContent,
} from '@/types/resume';
import { esc, safe, localizeSectionTitles, type ResumeWithSections, type Section } from './utils';

/* ---------- Word-compatible helpers ---------- */

/** Build a two-column table row: left content + right-aligned date */
function headerRow(left: string, right: string): string {
  return `<table border="0" cellspacing="0" cellpadding="0" width="100%" style="border-collapse:collapse;">
<tr><td style="padding:0;"><b>${left}</b></td>
<td align="right" style="padding:0;white-space:nowrap;color:#666;font-size:10pt;">${right}</td></tr></table>`;
}

function renderSectionHtml(section: Section): string {
  if (!section.visible) return '';

  switch (section.type) {
    case 'personal_info': {
      const info = section.content as PersonalInfoContent;
      let html = '<div style="text-align:center;border-bottom:2pt solid #2563eb;padding-bottom:8pt;margin-bottom:12pt;">';
      if (info.fullName) html += `<p style="font-size:22pt;font-weight:bold;color:#1a1a1a;margin:0 0 2pt 0;">${esc(info.fullName)}</p>`;
      if (info.jobTitle) html += `<p style="font-size:11pt;color:#555;margin:0 0 4pt 0;">${esc(info.jobTitle)}</p>`;
      const contactParts: string[] = [];
      if (info.email) contactParts.push(esc(info.email));
      if (info.phone) contactParts.push(esc(info.phone));
      if (info.location) contactParts.push(esc(info.location));
      if (info.website) contactParts.push(esc(info.website));
      if (contactParts.length) html += `<p style="font-size:9pt;color:#666;margin:0;">${contactParts.join(' | ')}</p>`;
      const linkParts: string[] = [];
      if (info.linkedin) linkParts.push(`<a href="${esc(info.linkedin)}" style="color:#2563eb;">${esc(info.linkedin)}</a>`);
      if (info.github) linkParts.push(`<a href="${esc(info.github)}" style="color:#2563eb;">${esc(info.github)}</a>`);
      if (linkParts.length) html += `<p style="font-size:9pt;margin:2pt 0 0 0;">${linkParts.join(' | ')}</p>`;
      html += '</div>';
      return html;
    }
    case 'summary': {
      const summary = section.content as SummaryContent;
      let html = sectionHeading(section.title);
      if (summary.text) {
        const cleaned = summary.text.replace(/<div>/g, '<br>').replace(/<\/div>/g, '');
        html += `<p style="font-size:10pt;line-height:150%;margin:0 0 4pt 0;">${cleaned}</p>`;
      }
      return html;
    }
    case 'work_experience': {
      const work = section.content as WorkExperienceContent;
      let html = sectionHeading(section.title);
      for (const item of work.items || []) {
        const dateRange = item.current ? `${safe(item.startDate)} - Present` : `${safe(item.startDate)} - ${safe(item.endDate)}`;
        const leftParts = [esc(item.position)];
        if (item.company) leftParts[0] += `<span style="font-weight:normal;">, ${esc(item.company)}</span>`;
        html += headerRow(leftParts[0], esc(dateRange));
        if (item.location) html += `<p style="font-size:9pt;color:#888;margin:0 0 2pt 0;">${esc(item.location)}</p>`;
        if (item.description) html += `<p style="font-size:10pt;margin:2pt 0;">${esc(item.description)}</p>`;
        if (item.highlights?.length) {
          html += '<ul style="margin:2pt 0 8pt 18pt;padding:0;">';
          for (const h of item.highlights) if (h) html += `<li style="font-size:10pt;margin-bottom:1pt;">${esc(h)}</li>`;
          html += '</ul>';
        } else {
          html += '<p style="margin:0 0 6pt 0;">&nbsp;</p>';
        }
      }
      return html;
    }
    case 'education': {
      const edu = section.content as EducationContent;
      let html = sectionHeading(section.title);
      for (const item of edu.items || []) {
        const left = `${esc(item.degree)}${item.field ? `, ${esc(item.field)}` : ''}<span style="font-weight:normal;">, ${esc(item.institution)}</span>`;
        html += headerRow(left, `${esc(item.startDate)} - ${esc(item.endDate)}`);
        if (item.location) html += `<p style="font-size:9pt;color:#888;margin:0 0 2pt 0;">${esc(item.location)}</p>`;
        if (item.gpa) html += `<p style="font-size:10pt;margin:0 0 2pt 0;">GPA: ${esc(item.gpa)}</p>`;
        if (item.highlights?.length) {
          html += '<ul style="margin:2pt 0 8pt 18pt;padding:0;">';
          for (const h of item.highlights) if (h) html += `<li style="font-size:10pt;margin-bottom:1pt;">${esc(h)}</li>`;
          html += '</ul>';
        } else {
          html += '<p style="margin:0 0 6pt 0;">&nbsp;</p>';
        }
      }
      return html;
    }
    case 'skills': {
      const skills = section.content as SkillsContent;
      let html = sectionHeading(section.title);
      html += '<table border="0" cellspacing="0" cellpadding="2" style="border-collapse:collapse;">';
      for (const cat of skills.categories || []) {
        html += `<tr><td valign="top" style="font-size:10pt;font-weight:bold;padding-right:6pt;white-space:nowrap;">${esc(cat.name)}:</td>`;
        html += `<td style="font-size:10pt;">${esc((cat.skills || []).join(', '))}</td></tr>`;
      }
      html += '</table>';
      return html;
    }
    case 'projects': {
      const projects = section.content as ProjectsContent;
      let html = sectionHeading(section.title);
      for (const item of projects.items || []) {
        const dateStr = item.startDate ? `${esc(item.startDate)}${item.endDate ? ` - ${esc(item.endDate)}` : ''}` : '';
        html += headerRow(esc(item.name), dateStr);
        if (item.url) html += `<p style="font-size:9pt;margin:0 0 2pt 0;"><span style="color:#888;">Website: </span><a href="${esc(item.url)}" style="color:#2563eb;">${esc(item.url)}</a></p>`;
        if (item.description) html += `<p style="font-size:10pt;margin:0 0 2pt 0;">${esc(item.description)}</p>`;
        if (item.technologies?.length) html += `<p style="font-size:9pt;color:#555;margin:0 0 2pt 0;">Tech: ${esc(item.technologies.join(', '))}</p>`;
        if (item.highlights?.length) {
          html += '<ul style="margin:2pt 0 8pt 18pt;padding:0;">';
          for (const h of item.highlights) if (h) html += `<li style="font-size:10pt;margin-bottom:1pt;">${esc(h)}</li>`;
          html += '</ul>';
        } else {
          html += '<p style="margin:0 0 6pt 0;">&nbsp;</p>';
        }
      }
      return html;
    }
    case 'certifications': {
      const certs = section.content as CertificationsContent;
      let html = sectionHeading(section.title);
      for (const item of certs.items || []) {
        const parts = [`<b>${esc(item.name)}</b>`];
        if (item.issuer) parts.push(esc(item.issuer));
        if (item.date) parts.push(`(${esc(item.date)})`);
        html += `<p style="font-size:10pt;margin:0 0 2pt 0;">${parts.join(' — ')}</p>`;
      }
      return html;
    }
    case 'languages': {
      const langs = section.content as LanguagesContent;
      let html = sectionHeading(section.title);
      for (const item of langs.items || []) {
        html += `<p style="font-size:10pt;margin:0 0 2pt 0;">${esc(item.language)}: ${esc(item.proficiency)}</p>`;
      }
      return html;
    }
    default: {
      const custom = section.content as CustomContent;
      let html = sectionHeading(section.title);
      for (const item of (custom as any).items || []) {
        const left = `${esc(item.title)}${item.subtitle ? ` - ${esc(item.subtitle)}` : ''}`;
        html += headerRow(left, item.date ? esc(item.date) : '');
        if (item.description) html += `<p style="font-size:10pt;margin:2pt 0 6pt 0;">${esc(item.description)}</p>`;
      }
      return html;
    }
  }
}

function sectionHeading(title: string): string {
  return `<p style="font-size:13pt;font-weight:bold;color:#1a1a1a;border-bottom:1pt solid #cccccc;padding-bottom:2pt;margin:12pt 0 6pt 0;">${esc(title)}</p>`;
}

export function generateDocx(resume: ResumeWithSections, locale?: string): string {
  const localizedResume = localizeSectionTitles(resume, locale);
  const sectionsHtml = localizedResume.sections.map(renderSectionHtml).join('\n');

  return `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta charset="UTF-8">
  <meta name="ProgId" content="Word.Document">
  <meta name="Generator" content="JadeAI">
  <!--[if gte mso 9]>
  <xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>100</w:Zoom>
      <w:DoNotOptimizeForBrowser/>
    </w:WordDocument>
  </xml>
  <![endif]-->
  <style>
    @page { size: A4; margin: 54pt 54pt 54pt 54pt; }
    body {
      font-family: Calibri, 'Microsoft YaHei', 'PingFang SC', Arial, sans-serif;
      font-size: 10pt;
      color: #333;
      line-height: 150%;
    }
    table { font-size: 10pt; }
    a { color: #2563eb; text-decoration: none; }
  </style>
</head>
<body>
${sectionsHtml}
</body>
</html>`;
}
