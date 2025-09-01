import type { CollectionConfig } from 'payload'

export const ProductCategories: CollectionConfig = {
  slug: 'productCategories',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'emoji',
      label: 'Emoji',
      type: 'text',
      required: true,
    },
    {
      name: 'name',
      label: 'Product Category Name',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      label: 'Product Category Description',
      type: 'text',
      required: true,
    },
    {
      name: 'key',
      label: 'Key',
      type: 'text',
      admin: {
        hidden: true, 
      },
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (data?.name) {
          data.key = data.name 
        }
        return data
      },
    ],
  },
}
