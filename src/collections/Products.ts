import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'name',
          label: 'Product Name',
          type: 'text',
          required: true,
          admin: { width: '50%' },
        },
        {
          name: 'price',
          label: 'Product Price',
          type: 'number',
          required: true,
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'discounted',
      label: 'Discounted?',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'originalPrice',
      label: 'Original Price',
      type: 'number',
      required: false,
      admin: {
        condition: (data) => !!data.discounted,
      },
    },
    {
      name: 'excerpt',
      label: 'Product Excerpt',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      label: 'Product Description',
      type: 'textarea',
      required: true,
    },
    {
      type: 'row',
      fields: [
        {
          type: 'group',
          label: 'Details',
          admin: { width: '50%' },
          fields: [
            {
              name: 'unit',
              label: 'Product Unit',
              type: 'text',
              required: true,
              admin: { description: 'Example: per porsi' },
            },
          ],
        },
        {
          type: 'group',
          label: 'Category & Media',
          admin: { width: '50%' },
          fields: [
            {
              name: 'category',
              label: 'Product Category',
              type: 'relationship',
              relationTo: 'productCategories',
              required: true,
            },
            {
              name: 'images',
              label: 'Product Displays',
              type: 'array',
              fields: [{ name: 'item', type: 'upload', relationTo: 'media', required: true }],
              required: true,
            },
            {
              name: 'features',
              label: 'Product Features',
              type: 'array',
              fields: [{ name: 'item', type: 'text', required: true }],
              required: true,
            },
          ],
        },
      ],
    },
  ],
}
