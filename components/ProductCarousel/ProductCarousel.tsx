"use client";

import { useEffect, useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react"
import { track } from "@vercel/analytics"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"
import type { CarouselApi } from "@/components/ui/carousel"

type Product = {
  _id: string
  name: string
  icon?: string
  description: string[]
}

type Category = {
  _id: string
  name: string
  products: Product[]
}

type ProductCarouselProps = {
  categories: Category[]
}

const ProductCarousel = ({ categories }: ProductCarouselProps) => {
  const [carouselApi, setCarouselApi] = useState<CarouselApi | undefined>(undefined)
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [slidesToShow, setSlidesToShow] = useState(3)

  useEffect(() => {
    if (!carouselApi) return

    const onSelect = (event: any) => {
      setCanScrollPrev(carouselApi.canScrollPrev())
      setCanScrollNext(carouselApi.canScrollNext())
      setCurrentIndex(carouselApi.selectedScrollSnap())

      // likely a swipe if no source
      if (!event?.source) {
        track('carousel_swipe', {
          category: categories[carouselApi.selectedScrollSnap()]?.name
        })
      }
    }

    carouselApi.on("select", onSelect)
    onSelect({})

    return () => {
      carouselApi.off("select", onSelect)
    }
  }, [carouselApi, categories])

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      if (width < 640) { // small breakpoint
        setSlidesToShow(1)
      } else if (width < 1024) { // large breakpoint
        setSlidesToShow(2)
      } else {
        setSlidesToShow(3)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handlePrev = () => {
    if (carouselApi) {
      carouselApi.scrollPrev()
      track('carousel_navigation', { direction: 'prev', category: categories[currentIndex]?.name })
    }
  }

  const handleNext = () => {
    if (carouselApi) {
      carouselApi.scrollNext()
      track('carousel_navigation', { direction: 'next', category: categories[currentIndex]?.name })
    }
  }

  if (!categories.length) {
    return <div>Loading...</div>
  }

  const isMiddleCategory = (index: number) => {
    if (slidesToShow === 1) return true;
    if (slidesToShow === 2) return index === currentIndex;

    const totalSlides = categories.length;
    const middleIndex = currentIndex % totalSlides;
    return index === middleIndex;
  }

  return (
    <div className="flex flex-col gap-y-6 w-full">
      <div className="flex items-center justify-center gap-16">
        <button
          aria-label="Previous Category"
          onClick={handlePrev}
          disabled={!canScrollPrev}
          className="rounded-full border p-2 bg-white shadow disabled:opacity-50"
        >
          <ChevronLeft className={`size-5 ${!canScrollPrev ? "opacity-50" : ""}`} />
        </button>
        <span className="text-lg font-semibold">Explore Accounts</span>
        <button
          aria-label="Next Category"
          onClick={handleNext}
          disabled={!canScrollNext}
          className="rounded-full border p-2 bg-white shadow disabled:opacity-50"
        >
          <ChevronRight className={`size-5 ${!canScrollNext ? "opacity-50" : ""}`} />
        </button>
      </div>
      <Carousel
        className="w-full"
        setApi={setCarouselApi}
        opts={{
          loop: true
        }}
      >
        <CarouselContent className="-ml-6">
          {categories.map((category, index) => (
            <CarouselItem key={category._id} className="pl-6 basis-full sm:basis-1/2 lg:basis-1/3">
              <Card className={`p-0 ${isMiddleCategory(index) ? 'h-full' : ''}`}>
                <CardContent className={`flex flex-col gap-y-4 items-center p-4 ${isMiddleCategory(index) ? 'h-full' : ''}`}>
                  <span className="font-bold text-lg text-center">
                    {category.name}
                  </span>
                  {isMiddleCategory(index) && (
                    <Accordion
                      type="single"
                      collapsible
                      className="w-full flex-1"
                      onValueChange={(value) => {

                        const action = value ? 'open' : 'close'
                        const productName = value || 'unknown'
                        track('product_accordion_interaction', {
                          action,
                          product: productName,
                          category: category.name
                        })
                      }}
                    >
                      {category.products.map((product) => (
                        <AccordionItem value={product.name} key={product._id} className="border-b">
                          <AccordionTrigger className="hover:no-underline">
                            {product.name}
                          </AccordionTrigger>
                          <AccordionContent className="pb-2">
                            <div className="flex items-start gap-3">
                              {product.icon ? (
                                <Image
                                  src={product.icon}
                                  alt={product.name}
                                  width={24}
                                  height={24}
                                  className="flex-0 mt-0.5"
                                />
                              ) : (
                                <ImageIcon className="size-6 text-primary mt-0.5" />
                              )}
                              <div className="text-sm text-muted-foreground flex flex-col gap-y-2">
                                <ul className="list-none list-inside flex flex-col gap-y-2">
                                  {product.description.map((description, index) => (
                                    <li key={index}>{description}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  )}
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  )
}

export default ProductCarousel;
