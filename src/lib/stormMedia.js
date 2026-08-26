// The storm archive. Every item carries a 6-digit serial — punch one into the
// console on /work and the matching item tears out of the vortex.
//
// Drop photos into `src/assets/images` and they join the storm automatically.
// Placeholder captions/details below are meant to be replaced per project.
// To fly a video instead of a still, point `url` at an .mp4/.webm and set
// `kind: 'VIDEO'` (Storm3D switches to a VideoTexture).

const modules = import.meta.glob('../assets/images/*.{jpg,jpeg,png,webp}', {
  eager: true,
  as: 'url',
})

const byNumber = (s) => {
  const m = s.match(/(\d+)/)
  return m ? parseInt(m[1], 10) : 0
}

const urls = Object.entries(modules)
  .sort((a, b) => byNumber(a[0]) - byNumber(b[0]))
  .map(([, url]) => url)

// Placeholder archive copy — swap in real project stories later.
const ENTRIES = [
  ['SIGNAL IN THE STATIC', 'First frame recovered from the vortex. A project that started as noise and ended as a deployed signal.'],
  ['NEGATIVE ORBIT', 'Shot on expired film, scanned at 3am. The grain was the point.'],
  ['KERNEL PANIC SUNSET', 'The build failed forty times. The forty-first compiled, and the sky looked like this.'],
  ['REEL 04 // MISSING', 'A video fragment from a jam weekend. The rest of the tape is still somewhere in the storm.'],
  ['HALF-LIFE OF A DEMO', 'Every demo decays. This one was caught mid-decay, still glowing.'],
  ['SIDE B', 'An album cover study for tracks that only exist as project files. Loud anyway.'],
  ['TERMINAL VELOCITY', 'Long exposure of a deploy pipeline. Green means it passed.'],
  ['THE KESSEL CUT', 'Twelve parsecs, give or take. A poster study in negative space.'],
  ['STATIC BLOOM', 'CRT phosphor blooming under a macro lens. Technology pretending to be weather.'],
  ['REEL 10 // DRIFT', 'Footage of nothing in particular, spinning at exactly the right speed.'],
  ['GHOST IN THE GRID', 'Scanlines over a city that never sleeps and rarely compiles.'],
  ['ARCHIVE FEVER', 'A still from the backlog — the projects that wait their turn in the funnel.'],
  ['PRESSING 003', 'Vinyl that was never pressed. The sleeve design survived; the audio is a TODO.'],
  ['DEAD PIXEL VALLEY', 'A landscape rendered by a broken GPU. Kept because the bugs were beautiful.'],
  ['SIGNAL DECAY', 'The last frame of a livestream nobody watched. History anyway.'],
  ['EYE OF THE STORM', 'The only calm pixel in the whole archive. You are standing in it.'],
  ['LOW ORBIT', 'A moonrise over the ridge line, exposed a second too long. The smear stayed.'],
  ['DUNE STATIC', 'Paper-bright sand under a dead sun. The negative version hangs in the studio.'],
  ['NIGHT SHIFT', 'Tower blocks past midnight. Every lit window is somebody still debugging.'],
  ['BEAM SPLITTER', 'Stage lights cut into columns. Techno does to light what it does to time.'],
  ['CRATER LINE', 'Two ridges and a pale moon. Cartography of a place that does not exist.'],
  ['SODIUM GLOW', 'The city grid from above, one diode at a time.'],
  ['WHITEOUT', 'Overexposed on purpose. Some frames are just weather.'],
  ['CONTROL ROOM', 'Every LED a heartbeat, every heartbeat a cron job.'],
]

const KIND_CYCLE = ['PHOTO', 'PHOTO', 'PHOTO', 'VIDEO', 'PHOTO', 'ALBUM']

const entries = urls.map((url, i) => ({
  serial: `66${String(1000 + i * 137)}`,
  kind: KIND_CYCLE[i % KIND_CYCLE.length],
  url,
  caption: ENTRIES[i % ENTRIES.length][0],
  detail: ENTRIES[i % ENTRIES.length][1],
}))

// Manual entries — non-image media lives here. The studio theme, pressed to
// a phantom LP with a techno sleeve.
import themeAudio from '../assets/audio/theme.wav'
import themeCover from '../assets/covers/theme-cover.jpg'

entries.push({
  serial: '664210',
  kind: 'ALBUM',
  url: themeCover,
  audio: themeAudio,
  caption: 'THEME // SIDE A',
  detail:
    'The studio theme, cut to a phantom pressing. Techno from the eye of the storm — extract the sleeve and the side plays itself.',
})

export const stormMedia = entries
