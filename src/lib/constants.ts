export const APP_NAME = 'JadeAI';

export const SECTION_TYPES = [
  'personal_info',
  'summary',
  'work_experience',
  'education',
  'skills',
  'projects',
  'certifications',
  'languages',
  'custom',
] as const;

export type SectionType = (typeof SECTION_TYPES)[number];

export const DEFAULT_SECTIONS: { type: SectionType; titleZh: string; titleEn: string }[] = [
  { type: 'personal_info', titleZh: '个人信息', titleEn: 'Personal Info' },
  { type: 'summary', titleZh: '个人简介', titleEn: 'Summary' },
  { type: 'work_experience', titleZh: '工作经历', titleEn: 'Work Experience' },
  { type: 'education', titleZh: '教育背景', titleEn: 'Education' },
  { type: 'skills', titleZh: '技能特长', titleEn: 'Skills' },
];

// Complete section type labels for all possible section types
export const SECTION_LABELS: Record<
  SectionType,
  { zh: string; en: string }
> = {
  personal_info: { zh: '个人信息', en: 'Personal Info' },
  summary: { zh: '个人简介', en: 'Summary' },
  work_experience: { zh: '工作经历', en: 'Work Experience' },
  education: { zh: '教育背景', en: 'Education' },
  skills: { zh: '技能特长', en: 'Skills' },
  projects: { zh: '项目经历', en: 'Projects' },
  certifications: { zh: '资格证书', en: 'Certifications' },
  languages: { zh: '语言能力', en: 'Languages' },
  custom: { zh: '自定义模块', en: 'Custom Section' },
};

/**
 * Get the localized section title based on section type and locale.
 * @param type - The section type
 * @param locale - The locale ('zh' or 'en')
 * @returns The localized title for the section
 */
export function getSectionTitle(type: SectionType, locale: string = 'zh'): string {
  const labels = SECTION_LABELS[type];
  if (!labels) return type;
  return locale === 'en' ? labels.en : labels.zh;
}

export const TEMPLATES = [
  'classic', 'modern', 'minimal', 'professional', 'two-column', 'creative', 'ats', 'academic', 'elegant', 'executive',
  'developer', 'designer', 'startup', 'formal', 'infographic', 'compact', 'euro', 'clean', 'bold', 'timeline',
  // Batch 1: Industry/Professional
  'nordic', 'corporate', 'consultant', 'finance', 'medical',
  // Batch 2: Modern/Tech
  'gradient', 'metro', 'material', 'coder', 'blocks',
  // Batch 3: Creative/Artistic
  'magazine', 'artistic', 'retro', 'neon', 'watercolor',
  // Batch 4: Style/Culture
  'swiss', 'japanese', 'berlin', 'luxe', 'rose',
  // Batch 5: Specialized
  'architect', 'legal', 'teacher', 'scientist', 'engineer',
  // Batch 6: Layout Variants
  'sidebar', 'card', 'zigzag', 'ribbon', 'mosaic',
] as const;
export type Template = (typeof TEMPLATES)[number];

/** Templates with full-bleed background headers — no outer padding needed */
export const BACKGROUND_TEMPLATES: ReadonlySet<string> = new Set([
  'modern', 'creative', 'two-column', 'executive', 'developer',
  'designer', 'startup', 'infographic', 'compact', 'bold',
  'corporate', 'finance', 'gradient', 'material', 'coder',
  'artistic', 'neon', 'berlin', 'engineer', 'sidebar', 'ribbon',
]);

export const AUTOSAVE_DELAY = 500;
export const MAX_UNDO_STACK = 50;
