#!/usr/bin/env python3
"""
Parse complete ASV text and combine with Chinese to create chapters.json
"""

import json
import re

# ASV text embedded in script
ASV_TEXT = """Acts 1:1    The former treatise I made, O Theophilus, concerning all that Jesus began both to do and to teach,
Acts 1:2    until the day in which he was received up, after that he had given commandment through the Holy Spirit unto the apostles whom he had chosen:
Acts 1:3    to whom he also showed himself alive after his passion by many proofs, appearing unto them by the space of forty days, and speaking the things concerning the kingdom of God:
Acts 1:4    and, being assembled together with them, he charged them not to depart from Jerusalem, but to wait for the promise of the Father, which, said he, ye heard from me:
Acts 1:5    for John indeed baptized with water; but ye shall be baptized in the Holy Spirit not many days hence.
Acts 1:6    They therefore, when they were come together, asked him, saying, Lord, dost thou at this time restore the kingdom to Israel?
Acts 1:7    And he said unto them, It is not for you to know times or seasons, which the Father hath set within His own authority.
Acts 1:8    But ye shall receive power, when the Holy Spirit is come upon you: and ye shall be my witnesses both in Jerusalem, and in all Judæa and Samaria, and unto the uttermost part of the earth.
Acts 1:9    And when he had said these things, as they were looking, he was taken up; and a cloud received him out of their sight.
Acts 1:10    And while they were looking stedfastly into heaven as he went, behold two men stood by them in white apparel;
Acts 1:11    who also said, Ye men of Galilee, why stand ye looking into heaven? this Jesus, who was received up from you into heaven shall so come in like manner as ye beheld him going into heaven.
Acts 1:12    Then returned they unto Jerusalem from the mount called Olivet, which is nigh unto Jerusalem, a sabbath day's journey off.
Acts 1:13    And when they were come in, they went up into the upper chamber, where they were abiding; both Peter and John and James and Andrew, Philip and Thomas, Bartholomew and Matthew, James the son of Alphæus, and Simon the Zealot, and Judas the son of James.
Acts 1:14    These all with one accord continued stedfastly in prayer, with the women, and Mary the mother of Jesus, and with his brethren.
Acts 1:15    And in these days Peter stood up in the midst of the brethren, and said (and there was a multitude of persons gathered together, about a hundred and twenty),
Acts 1:16    Brethren, it was needful that the scripture should be fulfilled, which the Holy Spirit spake before by the mouth of David concerning Judas, who was guide to them that took Jesus.
Acts 1:17    For he was numbered among us, and received his portion in this ministry.
Acts 1:18    (Now this man obtained a field with the reward of his iniquity; and falling headlong, he burst asunder in the midst, and all his bowels gushed out.
Acts 1:19    And it became known to all the dwellers at Jerusalem; insomuch that in their language that field was called Akeldama, that is, The field of blood.)
Acts 1:20    For it is written in the book of Psalms, Let his habitation be made desolate, And let no man dwell therein:and, His office let another take.
Acts 1:21    Of the men therefore that have companied with us all the time that the Lord Jesus went in and went out among us,
Acts 1:22    beginning from the baptism of John, unto the day that he was received up from us, of these must one become a witness with us of his resurrection.
Acts 1:23    And they put forward two, Joseph called Barsabbas, who was surnamed Justus, and Matthias.
Acts 1:24    And they prayed, and said, Thou, Lord, who knowest the hearts of all men, show of these two the one whom thou hast chosen,
Acts 1:25    to take the place in this ministry and apostleship from which Judas fell away, that he might go to his own place.
Acts 1:26    And they gave lots for them; and the lot fell upon Matthias; and he was numbered with the eleven apostles."""

# The script will read the rest from stdin to avoid file size limits
# But for now, let me create a version that reads from a separate data file

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
    # Read the complete ASV text from a data file
    print("Reading ASV text...")
    try:
        with open('asv-acts.txt', 'r', encoding='utf-8') as f:
            asv_text = f.read()
    except FileNotFoundError:
        print("Error: asv-acts.txt not found")
        print("Please save the complete ASV text to 'asv-acts.txt' first")
        return

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
        print(f"  ✓ Chapter {chapter_num}: {filled_en}/{verse_count} EN, {filled_zh}/{verse_count} ZH")

        final_chapters.append(chapter_data)

    # Save final combined data
    output = {
        "chapters": final_chapters
    }

    with open('public/data/chapters.json', 'w', encoding='utf-8') as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    print("\n✓ Saved complete chapters.json to public/data/chapters.json")

    # Final statistics
    total_verses = sum(ch['verseCount'] for ch in final_chapters)
    total_en = sum(sum(1 for v in ch['verses']['en'] if v['text']) for ch in final_chapters)
    total_zh = sum(len(ch['verses']['zh']) for ch in final_chapters)

    print(f"\nFinal Statistics:")
    print(f"  Total chapters: {len(final_chapters)}")
    print(f"  Expected total verses: {total_verses}")
    print(f"  English (ASV) verses: {total_en}/{total_verses} ({100*total_en//total_verses}%)")
    print(f"  Chinese (CUV) verses: {total_zh}/{total_verses} ({100*total_zh//total_verses}%)")

if __name__ == '__main__':
    main()
