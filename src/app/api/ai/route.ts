import { NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

export async function POST(req: Request) {
  const { prompt, history } = await req.json()
  const conversationHistory = history || []

  const systemInstruction = `
Kamu adalah asisten khusus untuk menghitung ongkos kirim dari:
  Titik awal: Jl. Pekunden Selatan No.1168, Semarang Tengah.

Aturan:
- Input HARUS berupa alamat tujuan dengan format:
  [nama jalan], [daerah/kecamatan], [kota]
- Jika input tidak lengkap → balas hanya: !null
- Jika valid:
  • Hitung jarak terpendek (km).
  • Jika ≤ 3 km → ongkir = 0
  • Jika > 3 km → setiap tambahan 2 km → +Rp5.000

Balasan WAJIB dalam bentuk sinyal:
- !distance=<angka_km>
- !ongkir=<angka>
- !view=<url_google_maps_embed>

Ketentuan penting:
- Gunakan format berikut untuk !view:
  https://maps.google.com/maps?width=100%25&height=300&hl=id&q=<alamat>&t=&z=14&ie=UTF8&iwloc=B&output=embed
- Ganti <alamat> dengan alamat tujuan user (tanpa ubah format lainnya).
- Ubah setiap spasi dalam <alamat> menjadi %20.
- Jika alamat tidak valid → balas hanya: !null
`

  const chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    history: conversationHistory,
    config: { systemInstruction, temperature: 0 },
  })

  const response = await chat.sendMessage({ message: prompt })
  const raw = response.text?.trim() ?? ''

  console.log('📩 Prompt:', prompt)
  console.log('🤖 Gemini raw response:', raw)

  let reply = '!null'
  let distanceValue: number | null = null
  let ongkirValue: number | null = null
  let viewUrl: string | null = null

  if (raw.includes('!distance=')) {
    const match = raw.match(/!distance=(\d+(\.\d+)?)/) 
    if (match) {
      distanceValue = parseFloat(match[1])
      console.log('Distance: ', distanceValue)
    }
  }

  if (raw.includes('!ongkir=')) {
    const match = raw.match(/!ongkir=(\d+)/)
    if (match) {
      reply = `!ongkir=${match[1]}`
      ongkirValue = parseInt(match[1], 10)
      console.log('Ongkir', ongkirValue)
    }
  }

  if (raw.includes('!view=')) {
    const match = raw.match(/!view=(https?:\/\/[^\s]+)/)
    if (match) {
      viewUrl = match[1]
      console.log('URL Maps: ', viewUrl)
    }
  }

  if (raw === '!null') {
    reply = '!null'
  }

  const newHistory = [
    ...conversationHistory,
    { role: 'user', parts: [{ text: prompt }] },
    { role: 'model', parts: [{ text: raw }] },
  ]

  return NextResponse.json({
    reply,
    distance: distanceValue,
    ongkir: ongkirValue,
    view: viewUrl,
    newHistory,
  })
}
