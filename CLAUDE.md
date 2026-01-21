# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Cymatics is an Electron desktop application that visualizes system audio in real-time as waveforms on a canvas. The application captures system audio (loopback audio) and renders it as animated sound waves.

## Commands

- **Start the application**: `npm start`
  - Launches the Electron application with `--no-sandbox` flag for Linux compatibility
- **Install dependencies**: `npm install`

## Architecture

### Application Structure

- **Main Process** ([src/main.js](src/main.js))
  - Creates BrowserWindow with dimensions 1200x800
  - Configures `setDisplayMediaRequestHandler` to enable system audio capture via `desktopCapturer`
  - Uses `nodeIntegration: true` and `contextIsolation: false` for direct access to Electron APIs
  - Handles app lifecycle events (window-all-closed, activate)

- **Renderer Process** ([src/renderer.js](src/renderer.js))
  - Captures system audio using `navigator.mediaDevices.getDisplayMedia()` with audio loopback
  - Uses Web Audio API (`AudioContext`, `AnalyserNode`) to process audio data
  - Visualizes audio waveform on HTML5 Canvas with real-time animation
  - FFT size: 2048 samples
  - Sample rate: 44100 Hz

- **UI** ([src/index.html](src/index.html))
  - Minimal black background with full-screen canvas
  - Single button to initiate audio capture
  - Button removes itself after capture starts

### Key Technical Details

**Audio Capture in Electron 40+:**
- The `desktopCapturer` API is no longer directly available in renderer/preload scripts
- Must use `session.setDisplayMediaRequestHandler()` in the main process to intercept `getDisplayMedia()` calls
- The handler provides audio loopback via `{ video: source, audio: 'loopback' }`
- This approach enables system audio capture without IPC complexity

**Visualization:**
- Uses `getByteTimeDomainData()` for time-domain waveform data
- Canvas uses fade effect with `rgba(0, 0, 0, 0.2)` for trailing effect
- Waveform drawn with white stroke at 2px width
- Automatically resizes canvas on window resize

### Module System

- CommonJS (`"type": "commonjs"` in package.json)
- Main entry point: `src/main.js`

### Security Configuration

- `nodeIntegration: true` - Required for direct Electron API access
- `contextIsolation: false` - Simplifies API access for local desktop app
- Content Security Policy set in HTML for basic protection
- Note: This configuration is suitable for local desktop applications but should be reconsidered if loading remote content

## Platform-Specific Notes

**Linux:**
- Requires `--no-sandbox` flag due to Chrome sandbox permissions
- System audio capture depends on PulseAudio or PipeWire configuration
