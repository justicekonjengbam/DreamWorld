# React + Vite

## Synced lyrics

Lyric highlighting uses the audio element's `currentTime`; if a line drifts, correct its timestamp data instead of adding a playback offset or stretching the full timeline. Spotify's artist guidance says to sync each line to its first sung word, using its lyrics partner Musixmatch: [Managing lyrics on Spotify](https://support.spotify.com/cg-en/artists/article/managing-your-lyrics-on-spotify/).

### Aligning the song library

- Track data is in `src/data/songs.js`; audio files are in `public/Songs/`. Each line's `time` is seconds from the start of its audio file.
- Use the bundled lyric text as the alignment transcript. Generate line start times from the audio with WhisperX forced alignment, using the first sung word of each line. Do not tune timestamps by multiplying or stretching the whole timeline.
- On this Windows setup, Python is available through `uv` (Python 3.11). WhisperX's default audio loader needs ffmpeg; decode the MP3 with PyAV (`av.open`, `AudioResampler(format='s16', layout='mono', rate=16000)`) and pass a normalized 16 kHz mono float array to `whisperx.align`.
- Align the full lyric transcript as one ordered segment against the full audio, with WhisperX's English model on CPU. Match each line's first word to an aligned word in transcript order and within five seconds of its current cue. Keep the current cue when the aligner cannot make that confident match; do not let a repeated word elsewhere in the song pull a line far from its existing position. Check chronology and listen through uncertain lines before changing them.
- Remove section headings such as `Verse` or `Chorus` from the lyric rows. Keep sung vocalizations such as `Ahhh` and `Oh-oh-oh`; these may need their existing cue if forced alignment cannot match them.
- Update each song's displayed `duration` from its media file length (`minutes:seconds`).
- For `Waiting For` (`song-5`, `public/Songs/Waiting for.mp3`), useful landmarks are vocals starting around 0:18, an instrumental passage around 1:34, and vocals resuming around 1:42. Forced alignment placed those lines at 17.941 and 102.228 seconds. The file is about 4:24.
- When the user asks to preview a sync change before pushing, leave it local until they approve. If they explicitly authorize a push, commit and push the reviewed changes.

The app follows the aligned line start times from the playback clock. Forced alignment can still need a listening pass on sung vocals, especially around long held words, repeated lyrics, vocalizations, or instrumental breaks.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is currently not compatible with SWC. See [this issue](https://github.com/vitejs/vite-plugin-react/issues/428) for tracking the progress.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
