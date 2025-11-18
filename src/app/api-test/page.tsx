import type { Metadata } from 'next';
import MainPageContent from '../page';

export const metadata: Metadata = {
  title: 'API Testing & Documentation - Booru Prompt',
  description: 'Test the Booru tag extraction API with interactive examples and view comprehensive documentation with code samples in multiple programming languages.',
  keywords: 'api testing, api documentation, booru api, tag extraction api, rest api, api examples, curl, javascript, python',
  openGraph: {
    title: 'API Testing & Documentation - Booru Prompt',
    description: 'Test the Booru tag extraction API with interactive examples and comprehensive documentation.',
    type: 'website',
    url: 'https://booruprompt.vercel.app/api-test',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'API Testing & Documentation - Booru Prompt',
    description: 'Test the Booru tag extraction API with interactive examples and comprehensive documentation.',
  },
  alternates: {
    canonical: 'https://booruprompt.vercel.app/api-test',
  },
};

export default MainPageContent;
