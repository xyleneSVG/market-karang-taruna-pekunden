'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCart, type Address } from '@/contexts/cart-context'
import { MapPin, ChevronDown, ChevronUp } from 'lucide-react'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible'
import { Button } from '@/components/ui/button'

interface AddressSelectorProps {
  onAddressSelect?: (address: Address) => void
}

export function AddressSelector({ onAddressSelect }: AddressSelectorProps) {
  const { state, dispatch } = useCart()
  const [inputValue, setInputValue] = useState(state.address?.detail || '')
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(true)

  const fetchOngkir = async () => {
    if (!inputValue) return
    setIsLoading(true)

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: inputValue, history: [] }),
      })

      const data = await res.json()
      if (data.reply === '!null') {
        dispatch({ type: 'SET_ONGKIR', cost: null })
        dispatch({ type: 'SET_MAP_URL', mapUrl: null })
      } else {
        if (data.reply.startsWith('!ongkir=')) {
          const cost = parseInt(data.reply.replace('!ongkir=', ''), 10)
          dispatch({ type: 'SET_ONGKIR', cost })
        }
        if (data.view) {
          dispatch({ type: 'SET_MAP_URL', mapUrl: data.view })
        }
      }

      const updatedAddress: Address = state.address
        ? { ...state.address, detail: inputValue, fullAddress: data.view || '' }
        : {
            street: '',
            city: '',
            district: '',
            postalCode: '',
            coordinates: { lat: 0, lng: 0 },
            fullAddress: data.view || '',
            detail: inputValue,
          }

      dispatch({ type: 'SET_ADDRESS', address: updatedAddress })
      onAddressSelect?.(updatedAddress)
    } catch (err) {
      console.error('❌ Gagal hitung ongkir:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    dispatch({ type: 'SET_FETCHING', isLoading })
  }, [isLoading, dispatch])

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-2 border rounded-lg p-2">
      <div className="flex items-start justify-between">
        <Label className="text-sm font-medium flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary" />
          Alamat
        </Label>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="icon">
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </CollapsibleTrigger>
      </div>

      <CollapsibleContent className="space-y-2">
        <div className="flex gap-2">
          <Input
            className="placeholder:opacity-60"
            placeholder="Contoh: Jalan Pandanaran, Semarang Tengah, Kota Semarang"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <Button onClick={fetchOngkir} disabled={isLoading}>
            {isLoading ? '...' : 'Send'}
          </Button>
        </div>
        {state.mapUrl && (
          <iframe width="100%" height="200" src={state.mapUrl} className="rounded-md"></iframe>
        )}
      </CollapsibleContent>
    </Collapsible>
  )
}
