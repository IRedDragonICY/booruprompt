'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ClipboardIcon, CheckCircleIcon, ChevronDownIcon } from './icons/icons';

const API_ENDPOINT = '/api/fetch-booru';
const EXAMPLE_URL = 'https://safebooru.org/index.php?page=post&s=view&id=5592299';

type Language = 'curl' | 'javascript' | 'typescript' | 'python' | 'nodejs' | 'php' | 'react' | 'nextjs' | 'vue' | 'go' | 'ruby' | 'java' | 'csharp' | 'rust' | 'swift' | 'kotlin';

const LANGUAGES: { id: Language; label: string }[] = [
    { id: 'curl', label: 'cURL' },
    { id: 'javascript', label: 'JavaScript (Fetch)' },
    { id: 'typescript', label: 'TypeScript' },
    { id: 'nodejs', label: 'Node.js (Axios)' },
    { id: 'react', label: 'React' },
    { id: 'nextjs', label: 'Next.js' },
    { id: 'vue', label: 'Vue.js' },
    { id: 'python', label: 'Python (Requests)' },
    { id: 'php', label: 'PHP' },
    { id: 'go', label: 'Go' },
    { id: 'ruby', label: 'Ruby' },
    { id: 'java', label: 'Java' },
    { id: 'csharp', label: 'C# (.NET)' },
    { id: 'rust', label: 'Rust' },
    { id: 'swift', label: 'Swift' },
    { id: 'kotlin', label: 'Kotlin' },
];

export default function ApiTestView() {
    const [testUrl, setTestUrl] = useState(EXAMPLE_URL);
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [copiedSection, setCopiedSection] = useState<string | null>(null);
    const [selectedLanguage, setSelectedLanguage] = useState<Language>('curl');
    const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const searchInputRef = React.useRef<HTMLInputElement>(null);

    const baseUrl = typeof window !== 'undefined'
        ? window.location.origin
        : 'https://booruprompt.vercel.app';

    // Auto-focus search input when dropdown opens
    React.useEffect(() => {
        if (showLanguageDropdown && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [showLanguageDropdown]);

    // Filter languages based on search query
    const filteredLanguages = LANGUAGES.filter(lang =>
        lang.label.toLowerCase().includes(searchQuery.toLowerCase())
    );

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

    const getCodeExample = (lang: Language): string => {
        const examples: Record<Language, string> = {
            curl: `curl -X POST ${baseUrl}${API_ENDPOINT} \\
  -H "Content-Type: application/json" \\
  -d '{
    "targetUrl": "${EXAMPLE_URL}"
  }'`,
            javascript: `// Using fetch API
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
  .catch(error => console.error('Error:', error));`,
            typescript: `// TypeScript with async/await
interface BooruResponse {
  siteName: string;
  tags: {
    general?: string[];
    character?: string[];
    copyright?: string[];
    artist?: string[];
    meta?: string[];
  };
  imageUrl?: string;
  title?: string;
}

async function fetchBooruTags(url: string): Promise<BooruResponse> {
  const response = await fetch('${baseUrl}${API_ENDPOINT}', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ targetUrl: url })
  });

  if (!response.ok) {
    throw new Error(\`HTTP error! status: \${response.status}\`);
  }

  return await response.json();
}

// Usage
fetchBooruTags('${EXAMPLE_URL}')
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));`,
            python: `import requests
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
print(json.dumps(data, indent=2))`,
            nodejs: `const axios = require('axios');

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
  });`,
            react: `// React component with hooks
import { useState } from 'react';

function BooruTagFetcher() {
  const [tags, setTags] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTags = async (url) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('${baseUrl}${API_ENDPOINT}', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ targetUrl: url })
      });

      if (!response.ok) throw new Error('Failed to fetch');

      const data = await response.json();
      setTags(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={() => fetchTags('${EXAMPLE_URL}')}>
        Fetch Tags
      </button>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {tags && <pre>{JSON.stringify(tags, null, 2)}</pre>}
    </div>
  );
}`,
            nextjs: `// Next.js API Route (app/api/booru/route.ts)
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { targetUrl } = await request.json();

  const response = await fetch('${baseUrl}${API_ENDPOINT}', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ targetUrl })
  });

  const data = await response.json();
  return NextResponse.json(data);
}

// Server Component
async function BooruPage() {
  const response = await fetch('${baseUrl}${API_ENDPOINT}', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ targetUrl: '${EXAMPLE_URL}' }),
    cache: 'no-store' // Disable caching
  });

  const data = await response.json();

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}`,
            vue: `<!-- Vue 3 Composition API -->
<script setup>
import { ref } from 'vue';

const tags = ref(null);
const loading = ref(false);
const error = ref(null);

const fetchTags = async (url) => {
  loading.value = true;
  error.value = null;

  try {
    const response = await fetch('${baseUrl}${API_ENDPOINT}', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ targetUrl: url })
    });

    if (!response.ok) throw new Error('Failed to fetch');

    tags.value = await response.json();
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div>
    <button @click="fetchTags('${EXAMPLE_URL}')">
      Fetch Tags
    </button>
    <p v-if="loading">Loading...</p>
    <p v-if="error">Error: {{ error }}</p>
    <pre v-if="tags">{{ JSON.stringify(tags, null, 2) }}</pre>
  </div>
</template>`,
            go: `package main

import (
    "bytes"
    "encoding/json"
    "fmt"
    "io"
    "net/http"
)

type RequestBody struct {
    TargetURL string \`json:"targetUrl"\`
}

type BooruResponse struct {
    SiteName string                 \`json:"siteName"\`
    Tags     map[string][]string    \`json:"tags"\`
    ImageURL string                 \`json:"imageUrl"\`
    Title    string                 \`json:"title"\`
}

func main() {
    url := "${baseUrl}${API_ENDPOINT}"

    requestBody := RequestBody{
        TargetURL: "${EXAMPLE_URL}",
    }

    jsonData, err := json.Marshal(requestBody)
    if err != nil {
        panic(err)
    }

    resp, err := http.Post(url, "application/json", bytes.NewBuffer(jsonData))
    if err != nil {
        panic(err)
    }
    defer resp.Body.Close()

    body, err := io.ReadAll(resp.Body)
    if err != nil {
        panic(err)
    }

    var result BooruResponse
    json.Unmarshal(body, &result)

    fmt.Printf("%+v\\n", result)
}`,
            ruby: `require 'net/http'
require 'json'
require 'uri'

uri = URI('${baseUrl}${API_ENDPOINT}')
http = Net::HTTP.new(uri.host, uri.port)
http.use_ssl = true if uri.scheme == 'https'

request = Net::HTTP::Post.new(uri.path)
request['Content-Type'] = 'application/json'
request.body = {
  targetUrl: '${EXAMPLE_URL}'
}.to_json

response = http.request(request)
data = JSON.parse(response.body)

puts JSON.pretty_generate(data)`,
            java: `import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import org.json.JSONObject;

public class BooruClient {
    public static void main(String[] args) throws Exception {
        String url = "${baseUrl}${API_ENDPOINT}";

        JSONObject requestBody = new JSONObject();
        requestBody.put("targetUrl", "${EXAMPLE_URL}");

        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(url))
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(requestBody.toString()))
            .build();

        HttpResponse<String> response = client.send(
            request,
            HttpResponse.BodyHandlers.ofString()
        );

        System.out.println(response.body());
    }
}`,
            csharp: `using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

class Program
{
    static async Task Main(string[] args)
    {
        using var client = new HttpClient();

        var requestBody = new
        {
            targetUrl = "${EXAMPLE_URL}"
        };

        var json = JsonSerializer.Serialize(requestBody);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        var response = await client.PostAsync(
            "${baseUrl}${API_ENDPOINT}",
            content
        );

        var responseData = await response.Content.ReadAsStringAsync();
        Console.WriteLine(responseData);
    }
}`,
            rust: `use reqwest;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Serialize)]
struct RequestBody {
    #[serde(rename = "targetUrl")]
    target_url: String,
}

#[derive(Deserialize, Debug)]
struct BooruResponse {
    #[serde(rename = "siteName")]
    site_name: String,
    tags: HashMap<String, Vec<String>>,
    #[serde(rename = "imageUrl")]
    image_url: Option<String>,
    title: Option<String>,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let client = reqwest::Client::new();

    let request_body = RequestBody {
        target_url: "${EXAMPLE_URL}".to_string(),
    };

    let response = client
        .post("${baseUrl}${API_ENDPOINT}")
        .json(&request_body)
        .send()
        .await?
        .json::<BooruResponse>()
        .await?;

    println!("{:#?}", response);

    Ok(())
}`,
            swift: `import Foundation

struct RequestBody: Codable {
    let targetUrl: String
}

struct BooruResponse: Codable {
    let siteName: String
    let tags: [String: [String]]
    let imageUrl: String?
    let title: String?
}

func fetchBooruTags() async throws {
    let url = URL(string: "${baseUrl}${API_ENDPOINT}")!

    var request = URLRequest(url: url)
    request.httpMethod = "POST"
    request.setValue("application/json", forHTTPHeaderField: "Content-Type")

    let requestBody = RequestBody(targetUrl: "${EXAMPLE_URL}")
    request.httpBody = try JSONEncoder().encode(requestBody)

    let (data, _) = try await URLSession.shared.data(for: request)
    let response = try JSONDecoder().decode(BooruResponse.self, from: data)

    print(response)
}

Task {
    try await fetchBooruTags()
}`,
            kotlin: `import kotlinx.coroutines.*
import okhttp3.*
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONObject

suspend fun fetchBooruTags() {
    val client = OkHttpClient()
    val mediaType = "application/json".toMediaType()

    val json = JSONObject()
    json.put("targetUrl", "${EXAMPLE_URL}")

    val body = json.toString().toRequestBody(mediaType)

    val request = Request.Builder()
        .url("${baseUrl}${API_ENDPOINT}")
        .post(body)
        .build()

    withContext(Dispatchers.IO) {
        client.newCall(request).execute().use { response ->
            if (response.isSuccessful) {
                println(response.body?.string())
            } else {
                throw Exception("Request failed: \${response.code}")
            }
        }
    }
}

fun main() = runBlocking {
    fetchBooruTags()
}`,
            php: `<?php
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
?>`
        };
        return examples[lang];
    };

    const CodeBlock = () => {
        const code = getCodeExample(selectedLanguage);
        const lines = code.split('\n');

        return (
            <div className="relative">
                {/* Header with language selector and copy button */}
                <div className="flex items-center justify-between border-b border-[rgb(var(--color-surface-border-rgb))] bg-[rgb(var(--color-surface-alt-rgb))] px-4 py-2">
                    {/* Language selector */}
                    <div className="relative">
                        <button
                            onClick={() => {
                                setShowLanguageDropdown(!showLanguageDropdown);
                                setSearchQuery(''); // Reset search when opening dropdown
                            }}
                            className="flex items-center gap-2 text-sm text-[rgb(var(--color-on-surface-rgb))] hover:text-[rgb(var(--color-primary-rgb))] transition-colors"
                        >
                            <span className="font-medium">{LANGUAGES.find(l => l.id === selectedLanguage)?.label}</span>
                            <ChevronDownIcon className="h-4 w-4" />
                        </button>

                        {/* Dropdown */}
                        {showLanguageDropdown && (
                            <>
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => {
                                        setShowLanguageDropdown(false);
                                        setSearchQuery(''); // Reset search when closing
                                    }}
                                />
                                <div className="absolute top-full left-0 mt-1 z-20 bg-[rgb(var(--color-surface-alt-rgb))] border border-[rgb(var(--color-surface-border-rgb))] rounded-lg shadow-lg overflow-hidden min-w-[220px]">
                                    {/* Search input */}
                                    <div className="p-2 border-b border-[rgb(var(--color-surface-border-rgb))]">
                                        <input
                                            ref={searchInputRef}
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Search languages..."
                                            className="w-full px-3 py-1.5 text-sm bg-[rgb(var(--color-surface-rgb))] border border-[rgb(var(--color-surface-border-rgb))] rounded text-[rgb(var(--color-on-surface-rgb))] placeholder-[rgb(var(--color-on-surface-muted-rgb))] focus:outline-none focus:ring-1 focus:ring-[rgb(var(--color-primary-rgb))]"
                                            onClick={(e) => e.stopPropagation()} // Prevent closing dropdown when clicking input
                                        />
                                    </div>

                                    {/* Language list */}
                                    <div className="max-h-64 overflow-y-auto py-1">
                                        {filteredLanguages.length > 0 ? (
                                            filteredLanguages.map((lang) => (
                                                <button
                                                    key={lang.id}
                                                    onClick={() => {
                                                        setSelectedLanguage(lang.id);
                                                        setShowLanguageDropdown(false);
                                                        setSearchQuery('');
                                                    }}
                                                    className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                                                        selectedLanguage === lang.id
                                                            ? 'bg-[rgb(var(--color-primary-rgb))] text-white'
                                                            : 'text-[rgb(var(--color-on-surface-rgb))] hover:bg-[rgb(var(--color-surface-border-rgb))]'
                                                    }`}
                                                >
                                                    {lang.label}
                                                </button>
                                            ))
                                        ) : (
                                            <div className="px-4 py-3 text-sm text-[rgb(var(--color-on-surface-muted-rgb))] text-center">
                                                No languages found
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Copy button */}
                    <button
                        onClick={() => copyToClipboard(code, 'code-example')}
                        className="p-2 rounded hover:bg-[rgb(var(--color-surface-border-rgb))] transition-colors"
                        title="Copy to clipboard"
                    >
                        {copiedSection === 'code-example' ? (
                            <CheckCircleIcon className="h-4 w-4 text-green-500" />
                        ) : (
                            <ClipboardIcon className="h-4 w-4 text-[rgb(var(--color-on-surface-rgb))]" />
                        )}
                    </button>
                </div>

                {/* Code content with line numbers */}
                <div className="bg-[rgb(var(--color-surface-alt-2-rgb))] rounded-b-lg overflow-x-auto">
                    <pre className="p-4">
                        <code className="text-sm text-[rgb(var(--color-on-surface-rgb))] font-mono">
                            {lines.map((line, index) => (
                                <div key={index} className="table-row">
                                    <span className="table-cell pr-4 text-right select-none text-[rgb(var(--color-on-surface-muted-rgb))] w-8">
                                        {index + 1}
                                    </span>
                                    <span className="table-cell">{line || ' '}</span>
                                </div>
                            ))}
                        </code>
                    </pre>
                </div>
            </div>
        );
    };

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
                                <pre className="bg-[rgb(var(--color-surface-rgb))] rounded-lg p-4 overflow-x-auto text-sm max-h-96 border border-[rgb(var(--color-surface-border-rgb))]">
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
                            <code className="block bg-[rgb(var(--color-surface-alt-2-rgb))] px-4 py-2 rounded text-[rgb(var(--color-on-surface-rgb))] border border-[rgb(var(--color-surface-border-rgb))]">
                                POST {baseUrl}{API_ENDPOINT}
                            </code>
                        </div>

                        <div>
                            <p className="text-sm text-[rgb(var(--color-on-surface-muted-rgb))] mb-2">Request Body</p>
                            <pre className="bg-[rgb(var(--color-surface-alt-2-rgb))] px-4 py-3 rounded text-sm overflow-x-auto border border-[rgb(var(--color-surface-border-rgb))]">
                                <code className="text-[rgb(var(--color-on-surface-rgb))]">
{`{
  "targetUrl": "https://example.com/post/123"
}`}
                                </code>
                            </pre>
                        </div>

                        <div>
                            <p className="text-sm text-[rgb(var(--color-on-surface-muted-rgb))] mb-2">Response Format</p>
                            <pre className="bg-[rgb(var(--color-surface-alt-2-rgb))] px-4 py-3 rounded text-sm overflow-x-auto border border-[rgb(var(--color-surface-border-rgb))]">
                                <code className="text-[rgb(var(--color-on-surface-rgb))]">
{`{
  "siteName": "Safebooru",
  "tags": {
    "general": ["tag1", "tag2"],
    "character": ["character1"],
    "copyright": ["series1"],
    "artist": ["artist1"],
    "meta": ["meta1"]
  },
  "imageUrl": "https://...",
  "title": "Post #123"
}`}
                                </code>
                            </pre>
                        </div>
                    </div>
                </div>

                {/* Code Examples */}
                <div className="bg-[rgb(var(--color-surface-alt-rgb))] rounded-xl p-6 border border-[rgb(var(--color-surface-border-rgb))]">
                    <h2 className="text-xl font-semibold text-[rgb(var(--color-on-surface-rgb))] mb-4">
                        Code Examples
                    </h2>
                    <CodeBlock />
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
