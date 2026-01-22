# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Cymatics is an Electron desktop application that visualizes system audio in real-time with multiple psychedelic animation styles. The application captures system audio (loopback audio) and renders it as animated visualizations on a canvas.

## Commands

- **Start**: `npm start` - Launches the app with `--no-sandbox` for Linux
- **Install**: `npm install`
- **Build**: `npm run build` (current platform), `npm run build:linux`, `npm run build:win`, `npm run build:mac`, `npm run build:all`

## Architecture

### Application Structure

- **Main Process** ([src/main.js](src/main.js))
  - Creates BrowserWindow with dimensions 1200x800
  - Configures `setDisplayMediaRequestHandler` to enable system audio capture via `desktopCapturer`
  - Creates native application menu with animation selection (menu "Animações")
  - Uses IPC to send `change-animation` events to renderer
  - Handles app lifecycle events (window-all-closed, activate)

- **Renderer Process** ([src/renderer.js](src/renderer.js))
  - Captures system audio using `navigator.mediaDevices.getDisplayMedia()` with audio loopback
  - Uses Web Audio API (`AudioContext`, `AnalyserNode`) to process audio data
  - Implements 6 visualization types with real-time animation
  - FFT size: 2048 samples, Sample rate: 44100 Hz
  - Listens for `change-animation` IPC events from main process

- **Preload Script** ([src/preload.js](src/preload.js))
  - Placeholder for future secure API exposure

- **UI** ([src/index.html](src/index.html))
  - Minimal black background with full-screen canvas
  - Single button to initiate audio capture (removes itself after capture starts)
  - Portuguese (Brazilian) localization

### Animation Types

6 visualization modes selectable via native menu (Animações):

1. **Psicodélica** (`psychedelic`) - Default. Multiple rotating layers with radial waveforms, HSL color cycling
2. **Onda Linear** (`waveform`) - Classic horizontal waveform with glow effect
3. **Circular Simples** (`circular`) - Single circular waveform with amplitude-based radius
4. **Barras de Frequência** (`bars`) - Frequency bars from bottom with rainbow coloring
5. **Partículas** (`particles`) - 100 bouncing particles that react to audio amplitude
6. **Partículas Interativas** (`interactive`) - 150 particles with mouse interaction, connection lines, audio-reactive repulsion/attraction

### Key Technical Details

**Audio Capture in Electron 40+:**
- The `desktopCapturer` API is no longer directly available in renderer/preload scripts
- Must use `session.setDisplayMediaRequestHandler()` in the main process to intercept `getDisplayMedia()` calls
- The handler provides audio loopback via `{ video: source, audio: 'loopback' }`
- This approach enables system audio capture without IPC complexity

**Visualization:**
- Uses `getByteTimeDomainData()` for time-domain waveform data
- Canvas uses fade effect with varying alpha (0.05 to 0.2) for trailing effects
- HSL color cycling with hue increment per frame
- Shadow/glow effects using `ctx.shadowBlur` and `ctx.shadowColor`
- Automatically resizes canvas on window resize

**IPC Communication:**
- Main process sends `change-animation` events via `mainWindow.webContents.send()`
- Renderer listens with `ipcRenderer.on('change-animation', ...)`

### Build Configuration

Build assets in [build/](build/): `icon.svg`, `cymatics.desktop`, icon generation scripts, AppImage helpers.

Output formats: Linux (AppImage, deb), Windows (NSIS, portable), macOS (DMG, ZIP)

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
- Requires `--no-sandbox` flag (set programmatically in main.js and in AppImage config)
- System audio capture depends on PulseAudio or PipeWire configuration
