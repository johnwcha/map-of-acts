#!/usr/bin/env python3
"""
Fetch and parse Chinese Union Version (Traditional) from iBibles
"""

import requests
import re
import json
from bs4 import BeautifulSoup

# Chapter metadata
CHAPTERS_INFO = [
    (1, 26, "The Promise of the Holy Spirit", "聖靈的應許"),
    (2, 47, "The Coming of the Holy Spirit", "聖靈降臨"),
    (3, 26, "Peter Heals a Lame Beggar", "彼得醫治瘸腿的人"),
    (4, 37, "Peter and John Before the Council", "彼得和約翰在公會前"),
    (5, 42, "Ananias and Sapphira", "亞拿尼亞和撒非喇"),
    (6, 15, "The Choosing of the Seven", "揀選七位執事"),
    (7, 60, "Stephen's Speech and Martyrdom", "司提反的講道與殉道"),
    (8, 40, "Saul Persecutes the Church", "掃羅逼迫教會"),
    (9, 43, "Saul's Conversion", "掃羅歸主"),
    (10, 48, "Peter and Cornelius", "彼得和哥尼流"),
    (11, 30, "Peter Reports to the Church", "彼得向教會報告"),
    (12, 25, "James Killed and Peter Imprisoned", "雅各被殺，彼得被囚"),
    (13, 52, "Paul's First Missionary Journey Begins", "保羅第一次宣教旅程"),
    (14, 28, "Paul and Barnabas at Iconium", "保羅和巴拿巴在以哥念"),
    (15, 41, "The Jerusalem Council", "耶路撒冷會議"),
    (16, 40, "Timothy Joins Paul", "提摩太加入保羅"),
    (17, 34, "Paul in Athens", "保羅在雅典"),
    (18, 28, "Paul in Corinth", "保羅在哥林多"),
    (19, 41, "Paul in Ephesus", "保羅在以弗所"),
    (20, 38, "Paul's Farewell to the Ephesian Elders", "保羅向以弗所長老告別"),
    (21, 40, "Paul's Arrest in Jerusalem", "保羅在耶路撒冷被捕"),
    (22, 30, "Paul's Defense Before the Crowd", "保羅在眾人前申辯"),
    (23, 35, "Paul Before the Council", "保羅在公會前"),
    (24, 27, "Paul Before Felix", "保羅在腓力斯前"),
    (25, 27, "Paul Before Festus", "保羅在非斯都前"),
    (26, 32, "Paul Before Agrippa", "保羅在亞基帕前"),
    (27, 44, "Paul's Voyage to Rome", "保羅前往羅馬"),
    (28, 31, "Paul Arrives at Rome", "保羅抵達羅馬"),
]

def fetch_chinese_acts():
    """Fetch Chinese text from iBibles"""
    url = "https://cut.ibibles.net/105Acts.htm"

    try:
        print(f"Fetching Chinese text from {url}...")
        response = requests.get(url, timeout=30)
        response.encoding = 'utf-8'

        print(f"✓ Fetched {len(response.text)} characters")
        return response.text

    except Exception as e:
        print(f"✗ Error fetching: {e}")
        return None

def parse_chapters(html_text):
    """Parse chapters and verses from HTML using BeautifulSoup"""
    soup = BeautifulSoup(html_text, 'html.parser')
    chapters = {}

    # Find all verse markers: <small>chapter:verse</small>
    small_tags = soup.find_all('small')

    for small in small_tags:
        verse_ref = small.get_text().strip()

        # Match pattern like "1:1", "2:47", etc.
        match = re.match(r'(\d+):(\d+)', verse_ref)
        if match:
            chapter_num = int(match.group(1))
            verse_num = int(match.group(2))

            # Get the text following this <small> tag until the next <br>
            verse_text = ""
            next_sibling = small.next_sibling

            while next_sibling:
                if hasattr(next_sibling, 'name') and next_sibling.name == 'br':
                    break
                if isinstance(next_sibling, str):
                    verse_text += next_sibling
                next_sibling = next_sibling.next_sibling

            # Clean up the text
            verse_text = verse_text.strip()
            # Remove special markers
            verse_text = re.sub(r'[．。、]$', '', verse_text)  # Remove trailing punctuation duplicates

            if verse_text and verse_text != "見上節":  # Skip "see above" markers
                if chapter_num not in chapters:
                    chapters[chapter_num] = []

                chapters[chapter_num].append({
                    "number": verse_num,
                    "text": verse_text
                })

    # Sort verses within each chapter
    for chapter_num in chapters:
        chapters[chapter_num].sort(key=lambda v: v['number'])

    return chapters

def main():
    # Fetch the page
    html_text = fetch_chinese_acts()
    if not html_text:
        print("Failed to fetch data")
        return

    print("\nParsing chapters and verses...")
    # Parse chapters
    parsed_chapters = parse_chapters(html_text)

    print(f"✓ Parsed {len(parsed_chapters)} chapters")

    # Build final structure
    chapters_data = []

    for chapter_num, verse_count, title_en, title_zh in CHAPTERS_INFO:
        verses_zh = parsed_chapters.get(chapter_num, [])

        print(f"  Chapter {chapter_num}: {len(verses_zh)} verses (expected {verse_count})")

        # Ensure we have the expected number of verses
        if len(verses_zh) < verse_count:
            print(f"    ⚠ Warning: Missing {verse_count - len(verses_zh)} verses")

        chapters_data.append({
            "chapter": chapter_num,
            "title": {
                "en": title_en,
                "zh": title_zh
            },
            "verseCount": verse_count,
            "verses": {
                "zh": verses_zh
            }
        })

    # Save to file
    output = {
        "chapters": chapters_data
    }

    with open('chinese-acts.json', 'w', encoding='utf-8') as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    print(f"\n✓ Saved Chinese text to chinese-acts.json")
    print(f"  Total chapters: {len(chapters_data)}")

    # Stats
    total_verses = sum(len(ch['verses']['zh']) for ch in chapters_data)
    print(f"  Total verses parsed: {total_verses}")

if __name__ == '__main__':
    main()
