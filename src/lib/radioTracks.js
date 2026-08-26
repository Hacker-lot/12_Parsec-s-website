// 12_PARSEC RADIO — station playlist.
//
// Two kinds of broadcast:
//   LOCAL  — `audio` points at a file we host. Plays in full, loops a few
//            times, then the rotation moves on. Anything we made ourselves
//            (or have rights to) lives here.
//   EMBED  — `netease` carries a music.163.com song ID and `duration` in
//            seconds. Playback happens through NetEase's official outchain
//            player (生成外链播放器), so the license stays with them.
//            Outchain iframes expose no ended-event, so embeds advance on a
//            duration timer. VIP/login does not carry into embeds, and
//            copyright-greyed songs refuse to play there — every ID below
//            was verified against the outchain endpoint when added.
//
// To add a song: find its ID in the NetEase URL (music.163.com/song?id=…),
// add an entry with duration, and give it a sleeve in src/assets/covers.

import themeAudio from '../assets/audio/theme.wav'
import motorikAudio from '../assets/audio/radio-motorik.wav'
import lullabyAudio from '../assets/audio/radio-lullaby.wav'
import rodeoAudio from '../assets/audio/pixel-rodeo.wav'
import nightDriveAudio from '../assets/audio/night-drive.wav'

import themeCover from '../assets/covers/theme-cover.jpg'
import speedCover from '../assets/covers/radio-speed.jpg'
import starsCover from '../assets/covers/radio-stars.jpg'
import pixelsCover from '../assets/covers/radio-pixels.jpg'
import gridCover from '../assets/covers/radio-grid.jpg'

const embCovers = import.meta.glob('../assets/covers/emb-*.jpg', { eager: true, as: 'url' })
const embCover = (slug) => embCovers[`../assets/covers/emb-${slug}.jpg`]

const LOCAL = [
  { id: 'local-theme', title: 'THEME // SIDE A', artist: '12_PARSEC STUDIO', genre: 'TECHNO', audio: themeAudio, cover: themeCover },
  { id: 'local-motorik', title: 'MOTORIK TRANSMISSION', artist: 'PARSEC SYNTH UNIT', genre: 'MOTORIK', audio: motorikAudio, cover: speedCover },
  { id: 'local-lullaby', title: 'STATIC LULLABY', artist: 'PARSEC SYNTH UNIT', genre: 'AMBIENT', audio: lullabyAudio, cover: starsCover },
  { id: 'local-rodeo', title: 'PIXEL RODEO', artist: 'PARSEC SYNTH UNIT', genre: 'CHIPTUNE', audio: rodeoAudio, cover: pixelsCover },
  { id: 'local-nightdrive', title: 'NIGHT DRIVE RADIO', artist: 'PARSEC SYNTH UNIT', genre: 'SYNTHWAVE', audio: nightDriveAudio, cover: gridCover },
]

const EMBEDS = [
  { id: 'emb-dramamine', title: 'DRAMAMINE', artist: 'FLAWED MANGOES', genre: 'GUITAR AMBIENT', netease: '2621452337', duration: 205, cover: embCover('dramamine') },
  { id: 'emb-lobster', title: 'LOBSTER 2.0', artist: 'RJ PASIN & WESGHOST', genre: 'GUITAR BEATS', netease: '2604767909', duration: 118, cover: embCover('lobster') },
  { id: 'emb-ricefields', title: 'RICE FIELDS', artist: 'CORN WAVE', genre: 'POST-PUNK', netease: '2086505323', duration: 265, cover: embCover('ricefields') },
  { id: 'emb-evening', title: 'EVENING', artist: 'CORN WAVE', genre: 'POST-PUNK', netease: '1473274368', duration: 257, cover: embCover('evening') },
  { id: 'emb-wind', title: 'WIND IN HER HAIR', artist: 'MOTORAMA', genre: 'POST-PUNK', netease: '4195036', duration: 281, cover: embCover('wind') },
  { id: 'emb-sudno', title: 'СУДНО', artist: 'MOLCHAT DOMA', genre: 'COLDWAVE', netease: '1413481294', duration: 141, cover: embCover('sudno') },
  { id: 'emb-wonderwall', title: 'WONDERWALL', artist: 'OASIS', genre: 'BRITPOP', netease: '4226257', duration: 258, cover: embCover('wonderwall') },
  { id: 'emb-anger', title: "DON'T LOOK BACK IN ANGER", artist: 'OASIS', genre: 'BRITPOP', netease: '4226232', duration: 287, cover: embCover('anger') },
  { id: 'emb-friday', title: "FRIDAY I'M IN LOVE", artist: 'THE CURE', genre: 'POP', netease: '21970528', duration: 214, cover: embCover('friday') },
  { id: 'emb-creep', title: 'CREEP', artist: 'RADIOHEAD', genre: 'ALT ROCK', netease: '22605222', duration: 238, cover: embCover('creep') },
  { id: 'emb-karma', title: 'KARMA POLICE', artist: 'RADIOHEAD', genre: 'ALT ROCK', netease: '22497475', duration: 264, cover: embCover('karma') },
  { id: 'emb-cars', title: 'CHASING CARS', artist: 'SNOW PATROL', genre: 'ALT ROCK', netease: '21730832', duration: 266, cover: embCover('cars') },
  { id: 'emb-imagine', title: 'IMAGINE', artist: 'JOHN LENNON', genre: 'ROCK', netease: '1476431', duration: 185, cover: embCover('imagine') },
  { id: 'emb-stairway', title: 'STAIRWAY TO HEAVEN', artist: 'LED ZEPPELIN', genre: 'ROCK', netease: '29719536', duration: 482, cover: embCover('stairway') },
  { id: 'emb-immigrant', title: 'IMMIGRANT SONG', artist: 'LED ZEPPELIN', genre: 'ROCK', netease: '20065049', duration: 146, cover: embCover('immigrant') },
  { id: 'emb-otherside', title: 'OTHERSIDE', artist: 'RED HOT CHILI PEPPERS', genre: 'ROCK', netease: '1364330789', duration: 255, cover: embCover('otherside') },
  { id: 'emb-snow', title: 'SNOW (HEY OH)', artist: 'RED HOT CHILI PEPPERS', genre: 'ROCK', netease: '21535888', duration: 334, cover: embCover('snow') },
]

export const neteaseEmbedUrl = (id) =>
  `https://music.163.com/outchain/player?type=2&id=${id}&auto=1&height=66`

// Interleave two records between each local station interlude; the caller
// shuffles within the groups for an infinite, non-repeating feel.
export const buildRotation = () => {
  const embeds = [...EMBEDS].sort(() => Math.random() - 0.5)
  const locals = [...LOCAL].sort(() => Math.random() - 0.5)
  const out = []
  while (embeds.length) {
    out.push(embeds.shift())
    if (embeds.length) out.push(embeds.shift())
    if (locals.length) out.push(locals.shift())
  }
  return out.concat(locals)
}

export const allTracks = [...EMBEDS, ...LOCAL]
