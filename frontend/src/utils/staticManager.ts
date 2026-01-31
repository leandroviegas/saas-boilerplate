import { ImageLoaderProps } from "next/image"

export function parseStaticUrl(src: string | null | undefined) {
    if (!src) {
        return '/placeholder.png';
    }
    return `${process.env.NEXT_PUBLIC_STATIC_URL || ''}/${src}`
}

export function parseImageUrl({ src, width, quality }: ImageLoaderProps) {
    if (!src) {
        return '/placeholder.png';
    }
    return `${(process.env.NEXT_PUBLIC_STATIC_URL || '')}/${src}?w=${width}&q=${quality || 75}`
}