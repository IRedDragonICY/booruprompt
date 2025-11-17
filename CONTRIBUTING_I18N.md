# Contributing Translations (i18n)

Thank you for helping make BooruPrompt accessible to more people worldwide! 🌍

## Current Status

We support **70 languages**. Translation completion status:

| Status | Languages | Count |
|--------|-----------|-------|
| ✅ **Complete** (100%) | Indonesian (id) | 1 |
| 🚧 **In Progress** (35-100%) | Most languages | 68 |
| ⚠️ **Need Help** | All languages | 69 |

Check current status: `npm run check:i18n:report`

## How to Contribute

### 1. Check What Needs Translation

Run the translation checker:

```bash
npm run check:i18n:report
```

This will show which languages need work and how complete they are.

### 2. Choose a Language

Pick a language you're fluent in from `src/lib/i18n/locales/`.

### 3. Translation Structure

Each language file has 8 main sections:

```typescript
export const [lang]: TranslationSchema = {
  common: {        // ← Common UI elements
    appName, language, nav, actions, etc.
  },
  settings: {      // ← Settings page
    title, sections, toggles, etc.
  },
  extractor: {     // ← Main tag extractor
    header, info, categories, etc.
  },
  imageTool: {     // ← Image metadata tool
    title, dropCta, prompts, etc.
  },
  historyItem: {   // ← History entries
    load, delete, previewAlt
  },
  imagePreview: {  // ← Image preview modal
    loading, error, controls
  },
  booruList: {     // ← Booru sites list
    pageTitle, filter, sort, etc.
  },
  booruDetail: {   // ← Booru detail page
    statistics, visit, etc.
  }
};
```

### 4. Reference Files

- **English (complete)**: `src/lib/i18n/locales/en.ts` - The source of truth
- **Indonesian (complete)**: `src/lib/i18n/locales/id.ts` - Example of 100% translation
- **Your language file**: `src/lib/i18n/locales/[code].ts`

### 5. Translation Guidelines

#### ✅ DO:
- Translate all strings to natural, idiomatic language
- Keep technical terms consistent (e.g., "URL", "PNG", "metadata")
- Preserve placeholders like `{{count}}`, `{{label}}`, `{{name}}`
- Test your translations in the app (`npm run dev`)

#### ❌ DON'T:
- Use machine translation directly (review and edit!)
- Change the structure or add/remove keys
- Translate HTML tags or code
- Use fallback operators like `...en.settings`

### 6. Example Translation

**English:**
```typescript
settings: {
  title: 'Settings',
  sections: {
    appearance: 'Appearance',
    colorTheme: 'Color Theme'
  }
}
```

**Indonesian:**
```typescript
settings: {
  title: 'Pengaturan',
  sections: {
    appearance: 'Tampilan',
    colorTheme: 'Tema Warna'
  }
}
```

### 7. Testing Your Translation

1. Run dev server:
   ```bash
   npm run dev
   ```

2. Change language in the app to your language

3. Check all pages:
   - Tags extractor
   - Image metadata tool
   - Booru list
   - Settings

4. Verify translation quality and completeness

### 8. Submit Your Contribution

1. Fork the repository
2. Create a branch: `git checkout -b i18n/[language-code]`
3. Make your changes
4. Run checker: `npm run check:i18n`
5. Commit: `git commit -m "feat(i18n): complete [language] translations"`
6. Push and create Pull Request

## Priority Languages

Help us complete these high-priority languages first:

### Tier 1 (Most Requested)
- 🇯🇵 Japanese (ja)
- 🇰🇷 Korean (ko)
- 🇫🇷 French (fr)
- 🇩🇪 German (de)
- 🇪🇸 Spanish (es)
- 🇷🇺 Russian (ru)
- 🇵🇹 Portuguese (pt)
- 🇮🇹 Italian (it)

### Tier 2 (High Priority)
- 🇨🇳 Chinese Simplified (zh-CN)
- 🇹🇼 Chinese Traditional (zh-TW)
- 🇹🇭 Thai (th)
- 🇻🇳 Vietnamese (vi)
- 🇸🇦 Arabic (ar)
- 🇹🇷 Turkish (tr)
- 🇵🇱 Polish (pl)
- 🇳🇱 Dutch (nl)

### Tier 3 (Nice to Have)
All other 54 languages!

## Translation Tools

### Automated Checker

```bash
# Check all translations
npm run check:i18n

# View report without errors
npm run check:i18n:report
```

### File Structure

```
src/lib/i18n/
├── locales/
│   ├── en.ts          ← English (reference)
│   ├── id.ts          ← Indonesian (complete example)
│   ├── [code].ts      ← Your language
│   └── ...
├── index.ts           ← Configuration
└── README.md
```

## Common Sections to Translate

### Priority 1: Core UI
- `common` (navigation, actions, status)
- `settings` (all settings options)

### Priority 2: Main Features
- `extractor` (tag extraction interface)
- `imageTool` (image metadata extraction)

### Priority 3: Additional Features
- `booruList` (booru sites listing)
- `booruDetail` (individual booru pages)
- `historyItem`, `imagePreview` (UI components)

## Questions or Help?

- 💬 Create an issue: [GitHub Issues](https://github.com/IRedDragonICY/booruprompt/issues)
- 📧 Contact: Check repository for contact info
- 🌐 Check existing translations for reference

## Recognition

All contributors will be recognized in:
- Project README
- About page in the app
- Release notes

Thank you for helping make BooruPrompt accessible to everyone! 🙏

---

**Quick Start:**
```bash
# 1. Check status
npm run check:i18n:report

# 2. Edit your language file
# src/lib/i18n/locales/[code].ts

# 3. Test
npm run dev

# 4. Verify
npm run check:i18n

# 5. Submit PR
```
