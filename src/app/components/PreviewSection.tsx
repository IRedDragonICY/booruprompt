import React from 'react';
import { ImagePreview } from './ImagePreview';
import { useTranslation } from 'react-i18next';

interface PreviewSectionProps {
  title?: string;
  show: boolean;
  imageUrl?: string;
  imageTitle?: string;
  loading: boolean;
  error?: string;
}

export const PreviewSection: React.FC<PreviewSectionProps> = ({ title, show, imageUrl, imageTitle, loading, error }) => {
  const { t } = useTranslation();
  const resolvedTitle = title ?? t('extractor.preview.title');
  if (!show) return null;
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-[rgb(var(--color-on-surface-muted-rgb))]">{resolvedTitle}</h3>
      <ImagePreview originalUrl={imageUrl} title={imageTitle} isLoading={loading && !imageUrl && !error} enableImagePreviews={true} />
    </div>
  );
};

export default PreviewSection;


