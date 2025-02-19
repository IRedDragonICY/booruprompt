'use client';

import { useState } from 'react';

async function extractTagsFromURL(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      return `Failed to fetch URL: ${response.status} ${response.statusText}`;
    }
    const html = await response.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const tagElements = doc.querySelectorAll('#tag-list li.flex');
    const extractedTags: string[] = [];
    tagElements.forEach((tagElement) => {
      const tagNameElement = tagElement.querySelector('a.search-tag');
      const tagName = tagNameElement?.textContent?.trim() ?? '';
      if (tagName) {
        extractedTags.push(tagName.replace(/ \(\d+\.?\d*[kM]?\)$/, ''));
      }
    });
    return extractedTags.join(', ');
  } catch (error) {
    console.error('Error extracting tags:', error);
    return 'Failed to extract tags from the URL';
  }
}

export default function Home() {
  const [booruUrl, setBooruUrl] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const extractTags = async () => {
    setLoading(true);
    setError('');
    setTags('');
    try {
      const extractedTags = await extractTagsFromURL(booruUrl);
      setTags(extractedTags);
    } catch (e) {
      setError('Failed to extract tags. Please check the URL and try again.');
      console.error('Error during tag extraction:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
        <div className="relative py-3 sm:max-w-xl sm:mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-sky-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl" />
          <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
            <div className="max-w-md mx-auto">
              <h1 className="text-2xl font-semibold">Booru Tag Extractor</h1>
              <div className="divide-y divide-gray-200">
                <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                  <div className="relative">
                    <input
                        id="booruUrl"
                        name="booruUrl"
                        type="url"
                        className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
                        placeholder="Enter Booru URL"
                        value={booruUrl}
                        onChange={(e) => setBooruUrl(e.target.value)}
                    />
                    <label
                        htmlFor="booruUrl"
                        className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                    >
                      Booru Post URL
                    </label>
                  </div>
                  <div className="relative">
                    <button
                        onClick={extractTags}
                        type="button"
                        className="bg-cyan-500 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        disabled={loading}
                    >
                      {loading ? 'Extracting...' : 'Extract Tags'}
                    </button>
                  </div>
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  {tags && (
                      <div className="relative mt-4">
                    <textarea
                        id="tagsOutput"
                        name="tagsOutput"
                        rows={4}
                        className="peer placeholder-transparent h-auto w-full border-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600 rounded p-2 resize-none"
                        placeholder="Extracted Tags"
                        value={tags}
                        readOnly
                    />
                        <label
                            htmlFor="tagsOutput"
                            className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                        >
                          Extracted Tags
                        </label>
                        <button
                            onClick={() => navigator.clipboard.writeText(tags)}
                            type="button"
                            className="mt-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline text-sm"
                        >
                          Copy Tags
                        </button>
                      </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
