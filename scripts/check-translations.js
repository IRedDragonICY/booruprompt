#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const LOCALES_DIR = path.join(__dirname, '../src/lib/i18n/locales');
const REFERENCE_LOCALE = 'en';

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function getAllKeys(obj, prefix = '') {
  let keys = [];

  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      keys = keys.concat(getAllKeys(value, fullKey));
    } else {
      keys.push(fullKey);
    }
  }

  return keys;
}

function getValueByPath(obj, path) {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

function checkTranslation() {
  console.log(`${colors.bright}${colors.cyan}🌍 Translation Completeness Check${colors.reset}\n`);

  // Keys that intentionally exist only in English (should NOT be translated)
  const ENGLISH_ONLY_KEYS = [
    'settings.toggles.blacklist.defaultKeywords' // Blacklist keywords always in English
  ];

  // Load reference locale
  const referencePath = path.join(LOCALES_DIR, `${REFERENCE_LOCALE}.json`);
  const referenceData = JSON.parse(fs.readFileSync(referencePath, 'utf-8'));
  const allReferenceKeys = getAllKeys(referenceData);
  const referenceKeys = allReferenceKeys.filter(k => !ENGLISH_ONLY_KEYS.includes(k));

  console.log(`${colors.blue}📋 Reference locale: ${REFERENCE_LOCALE}.json (${referenceKeys.length} keys required for translation)${colors.reset}`);
  console.log(`${colors.cyan}ℹ️  ${ENGLISH_ONLY_KEYS.length} keys are English-only and excluded from check${colors.reset}\n`);

  // Get all locale files
  const localeFiles = fs.readdirSync(LOCALES_DIR)
    .filter(file => file.endsWith('.json') && file !== `${REFERENCE_LOCALE}.json`)
    .sort();

  let allComplete = true;
  const results = [];

  for (const file of localeFiles) {
    const locale = file.replace('.json', '');
    const filePath = path.join(LOCALES_DIR, file);
    const localeData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const localeKeys = getAllKeys(localeData);

    const missingKeys = [];
    const untranslatedKeys = [];

    // Check for missing keys
    for (const key of referenceKeys) {
      const value = getValueByPath(localeData, key);
      const refValue = getValueByPath(referenceData, key);

      if (value === undefined) {
        missingKeys.push(key);
      } else if (value === refValue && !key.includes('author') && !key.includes('appName')) {
        // Check if value is same as English (likely untranslated)
        // Skip author and appName as they might legitimately be the same
        if (typeof value === 'string' && value.trim() !== '' && !/^[a-zA-Z\s]+$/.test(refValue)) {
          // Skip if reference contains non-Latin characters (like emojis, symbols)
          continue;
        }
        untranslatedKeys.push({ key, value });
      }
    }

    const extraKeys = localeKeys.filter(k => !referenceKeys.includes(k));
    const completeness = ((referenceKeys.length - missingKeys.length) / referenceKeys.length * 100).toFixed(2);

    results.push({
      locale,
      file,
      total: referenceKeys.length,
      missing: missingKeys.length,
      untranslated: untranslatedKeys.length,
      extra: extraKeys.length,
      completeness: parseFloat(completeness),
      missingKeys,
      untranslatedKeys,
      extraKeys
    });

    // Only fail if keys are missing, not if they're potentially untranslated
    if (missingKeys.length > 0) {
      allComplete = false;
    }
  }

  // Sort by completeness
  results.sort((a, b) => b.completeness - a.completeness);

  // Print summary
  console.log(`${colors.bright}Summary:${colors.reset}\n`);

  for (const result of results) {
    const statusIcon = result.completeness === 100 ? '✅' : result.completeness >= 95 ? '⚠️' : '❌';
    const color = result.completeness === 100 ? colors.green : result.completeness >= 95 ? colors.yellow : colors.red;

    console.log(`${statusIcon} ${color}${result.file.padEnd(15)}${colors.reset} ${color}${result.completeness}%${colors.reset} complete (${result.total - result.missing}/${result.total} keys)`);

    if (result.missing > 0) {
      console.log(`   ${colors.red}Missing: ${result.missing} keys${colors.reset}`);
    }
    if (result.untranslated > 0) {
      console.log(`   ${colors.yellow}Possibly untranslated: ${result.untranslated} keys${colors.reset}`);
    }
    if (result.extra > 0) {
      console.log(`   ${colors.cyan}Extra keys: ${result.extra}${colors.reset}`);
    }
  }

  // Print detailed errors
  console.log(`\n${colors.bright}Detailed Issues:${colors.reset}\n`);

  let hasMissingKeys = false;

  for (const result of results) {
    // Only show details if there are missing or extra keys (untranslated is just a warning)
    if (result.missing.length > 0 || result.extra.length > 0) {
      hasMissingKeys = true;
      console.log(`${colors.bright}${colors.blue}${result.file}:${colors.reset}`);

      if (result.missing.length > 0) {
        console.log(`\n  ${colors.red}Missing keys (${result.missing.length}):${colors.reset}`);
        result.missing.slice(0, 10).forEach(key => {
          console.log(`    - ${key}`);
        });
        if (result.missing.length > 10) {
          console.log(`    ... and ${result.missing.length - 10} more`);
        }
      }

      if (result.untranslated.length > 0) {
        console.log(`\n  ${colors.yellow}Possibly untranslated (same as English) (${result.untranslated.length}):${colors.reset}`);
        result.untranslatedKeys.slice(0, 5).forEach(({ key, value }) => {
          console.log(`    - ${key}: "${value}"`);
        });
        if (result.untranslated.length > 5) {
          console.log(`    ... and ${result.untranslated.length - 5} more`);
        }
      }

      if (result.extra.length > 0) {
        console.log(`\n  ${colors.cyan}Extra keys not in reference (${result.extra.length}):${colors.reset}`);
        result.extra.slice(0, 5).forEach(key => {
          console.log(`    - ${key}`);
        });
        if (result.extra.length > 5) {
          console.log(`    ... and ${result.extra.length - 5} more`);
        }
      }

      console.log('');
    }
  }

  if (!hasMissingKeys) {
    console.log(`${colors.green}✨ All translations are complete! No missing keys found.${colors.reset}\n`);
  }

  // Print statistics
  const avgCompleteness = (results.reduce((sum, r) => sum + r.completeness, 0) / results.length).toFixed(2);
  const fullyComplete = results.filter(r => r.completeness === 100).length;

  console.log(`${colors.bright}Statistics:${colors.reset}`);
  console.log(`  Total locales: ${results.length}`);
  console.log(`  Fully complete: ${colors.green}${fullyComplete}${colors.reset} (${(fullyComplete / results.length * 100).toFixed(1)}%)`);
  console.log(`  Average completeness: ${avgCompleteness}%`);
  console.log('');

  // Exit with error code if not all complete
  if (!allComplete) {
    console.log(`${colors.red}❌ Some translations are incomplete. Please review the issues above.${colors.reset}\n`);
    process.exit(1);
  } else {
    console.log(`${colors.green}✅ All translations are 100% complete!${colors.reset}\n`);
    process.exit(0);
  }
}

checkTranslation();
