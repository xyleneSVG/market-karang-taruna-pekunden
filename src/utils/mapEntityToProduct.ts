import { ProductEntity } from '@/Entities/ProductItem'
import { ProductContextEntity } from '@/contexts/cart-context'
import { Media } from '@/payload-types'

export function mapEntityToProduct(entity: ProductEntity): ProductContextEntity {
  return {
    id: entity.id.toString(),
    name: entity.name,
    price: entity.price,
    description: entity.description ?? entity.excerpt ?? '',
    category: entity.category?.name ?? 'Uncategorized',
    unit: entity.unit,
    images: (entity.images ?? []).map((img) => ({
      id: img.id,
      item: img.item as Media,
    })),
    features: (entity.features ?? []).map((f) => f.item),
  }
}
