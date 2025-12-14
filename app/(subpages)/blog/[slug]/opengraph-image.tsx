import { ImageResponse } from 'next/og';

export const size = { width: 1200, height: 630 };
export const alt = 'Blog post by Victor Mesquita';
export const contentType = 'image/png';
export const runtime = 'edge';

export default async function ({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<ImageResponse> {
  const { slug } = await params;
  const res = await fetch(
    `https://raw.githubusercontent.com/victor-teles/victormesquita.dev/main/posts/${slug}.mdx`,
  );

  if (!res.ok) {
    return new ImageResponse(
      <div style={{ display: 'flex', fontSize: 40, color: 'white', background: '#000', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
        Post not found
      </div>,
      { width: 1200, height: 630 }
    );
  }

  const text = await res.text();
  const title = text.match(/title: (.*)/)?.[1] || 'Untitled Post';
  const date = text.match(/date: (.*)/)?.[1];
  const description = text.match(/description: (.*)/)?.[1];

  const fontData = await fetch(new URL('../../../fonts/Inter-Medium.ttf', import.meta.url)).then((res) =>
    res.arrayBuffer(),
  );

  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        height: '100%',
        width: '100%',
        alignItems: 'center',
        letterSpacing: '-.02em',
        fontWeight: 700,
        background: '#000',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          width: '100%',
          padding: '10px 50px',
        }}
      >
        <span
          style={{
            fontSize: 25,
            fontWeight: 700,
            background: 'white',
            color: 'black',
            padding: '4px 10px',
          }}
        >
          victormesquita.dev
        </span>
        {date && (
          <div
            style={{
              fontSize: 25,
              background: 'white',
              color: 'black',
              padding: '4px 10px',
            }}
          >
            {date}
          </div>
        )}
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          padding: '0 80px',
          color: 'white',
          textAlign: 'center',
          height: 630 - 100,
          maxWidth: 1040,
        }}
      >
        <div
          style={{
            fontSize: 70,
            fontWeight: 900,
            marginBottom: description ? 30 : 0,
            lineHeight: 1.15,
          }}
        >
          {title}
        </div>
        {description && (
          <div
            style={{
              fontSize: 28,
              fontWeight: 500,
              lineHeight: 1.4,
              opacity: 0.85,
            }}
          >
            {description}
          </div>
        )}
      </div>
    </div>,
    {
      fonts: [
        {
          name: 'Inter',
          data: fontData,
          weight: 500,
        },
      ],
      width: 1200,
      height: 630,
    },
  );
}
