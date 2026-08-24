import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { compressImage } from '../compressImage'

const buildFile = (name: string, type: string, size: number): File => {
  const file = new File([new Uint8Array(size)], name, { type })
  return file
}

const buildBitmap = (width: number, height: number) => ({
  width,
  height,
  close: vi.fn(),
})

describe('compressImage', () => {
  let drawImage: ReturnType<typeof vi.fn>
  let toBlob: ReturnType<typeof vi.fn>
  let getContext: ReturnType<typeof vi.fn>

  beforeEach(() => {
    drawImage = vi.fn()
    getContext = vi.fn(() => ({ drawImage }))
    toBlob = vi.fn((callback: BlobCallback) => callback(new Blob(['x'], { type: 'image/jpeg' })))

    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(getContext as never)
    vi.spyOn(HTMLCanvasElement.prototype, 'toBlob').mockImplementation(toBlob as never)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns the original file unchanged when already under maxDimension', async () => {
    const file = buildFile('photo.jpg', 'image/jpeg', 1000)
    vi.stubGlobal('createImageBitmap', vi.fn().mockResolvedValue(buildBitmap(1200, 800)))

    const result = await compressImage(file, { maxDimension: 2000 })

    expect(result).toBe(file)
    expect(getContext).not.toHaveBeenCalled()
  })

  it('draws a scaled-down image to canvas when over maxDimension and returns a smaller file', async () => {
    const file = buildFile('photo.jpg', 'image/jpeg', 5_000_000)
    vi.stubGlobal('createImageBitmap', vi.fn().mockResolvedValue(buildBitmap(4000, 2000)))
    toBlob.mockImplementation((callback: BlobCallback) => callback(new Blob(['x'], { type: 'image/jpeg' })))

    const result = await compressImage(file, { maxDimension: 2000, quality: 0.8 })

    expect(getContext).toHaveBeenCalledWith('2d')
    expect(drawImage).toHaveBeenCalledWith(expect.anything(), 0, 0, 2000, 1000)
    expect(toBlob).toHaveBeenCalledWith(expect.any(Function), 'image/jpeg', 0.8)
    expect(result).not.toBe(file)
    expect(result.name).toBe('photo.jpg')
    expect(result.size).toBeLessThan(file.size)
  })

  it('falls back to the original file when the compressed blob is not smaller', async () => {
    const file = buildFile('photo.jpg', 'image/jpeg', 10)
    vi.stubGlobal('createImageBitmap', vi.fn().mockResolvedValue(buildBitmap(4000, 2000)))
    toBlob.mockImplementation((callback: BlobCallback) => callback(new Blob(['xxxxxxxxxxxxxxx'], { type: 'image/jpeg' })))

    const result = await compressImage(file, { maxDimension: 2000 })

    expect(result).toBe(file)
  })

  it('falls back to the original file when createImageBitmap throws', async () => {
    const file = buildFile('photo.jpg', 'image/jpeg', 1000)
    vi.stubGlobal('createImageBitmap', vi.fn().mockRejectedValue(new Error('nope')))
    vi.spyOn(console, 'error').mockImplementation(() => {})

    const result = await compressImage(file)

    expect(result).toBe(file)
  })

  it('does not pass a quality argument for PNG files', async () => {
    const file = buildFile('photo.png', 'image/png', 5_000_000)
    vi.stubGlobal('createImageBitmap', vi.fn().mockResolvedValue(buildBitmap(4000, 2000)))
    toBlob.mockImplementation((callback: BlobCallback) => callback(new Blob(['x'], { type: 'image/png' })))

    await compressImage(file, { maxDimension: 2000 })

    expect(toBlob).toHaveBeenCalledWith(expect.any(Function), 'image/png', undefined)
  })
})
