import { describe, expect, it } from 'vitest'
import { dayShapes, VESSEL_IDS, VESSELS, visibleLights } from './vessels'

const colours = (id: Parameters<typeof visibleLights>[0], aspect: Parameters<typeof visibleLights>[1]) =>
  visibleLights(id, aspect).map(l => l.colour).sort()

describe('vessel lights by aspect', () => {
  it('a power-driven vessel shows masthead and both sidelights ahead, one sidelight abeam, the sternlight astern', () => {
    expect(colours('power', 'ahead')).toEqual(['green', 'red', 'white'])
    expect(colours('power', 'starboard')).toEqual(['green', 'white'])
    expect(colours('power', 'port')).toEqual(['red', 'white'])
    expect(colours('power', 'astern')).toEqual(['white'])
  })

  it('over 50 m: two masthead lights, the aft one higher', () => {
    const mast = VESSELS.power50.lights.filter(l => l.kind === 'masthead')
    expect(mast).toHaveLength(2)
    const [fwd, aft] = [...mast].sort((a, b) => b.pos - a.pos)
    expect(aft!.height).toBeGreaterThan(fwd!.height)
  })

  it('a sailing vessel has no masthead light', () => {
    expect(VESSELS.sail.lights.some(l => l.kind === 'masthead')).toBe(false)
    expect(colours('sail', 'ahead')).toEqual(['green', 'red'])
  })

  it('all-round lights show from every side', () => {
    for (const aspect of ['ahead', 'starboard', 'port', 'astern'] as const) {
      expect(colours('anchor', aspect)).toEqual(['white'])
      expect(visibleLights('cbd', aspect).filter(l => l.kind === 'allround' && l.colour === 'red')).toHaveLength(3)
    }
  })

  it('working lights read top to bottom', () => {
    const stack = (id: keyof typeof VESSELS) => VESSELS[id].lights
      .filter(l => l.kind === 'allround').sort((a, b) => b.height - a.height).map(l => l.colour)
    expect(stack('trawler')).toEqual(['green', 'white'])
    expect(stack('fishing')).toEqual(['red', 'white'])
    expect(stack('pilot')).toEqual(['white', 'red'])
    expect(stack('nuc')).toEqual(['red', 'red'])
    expect(stack('ram')).toEqual(['red', 'white', 'red'])
  })

  it('a vessel restricted in her ability to manoeuvre shows a masthead light, one not under command does not', () => {
    expect(VESSELS.ram.lights.some(l => l.kind === 'masthead')).toBe(true)
    expect(VESSELS.nuc.lights.some(l => l.kind === 'masthead')).toBe(false)
  })

  it('day shapes', () => {
    expect(dayShapes('anchor')).toEqual(['ball'])
    expect(dayShapes('nuc')).toEqual(['ball', 'ball'])
    expect(dayShapes('ram')).toEqual(['ball', 'diamond', 'ball'])
    expect(dayShapes('cbd')).toEqual(['cylinder'])
    expect(dayShapes('trawler')).toEqual(['cone-down', 'cone-up'])
    expect(dayShapes('motorsail')).toEqual(['cone-down'])
    expect(dayShapes('pilot')).toBeNull()
  })

  it('every vessel has statements with both answers', () => {
    for (const id of VESSEL_IDS) {
      const truths = new Set(VESSELS[id].statements.map(s => s[1]))
      expect(truths.size).toBe(2)
    }
  })
})
