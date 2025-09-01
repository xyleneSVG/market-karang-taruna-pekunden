'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Users, Plus, Minus, Search, ArrowLeft, ChevronDown } from 'lucide-react'
import { ProductDetailModal } from '@/components/product-detail-modal'
import { ShoppingCartButton } from '@/components/shopping-cart'
import { AnimatedAddToCart } from '@/components/animated-add-to-cart'
import { useCart } from '@/contexts/cart-context'
import Link from 'next/link'
import { ProductCategoryEntity } from '@/Entities/ProductCategory'
import { ProductEntity } from '@/Entities/ProductItem'
import { mapEntityToProduct } from '@/utils/mapEntityToProduct'

interface Props {
  products: ProductEntity[]
  categories: ProductCategoryEntity[]
  url: string
}

export default function ProdukPageClient({ products, categories, url }: Props) {
  const [selectedProduct, setSelectedProduct] = useState<ProductEntity | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [productQuantities, setProductQuantities] = useState<Record<string, number>>({})
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [displayCount, setDisplayCount] = useState(6)
  const { dispatch } = useCart()

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === 'Semua' || product.category.key === selectedCategory

    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesCategory && matchesSearch
  })

  const displayedProducts = filteredProducts.slice(0, displayCount)
  const hasMoreProducts = displayCount < filteredProducts.length

  const handleProductClick = (product: ProductEntity) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  const handleAddToCart = (product: ProductEntity, quantity: number) => {
    const productForCart = mapEntityToProduct(product)
    dispatch({ type: 'ADD_ITEM', product: productForCart, quantity })
  }

  const updateProductQuantity = (productId: number, change: number) => {
    setProductQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) + change),
    }))
  }

  const getProductQuantity = (productId: number) => {
    return productQuantities[productId] || 1
  }

  const handleCategorySelect = (categoryKey: string) => {
    setSelectedCategory(categoryKey)
    setIsDropdownOpen(false)
    setDisplayCount(6)
  }

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + 6)
  }

  const currentCategory = categories.find((cat) => cat.key === selectedCategory) || categories[0]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 border-b border-border transition-all duration-300">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 group">
              <Link href="/" className="flex items-center space-x-3 group">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
                  <Users className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground transition-colors duration-300 group-hover:text-primary">
                    Karang Taruna
                  </h1>
                  <p className="text-sm text-muted-foreground">Pekunden</p>
                </div>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button
                  variant="ghost"
                  size="sm"
                  className="transition-all duration-300 hover:scale-105"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Kembali
                </Button>
              </Link>
              <ShoppingCartButton />
            </div>
          </div>
        </div>
      </header>

      {/* Products Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Semua Produk</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Jelajahi koleksi lengkap produk berkualitas dari komunitas Karang Taruna Pekunden
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Cari produk..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setDisplayCount(6)
                }}
                className="pl-10 pr-4 py-3 text-center transition-all duration-300 focus:scale-105"
              />
            </div>
          </div>

          {/* Category Filters */}
          <div className="hidden md:flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <Button
                key={category.key}
                variant={selectedCategory === category.key ? 'default' : 'outline'}
                className={`px-6 py-3 transition-all duration-300 hover:scale-105 active:scale-95 ${
                  selectedCategory !== category.key ? 'bg-transparent' : ''
                }`}
                onClick={() => handleCategorySelect(category.key ?? '')}
              >
                <span className="mr-2 transition-transform duration-300 hover:scale-125">
                  {category.emoji}
                </span>
                {category.name}
              </Button>
            ))}
          </div>

          <div className="md:hidden mb-12">
            <div className="max-w-xs mx-auto relative">
              <Button
                variant="default"
                className="w-full px-4 py-3 bg-primary text-primary-foreground justify-between transition-all duration-300 hover:scale-105"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <div className="flex items-center">
                  <span className="mr-2">{currentCategory.emoji}</span>
                  {currentCategory.name}
                </div>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}
                />
              </Button>

              {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-10 animate-in slide-in-from-top-2 duration-200 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
                  {categories
                    .filter((cat) => cat.key !== selectedCategory)
                    .map((category) => (
                      <Button
                        key={category.key}
                        variant="ghost"
                        className="w-full px-4 py-3 justify-start text-left hover:bg-muted transition-all duration-200 rounded-none border-b border-border last:border-b-0"
                        onClick={() => handleCategorySelect(category.key ?? '')}
                      >
                        <span className="mr-2">{category.emoji}</span>
                        {category.name}
                      </Button>
                    ))}
                </div>
              )}
            </div>

            {isDropdownOpen && (
              <div className="fixed inset-0 z-0" onClick={() => setIsDropdownOpen(false)} />
            )}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedProducts.length > 0 ? (
              displayedProducts.map((product, index) => (
                <Card
                  key={product.id}
                  className="group hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden transform hover:-translate-y-3 hover:rotate-1"
                  onClick={() => handleProductClick(product)}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div
                    className={`aspect-square flex items-center justify-center text-6xl relative overflow-hidden transition-all duration-500 group-hover:scale-110`}
                  >
                    <img
                      src={url + product.images[0].item.url}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                        {product.name}
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-lg font-bold text-primary transition-all duration-300 group-hover:scale-110 inline-block">
                          Rp {product.price.toLocaleString('id-ID')}
                        </span>
                        <p className="text-xs text-muted-foreground">{product.unit}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 bg-transparent transition-all duration-200 hover:scale-110 active:scale-90"
                          onClick={(e) => {
                            e.stopPropagation()
                            updateProductQuantity(product.id, -1)
                          }}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="w-8 text-center font-medium transition-all duration-300 hover:scale-110">
                          {getProductQuantity(product.id)}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 bg-transparent transition-all duration-200 hover:scale-110 active:scale-90"
                          onClick={(e) => {
                            e.stopPropagation()
                            updateProductQuantity(product.id, 1)
                          }}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <AnimatedAddToCart
                      onAddToCart={() => handleAddToCart(product, getProductQuantity(product.id))}
                      productName={product.name}
                      className="w-full mt-3"
                      size="sm"
                    />
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Produk tidak ditemukan
                </h3>
                <p className="text-muted-foreground mb-4">
                  Coba ubah kata kunci pencarian atau pilih kategori lain
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedCategory('Semua')
                    setDisplayCount(6)
                  }}
                  className="transition-all duration-300 hover:scale-105"
                >
                  Reset Filter
                </Button>
              </div>
            )}
          </div>

          {hasMoreProducts && (
            <div className="text-center mt-12">
              <Button
                onClick={handleLoadMore}
                variant="outline"
                size="lg"
                className="px-8 py-3 transition-all duration-300 hover:scale-105 hover:shadow-lg bg-transparent"
              >
                Muat Lebih Banyak
                <span className="ml-2 text-sm text-muted-foreground">
                  ({displayedProducts.length} dari {filteredProducts.length})
                </span>
              </Button>
            </div>
          )}
        </div>
      </section>

      {selectedProduct && (
        <ProductDetailModal
          url={url}
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  )
}
