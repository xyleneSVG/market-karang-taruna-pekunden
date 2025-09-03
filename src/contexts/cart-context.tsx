'use client'

import { Media } from '@/payload-types'
import type React from 'react'

import { createContext, useContext, useReducer, type ReactNode } from 'react'

// ===== TYPES =====
export interface ProductContextEntity {
  id: string
  name: string
  price: number
  description: string
  category: string
  unit: string
  images: { id: string; item: Media }[]
  features: string[]
}

interface CartItem {
  product: ProductContextEntity
  quantity: number
  note?: string
}

export interface Address {
  street?: string
  city?: string
  district?: string
  postalCode?: string
  coordinates?: { lat: number; lng: number }
  fullAddress?: string
  detail: string
}

interface CartState {
  items: CartItem[]
  total: number
  itemCount: number
  address: Address | null
  mapUrl: string | null
  shippingCost: number | null
  isFetching: boolean
}

type CartAction =
  | { type: 'ADD_ITEM'; product: ProductContextEntity; quantity: number }
  | { type: 'REMOVE_ITEM'; productId: string }
  | { type: 'UPDATE_QUANTITY'; productId: string; quantity: number }
  | { type: 'UPDATE_NOTE'; productId: string; note: string }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_ADDRESS'; address: Address }
  | { type: 'SET_MAP_URL'; mapUrl: string | null }
  | { type: 'SET_ONGKIR'; cost: number | null }
  | { type: 'SET_FETCHING'; isLoading: boolean }

// ===== CONTEXT =====
const CartContext = createContext<{
  state: CartState
  dispatch: React.Dispatch<CartAction>
} | null>(null)

// ===== REDUCER =====
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(
        (item) => item.product.id === action.product.id,
      )

      let newItems: CartItem[]
      if (existingItemIndex >= 0) {
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + action.quantity }
            : item,
        )
      } else {
        newItems = [...state.items, { product: action.product, quantity: action.quantity }]
      }

      const total = newItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0)

      return { ...state, items: newItems, total, itemCount }
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter((item) => item.product.id !== action.productId)
      const total = newItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0)

      return { ...state, items: newItems, total, itemCount }
    }

    case 'UPDATE_QUANTITY': {
      if (action.quantity <= 0) {
        return cartReducer(state, { type: 'REMOVE_ITEM', productId: action.productId })
      }

      const newItems = state.items.map((item) =>
        item.product.id === action.productId ? { ...item, quantity: action.quantity } : item,
      )

      const total = newItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0)

      return { ...state, items: newItems, total, itemCount }
    }

    case 'UPDATE_NOTE': {
      const newItems = state.items.map((item) =>
        item.product.id === action.productId ? { ...item, note: action.note } : item,
      )
      return { ...state, items: newItems }
    }

    case 'SET_ADDRESS': {
      return { ...state, address: action.address }
    }

    case 'SET_MAP_URL':
      return { ...state, mapUrl: action.mapUrl }

    case 'SET_ONGKIR': {
      return { ...state, shippingCost: action.cost }
    }

    case 'SET_FETCHING': {
      return { ...state, isFetching: action.isLoading }
    }

    case 'CLEAR_CART':
      return {
        items: [],
        total: 0,
        itemCount: 0,
        address: null,
        mapUrl: null,
        shippingCost: null,
        isFetching: false,
      }

    default:
      return state
  }
}

// ===== PROVIDER =====
export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    itemCount: 0,
    address: null,
    mapUrl: null,
    shippingCost: 0,
    isFetching: false,
  })

  return <CartContext.Provider value={{ state, dispatch }}>{children}</CartContext.Provider>
}

// ===== HOOK =====
export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
