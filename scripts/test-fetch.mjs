#!/usr/bin/env node

import { spawn } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';

const API_BASE = 'http://localhost:3000/api/fetch-booru';

async function testFetch(url, description = '') {
    console.log(`\n🧪 Testing: ${description || url}`);
    console.log(`📡 URL: ${url}`);
    
    try {
        const response = await fetch(API_BASE, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ targetUrl: url })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            console.log('✅ Success!');
            console.log(`📊 Site: ${data.siteName}`);
            console.log(`🏷️  Tags: ${Object.values(data.tags || {}).flat().length} total`);
            console.log(`🖼️  Image: ${data.imageUrl ? 'Found' : 'Not found'}`);
            console.log(`📝 Title: ${data.title || 'Not found'}`);
            
            if (data.debug) {
                console.log('🔍 Debug info:', data.debug);
            }
        } else {
            console.log('❌ Error:', data.error);
            if (data.debug) {
                console.log('🔍 Debug info:', data.debug);
            }
        }
        
    } catch (error) {
        console.log('💥 Network error:', error.message);
    }
}

async function main() {
    console.log('🚀 Starting fetch tests...\n');
    
    // Test URLs for different sites
    const testUrls = [
        {
            url: 'https://danbooru.donmai.us/posts/123456',
            description: 'Danbooru (should work)'
        },
        {
            url: 'https://safebooru.org/index.php?page=post&s=view&id=123456',
            description: 'Safebooru (should work)'
        },
        {
            url: 'https://gelbooru.com/index.php?page=post&s=view&id=123456',
            description: 'Gelbooru (should work)'
        },
        {
            url: 'https://e621.net/posts/123456',
            description: 'e621 (should work)'
        },
        {
            url: 'https://pixiv.net/artworks/123456',
            description: 'Pixiv (may require login)'
        }
    ];
    
    for (const test of testUrls) {
        await testFetch(test.url, test.description);
        // Wait a bit between requests to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    console.log('\n✨ Tests completed!');
}

// Check if server is running
async function checkServer() {
    try {
        const response = await fetch('http://localhost:3000');
        return response.ok;
    } catch {
        return false;
    }
}

async function startServer() {
    console.log('🔄 Starting development server...');
    
    return new Promise((resolve, reject) => {
        const server = spawn('npm', ['run', 'dev'], {
            stdio: 'pipe',
            shell: true
        });
        
        let output = '';
        
        server.stdout.on('data', (data) => {
            output += data.toString();
            if (output.includes('Ready') || output.includes('started server')) {
                console.log('✅ Server is ready!');
                setTimeout(resolve, 2000); // Give it a moment to fully start
            }
        });
        
        server.stderr.on('data', (data) => {
            console.error('Server error:', data.toString());
        });
        
        server.on('error', reject);
        
        // Timeout after 30 seconds
        setTimeout(() => {
            server.kill();
            reject(new Error('Server startup timeout'));
        }, 30000);
    });
}

async function run() {
    try {
        const serverRunning = await checkServer();
        
        if (!serverRunning) {
            console.log('⚠️  Development server not running. Starting it...');
            await startServer();
        } else {
            console.log('✅ Development server is already running');
        }
        
        await main();
        
    } catch (error) {
        console.error('💥 Error:', error.message);
        process.exit(1);
    }
}

run();