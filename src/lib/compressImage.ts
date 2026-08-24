interface ICompressImageOptions {
  maxDimension?: number
  quality?: number
}

const DEFAULT_MAX_DIMENSION = 2000
const DEFAULT_QUALITY = 0.82
const LOSSY_MIME_TYPES = new Set(['image/jpeg', 'image/webp'])

const canvasToBlob = (canvas: HTMLCanvasElement, mimeType: string, quality: number | undefined): Promise<Blob | null> =>
  new Promise((resolve) => {
    canvas.toBlob(resolve, mimeType, quality)
  })

export const compressImage = async (
  file: File,
  options?: ICompressImageOptions,
): Promise<File> => {
  const maxDimension = options?.maxDimension ?? DEFAULT_MAX_DIMENSION
  const quality = options?.quality ?? DEFAULT_QUALITY

  try {
    const bitmap = await createImageBitmap(file)
    const { width, height } = bitmap
    const longestEdge = Math.max(width, height)

    if (longestEdge <= maxDimension) {
      bitmap.close()
      return file
    }

    const scale = maxDimension / longestEdge
    const targetWidth = Math.round(width * scale)
    const targetHeight = Math.round(height * scale)

    const canvas = document.createElement('canvas')
    canvas.width = targetWidth
    canvas.height = targetHeight
    const context = canvas.getContext('2d')
    if (!context) {
      bitmap.close()
      return file
    }

    context.drawImage(bitmap, 0, 0, targetWidth, targetHeight)
    bitmap.close()

    const mimeType = file.type || 'image/jpeg'
    const blobQuality = LOSSY_MIME_TYPES.has(mimeType) ? quality : undefined
    const blob = await canvasToBlob(canvas, mimeType, blobQuality)

    if (!blob || blob.size >= file.size) {
      return file
    }

    return new File([blob], file.name, { type: mimeType, lastModified: file.lastModified })
  } catch (error) {
    console.error('Failed to compress image', error)
    return file
  }
}
