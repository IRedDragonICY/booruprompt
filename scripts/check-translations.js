#!/usr/bin/env node

/**
 * Translation Completeness Checker
 * Checks all language files against English (en.ts) to find missing translations
 *
 * Usage: node scripts/check-translations.js
 */

const fs = require('fs');
const path = require('path');

const LOCALES_DIR = path.join(__dirname, '../src/lib/i18n/locales');
const EN_FILE = path.join(LOCALES_DIR, 'en.ts');

// Count string values and fallback operators in a file
function analyzeFile(content) {
  // Count string assignments (key: 'value' or key: "value")
  const stringMatches = content.match(/:\s*['"`][^'"`]*['"`]/g) || [];
  const stringCount = stringMatches.length;

  // Count fallback operators (...en.)
  const fallbackMatches = content.match(/\.\.\.en\./g) || [];
  const fallbackCount = fallbackMatches.length;

  return {
    strings: stringCount,
    fallbacks: fallbackCount
  };
}

// Main function
function checkTranslations() {
  console.log('🔍 Checking translation completeness...\n');

  // Read English file as reference
  if (!fs.existsSync(EN_FILE)) {
    console.error('❌ English reference file not found!');
    process.exit(1);
  }

  const enContent = fs.readFileSync(EN_FILE, 'utf-8');
  const enAnalysis = analyzeFile(enContent);

  console.log(`📚 English reference has ${enAnalysis.strings} translation strings\n`);

  // Get all language files
  const files = fs.readdirSync(LOCALES_DIR)
    .filter(f => f.endsWith('.ts') && f !== 'en.ts')
    .sort();

  const results = [];
  let totalFiles = files.length;
  let completeFiles = 0;
  let incompleteFiles = 0;

  for (const file of files) {
    const filePath = path.join(LOCALES_DIR, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const langCode = file.replace('.ts', '');

    const analysis = analyzeFile(content);

    const completion = Math.round((analysis.strings / enAnalysis.strings) * 100);
    const hasFallbacks = analysis.fallbacks > 5; // Allow small number of fallbacks

    let status;
    if (completion >= 95 && !hasFallbacks) {
      status = '✅ COMPLETE';
      completeFiles++;
    } else if (completion >= 70) {
      status = '⚠️  PARTIAL';
      incompleteFiles++;
    } else {
      status = '❌ INCOMPLETE';
      incompleteFiles++;
    }

    results.push({
      lang: langCode,
      status,
      completion,
      strings: analysis.strings,
      fallbacks: analysis.fallbacks
    });
  }

  // Sort by completion percentage
  results.sort((a, b) => b.completion - a.completion);

  // Print results
  console.log('┌─────────┬──────────────┬────────────┬─────────┬───────────┐');
  console.log('│ Lang    │ Status       │ Completion │ Strings │ Fallbacks │');
  console.log('├─────────┼──────────────┼────────────┼─────────┼───────────┤');

  for (const result of results) {
    const lang = result.lang.padEnd(7);
    const status = result.status.padEnd(12);
    const completion = `${result.completion}%`.padStart(10);
    const strings = result.strings.toString().padStart(7);
    const fallbacks = result.fallbacks.toString().padStart(9);

    console.log(`│ ${lang} │ ${status} │ ${completion} │ ${strings} │ ${fallbacks} │`);
  }

  console.log('└─────────┴──────────────┴────────────┴─────────┴───────────┘');

  // Summary
  console.log(`\n📊 Summary:`);
  console.log(`   Total languages: ${totalFiles}`);
  console.log(`   ✅ Complete: ${completeFiles} (${Math.round(completeFiles/totalFiles*100)}%)`);
  console.log(`   ⚠️  Incomplete: ${incompleteFiles} (${Math.round(incompleteFiles/totalFiles*100)}%)`);

  // List files needing attention
  const needsWork = results.filter(r => r.completion < 95 || r.fallbacks > 5);

  if (needsWork.length > 0) {
    console.log(`\n🔧 Languages needing attention (${needsWork.length}):`);
    for (const item of needsWork) {
      console.log(`   - ${item.lang}: ${item.completion}% complete, ${item.fallbacks} fallbacks`);
    }

    console.log(`\n💡 To fix: Complete all sections in each language file`);
    console.log(`   Required sections: common, settings, extractor, imageTool, historyItem, imagePreview, booruList, booruDetail`);

    process.exit(1); // Exit with error code for CI/CD
  } else {
    console.log(`\n🎉 All languages are fully translated!`);
    process.exit(0);
  }
}

// Run the check
checkTranslations();
