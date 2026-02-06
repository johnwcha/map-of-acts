#!/usr/bin/env python3
"""
Combine Chinese text with English ASV text from acts-data.json to create complete chapters.json
"""

import json

def load_existing_asv():
    """Load ASV verses from existing acts-data.json"""
    with open('public/data/acts-data.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    # Extract ASV verses by chapter
    asv_by_chapter = {}

    for event in data['events']:
        chapter = event['scripture']['chapter']
        verse_start = event['scripture']['verseStart']
        verse_end = event['scripture'].get('verseEnd', verse_start)

        if chapter not in asv_by_chapter:
            asv_by_chapter[chapter] = {}

        # Get verses from the event
        for verse in event['passage']['en']['verses']:
            verse_num = verse['number']
            if verse_start <= verse_num <= verse_end:
                asv_by_chapter[chapter][verse_num] = verse['text']

    return asv_by_chapter

def fetch_missing_asv_from_web(chapter_num, verses_needed):
    """Fetch missing ASV verses from Bible Gateway"""
    import requests
    from bs4 import BeautifulSoup
    import time

    verses = {}
    url = f"https://www.biblegateway.com/passage/?search=Acts+{chapter_num}&version=ASV&interface=print"

    try:
        print(f"    Fetching ASV chapter {chapter_num} from Bible Gateway...")
        response = requests.get(url, timeout=15)
        response.raise_for_status()

        soup = BeautifulSoup(response.text, 'html.parser')
        passage = soup.find('div', class_='passage-text')

        if passage:
            # Remove headers and footnotes
            for elem in passage.find_all(['h3', 'h4']):
                elem.decompose()
            for elem in passage.find_all('sup', class_='footnote'):
                elem.decompose()

            # Find verse spans
            verse_spans = passage.find_all('span', class_='text')

            for span in verse_spans:
                # Try to find verse number
                prev_sup = span.find_previous_sibling('sup', class_='versenum')
                if prev_sup:
                    import re
                    verse_num_text = prev_sup.get_text(strip=True)
                    match = re.search(r'\d+', verse_num_text)
                    if match:
                        verse_num = int(match.group())
                        if verse_num in verses_needed:
                            text = span.get_text(strip=True)
                            verses[verse_num] = text

        time.sleep(1)  # Be nice to the server
        return verses

    except Exception as e:
        print(f"    Error fetching: {e}")
        return {}

def main():
    # Load Chinese text
    print("Loading Chinese text...")
    with open('chinese-acts.json', 'r', encoding='utf-8') as f:
        chinese_data = json.load(f)

    # Load existing ASV text from acts-data.json
    print("Loading existing ASV text from acts-data.json...")
    existing_asv = load_existing_asv()

    print(f"✓ Found ASV verses for {len(existing_asv)} chapters in acts-data.json\n")

    # Combine
    final_chapters = []

    for chapter_data in chinese_data['chapters']:
        chapter_num = chapter_data['chapter']
        verse_count = chapter_data['verseCount']

        print(f"Processing Chapter {chapter_num} ({verse_count} verses)...")

        # Get verses from existing ASV
        asv_verses_dict = existing_asv.get(chapter_num, {})

        # Check what verses we're missing
        needed_verses = set(range(1, verse_count + 1))
        have_verses = set(asv_verses_dict.keys())
        missing_verses = needed_verses - have_verses

        if missing_verses:
            print(f"  Missing {len(missing_verses)} ASV verses, fetching from web...")
            fetched = fetch_missing_asv_from_web(chapter_num, missing_verses)
            asv_verses_dict.update(fetched)
            print(f"  Fetched {len(fetched)} additional verses")

        # Build verse array
        verses_en = []
        for verse_num in range(1, verse_count + 1):
            text = asv_verses_dict.get(verse_num, "")
            verses_en.append({
                "number": verse_num,
                "text": text
            })

        # Update chapter data
        chapter_data['verses']['en'] = verses_en

        # Report
        filled = sum(1 for v in verses_en if v['text'])
        print(f"  ✓ Chapter {chapter_num}: {filled}/{verse_count} ASV verses\n")

        final_chapters.append(chapter_data)

    # Save final combined data
    output = {
        "chapters": final_chapters
    }

    with open('public/data/chapters.json', 'w', encoding='utf-8') as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    print("✓ Saved complete chapters.json")

    # Stats
    total_verses = sum(ch['verseCount'] for ch in final_chapters)
    total_en = sum(sum(1 for v in ch['verses']['en'] if v['text']) for ch in final_chapters)
    total_zh = sum(len(ch['verses']['zh']) for ch in final_chapters)

    print(f"\nFinal Statistics:")
    print(f"  Total chapters: {len(final_chapters)}")
    print(f"  Total verses: {total_verses}")
    print(f"  English (ASV) verses: {total_en}")
    print(f"  Chinese (CUV) verses: {total_zh}")

if __name__ == '__main__':
    main()
