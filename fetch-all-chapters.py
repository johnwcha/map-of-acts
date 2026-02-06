#!/usr/bin/env python3
"""
Fetch all 28 chapters of Acts with complete ASV and CUV text
for the continuous reading experience
"""

import requests
import json
import time

# Chapter metadata: (chapter_num, verse_count, title_en, title_zh)
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

def fetch_chapter_asv(chapter_num, verse_count):
    """Fetch ASV verses for a chapter using bible-api.com"""
    verses = []

    for verse_num in range(1, verse_count + 1):
        ref = f"Acts+{chapter_num}:{verse_num}"
        url = f"https://bible-api.com/{ref}?translation=asv"

        try:
            response = requests.get(url, timeout=10)
            if response.status_code == 200:
                data = response.json()

                if 'verses' in data and len(data['verses']) > 0:
                    verse_text = data['verses'][0]['text'].strip()
                    verses.append({
                        "number": verse_num,
                        "text": verse_text
                    })
                    print(f"    ASV {verse_num}: ✓")
                else:
                    print(f"    ASV {verse_num}: No data")
                    verses.append({"number": verse_num, "text": ""})
            else:
                print(f"    ASV {verse_num}: HTTP {response.status_code}")
                verses.append({"number": verse_num, "text": ""})

            time.sleep(0.3)  # Be nice to the API

        except Exception as e:
            print(f"    ASV {verse_num}: Error - {e}")
            verses.append({"number": verse_num, "text": ""})

    return verses

def fetch_chapter_cuv(chapter_num, verse_count):
    """Fetch CUV verses for a chapter using bible-api.com"""
    verses = []

    for verse_num in range(1, verse_count + 1):
        ref = f"Acts+{chapter_num}:{verse_num}"
        url = f"https://bible-api.com/{ref}?translation=cuvmp"  # Chinese Union Version Modern Punctuation

        try:
            response = requests.get(url, timeout=10)
            if response.status_code == 200:
                data = response.json()

                if 'verses' in data and len(data['verses']) > 0:
                    verse_text = data['verses'][0]['text'].strip()
                    verses.append({
                        "number": verse_num,
                        "text": verse_text
                    })
                    print(f"    CUV {verse_num}: ✓")
                else:
                    print(f"    CUV {verse_num}: No data")
                    verses.append({"number": verse_num, "text": ""})
            else:
                print(f"    CUV {verse_num}: HTTP {response.status_code}")
                verses.append({"number": verse_num, "text": ""})

            time.sleep(0.3)  # Be nice to the API

        except Exception as e:
            print(f"    CUV {verse_num}: Error - {e}")
            verses.append({"number": verse_num, "text": ""})

    return verses

def main():
    chapters = []

    print("Fetching all 28 chapters of Acts with ASV and CUV translations...\n")

    for chapter_num, verse_count, title_en, title_zh in CHAPTERS_INFO:
        print(f"Chapter {chapter_num}: {title_en} ({verse_count} verses)")
        print(f"  Fetching ASV...")
        verses_en = fetch_chapter_asv(chapter_num, verse_count)

        print(f"  Fetching CUV...")
        verses_zh = fetch_chapter_cuv(chapter_num, verse_count)

        chapter = {
            "chapter": chapter_num,
            "title": {
                "en": title_en,
                "zh": title_zh
            },
            "verseCount": verse_count,
            "verses": {
                "en": verses_en,
                "zh": verses_zh
            }
        }

        chapters.append(chapter)
        print(f"  ✓ Chapter {chapter_num} complete\n")

        # Longer pause between chapters
        time.sleep(2)

    # Create final structure
    chapters_data = {
        "chapters": chapters
    }

    # Save to file
    output_file = 'public/data/chapters.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(chapters_data, f, indent=2, ensure_ascii=False)

    print(f"\n✓ Successfully created {output_file}")
    print(f"  Total chapters: {len(chapters)}")

    # Calculate stats
    total_verses = sum(c['verseCount'] for c in chapters)
    print(f"  Total verses: {total_verses}")

    # Check for any missing verses
    missing = 0
    for chapter in chapters:
        for verse in chapter['verses']['en']:
            if not verse['text']:
                missing += 1
        for verse in chapter['verses']['zh']:
            if not verse['text']:
                missing += 1

    if missing > 0:
        print(f"  ⚠ Warning: {missing} verses have empty text")
    else:
        print(f"  ✓ All verses fetched successfully")

if __name__ == '__main__':
    main()
