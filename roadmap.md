# 🎯 dotgo-player Minimal Playback Roadmap

This version assumes:
- Security, token gating, and auth are already handled upstream
- TMDB thumbnails and modal previews are already implemented
- The goal is to build a modular, resilient player that consumes dotgo-transcode output and supports adaptive playback

---

## Phase 1: Core Setup

### What  
Scaffold the player repo with minimal clutter and modular structure.

### How  
- `src/core/`: Playback logic, manifest parsing, segment fetching  
- `src/hooks/`: Custom hooks for playback state  
- `src/ui/`: Optional UI shell if needed  
- `src/utils/`: Logging, retry logic, helpers  
- Add `ROADMAP.txt` and inline docs

---

## Phase 2: Manifest Parsing

### What  
Load and parse `.m3u8` master and media playlists.

### How  
- `ManifestLoader.ts`:  
  - Fetch master playlist  
  - Extract variant streams (resolution, bandwidth)  
  - Parse media playlist for selected variant  
  - Expose metadata for resolution switching

---

## Phase 3: Segment Fetching

### What  
Download media segments and expose them to MSE.

### How  
- `SegmentFetcher.ts`:  
  - Fetch segments sequentially  
  - Support retry logic and logging  
  - Handle init segments and discontinuities  
  - Expose segment queue to buffer manager

---

## Phase 4: MSE Buffering

### What  
Append segments to SourceBuffer and manage playback.

### How  
- `BufferManager.ts`:  
  - Create MediaSource and SourceBuffer  
  - Append segments dynamically  
  - Handle buffer cleanup and seek logic  
  - Monitor buffer health and playback state

---

## Phase 5: Playback Controller

### What  
Control play, pause, seek, and resolution switching.

### How  
- `PlaybackController.ts`:  
  - Manage playback state  
  - Trigger resolution switch via manifest reload  
  - Expose hooks for UI integration  
  - Log playback events and errors

---

## Phase 6: Adaptive Logic

### What  
Monitor bandwidth and switch resolution dynamically.

### How  
- `BandwidthMonitor.ts`:  
  - Measure segment download speed  
  - Trigger resolution switch if bandwidth drops  
  - Log switching events and trends  
  - Optional: expose override toggle

---

## Phase 7: Integration and Testing

### What  
Integrate with your existing frontend and validate playback.

### How  
- Drop player into your site as a modular component  
- Test with dotgo-transcode output across resolutions  
- Validate:  
  - Manifest parsing  
  - Segment buffering  
  - Resolution switching  
  - Playback stability

---

## Philosophy

This player is lean, modular, and focused. It’s not a full frontend—it’s a playback engine designed to honor the resilience and adaptability of dotgo-transcode. Every module is built for clarity, control, and future-proofing.
