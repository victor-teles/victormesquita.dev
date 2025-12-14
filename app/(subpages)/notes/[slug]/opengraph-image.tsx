import { ImageResponse } from 'next/og';

export const size = { width: 1200, height: 630 };
export const alt = 'Note by Victor Mesquita';
export const contentType = 'image/png';
export const runtime = 'edge';

// eslint-disable-next-line import/no-anonymous-default-export
export default async function ({
  params,
}: {
  params: { slug: string };
}): Promise<ImageResponse> {
  const res = await fetch(
    `https://raw.githubusercontent.com/victor-teles/victormesquita.dev/main/notes/${params.slug}.mdx`,
  );

  if (!res.ok) {
    return new ImageResponse(
      <div style={{ display: 'flex', fontSize: 40, color: 'white', background: '#000', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
        Note not found
      </div>,
      { width: 1200, height: 630 }
    );
  }

  const text = await res.text();
  const title = text.match(/title: (.*)/)?.[1] || 'Untitled Note';
  const date = text.match(/date: (.*)/)?.[1];
  const type = text.match(/type: (.*)/)?.[1];

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
        <div style={{ display: 'flex', gap: 10 }}>
          <div
            style={{
              fontSize: 25,
              background: '#3b82f6',
              color: 'white',
              padding: '4px 10px',
            }}
          >
            {type || 'note'}
          </div>
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
            lineHeight: 1.15,
          }}
        >
          {title}
        </div>
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
