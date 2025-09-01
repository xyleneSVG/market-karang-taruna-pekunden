  'use client'

  import { useState } from 'react'
  import { Button } from '@/components/ui/button'
  import { Badge } from '@/components/ui/badge'
  import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
  import { X, ChevronLeft, ChevronRight, Plus, Minus } from 'lucide-react'
  import { useCart } from '@/contexts/cart-context'
  import { AnimatedAddToCart } from '@/components/animated-add-to-cart'
  import { WhatsAppCheckoutButton } from '@/components/whatsapp-checkout-button'
  import { ProductEntity } from '@/Entities/ProductItem'
  import { mapEntityToProduct } from '@/utils/mapEntityToProduct'

  interface ProductDetailModalProps {
    url: string
    product: ProductEntity
    isOpen: boolean
    onClose: () => void
  }

  export function ProductDetailModal({ url, product, isOpen, onClose }: ProductDetailModalProps) {
    const [quantity, setQuantity] = useState(1)
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const { dispatch } = useCart()

    if (!product) return null

    const handleQuantityChange = (change: number) => {
      setQuantity(Math.max(1, quantity + change))
    }

    const nextImage = () => {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length)
    }

    const prevImage = () => {
      setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length)
    }

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 animate-in fade-in-0 zoom-in-95 duration-300">
          <div className="grid grid-cols-1 gap-0">
            {/* Image Gallery */}
            <div className="relative">
              <div
                className={`aspect-square flex items-center justify-center text-8xl md:text-9xl relative overflow-hidden transition-all duration-500 hover:scale-105`}
              >
                <img
                  src={url + product.images[currentImageIndex]?.item?.url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {/* Image Navigation */}
                {product.images.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background/90 transition-all duration-300 hover:scale-110"
                      onClick={prevImage}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background/90 transition-all duration-300 hover:scale-110"
                      onClick={nextImage}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </>
                )}

                {/* Image Indicators */}
                {product.images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {product.images.map((_, index) => (
                      <button
                        key={index}
                        className={`w-2 h-2 rounded-full transition-all duration-300 hover:scale-125 ${
                          index === currentImageIndex ? 'bg-primary scale-125' : 'bg-background/50'
                        }`}
                        onClick={() => setCurrentImageIndex(index)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Product Details */}
            <div className="p-6 flex flex-col">
              <DialogHeader className="space-y-4 pb-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex items-start flex-col">
                    <Badge
                      variant="secondary"
                      className="w-fit transition-all duration-300 hover:scale-110"
                    >
                      {product.category.name}
                    </Badge>
                    <DialogTitle className="text-2xl font-bold text-foreground text-left">
                      {product.name}
                    </DialogTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={onClose}
                      className="transition-all duration-300 hover:scale-110"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </DialogHeader>

              {/* Price */}
              <div className="space-y-2 mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-primary transition-all duration-300 hover:scale-110 inline-block">
                    Rp {product.price.toLocaleString('id-ID')}
                  </span>
                  {product.price && (
                    <span className="text-lg text-muted-foreground line-through">
                      Rp {product.price.toLocaleString('id-ID')}
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{product.unit}</p>
              </div>

              {/* Description */}
              <div className="space-y-4 mb-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Deskripsi Produk</h3>
                  <p className="text-muted-foreground leading-relaxed">{product.description}</p>
                </div>

                {/* Features */}
                {product.features.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Keunggulan</h3>
                    <ul className="space-y-1">
                      {product.features.map((feature, index) => (
                        <li
                          key={index}
                          className="text-sm text-muted-foreground flex items-center gap-2 group"
                        >
                          <div className="w-1.5 h-1.5 bg-primary rounded-full transition-all duration-300 group-hover:scale-150" />
                          <span className="transition-all duration-300 group-hover:text-foreground">
                            {feature.item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Quantity and Actions */}
              <div className="mt-auto space-y-4">
                {/* Quantity Controls */}
                <div className="flex items-center gap-4">
                  <span className="font-medium text-foreground">Jumlah:</span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="h-8 w-8 transition-all duration-300 hover:scale-110 disabled:hover:scale-100"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-12 text-center font-medium text-lg transition-all duration-300 hover:scale-110">
                      {quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleQuantityChange(1)}
                      className="h-8 w-8 transition-all duration-300 hover:scale-110"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3">
                  <AnimatedAddToCart
                    productName={product.name}
                    onAddToCart={() => {
                      const productForCart = mapEntityToProduct(product)
                      dispatch({ type: 'ADD_ITEM', product: productForCart, quantity })
                      onClose()
                    }}
                    className="w-full"
                  >
                    Tambah {quantity} ke Keranjang
                  </AnimatedAddToCart>

                  <WhatsAppCheckoutButton
                    product={mapEntityToProduct(product)}
                    quantity={quantity}
                    variant="outline"
                    className="w-full transition-all duration-300 hover:scale-105"
                  />
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }
