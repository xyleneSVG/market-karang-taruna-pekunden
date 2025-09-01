"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AnimatedAddToCartProps {
  onAddToCart: () => void
  productName: string
  className?: string
  size?: "sm" | "default" | "lg"
  children?: React.ReactNode
}

export function AnimatedAddToCart({
  onAddToCart,
  productName,
  className,
  size = "sm",
  children,
}: AnimatedAddToCartProps) {
  const [isAnimating, setIsAnimating] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const { toast } = useToast()

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()

    if (isAnimating) return

    setIsAnimating(true)

    // Create flying cart animation
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      const flyingCart = document.createElement("div")
      flyingCart.innerHTML = "🛒"
      flyingCart.style.cssText = `
        position: fixed;
        left: ${rect.left + rect.width / 2}px;
        top: ${rect.top + rect.height / 2}px;
        font-size: 24px;
        z-index: 9999;
        pointer-events: none;
        transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        transform: scale(1);
      `

      document.body.appendChild(flyingCart)

      // Animate to cart position (top right)
      requestAnimationFrame(() => {
        flyingCart.style.left = "calc(100vw - 100px)"
        flyingCart.style.top = "20px"
        flyingCart.style.transform = "scale(0.5)"
        flyingCart.style.opacity = "0"
      })

      // Remove element and show toast
      setTimeout(() => {
        document.body.removeChild(flyingCart)
        setIsAnimating(false)

        toast({
          variant: "success",
          title: "Berhasil ditambahkan!",
          description: `${productName} telah ditambahkan ke keranjang`,
        })
      }, 800)
    }

    onAddToCart()
  }

  return (
    <Button
      ref={buttonRef}
      onClick={handleClick}
      className={`${className} ${isAnimating ? "animate-pulse" : ""} transition-all duration-200 hover:scale-105 active:scale-95`}
      size={size}
      disabled={isAnimating}
    >
      {children || (
        <>
          <ShoppingCart className="w-4 h-4 mr-2" />
          Tambah ke Keranjang
        </>
      )}
    </Button>
  )
}
