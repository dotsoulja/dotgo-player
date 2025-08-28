# dotgo-player

A modular, self-hosted HLS media player built in React + TypeScript. Designed to integrate seamlessly with dotgo-transcode and support adaptive streaming via master `.m3u8` playlists.

## Features

- Full HLS support via hls.js
- Dynamic resolution switching based on client network state
- Manual variant selection UI
- Modular architecture for easy extension
- Developer-friendly hooks and inline documentation

## Getting Started

1. Clone the repo
2. Install dependencies: `npm install`
3. Run the dev server: `npm run dev`
4. Point to a valid `.m3u8` master playlist

## Folder Structure

See `roadmap.md` for architectural rationale and module breakdown.
