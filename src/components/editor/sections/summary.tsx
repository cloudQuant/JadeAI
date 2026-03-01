'use client';

import { useTranslations } from 'next-intl';
import { RichTextEditor } from '../fields/rich-text-editor';
import type { ResumeSection, SummaryContent } from '@/types/resume';

interface Props {
  section: ResumeSection;
  onUpdate: (content: Partial<SummaryContent>) => void;
}

export function SummarySection({ section, onUpdate }: Props) {
  const t = useTranslations('editor.fields');
  const content = section.content as SummaryContent;

  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{t('description')}</label>
      <RichTextEditor
        value={content.text || ''}
        onChange={(v) => onUpdate({ text: v })}
        placeholder={t('description')}
      />
    </div>
  );
}
