'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { ShoppingCart, Plus, Minus, Trash2, X, MessageCircle } from 'lucide-react'
import { useCart } from '@/contexts/cart-context'
import { useState } from 'react'
import { generateWhatsAppMessage, generateWhatsAppURL } from '@/lib/whatsapp-utils'
import { AddressSelector } from './address-selector'

export function ShoppingCartButton() {
  const { state } = useCart()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCart className="w-5 h-5" />
          {state.itemCount > 0 && (
            <Badge className="absolute -top-2 -right-2 w-5 h-5 rounded-full p-0 flex items-center justify-center text-xs">
              {state.itemCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <ShoppingCartContent onClose={() => setIsOpen(false)} />
      </SheetContent>
    </Sheet>
  )
}

function ShoppingCartContent({ onClose }: { onClose: () => void }) {
  const { state, dispatch } = useCart()
  const URL = process.env.NEXT_PUBLIC_URL ?? ''

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', productId, quantity })
  }

  const removeItem = (productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', productId })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  const handleWhatsAppCheckout = () => {
    if (state.items.length === 0) return

    const whatsappItems = state.items.map((item) => ({
      product: {
        id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        category: item.product.category,
        unit: item.product.unit,
      },
      quantity: item.quantity,
    }))

    const addressText = state.address
      ? `\nAlamat Pengiriman:\n${state.address.fullAddress}` +
        (state.address.detail ? `\n\nDetail Alamat:\n${state.address.detail}` : '')
      : ''

    const total = state.total
    const message = generateWhatsAppMessage(whatsappItems, total) + addressText

    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER
    const whatsappURL = generateWhatsAppURL(message, Number(whatsappNumber))
    window.open(whatsappURL, '_blank')

    onClose()
  }

  if (state.items.length === 0) {
    return (
      <div className="flex flex-col h-full">
        <SheetHeader className="space-y-4 pb-4 border-b">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl font-bold">Keranjang Belanja</SheetTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </SheetHeader>

        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto">
              <ShoppingCart className="w-10 h-10 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Keranjang Kosong</h3>
              <p className="text-muted-foreground text-sm">
                Belum ada produk yang ditambahkan ke keranjang
              </p>
            </div>
            <Button onClick={onClose} className="mt-4">
              Mulai Belanja
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <SheetHeader className="space-y-4 pb-4 border-b">
        <div className="flex items-center justify-between">
          <SheetTitle className="text-xl font-bold">Keranjang Belanja</SheetTitle>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={clearCart} className="text-destructive">
              <Trash2 className="w-4 h-4 mr-1" />
              Kosongkan
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{state.itemCount} item</span>
          <span className="font-semibold text-primary">
            Total: Rp {state.total.toLocaleString('id-ID')}
          </span>
        </div>
      </SheetHeader>

      <div className="flex-1 overflow-y-auto py-4 px-4 space-y-4">
        {state.items.map((item) => (
          <div key={item.product.id} className="flex gap-4 p-4 bg-card rounded-lg border">
            <div
              className={`w-16 h-16 rounded-lg flex items-center justify-center text-2xl flex-shrink-0`}
            >
              <img
                src={URL + item.product.images[0].item.url}
                alt={item.product.name}
                className="w-full h-full rounded-lg object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-foreground text-sm line-clamp-1">
                {item.product.name}
              </h4>
              <p className="text-xs text-muted-foreground mb-2">
                {item.product.category} • {item.product.unit}
              </p>

              <div className="my-2">
                <input
                  type="text"
                  placeholder="Tambah catatan..."
                  value={item.note || ''}
                  onChange={(e) =>
                    dispatch({
                      type: 'UPDATE_NOTE',
                      productId: item.product.id,
                      note: e.target.value,
                    })
                  }
                  className="w-full rounded-md border px-2 py-1 text-sm text-foreground"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7 bg-transparent"
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                  <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7 bg-transparent"
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-destructive"
                  onClick={() => removeItem(item.product.id)}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>

              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-muted-foreground">
                  Rp {item.product.price.toLocaleString('id-ID')} × {item.quantity}
                </span>
                <span className="font-semibold text-primary text-sm">
                  Rp {(item.product.price * item.quantity).toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t px-4 py-4 space-y-4">
        <AddressSelector
          onAddressSelect={(addr) => dispatch({ type: 'SET_ADDRESS', address: addr })}
        />

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Subtotal ({state.itemCount} item)</span>
            <span className="font-medium">Rp {state.total.toLocaleString('id-ID')}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Ongkos Kirim</span>
            <span className="font-medium text-primary">
              {state.isFetching
                ? 'Menghitung...'
                : state.shippingCost === null
                  ? 'Alamat tidak ditemukan'
                  : state.shippingCost === 0
                    ? 'Gratis'
                    : `Rp ${state.shippingCost.toLocaleString('id-ID')}`}
            </span>
          </div>
          <div className="border-t pt-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold">Total</span>
              <span className="font-bold text-lg text-primary">
                Rp {(state.total + (state.shippingCost || 0)).toLocaleString('id-ID')}
              </span>
            </div>
          </div>
        </div>

        <Button
          className="w-full"
          size="lg"
          onClick={handleWhatsAppCheckout}
          disabled={!state.address || state.shippingCost === null || state.isFetching}
        >
          <MessageCircle className="w-5 h-5 mr-2" />
          Checkout via WhatsApp
        </Button>

        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            {!state.address
              ? 'Tulis alamat pengiriman untuk melanjutkan checkout'
              : 'Pesanan akan dikirim melalui WhatsApp untuk konfirmasi'}
          </p>
        </div>
      </div>
    </div>
  )
}
