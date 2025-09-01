'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MapPin, Search, Navigation } from 'lucide-react'
import { useCart, type Address } from '@/contexts/cart-context'

interface AddressSelectorProps {
  onAddressSelect?: (address: Address) => void
}

export function AddressSelector({ onAddressSelect }: AddressSelectorProps) {
  const { state, dispatch } = useCart()
  const [isExpanded, setIsExpanded] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<Address[]>([])
  const [detailAddress, setDetailAddress] = useState('')

  // Debounce search query 1 detik
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery)
    }, 1000)

    return () => clearTimeout(handler)
  }, [searchQuery])

  // Fetch addresses setelah debounceQuery berubah
  useEffect(() => {
    if (debouncedQuery.length > 2) {
      const fetchAddresses = async () => {
        setIsLoading(true)
        try {
          const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            debouncedQuery,
          )}&addressdetails=1&limit=5&countrycodes=id`

          const res = await fetch(url, {
            headers: {
              'User-Agent': 'KarangTaruna/1.0',
            },
          })
          const data = await res.json()
          const addresses: Address[] = data.map((item: any) => ({
            street: item.address?.road || item.display_name,
            city: item.address?.city || item.address?.town || item.address?.village || '',
            district: item.address?.suburb || item.address?.city_district || '',
            postalCode: item.address?.postcode || '',
            coordinates: {
              lat: parseFloat(item.lat),
              lng: parseFloat(item.lon),
            },
            fullAddress: item.display_name,
            detail: '',
          }))
          setSuggestions(addresses)
        } catch (err) {
          console.error(err)
          setSuggestions([])
        } finally {
          setIsLoading(false)
        }
      }
      fetchAddresses()
    } else {
      setSuggestions([])
    }
  }, [debouncedQuery])

  const handleAddressSelect = (address: Address) => {
    const updatedAddress = { ...address, detail: detailAddress }
    dispatch({ type: 'SET_ADDRESS', address: updatedAddress })
    onAddressSelect?.(updatedAddress)
    setIsExpanded(false)
    setSearchQuery('')
    setSuggestions([])
  }

  const getCurrentLocation = () => {
    setIsLoading(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}&addressdetails=1`,
            )
            const data = await res.json()
            const addr = data.address
            const street =
              addr.road ||
              addr.pedestrian ||
              addr.footway ||
              addr.cycleway ||
              addr.neighbourhood ||
              data.display_name
            const district = addr.suburb || addr.city_district || addr.neighbourhood || ''
            const city = addr.city || addr.town || addr.village || ''
            const postalCode = addr.postcode || ''

            const address: Address = {
              street,
              district,
              city,
              postalCode,
              coordinates: { lat: position.coords.latitude, lng: position.coords.longitude },
              fullAddress: data.display_name,
              detail: '',
            }

            setSuggestions([address])
          } catch (err) {
            console.error(err)
            alert('Gagal mengambil alamat dari GPS')
          } finally {
            setIsLoading(false)
          }
        },
        () => {
          setIsLoading(false)
          alert('Tidak dapat mengakses lokasi. Pastikan GPS aktif.')
        },
      )
    } else {
      setIsLoading(false)
      alert('Browser tidak mendukung geolocation')
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary" />
          Alamat Pengiriman
        </Label>
        {!isExpanded && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(true)}
            className="text-primary hover:text-primary/80"
          >
            {state.address ? 'Ubah' : 'Pilih Alamat'}
          </Button>
        )}
      </div>

      {state.address && !isExpanded && (
        <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{state.address.fullAddress}</p>
              <p className="text-xs text-muted-foreground">
                {state.address.district}, {state.address.city} {state.address.postalCode}
              </p>
              {state.address.detail && (
                <p className="text-xs mt-2 text-muted-foreground">
                  Detail Alamat: {state.address.detail}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {isExpanded && (
        <div className="space-y-3 p-4 border rounded-lg bg-card">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Cari alamat..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={getCurrentLocation}
              disabled={isLoading}
              className="flex-shrink-0 bg-transparent"
            >
              <Navigation className="w-4 h-4" />
            </Button>
          </div>

          {isLoading && (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <p className="text-sm text-muted-foreground mt-2">Mencari alamat...</p>
            </div>
          )}

          {suggestions.length > 0 && (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {suggestions.map((address, index) => (
                <button
                  key={index}
                  onClick={() => handleAddressSelect(address)}
                  className="w-full text-left p-3 hover:bg-muted rounded-lg border transition-colors"
                >
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{address.fullAddress}</p>
                      <p className="text-xs text-muted-foreground">
                        {address.district}, {address.city} {address.postalCode}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Input detail alamat */}
          <div className="mt-2">
            <Label className="text-sm font-medium">Detail Alamat</Label>
            <Input
              placeholder="Contoh: Lantai 2, No. 12"
              value={detailAddress}
              onChange={(e) => setDetailAddress(e.target.value)}
            />
          </div>

          <div className="flex gap-2 pt-2 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsExpanded(false)
                setSearchQuery('')
                setSuggestions([])
              }}
              className="flex-1"
            >
              Batal
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
