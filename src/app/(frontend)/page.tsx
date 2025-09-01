"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Heart, Star, Users, MapPin, Phone } from "lucide-react"
import { ShoppingCartButton } from "@/components/shopping-cart"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 border-b border-border transition-all duration-300">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
                <Users className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground transition-colors duration-300 group-hover:text-primary">
                  Karang Taruna
                </h1>
                <p className="text-sm text-muted-foreground">Pekunden</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <ShoppingCartButton />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4 overflow-hidden">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance animate-in fade-in-0 slide-in-from-bottom-4 duration-1000">
              Marketplace Digital
              <span className="text-primary block animate-in fade-in-0 slide-in-from-bottom-4 duration-1000 delay-300">
                Karang Taruna Pekunden
              </span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto animate-in fade-in-0 slide-in-from-bottom-4 duration-1000 delay-500">
              Platform komunitas untuk mempromosikan dan menjual produk hasil karya warga dan pemuda. Makanan, pakaian,
              kerajinan, dan produk wirausaha lainnya dalam satu tempat!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-in fade-in-0 slide-in-from-bottom-4 duration-1000 delay-700">
              <Link href="/produk">
                <Button
                  size="lg"
                  className="px-8 py-6 text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95"
                >
                  Jelajahi Produk
                  <ShoppingCart className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-6 text-lg bg-transparent transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95"
              >
                Tentang Kami
                <Users className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4 bg-card">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: ShoppingCart, value: "50+", label: "Produk Tersedia", color: "primary" },
              { icon: Users, value: "25+", label: "Anggota Aktif", color: "accent" },
              { icon: Star, value: "4.8", label: "Rating Produk", color: "primary" },
              { icon: Heart, value: "100+", label: "Pelanggan Puas", color: "accent" },
            ].map((stat, index) => (
              <div key={index} className="text-center group">
                <div
                  className={`w-16 h-16 bg-${stat.color}/10 rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-300 group-hover:bg-${stat.color}/20 group-hover:scale-110 group-hover:rotate-6`}
                >
                  <stat.icon className={`w-8 h-8 text-${stat.color}`} />
                </div>
                <h3 className="text-2xl font-bold text-foreground transition-all duration-300 group-hover:scale-110">
                  {stat.value}
                </h3>
                <p className="text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Categories Preview */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Kategori Produk Unggulan</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Temukan berbagai produk berkualitas dari komunitas Karang Taruna Pekunden
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { emoji: "🍜", title: "Makanan", desc: "Kuliner khas dan makanan rumahan berkualitas", count: "15+" },
              { emoji: "👕", title: "Pakaian", desc: "Fashion dan pakaian tradisional modern", count: "20+" },
              { emoji: "🎨", title: "Kerajinan", desc: "Kerajinan tangan unik dan berkualitas", count: "15+" },
            ].map((category, index) => (
              <Link key={index} href="/produk">
                <Card className="group hover:shadow-xl transition-all duration-500 cursor-pointer transform hover:-translate-y-2 hover:rotate-1">
                  <CardContent className="p-6 text-center">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
                      <div className="text-3xl transition-transform duration-300 group-hover:scale-125">
                        {category.emoji}
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2 transition-colors duration-300 group-hover:text-primary">
                      {category.title}
                    </h3>
                    <p className="text-muted-foreground mb-4">{category.desc}</p>
                    <Badge variant="secondary" className="transition-all duration-300 group-hover:scale-110">
                      {category.count} Produk
                    </Badge>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/produk">
              <Button
                variant="outline"
                size="lg"
                className="px-8 bg-transparent transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95"
              >
                Lihat Produk Lainnya
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-16 px-4 bg-card">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Tentang Karang Taruna Pekunden</h2>
            <p className="text-lg text-muted-foreground mb-8 text-pretty">
              Kami adalah komunitas pemuda yang berkomitmen untuk mengembangkan ekonomi lokal melalui platform digital.
              Setiap produk yang dijual merepresentasikan kreativitas dan dedikasi anggota komunitas kami.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="flex items-center gap-2 text-muted-foreground group transition-all duration-300 hover:scale-105">
                <MapPin className="w-5 h-5 text-primary transition-all duration-300 group-hover:scale-125" />
                <span>Pekunden, Indonesia</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground group transition-all duration-300 hover:scale-105">
                <Phone className="w-5 h-5 text-primary transition-all duration-300 group-hover:scale-125 group-hover:rotate-12" />
                <span>Hubungi via WhatsApp</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-foreground text-background">
        <div className="container mx-auto">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4 group">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
                <Users className="w-5 h-5 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold transition-colors duration-300 group-hover:text-primary">
                Karang Taruna Pekunden
              </h3>
            </div>
            <p className="text-background/80 mb-6">Platform marketplace digital untuk komunitas pemuda Pekunden</p>
            <p className="text-sm text-background/60">© 2024 Karang Taruna Pekunden. Semua hak dilindungi.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
