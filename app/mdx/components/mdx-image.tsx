import NextImage from 'next/image'

export function MDXImage({
  src,
  alt,
}: React.DetailedHTMLProps<
  React.ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement
> & {
  src: string
  alt: string
}) {
  let widthFromSrc = 0
  let heightFromSrc = 0
  const url = new URL(src, 'https://victormesquita.dev')
  const widthParam = url.searchParams.get('w') || url.searchParams.get('width')
  const heightParam =
    url.searchParams.get('h') || url.searchParams.get('height')
  if (widthParam) {
    widthFromSrc = Number.parseInt(widthParam)
  }
  if (heightParam) {
    heightFromSrc = Number.parseInt(heightParam)
  }

  const imageProps = {
    src,
    alt,
    height: heightFromSrc || 450,
    width: widthFromSrc || 550,
  }

  return <NextImage {...imageProps} />
}
