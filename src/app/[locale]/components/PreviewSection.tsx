import React from 'react';
import { ImagePreview } from './ImagePreview';

interface PreviewSectionProps {
  title?: string;
  show: boolean;
  imageUrl?: string;
  imageTitle?: string;
  loading: boolean;
  error?: string;
}

export const PreviewSection: React.FC<PreviewSectionProps> = ({ title = 'Preview', show, imageUrl, imageTitle, loading, error }) => {
  if (!show) return null;
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-[rgb(var(--color-on-surface-muted-rgb))]">{title}</h3>
      <ImagePreview originalUrl={imageUrl} title={imageTitle} isLoading={loading && !imageUrl && !error} enableImagePreviews={true} />
    </div>
  );
};

export default PreviewSection;


