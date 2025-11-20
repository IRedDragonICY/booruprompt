'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ClipboardIcon, CheckCircleIcon, ChevronDownIcon, CodeBracketIcon, ServerIcon, BoltIcon, GlobeAltIcon, ShieldCheckIcon, PlayIcon } from './icons/icons';

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
    const { t } = useTranslation();
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
            setError(t('apiTest.urlError'));
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
            <div className="relative group rounded-[28px] overflow-hidden bg-[rgb(var(--color-surface-alt-rgb))] border border-[rgb(var(--color-surface-border-rgb))] transition-all">
                {/* Header with language selector and copy button */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[rgb(var(--color-surface-border-rgb))]">
                    {/* Language selector */}
                    <div className="relative">
                        <button
                            onClick={() => {
                                setShowLanguageDropdown(!showLanguageDropdown);
                                setSearchQuery(''); // Reset search when opening dropdown
                            }}
                            className="flex items-center gap-2 text-sm font-medium text-[rgb(var(--color-on-surface-rgb))] hover:bg-[rgb(var(--color-surface-border-rgb))]/50 transition-colors px-4 py-2 rounded-full"
                        >
                            <CodeBracketIcon className="h-4 w-4 text-[rgb(var(--color-primary-rgb))]" />
                            <span>{LANGUAGES.find(l => l.id === selectedLanguage)?.label}</span>
                            <ChevronDownIcon className={`h-3 w-3 transition-transform duration-200 ${showLanguageDropdown ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Dropdown */}
                        <AnimatePresence>
                            {showLanguageDropdown && (
                                <>
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={() => {
                                            setShowLanguageDropdown(false);
                                            setSearchQuery(''); // Reset search when closing
                                        }}
                                    />
                                    <motion.div 
                                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                        className="absolute top-full left-0 mt-2 z-20 bg-[rgb(var(--color-surface-alt-rgb))] border border-[rgb(var(--color-surface-border-rgb))] rounded-[20px] shadow-lg overflow-hidden min-w-[280px] origin-top-left"
                                    >
                                        {/* Search input */}
                                        <div className="p-3 border-b border-[rgb(var(--color-surface-border-rgb))]">
                                            <input
                                                ref={searchInputRef}
                                                type="text"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                placeholder={t('apiTest.searchLanguages')}
                                                className="w-full px-4 py-2.5 text-sm bg-[rgb(var(--color-surface-alt-2-rgb))] border-none rounded-full text-[rgb(var(--color-on-surface-rgb))] placeholder-[rgb(var(--color-on-surface-muted-rgb))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary-rgb))]/50 transition-all"
                                                onClick={(e) => e.stopPropagation()} // Prevent closing dropdown when clicking input
                                            />
                                        </div>

                                        {/* Language list */}
                                        <div className="max-h-64 overflow-y-auto py-2 scrollbar-thin">
                                            {filteredLanguages.length > 0 ? (
                                                filteredLanguages.map((lang) => (
                                                    <button
                                                        key={lang.id}
                                                        onClick={() => {
                                                            setSelectedLanguage(lang.id);
                                                            setShowLanguageDropdown(false);
                                                            setSearchQuery('');
                                                        }}
                                                        className={`w-full px-6 py-3 text-left text-sm transition-colors flex items-center justify-between ${
                                                            selectedLanguage === lang.id
                                                                ? 'bg-[rgb(var(--color-primary-rgb))]/10 text-[rgb(var(--color-primary-rgb))] font-medium'
                                                                : 'text-[rgb(var(--color-on-surface-rgb))] hover:bg-[rgb(var(--color-surface-border-rgb))]/50'
                                                        }`}
                                                    >
                                                        {lang.label}
                                                        {selectedLanguage === lang.id && <CheckCircleIcon className="h-4 w-4" />}
                                                    </button>
                                                ))
                                            ) : (
                                                <div className="px-6 py-4 text-sm text-[rgb(var(--color-on-surface-muted-rgb))] text-center">
                                                    {t('apiTest.noLanguagesFound')}
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Copy button */}
                    <button
                        onClick={() => copyToClipboard(code, 'code-example')}
                        className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium text-[rgb(var(--color-on-surface-muted-rgb))] hover:text-[rgb(var(--color-primary-rgb))] hover:bg-[rgb(var(--color-primary-rgb))]/10 transition-all"
                        title={t('apiTest.copyCode')}
                    >
                        {copiedSection === 'code-example' ? (
                            <>
                                <CheckCircleIcon className="h-4 w-4 text-green-500" />
                                <span className="text-green-500">Copied</span>
                            </>
                        ) : (
                            <>
                                <ClipboardIcon className="h-4 w-4" />
                                <span>Copy</span>
                            </>
                        )}
                    </button>
                </div>

                {/* Code content with line numbers */}
                <div className="bg-[rgb(var(--color-surface-alt-2-rgb))] overflow-x-auto">
                    <pre className="p-6 font-mono text-sm leading-relaxed">
                        <code className="text-[rgb(var(--color-on-surface-rgb))]">
                            {lines.map((line, index) => (
                                <div key={index} className="table-row hover:bg-[rgb(var(--color-surface-border-rgb))]/30 transition-colors">
                                    <span className="table-cell pr-6 text-right select-none text-[rgb(var(--color-on-surface-faint-rgb))] w-8 text-xs pt-0.5">
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
        <div className="h-full w-full overflow-y-auto bg-[rgb(var(--color-surface-rgb))] p-4 md:p-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="max-w-6xl mx-auto space-y-6 pb-12"
            >
                {/* Header Section - Flat Material You Style */}
                <div className="relative overflow-hidden rounded-[32px] bg-[rgb(var(--color-primary-rgb))]/10 p-8 md:p-12">
                    <div className="relative z-10 max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[rgb(var(--color-surface-rgb))] text-[rgb(var(--color-primary-rgb))] text-xs font-bold mb-6 shadow-sm">
                            <BoltIcon className="h-3.5 w-3.5" />
                            <span>Developer Tools</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-[rgb(var(--color-on-surface-rgb))] mb-4 tracking-tight">
                            {t('apiTest.title')}
                        </h1>
                        <p className="text-lg text-[rgb(var(--color-on-surface-muted-rgb))] leading-relaxed max-w-2xl">
                            {t('apiTest.subtitle')}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: Interactive Tester */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Interactive Tester Card */}
                        <div className="bg-[rgb(var(--color-surface-alt-rgb))] rounded-[28px] p-6 md:p-8 border border-[rgb(var(--color-surface-border-rgb))]">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="h-12 w-12 rounded-full bg-[rgb(var(--color-primary-rgb))]/10 flex items-center justify-center text-[rgb(var(--color-primary-rgb))]">
                                    <PlayIcon className="h-6 w-6" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-[rgb(var(--color-on-surface-rgb))]">
                                        {t('apiTest.testerTitle')}
                                    </h2>
                                    <p className="text-sm text-[rgb(var(--color-on-surface-muted-rgb))]">Send a live request to the API</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-[rgb(var(--color-on-surface-rgb))] mb-3 ml-1">
                                        {t('apiTest.urlLabel')}
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                            <GlobeAltIcon className="h-5 w-5 text-[rgb(var(--color-on-surface-muted-rgb))] group-focus-within:text-[rgb(var(--color-primary-rgb))] transition-colors" />
                                        </div>
                                        <input
                                            type="text"
                                            value={testUrl}
                                            onChange={(e) => setTestUrl(e.target.value)}
                                            placeholder={t('apiTest.urlPlaceholder')}
                                            className="w-full pl-12 pr-6 py-4 bg-[rgb(var(--color-surface-alt-2-rgb))] border-none rounded-[20px] text-[rgb(var(--color-on-surface-rgb))] placeholder-[rgb(var(--color-on-surface-muted-rgb))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary-rgb))] transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        onClick={handleTest}
                                        disabled={loading}
                                        className="relative overflow-hidden px-8 py-4 bg-[rgb(var(--color-primary-rgb))] text-[rgb(var(--color-primary-content-rgb))] rounded-full font-semibold hover:opacity-90 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none transition-all duration-200 group shadow-sm"
                                    >
                                        <span className="relative z-10 flex items-center gap-2">
                                            {loading ? (
                                                <>
                                                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    {t('apiTest.testing')}
                                                </>
                                            ) : (
                                                <>
                                                    {t('apiTest.testButton')}
                                                    <BoltIcon className="h-5 w-5" />
                                                </>
                                            )}
                                        </span>
                                    </button>
                                </div>

                                <AnimatePresence mode="wait">
                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="bg-red-500/10 rounded-[20px] p-5 flex items-start gap-4"
                                        >
                                            <div className="p-2 bg-red-500/10 rounded-full text-red-500 shrink-0">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-red-500 font-bold text-sm mb-1">{t('apiTest.error')}</p>
                                                <p className="text-red-500/80 text-sm">{error}</p>
                                            </div>
                                        </motion.div>
                                    )}

                                    {response && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="space-y-4 pt-6 border-t border-[rgb(var(--color-surface-border-rgb))]"
                                        >
                                            <div className="flex items-center justify-between px-1">
                                                <h3 className="text-sm font-bold text-[rgb(var(--color-on-surface-rgb))] uppercase tracking-wider flex items-center gap-2">
                                                    <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
                                                    {t('apiTest.responseTitle')}
                                                </h3>
                                                <button
                                                    onClick={() => copyToClipboard(JSON.stringify(response, null, 2), 'response')}
                                                    className="text-xs font-bold text-[rgb(var(--color-primary-rgb))] hover:bg-[rgb(var(--color-primary-rgb))]/10 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5"
                                                >
                                                    {copiedSection === 'response' ? (
                                                        <>
                                                            <CheckCircleIcon className="h-4 w-4" />
                                                            Copied
                                                        </>
                                                    ) : (
                                                        <>
                                                            <ClipboardIcon className="h-4 w-4" />
                                                            Copy JSON
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                            <div className="bg-[rgb(var(--color-surface-alt-2-rgb))] rounded-[24px] overflow-hidden">
                                                <pre className="p-6 overflow-x-auto text-sm max-h-[500px] scrollbar-thin">
                                                    <code className="text-[rgb(var(--color-on-surface-rgb))] font-mono">
                                                        {JSON.stringify(response, null, 2)}
                                                    </code>
                                                </pre>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Code Examples */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold text-[rgb(var(--color-on-surface-rgb))] flex items-center gap-3 px-2">
                                <div className="p-2 rounded-full bg-[rgb(var(--color-secondary-rgb))]/10 text-[rgb(var(--color-secondary-rgb))]">
                                    <CodeBracketIcon className="h-5 w-5" />
                                </div>
                                {t('apiTest.codeExamples')}
                            </h2>
                            <CodeBlock />
                        </div>
                    </div>

                    {/* Right Column: Documentation & Info */}
                    <div className="space-y-6">
                        {/* Endpoint Info */}
                        <div className="bg-[rgb(var(--color-surface-alt-rgb))] rounded-[28px] p-6 border border-[rgb(var(--color-surface-border-rgb))]">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="h-10 w-10 rounded-full bg-[rgb(var(--color-accent-rgb))]/10 flex items-center justify-center text-[rgb(var(--color-accent-rgb))]">
                                    <ServerIcon className="h-5 w-5" />
                                </div>
                                <h2 className="text-lg font-bold text-[rgb(var(--color-on-surface-rgb))]">
                                    {t('apiTest.endpointTitle')}
                                </h2>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <p className="text-xs font-bold text-[rgb(var(--color-on-surface-muted-rgb))] uppercase tracking-wider mb-3 ml-1">{t('apiTest.endpointUrl')}</p>
                                    <div className="flex items-center gap-3 bg-[rgb(var(--color-surface-alt-2-rgb))] p-3 rounded-[16px]">
                                        <span className="px-2.5 py-1 rounded-md bg-[rgb(var(--color-primary-rgb))] text-[rgb(var(--color-primary-content-rgb))] text-xs font-bold">POST</span>
                                        <code className="text-sm text-[rgb(var(--color-on-surface-rgb))] font-mono truncate flex-1">
                                            {API_ENDPOINT}
                                        </code>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs font-bold text-[rgb(var(--color-on-surface-muted-rgb))] uppercase tracking-wider mb-3 ml-1">{t('apiTest.requestBody')}</p>
                                    <div className="bg-[rgb(var(--color-surface-alt-2-rgb))] p-4 rounded-[20px]">
                                        <pre className="text-xs text-[rgb(var(--color-on-surface-rgb))] font-mono overflow-x-auto">
{`{
  "targetUrl": "string"
}`}
                                        </pre>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs font-bold text-[rgb(var(--color-on-surface-muted-rgb))] uppercase tracking-wider mb-3 ml-1">{t('apiTest.responseFormat')}</p>
                                    <div className="bg-[rgb(var(--color-surface-alt-2-rgb))] p-4 rounded-[20px]">
                                        <pre className="text-xs text-[rgb(var(--color-on-surface-rgb))] font-mono overflow-x-auto">
{`{
  "siteName": "string",
  "tags": {
    "general": ["string"],
    "character": ["string"],
    ...
  },
  "imageUrl": "string",
  "title": "string"
}`}
                                        </pre>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Supported Sites */}
                        <div className="bg-[rgb(var(--color-surface-alt-rgb))] rounded-[28px] p-6 border border-[rgb(var(--color-surface-border-rgb))]">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                                    <ShieldCheckIcon className="h-5 w-5" />
                                </div>
                                <h2 className="text-lg font-bold text-[rgb(var(--color-on-surface-rgb))]">
                                    {t('apiTest.supportedSites')}
                                </h2>
                            </div>
                            
                            <div className="flex flex-wrap gap-2 mb-6">
                                {['Danbooru', 'Safebooru', 'Gelbooru', 'Rule34', 'e621', 'Yande.re', 'Konachan', 'Pixiv'].map((site) => (
                                    <span key={site} className="px-3 py-1.5 rounded-full bg-[rgb(var(--color-surface-alt-2-rgb))] text-xs font-medium text-[rgb(var(--color-on-surface-rgb))]">
                                        {site}
                                    </span>
                                ))}
                                <span className="px-3 py-1.5 rounded-full bg-[rgb(var(--color-surface-alt-2-rgb))] text-xs font-medium text-[rgb(var(--color-on-surface-muted-rgb))]">
                                    + more
                                </span>
                            </div>
                            
                            <a href="/booru-list" className="text-sm font-bold text-[rgb(var(--color-primary-rgb))] hover:underline flex items-center gap-1 ml-1">
                                View full list
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                    <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                                </svg>
                            </a>
                        </div>

                        {/* Rate Limiting */}
                        <div className="bg-[rgb(var(--color-surface-alt-rgb))] rounded-[28px] p-6 border border-[rgb(var(--color-surface-border-rgb))]">
                            <h2 className="text-lg font-bold text-[rgb(var(--color-on-surface-rgb))] mb-4 px-1">
                                {t('apiTest.rateLimiting')}
                            </h2>
                            <ul className="space-y-4">
                                {[
                                    t('apiTest.note1'),
                                    t('apiTest.note2'),
                                    t('apiTest.note3')
                                ].map((note, i) => (
                                    <li key={i} className="flex gap-3 text-sm text-[rgb(var(--color-on-surface-muted-rgb))]">
                                        <div className="h-1.5 w-1.5 rounded-full bg-[rgb(var(--color-on-surface-border-rgb))] mt-2 flex-shrink-0" />
                                        <span className="leading-relaxed">{note}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
