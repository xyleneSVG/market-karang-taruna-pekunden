"use client"

import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"
import { openWhatsAppCheckout } from "@/lib/whatsapp-utils"

interface Product {
  id: string
  name: string
  price: number
  category: string
  unit: string
}

interface WhatsAppCheckoutButtonProps {
  product: Product
  quantity: number
  className?: string
  size?: "sm" | "default" | "lg"
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
}

export function WhatsAppCheckoutButton({
  product,
  quantity,
  className,
  size = "default",
  variant = "default",
}: WhatsAppCheckoutButtonProps) {
  const handleDirectCheckout = () => {
    const items = [
      {
        product: {
          id: product.id,
          name: product.name,
          price: product.price,
          category: product.category,
          unit: product.unit,
        },
        quantity,
      },
    ]

    const total = product.price * quantity
    openWhatsAppCheckout(items, total)
  }

  return (
    <Button onClick={handleDirectCheckout} className={className} size={size} variant={variant}>
      <MessageCircle className="w-4 h-4 mr-2" />
      Pesan via WhatsApp
    </Button>
  )
}
