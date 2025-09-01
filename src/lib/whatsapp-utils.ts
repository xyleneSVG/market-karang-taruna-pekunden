interface CartItem {
  product: {
    id: string
    name: string
    price: number
    category: string
    unit: string
  }
  quantity: number
}

export function generateWhatsAppMessage(items: CartItem[], total: number): string {
  const header = '*Pesanan dari Karang Taruna Pekunden Marketplace*\n\n'

  const itemsList = items
    .map((item, index) => {
      const itemTotal = item.product.price * item.quantity
      return `${index + 1}. *${item.product.name}*
   Kategori: ${item.product.category}
   Harga: Rp ${item.product.price.toLocaleString('id-ID')} ${item.product.unit}
   Jumlah: ${item.quantity}
   Subtotal: Rp ${itemTotal.toLocaleString('id-ID')}\n`
    })
    .join('\n')

  const summary = `*Ringkasan Pesanan:*
Total Item: ${items.reduce((sum, item) => sum + item.quantity, 0)} item
Total Harga: Rp ${total.toLocaleString('id-ID')}
Ongkos Kirim: Gratis

*Pesan Tambahan:*
Mohon konfirmasi ketersediaan produk dan waktu pengiriman. Terima kasih!

---
_Pesanan melalui Karang Taruna Pekunden Marketplace_`

  return header + itemsList + summary
}

export function generateWhatsAppURL(message: string, phoneNumber: number): string {
  const encodedMessage = encodeURIComponent(message)
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`
}

export function openWhatsAppCheckout(items: CartItem[], total: number, phoneNumber?: string): void {
  const message = generateWhatsAppMessage(items, total)
  const whatsappURL = generateWhatsAppURL(message, Number(phoneNumber))

  window.open(whatsappURL, '_blank')
}
