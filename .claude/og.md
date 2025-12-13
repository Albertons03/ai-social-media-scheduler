// app/api/og/route.tsx (Vercel OG Image Generation)
import { ImageResponse } from 'next/og'

export async function GET() {
return new ImageResponse(
(
<div
style={{
          background: 'linear-gradient(135deg, #0F766E 0%, #8B5CF6 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontFamily: 'Inter'
        }} >
<div style={{ fontSize: 72, fontWeight: 'bold', marginBottom: 20 }}>
AI Social Media
</div>
<div style={{ fontSize: 72, fontWeight: 'bold',
          background: 'linear-gradient(to right, #06B6D4, #8B5CF6)',
          backgroundClip: 'text',
          color: 'transparent'
        }}>
On Autopilot
</div>
<div style={{ fontSize: 32, marginTop: 40, opacity: 0.9 }}>
Save 10 hours/week with AI scheduling
</div>
</div>
),
{
width: 1200,
height: 630,
}
)
}

```

Aztán metadata-ban: `images: [{ url: '/api/og' }]`

---

## ✅ Check OG Image működik-e:

1. **Facebook Sharing Debugger:** https://developers.facebook.com/tools/debug/
2. **Twitter Card Validator:** https://cards-dev.twitter.com/validator
3. **LinkedIn Post Inspector:** https://www.linkedin.com/post-inspector/

Másold be: `https://landingbits.net` → Látod a preview-t!

```
