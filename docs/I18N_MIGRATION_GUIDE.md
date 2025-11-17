# Migration Guide: TypeScript i18n → JSON-based next-i18next

## Why Migrate?

### Current System (TypeScript)
```typescript
// src/lib/i18n/locales/en.ts
export const en: TranslationSchema = {
  common: {
    appName: 'Booru Tag Extractor',
    // ...
  }
}
```

**Pros:**
- Type safety
- Autocomplete in IDE
- Compile-time checks

**Cons:**
- Requires TypeScript knowledge
- Not accessible for non-developers
- Harder for crowdfunding contributions
- More complex for automated tools

### New System (JSON with next-i18next)
```json
// public/locales/en/common.json
{
  "appName": "Booru Tag Extractor"
}
```

**Pros:**
- ✅ **Accessible** - Anyone can edit JSON
- ✅ **Standard** - Follows Next.js best practices
- ✅ **Tooling** - Better translation tools (POEditor, Crowdin, etc.)
- ✅ **Crowdfunding** - Easy for community contributions
- ✅ **Bundle Size** - Better code-splitting
- ✅ **SSR/SSG** - Optimized server-side translations

**Cons:**
- No type safety (can be solved with JSON Schema)
- No autocomplete (can be solved with i18next Ally VSCode extension)

## Architecture Comparison

### Old Structure
```
src/lib/i18n/
├── locales/
│   ├── en.ts          (TypeScript with types)
│   ├── id.ts
│   └── ...
└── index.ts           (i18next config)
```

### New Structure (next-i18next)
```
public/locales/         <-- JSON files for translations
├── en/
│   ├── common.json     (Common UI elements)
│   ├── settings.json   (Settings page)
│   ├── extractor.json  (Tag extractor)
│   ├── imageTool.json  (Image metadata tool)
│   ├── booruList.json  (Booru list)
│   └── booruDetail.json
├── id/
│   ├── common.json
│   └── ...
└── ...

next-i18next.config.js   <-- i18n configuration
next.config.js           <-- Next.js config with i18n
```

## Migration Steps

### Phase 1: Setup next-i18next

1. **Install dependencies**
```bash
npm install next-i18next
```

2. **Create next-i18next.config.js** (already created)

3. **Update next.config.js**
```javascript
const { i18n } = require('./next-i18next.config');

module.exports = {
  i18n,
  // ... rest of config
};
```

### Phase 2: Convert Translation Files

#### Automated Conversion Script

Create `scripts/convert-ts-to-json.js`:

```javascript
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const LOCALES_DIR = path.join(__dirname, '../src/lib/i18n/locales');
const OUTPUT_DIR = path.join(__dirname, '../public/locales');

// Namespaces to split into
const NAMESPACES = {
  common: ['common'],
  settings: ['settings'],
  extractor: ['extractor'],
  imageTool: ['imageTool'],
  historyItem: ['historyItem'],
  imagePreview: ['imagePreview'],
  booruList: ['booruList'],
  booruDetail: ['booruDetail']
};

function convertTsToJson(lang) {
  // Read TS file
  const tsFile = path.join(LOCALES_DIR, `${lang}.ts`);

  if (!fs.existsSync(tsFile)) {
    console.log(`Skipping ${lang} - file not found`);
    return;
  }

  // Import the module
  const translations = require(tsFile)[lang];

  // Create output directory
  const langDir = path.join(OUTPUT_DIR, lang);
  fs.mkdirSync(langDir, { recursive: true });

  // Write each namespace
  Object.keys(NAMESPACES).forEach(namespace => {
    const nsData = translations[namespace];

    if (nsData) {
      const outputFile = path.join(langDir, `${namespace}.json`);
      fs.writeFileSync(
        outputFile,
        JSON.stringify(nsData, null, 2),
        'utf8'
      );
      console.log(`✅ Created ${lang}/${namespace}.json`);
    }
  });
}

// Convert all languages
const langs = ['en', 'id', 'zh-CN', 'zh-TW', /* ... add all languages */];
langs.forEach(convertTsToJson);

console.log('\n✨ Conversion complete!');
```

Run: `node scripts/convert-ts-to-json.js`

### Phase 3: Update Code

#### 1. Update _app.tsx

**Before:**
```typescript
import { I18nextProvider } from 'react-i18next';
import i18n from '@/lib/i18n';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <I18nextProvider i18n={i18n}>
      <Component {...pageProps} />
    </I18nextProvider>
  );
}
```

**After:**
```typescript
import { appWithTranslation } from 'next-i18next';

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default appWithTranslation(MyApp);
```

#### 2. Update Pages with getStaticProps

**Before:**
```typescript
export default function Page() {
  return <div>Content</div>;
}
```

**After:**
```typescript
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function Page() {
  return <div>Content</div>;
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'common',
        'settings',
        'extractor'
      ])),
    },
  };
}
```

#### 3. Update Component Usage

**Before:**
```typescript
import { useTranslation } from 'react-i18next';

function Component() {
  const { t } = useTranslation();
  return <div>{t('common:appName')}</div>;
}
```

**After:**
```typescript
import { useTranslation } from 'next-i18next';

function Component() {
  const { t } = useTranslation('common');
  return <div>{t('appName')}</div>;
}
```

### Phase 4: Cleanup

1. Remove old i18n setup:
```bash
rm -rf src/lib/i18n
```

2. Update imports across codebase:
```bash
# Find all files using old import
grep -r "from '@/lib/i18n'" src/

# Replace with new import
# from 'react-i18next' → from 'next-i18next'
```

3. Remove TypeScript types (no longer needed):
```typescript
// DELETE: type TranslationSchema = { ... }
```

## Testing Migration

### 1. Test Language Switching
```typescript
import { useRouter } from 'next/router';

function LanguageSwitcher() {
  const router = useRouter();
  const { locale, locales, pathname, asPath, query } = router;

  const changeLanguage = (newLocale: string) => {
    router.push({ pathname, query }, asPath, { locale: newLocale });
  };

  return (
    <select value={locale} onChange={(e) => changeLanguage(e.target.value)}>
      {locales?.map(locale => (
        <option key={locale} value={locale}>{locale}</option>
      ))}
    </select>
  );
}
```

### 2. Test SSR/SSG
```bash
npm run build
npm start

# Check that translations load on:
# - Initial page load (SSR)
# - Client-side navigation
# - Different locales
```

### 3. Validate JSON Files
```bash
# Install validator
npm install --save-dev ajv ajv-cli

# Validate all JSON files
find public/locales -name "*.json" -exec ajv validate -s schema.json -d {} \;
```

## JSON Schema for Type Safety

Create `public/locales/schema.json`:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "appName": { "type": "string" },
    "language": { "type": "string" }
  },
  "required": ["appName", "language"]
}
```

## VSCode Extension

Install **i18next Ally** for:
- Inline translation previews
- Auto-completion
- Missing translation warnings
- Quick navigation to translation files

## Gradual Migration Strategy

Don't want to migrate everything at once? Use this approach:

### Hybrid System (Temporary)

1. Keep both systems running
2. Migrate page by page
3. Use feature flags

```typescript
// Feature flag
const USE_JSON_I18N = process.env.NEXT_PUBLIC_USE_JSON_I18N === 'true';

// Conditional import
const useTranslation = USE_JSON_I18N
  ? require('next-i18next').useTranslation
  : require('react-i18next').useTranslation;
```

### Migration Checklist

- [ ] Phase 1: Setup next-i18next config
- [ ] Phase 2: Convert EN + ID to JSON (test with 2 languages)
- [ ] Phase 3: Update 1-2 pages to use serverSideTranslations
- [ ] Phase 4: Test thoroughly
- [ ] Phase 5: Convert remaining languages
- [ ] Phase 6: Update all pages
- [ ] Phase 7: Update all components
- [ ] Phase 8: Remove old TypeScript i18n system
- [ ] Phase 9: Update documentation
- [ ] Phase 10: Deploy to production

## Common Issues

### Issue: "Text content does not match server-rendered HTML"

**Solution**: Ensure `serverSideTranslations` is in getStaticProps/getServerSideProps

### Issue: "useTranslation hook not working"

**Solution**: Import from 'next-i18next', NOT 'react-i18next'

### Issue: "Translations not loading"

**Solution**: Check namespace is included in serverSideTranslations

### Issue: "Missing translations in production"

**Solution**: Ensure public/locales is included in build

## Benefits After Migration

1. **Easier Contributions**
   - Non-developers can edit JSON
   - Use online translation platforms (Crowdin, POEditor)
   - Community can submit PRs with just JSON changes

2. **Better Performance**
   - Code-splitting per namespace
   - Server-side optimized
   - Smaller client bundles

3. **Professional Setup**
   - Industry standard (next-i18next)
   - Better documented
   - More tooling support

4. **Scalability**
   - Easy to add new languages
   - Easy to maintain
   - Better for large teams

## Resources

- [next-i18next Documentation](https://github.com/i18next/next-i18next)
- [Next.js i18n Routing](https://nextjs.org/docs/advanced-features/i18n-routing)
- [i18next Ally VSCode Extension](https://marketplace.visualstudio.com/items?itemName=Lokalise.i18n-ally)
- [Crowdin](https://crowdin.com/) - Translation management platform
- [POEditor](https://poeditor.com/) - Translation management

## Questions?

Create an issue on GitHub or check existing discussions about i18n migration.

---

**Migration Script**: See `scripts/convert-ts-to-json.js` for automated conversion
**Test Plan**: See `docs/I18N_TESTING.md` for comprehensive testing guide
