---
name: douyin-video-deconstruct
description: Download and deconstruct Douyin/TikTok-style short videos from a user-provided Douyin link. Use when the user gives a Douyin video URL, especially requests containing "拆解", "视频拆解", "分镜", "钩子", "模仿", "复刻", "分析这个抖音", or asks for the video's structure, hook, content, appeal, script flow, shot-by-shot imitation plan, or a markdown report generated in the current folder.
---

# Douyin Video Deconstruct

## Overview

Turn a user-provided Douyin video link into a local markdown deconstruction report. Prefer direct access first; when blocked, use browser/computer control to download the video through a parser site, analyze the temporary video, delete the temporary copy, and save the final report in the folder where the user asked.

## Workflow

1. Confirm the input contains a Douyin video link or share text with a link.
2. Identify the output folder as the current working folder unless the user explicitly provides another folder.
3. Create a temporary working directory under the system temp path. Store downloaded videos only there.
4. Try the lowest-friction retrieval path first:
   - Expand short links when needed.
   - Try common command-line downloaders already available in the environment, such as `yt-dlp`, if they support the link.
   - If a direct download works, keep the downloaded file in the temp directory.
5. If retrieval or analysis is blocked, control the computer/browser and visit `https://3g.gljlw.com/diy/`.
   - Paste the Douyin link into the parser.
   - Use the parser's download result to save the video into the temp directory.
   - If the site is unavailable or fails, open Google, search `抖音视频解析下载`, pick a usable parser site, and download the video to the temp directory.
6. Analyze the downloaded video:
   - Extract or inspect audio/transcript when possible.
   - Sample visual frames when needed to understand scene changes, captions, edits, and shot rhythm.
   - If automatic transcription is unavailable, infer from audible speech, subtitles, on-screen text, and visible actions, and label uncertain points clearly.
7. Write the report in markdown using the structure in `references/report-template.md`.
8. Save the report to the output folder. Use a clear filename such as `douyin-video-deconstruction-YYYYMMDD-HHMMSS.md`.
9. Delete the temporary downloaded video and any temporary extraction artifacts before finishing.

## Browser And Download Fallback

When using browser/computer control, keep the process practical and observable:

- Use the user's existing browser only when login/session/cookies are required; otherwise use the in-app browser or normal automation available in the environment.
- Do not leave the downloaded video in Downloads, Desktop, or the project folder. If the browser forces a download location, move it into the temp directory before analysis and delete the original copy.
- If parser sites show multiple buttons, prefer the button that clearly downloads the watermark-free or original MP4. Avoid ads and installer downloads.
- If no parser succeeds, still produce a partial report from accessible metadata, screenshots, captions, or page content, and state exactly what prevented full video analysis.

## Analysis Requirements

The report must answer these questions:

- What is the video's overall flow?
- What content does it communicate?
- What is the opening hook?
- Why can the hook attract user attention?
- If the user imitates it, what are the shot-by-shot scenes?
- What should be copied, adapted, or avoided?

When creating the imitation plan, avoid copying protected creative expression too literally. Preserve reusable structure, pacing, rhetorical moves, and production logic; rewrite wording and scene details for the user's own topic.

## Output Rules

- Generate one markdown report in the output folder.
- Include the source link, analysis date, and any limitations.
- Keep the tone useful and concrete, not academic.
- Use tables for shot-by-shot breakdowns when that improves readability.
- Delete temporary video files and temporary analysis artifacts after the report is written.
- Tell the user the final report path and whether temporary files were cleaned up.

## Reference

Use `references/report-template.md` when formatting the final report.
