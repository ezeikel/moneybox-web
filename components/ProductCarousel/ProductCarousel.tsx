"use client";

import { useEffect, useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react"
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
import { CATEGORIES } from "@/constants"
import type { CarouselApi } from "@/components/ui/carousel"

const ProductCarousel = () => {
  const [carouselApi, setCarouselApi] = useState<CarouselApi | undefined>(undefined)
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(true)

  useEffect(() => {
    if (!carouselApi) return

    const onSelect = () => {
      setCanScrollPrev(carouselApi.canScrollPrev())
      setCanScrollNext(carouselApi.canScrollNext())
    }

    carouselApi.on("select", onSelect)
    onSelect()

    return () => {
      carouselApi.off("select", onSelect)
    }
  }, [carouselApi])

  const handlePrev = () => {
    if (carouselApi) {
      carouselApi.scrollPrev()
    }
  }

  const handleNext = () => {
    if (carouselApi) {
      carouselApi.scrollNext()
    }
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
      <Carousel className="w-full" setApi={setCarouselApi}>
        <CarouselContent className="-ml-6">
          {CATEGORIES.map((category) => (
            <CarouselItem key={category.id} className="pl-6 basis-full sm:basis-1/2 lg:basis-1/3">
              <Card className="h-full p-0">
                <CardContent className="flex flex-col gap-y-4 items-center p-4 h-full">
                  <span className="font-bold text-lg text-center">
                    {category.name}
                  </span>
                  <Accordion type="single" collapsible className="w-full flex-1">
                    {category.products.map((product) => (
                      <AccordionItem value={product.name} key={product.id} className="border-b">
                        <AccordionTrigger className="hover:no-underline">
                          {product.name}
                        </AccordionTrigger>
                        <AccordionContent className="pb-2">
                          <div className="flex items-start gap-3">
                            {product.icon ? <Image src={product.icon} alt={product.name} width={24} height={24} className="flex-0 mt-0.5" /> : <ImageIcon className="size-6 text-primary mt-0.5" />}
                            <div className="text-sm text-muted-foreground flex flex-col gap-y-2">
                              <ul className="list-disc list-inside">
                                {product.description.map((description) => (
                                  <li key={description}>{description}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
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
