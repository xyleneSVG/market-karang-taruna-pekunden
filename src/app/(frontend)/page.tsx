import ProdukPageClient from '@/components/pages/product'
import { ProductCategoryEntity } from '@/Entities/ProductCategory'
import { Feature, ProductEntity, ProductImage } from '@/Entities/ProductItem'
import { Media } from '@/payload-types'
import { getDataProductCategories } from '@/utils/getDataProductCategories'
import { getDataProductItems } from '@/utils/getDataProductItems'

export default async function ProdukPage() {
  const categoriesFromPayload = await getDataProductCategories()
  const productItemsFromPayload = await getDataProductItems()
  const URL = process.env.NEXT_PUBLIC_URL ?? ''

  const categories: ProductCategoryEntity[] = [
    { key: 'Semua', emoji: '🛍️', name: 'Semua Produk', description: 'Semua produk tersedia' },
    ...categoriesFromPayload.map((cat) => ({
      key: cat.key ?? cat.name,
      emoji: cat.emoji ?? '📦',
      name: cat.name,
      description: cat.description ?? '',
    })),
  ]

  const products: ProductEntity[] = productItemsFromPayload.map((prod) => {
    const categoryEntity: ProductCategoryEntity =
      typeof prod.category === 'number'
        ? ((categoriesFromPayload.find((cat) => cat.id === prod.category) || {
            key: 'unknown',
            name: 'Unknown',
            emoji: '❓',
            description: '',
          }) as ProductCategoryEntity)
        : {
            key: prod.category.key ?? 'unknown',
            name: prod.category.name ?? 'Unknown',
            emoji: prod.category.emoji ?? '📦',
            description: prod.category.description ?? '',
          }

    const images: ProductImage[] = (prod.images ?? []).map((img) => ({
      id: img.id ?? 'unknown',
      item: img.item as Media,
    }))

    const features: Feature[] = (prod.features ?? []).map((f, idx) => ({
      id: typeof f.id === 'number' ? f.id : idx,
      item: f.item,
    }))

    return {
      ...prod,
      category: categoryEntity,
      images,
      features,
      discounted: Boolean(prod.discounted),
      originalPrice: prod.originalPrice ?? 0,
    }
  })

  return <ProdukPageClient products={products} categories={categories} url={URL} />
}
