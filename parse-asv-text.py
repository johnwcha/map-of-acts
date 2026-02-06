#!/usr/bin/env python3
"""
Parse ASV text from user input and combine with Chinese text to create complete chapters.json
"""

import json
import re

def parse_asv_text(text):
    """Parse ASV text in format 'Acts chapter:verse    verse text'"""
    asv_by_chapter = {}

    lines = text.strip().split('\n')

    for line in lines:
        # Match pattern: Acts chapter:verse    verse text
        match = re.match(r'Acts\s+(\d+):(\d+)\s+(.+)', line)
        if match:
            chapter = int(match.group(1))
            verse_num = int(match.group(2))
            verse_text = match.group(3).strip()

            if chapter not in asv_by_chapter:
                asv_by_chapter[chapter] = {}

            asv_by_chapter[chapter][verse_num] = verse_text

    return asv_by_chapter

def main():
    # Read the ASV text from file
    print("Reading ASV text from asv-acts.txt...")
    with open('asv-acts.txt', 'r', encoding='utf-8') as f:
        asv_text = f.read()

    # Parse ASV text
    print("Parsing ASV verses...")
    asv_verses = parse_asv_text(asv_text)

    print(f"✓ Parsed {len(asv_verses)} chapters")
    for ch in sorted(asv_verses.keys()):
        print(f"  Chapter {ch}: {len(asv_verses[ch])} verses")

    # Load Chinese text
    print("\nLoading Chinese text from chinese-acts.json...")
    with open('chinese-acts.json', 'r', encoding='utf-8') as f:
        chinese_data = json.load(f)

    # Combine both
    print("\nCombining English and Chinese texts...")
    final_chapters = []

    for chapter_data in chinese_data['chapters']:
        chapter_num = chapter_data['chapter']
        verse_count = chapter_data['verseCount']

        print(f"Processing Chapter {chapter_num}...")

        # Get ASV verses for this chapter
        asv_chapter = asv_verses.get(chapter_num, {})

        # Build English verses array
        verses_en = []
        for verse_num in range(1, verse_count + 1):
            text = asv_chapter.get(verse_num, "")
            verses_en.append({
                "number": verse_num,
                "text": text
            })

        # Update chapter data
        chapter_data['verses']['en'] = verses_en

        # Report
        filled_en = sum(1 for v in verses_en if v['text'])
        filled_zh = len(chapter_data['verses']['zh'])
        print(f"  ✓ Chapter {chapter_num}: {filled_en}/{verse_count} EN verses, {filled_zh}/{verse_count} ZH verses")

        final_chapters.append(chapter_data)

    # Save final combined data
    output = {
        "chapters": final_chapters
    }

    with open('public/data/chapters.json', 'w', encoding='utf-8') as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    print("\n✓ Saved complete chapters.json")

    # Final statistics
    total_verses = sum(ch['verseCount'] for ch in final_chapters)
    total_en = sum(sum(1 for v in ch['verses']['en'] if v['text']) for ch in final_chapters)
    total_zh = sum(len(ch['verses']['zh']) for ch in final_chapters)

    print(f"\nFinal Statistics:")
    print(f"  Total chapters: {len(final_chapters)}")
    print(f"  Total verses: {total_verses}")
    print(f"  English (ASV) verses: {total_en}/{total_verses}")
    print(f"  Chinese (CUV) verses: {total_zh}/{total_verses}")

if __name__ == '__main__':
    main()
