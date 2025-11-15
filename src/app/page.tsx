import { redirect } from 'next/navigation';
import { defaultLocale } from '@/i18n';

// This page only renders when the user visits '/' directly
// It immediately redirects to the default locale
export default function RootPage() {
  redirect(`/${defaultLocale}`);
}
