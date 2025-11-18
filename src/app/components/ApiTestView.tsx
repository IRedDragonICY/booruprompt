'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ClipboardIcon, CheckCircleIcon } from './icons/icons';

const API_ENDPOINT = '/api/fetch-booru';
const EXAMPLE_URL = 'https://safebooru.org/index.php?page=post&s=view&id=5592299';

export default function ApiTestView() {
    const [testUrl, setTestUrl] = useState(EXAMPLE_URL);
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [copiedSection, setCopiedSection] = useState<string | null>(null);

    const baseUrl = typeof window !== 'undefined'
        ? window.location.origin
        : 'https://booruprompt.vercel.app';

    const handleTest = async () => {
        if (!testUrl.trim()) {
            setError('Please enter a URL');
            return;
        }

        setLoading(true);
        setError(null);
        setResponse(null);

        try {
            const res = await fetch(API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ targetUrl: testUrl }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(`Error ${res.status}: ${data.error || 'Unknown error'}`);
            } else {
                setResponse(data);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to call API');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text: string, section: string) => {
        navigator.clipboard.writeText(text);
        setCopiedSection(section);
        setTimeout(() => setCopiedSection(null), 2000);
    };

    const curlExample = `curl -X POST ${baseUrl}${API_ENDPOINT} \\
  -H "Content-Type: application/json" \\
  -d '{"targetUrl": "${EXAMPLE_URL}"}'`;

    const javascriptExample = `// Using fetch API
fetch('${baseUrl}${API_ENDPOINT}', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    targetUrl: '${EXAMPLE_URL}'
  })
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));`;

    const pythonExample = `import requests
import json

url = "${baseUrl}${API_ENDPOINT}"
payload = {
    "targetUrl": "${EXAMPLE_URL}"
}

headers = {
    "Content-Type": "application/json"
}

response = requests.post(url, json=payload, headers=headers)
data = response.json()
print(json.dumps(data, indent=2))`;

    const nodeExample = `const axios = require('axios');

const url = '${baseUrl}${API_ENDPOINT}';
const data = {
  targetUrl: '${EXAMPLE_URL}'
};

axios.post(url, data)
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error('Error:', error.response?.data || error.message);
  });`;

    const phpExample = `<?php
$url = "${baseUrl}${API_ENDPOINT}";
$data = array(
    "targetUrl" => "${EXAMPLE_URL}"
);

$options = array(
    'http' => array(
        'header'  => "Content-Type: application/json\\r\\n",
        'method'  => 'POST',
        'content' => json_encode($data)
    )
);

$context  = stream_context_create($options);
$result = file_get_contents($url, false, $context);
$response = json_decode($result, true);

print_r($response);
?>`;

    const CodeBlock = ({ code, language, section }: { code: string; language: string; section: string }) => (
        <div className="relative">
            <div className="absolute top-2 right-2 flex items-center gap-2">
                <span className="text-xs text-[rgb(var(--color-on-surface-muted-rgb))] bg-[rgb(var(--color-surface-alt-2-rgb))] px-2 py-1 rounded">
                    {language}
                </span>
                <button
                    onClick={() => copyToClipboard(code, section)}
                    className="p-2 rounded bg-[rgb(var(--color-surface-alt-2-rgb))] hover:bg-[rgb(var(--color-surface-border-rgb))] transition-colors"
                    title="Copy to clipboard"
                >
                    {copiedSection === section ? (
                        <CheckCircleIcon className="h-4 w-4 text-green-500" />
                    ) : (
                        <ClipboardIcon className="h-4 w-4 text-[rgb(var(--color-on-surface-rgb))]" />
                    )}
                </button>
            </div>
            <pre className="bg-[rgb(var(--color-surface-alt-2-rgb))] rounded-lg p-4 overflow-x-auto text-sm">
                <code className="text-[rgb(var(--color-on-surface-rgb))]">{code}</code>
            </pre>
        </div>
    );

    return (
        <div className="h-full w-full overflow-y-auto bg-[rgb(var(--color-surface-rgb))] p-4 md:p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-5xl mx-auto space-y-6"
            >
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-[rgb(var(--color-on-surface-rgb))] mb-2">
                        API Testing & Documentation
                    </h1>
                    <p className="text-[rgb(var(--color-on-surface-muted-rgb))]">
                        Test the Booru tag extraction API and view integration examples
                    </p>
                </div>

                {/* Interactive Tester */}
                <div className="bg-[rgb(var(--color-surface-alt-rgb))] rounded-xl p-6 border border-[rgb(var(--color-surface-border-rgb))]">
                    <h2 className="text-xl font-semibold text-[rgb(var(--color-on-surface-rgb))] mb-4">
                        Interactive API Tester
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-[rgb(var(--color-on-surface-rgb))] mb-2">
                                Booru Post URL
                            </label>
                            <input
                                type="text"
                                value={testUrl}
                                onChange={(e) => setTestUrl(e.target.value)}
                                placeholder="Enter booru post URL"
                                className="w-full px-4 py-2 bg-[rgb(var(--color-surface-rgb))] border border-[rgb(var(--color-surface-border-rgb))] rounded-lg text-[rgb(var(--color-on-surface-rgb))] placeholder-[rgb(var(--color-on-surface-muted-rgb))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary-rgb))]"
                            />
                        </div>

                        <button
                            onClick={handleTest}
                            disabled={loading}
                            className="px-6 py-2 bg-[rgb(var(--color-primary-rgb))] text-white rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                        >
                            {loading ? 'Testing...' : 'Test API'}
                        </button>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                                <p className="text-red-500 font-medium">Error</p>
                                <p className="text-red-400 text-sm mt-1">{error}</p>
                            </div>
                        )}

                        {response && (
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-[rgb(var(--color-on-surface-rgb))]">
                                        Response
                                    </h3>
                                    <button
                                        onClick={() => copyToClipboard(JSON.stringify(response, null, 2), 'response')}
                                        className="p-2 rounded hover:bg-[rgb(var(--color-surface-border-rgb))] transition-colors"
                                        title="Copy response"
                                    >
                                        {copiedSection === 'response' ? (
                                            <CheckCircleIcon className="h-4 w-4 text-green-500" />
                                        ) : (
                                            <ClipboardIcon className="h-4 w-4 text-[rgb(var(--color-on-surface-rgb))]" />
                                        )}
                                    </button>
                                </div>
                                <pre className="bg-[rgb(var(--color-surface-rgb))] rounded-lg p-4 overflow-x-auto text-sm max-h-96">
                                    <code className="text-[rgb(var(--color-on-surface-rgb))]">
                                        {JSON.stringify(response, null, 2)}
                                    </code>
                                </pre>
                            </div>
                        )}
                    </div>
                </div>

                {/* API Documentation */}
                <div className="bg-[rgb(var(--color-surface-alt-rgb))] rounded-xl p-6 border border-[rgb(var(--color-surface-border-rgb))]">
                    <h2 className="text-xl font-semibold text-[rgb(var(--color-on-surface-rgb))] mb-4">
                        API Endpoint
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-[rgb(var(--color-on-surface-muted-rgb))] mb-2">Endpoint URL</p>
                            <code className="block bg-[rgb(var(--color-surface-alt-2-rgb))] px-4 py-2 rounded text-[rgb(var(--color-on-surface-rgb))]">
                                POST {baseUrl}{API_ENDPOINT}
                            </code>
                        </div>

                        <div>
                            <p className="text-sm text-[rgb(var(--color-on-surface-muted-rgb))] mb-2">Request Headers</p>
                            <code className="block bg-[rgb(var(--color-surface-alt-2-rgb))] px-4 py-2 rounded text-[rgb(var(--color-on-surface-rgb))]">
                                Content-Type: application/json
                            </code>
                        </div>

                        <div>
                            <p className="text-sm text-[rgb(var(--color-on-surface-muted-rgb))] mb-2">Request Body</p>
                            <CodeBlock
                                code={JSON.stringify({ targetUrl: "https://example.com/post/123" }, null, 2)}
                                language="JSON"
                                section="request-body"
                            />
                        </div>

                        <div>
                            <p className="text-sm text-[rgb(var(--color-on-surface-muted-rgb))] mb-2">Response Format</p>
                            <CodeBlock
                                code={`{
  "siteName": "Safebooru",
  "tags": {
    "general": ["tag1", "tag2", "..."],
    "character": ["character1", "..."],
    "copyright": ["series1", "..."],
    "artist": ["artist1", "..."],
    "meta": ["meta1", "..."]
  },
  "imageUrl": "https://...",
  "title": "Post #123"
}`}
                                language="JSON"
                                section="response-format"
                            />
                        </div>
                    </div>
                </div>

                {/* Code Examples */}
                <div className="bg-[rgb(var(--color-surface-alt-rgb))] rounded-xl p-6 border border-[rgb(var(--color-surface-border-rgb))]">
                    <h2 className="text-xl font-semibold text-[rgb(var(--color-on-surface-rgb))] mb-4">
                        Code Examples
                    </h2>

                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-medium text-[rgb(var(--color-on-surface-rgb))] mb-3">
                                cURL
                            </h3>
                            <CodeBlock code={curlExample} language="bash" section="curl" />
                        </div>

                        <div>
                            <h3 className="text-lg font-medium text-[rgb(var(--color-on-surface-rgb))] mb-3">
                                JavaScript (Fetch API)
                            </h3>
                            <CodeBlock code={javascriptExample} language="javascript" section="javascript" />
                        </div>

                        <div>
                            <h3 className="text-lg font-medium text-[rgb(var(--color-on-surface-rgb))] mb-3">
                                Python (Requests)
                            </h3>
                            <CodeBlock code={pythonExample} language="python" section="python" />
                        </div>

                        <div>
                            <h3 className="text-lg font-medium text-[rgb(var(--color-on-surface-rgb))] mb-3">
                                Node.js (Axios)
                            </h3>
                            <CodeBlock code={nodeExample} language="javascript" section="nodejs" />
                        </div>

                        <div>
                            <h3 className="text-lg font-medium text-[rgb(var(--color-on-surface-rgb))] mb-3">
                                PHP
                            </h3>
                            <CodeBlock code={phpExample} language="php" section="php" />
                        </div>
                    </div>
                </div>

                {/* Supported Sites */}
                <div className="bg-[rgb(var(--color-surface-alt-rgb))] rounded-xl p-6 border border-[rgb(var(--color-surface-border-rgb))]">
                    <h2 className="text-xl font-semibold text-[rgb(var(--color-on-surface-rgb))] mb-4">
                        Supported Sites
                    </h2>
                    <p className="text-[rgb(var(--color-on-surface-muted-rgb))] mb-4">
                        The API supports tag extraction from 18+ booru sites including:
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-[rgb(var(--color-on-surface-rgb))]">
                        <div>• Danbooru</div>
                        <div>• Safebooru</div>
                        <div>• Gelbooru</div>
                        <div>• Rule34</div>
                        <div>• e621</div>
                        <div>• Yande.re</div>
                        <div>• Konachan</div>
                        <div>• AIBooru</div>
                        <div>• Pixiv</div>
                        <div>• And more...</div>
                    </div>
                    <p className="text-[rgb(var(--color-on-surface-muted-rgb))] mt-4 text-sm">
                        Check the <a href="/booru-list" className="text-[rgb(var(--color-primary-rgb))] hover:underline">Booru List</a> page for the complete list of supported sites.
                    </p>
                </div>

                {/* Rate Limiting & Notes */}
                <div className="bg-[rgb(var(--color-surface-alt-rgb))] rounded-xl p-6 border border-[rgb(var(--color-surface-border-rgb))]">
                    <h2 className="text-xl font-semibold text-[rgb(var(--color-on-surface-rgb))] mb-4">
                        Rate Limiting & Notes
                    </h2>
                    <div className="space-y-3 text-[rgb(var(--color-on-surface-muted-rgb))]">
                        <p>
                            • API requests are rate-limited to prevent abuse and respect booru site resources
                        </p>
                        <p>
                            • Some sites may require authentication or have additional restrictions
                        </p>
                        <p>
                            • Response times vary depending on the target booru site (typically 1-5 seconds)
                        </p>
                        <p>
                            • Check the <a href="/status" className="text-[rgb(var(--color-primary-rgb))] hover:underline">API Status</a> page to verify endpoint availability before integration
                        </p>
                        <p>
                            • The API is provided as-is for educational and integration purposes
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
