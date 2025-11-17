#!/usr/bin/env python3
import json
import os
from pathlib import Path

locales_dir = Path('public/locales')
namespaces = ['common', 'settings', 'extractor', 'imageTool', 'historyItem', 'imagePreview', 'booruList', 'booruDetail']
test_languages = ['en', 'zh-TW', 'id', 'jv', 'es', 'fr', 'de', 'ja', 'ko']

def count_keys(obj, prefix=''):
    """Recursively count all keys in a nested dictionary"""
    count = 0
    if isinstance(obj, dict):
        for key, value in obj.items():
            new_prefix = f"{prefix}.{key}" if prefix else key
            if isinstance(value, dict):
                count += count_keys(value, new_prefix)
            else:
                count += 1
    return count

print("Translation Completeness Check\n")
print("=" * 80)

for ns in namespaces:
    print(f"\n{ns.upper()}")
    print("-" * 40)

    # Load English as reference
    en_file = locales_dir / 'en' / f'{ns}.json'
    with open(en_file, 'r', encoding='utf-8') as f:
        en_data = json.load(f)
    en_keys = count_keys(en_data)

    print(f"English (reference): {en_keys} keys")

    for lang in test_languages[1:]:  # Skip 'en'
        lang_file = locales_dir / lang / f'{ns}.json'
        try:
            with open(lang_file, 'r', encoding='utf-8') as f:
                lang_data = json.load(f)
            lang_keys = count_keys(lang_data)

            if lang_keys < en_keys:
                print(f"⚠️  {lang:6s}: {lang_keys:3d} keys (missing {en_keys - lang_keys})")
            else:
                print(f"✅ {lang:6s}: {lang_keys:3d} keys")
        except Exception as e:
            print(f"❌ {lang:6s}: Error - {e}")

print("\n" + "=" * 80)
