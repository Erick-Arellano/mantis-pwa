# Project Blueprint & Technical Specification: Vocali HSK1

This document serves as the architectural reference and development blueprint for **Vocali**, an interactive Progressive Web App (PWA) designed for teaching Mandarin Chinese (HSK1 level). This project is adapted from the **Mantis PWA** codebase.

---

## 1. Core Technical Stack
*   **Framework:** React 19 (`react` & `react-dom` version `^19.2.0`).
*   **Build Tool & Dev Server:** Vite 7 (`vite` version `^7.3.1`).
*   **PWA Engine:** `vite-plugin-pwa` with `autoUpdate` service worker configuration for full offline capability.
*   **Drag & Drop Engine:** `@dnd-kit/core` and `@dnd-kit/sortable` for physics-based, accessible interactions.
*   **3D / AR Library:** A-Frame (`1.5.0`) and MindAR (`1.2.5` Image Tracking) rendered via an embedded iframe.
*   **Design System:** Harmonies built on HSL/hex palettes with support for CSS variable theme tokens (dark/light themes).

---

## 2. Shared Learning Engines (`src/engines/`)
The application is modular and maps database/JSON configurations to dedicated UI engines via `src/App.jsx`.

| Engine Name | File Path | Description | HSK1 Application Example |
| :--- | :--- | :--- | :--- |
| **`AREngine`** | `/src/engines/AREngine.jsx` | Renders the camera scanner iframe with overlay labels. | Pointing camera at Hanzi card to reveal Pinyin + 3D model/labels. |
| **`DragDropEngine`** | `/src/engines/DragDropEngine.jsx` | Interactive canvas using `@dnd-kit`. | Matching Hanzi characters to Pinyin or English definitions. |
| **`GemQuizEngine`** | `/src/engines/grammar/GemQuizEngine.jsx` | Gamified quiz with timer, lives (hearts), and questions. | Sentence construction (word order: S-V-O in Chinese). |
| **`KaraokeEngine`** | `/src/engines/KaraokeEngine.jsx` | Sychronized audio dialogue engine with text highlighting. | Listening and repeating standard conversations (e.g., "你好", "你叫什么名字"). |
| **`AudioPracticeEngine`**| `/src/engines/AudioPracticeEngine.jsx` | Vocabulary pronunciation practicing. | HSK1 vocabulary list with native audio playback. |
| **`VisualExplorationEngine`**| `/src/engines/VisualExplorationEngine.jsx` | Image grids and spotlight panels. | Radical exploration and stroke-by-stroke visualizations. |
| **`SmartMatchEngine`** | `/src/engines/vocabulary/SmartMatchEngine.jsx` | High-fidelity vocabulary pairing engine. | Pairing Hanzi with correct English meanings under time pressure. |
| **`AudioPopEngine`** | `/src/engines/listening/AudioPopEngine.jsx` | Listening activity with target selections. | Listening to a word and popping/selecting the correct Hanzi bubble. |

---

## 3. Deep Dive: AR Engine Architecture (`AREngine`)
The AR scanner operates inside an isolated document (`public/ar-scanner.html`) wrapped by a React component (`src/engines/AREngine.jsx`).

### Iframe Integration
*   `AREngine.jsx` provides camera permissions and mounts the full-screen iframe.
*   It communicates with the iframe via standard `Window.postMessage()` API:
    *   **Sending actions:** React can stop the AR camera feed by sending `'stopAR'`.
    *   **Receiving actions:** The iframe fires `'arReady'` when the camera and targets are fully initialized.

### Tracking and Compiles
*   MindAR relies on compiled `.mind` target files.
*   The targets are specified in `<a-scene>` attributes:
    ```html
    mindar-image="imageTargetSrc: ./assets/ar/unit1_opener.mind; ..."
    ```
*   Multiple visual targets are mapped sequentially (0-indexed) using:
    ```html
    <a-entity mindar-image-target="targetIndex: 0">
    ```

### Interactive Overlays
*   The scanner overlays vector graphics and canvas textures using custom A-Frame components like `pill-label`.
*   The A-Frame component generates a dynamic 2D canvas texture with text, color, and border radius, then registers it as a transparent Material onto flat `<a-plane>` targets.

---

## 4. Adaptation Strategy for Mandarin Chinese (HSK1)

### I. Font Rendering and Styles
Mandarin Chinese requires clean typography for Hanzi (Chinese characters) and Pinyin (romanization with tone marks).
*   **System Fonts:** Integrate an elegant, highly readable Sans-Serif font for Chinese characters (e.g., *Noto Sans SC*, *Ma Shan Zheng* for brush strokes, or *Inter* paired with *PingFang SC* / *Microsoft YaHei*).
*   **CSS Adjustments:** Ensure line-heights are slightly increased (character blocks are taller than Latin baselines) and `letter-spacing` is set appropriately for reading character grids.

### II. Designing the JSON Structure (`src/data/unit1.json`)
The application structure is fully data-driven. To transition to Vocali HSK1, prepare the JSON to support characters, pinyin, and definitions.

#### Vocabulary Schema Example:
```json
{
  "id": "hsk1_vocab_hello",
  "hanzi": "你好",
  "pinyin": "nǐ hǎo",
  "english": "hello",
  "audio_url": "/assets/audio/hsk1/ni_hao.mp3"
}
```

#### Synchronized Karaoke Schema Example (for Pinyin + Hanzi reading):
```json
{
  "id": "hsk1_conv_1",
  "type": "Conversation",
  "title": "Basic Greetings",
  "engine": "KaraokeEngine",
  "content": {
    "instruction": "Listen and repeat. Notice the tone changes.",
    "audio_url": "/assets/audio/hsk1/greeting.mp3",
    "characters": [
      { "name": "Li Hua", "color": "#00A9B5" },
      { "name": "David", "color": "#882B41" }
    ],
    "dialogue": [
      {
        "character": "Li Hua",
        "text": "你好！",
        "pinyin": "nǐ hǎo!",
        "startTime": 0,
        "endTime": 1.5
      },
      {
        "character": "David",
        "text": "你好！你叫什么名字？",
        "pinyin": "nǐ hǎo! nǐ jiào shénme míngzi?",
        "startTime": 1.6,
        "endTime": 4.2
      }
    ]
  }
}
```

---

## 5. Immediate Next Steps for Testing AR in Vocali HSK1
1.  **Generate a MindAR target file:** 
    *   Use the online compiler [MindAR Target Compiler](https://hiukim.github.io/mind-ar-js-doc/tools/compile) to upload your target images (e.g., printed flashcards with Chinese characters or illustrations).
    *   Download the compiled `.mind` target file and place it in `/public/assets/ar/vocali_hsk1.mind`.
2.  **Configure `ar-scanner.html`:**
    *   Update the A-Scene to point to the new `.mind` path.
    *   Adjust `pill-label` components to overlay HSK1 relevant text (such as characters or pinyin labels corresponding to the target index).
3.  **Start Dev Server:**
    *   Run `npm run dev`.
    *   Ensure testing is done on HTTPS or `localhost` as modern mobile browsers require permissions which are only granted under secure contexts (Vite's `@vitejs/plugin-basic-ssl` handles this automatically in development).
