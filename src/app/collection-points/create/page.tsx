"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "@/hooks/use-toast";

const collectionPointSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
});

type CollectionPointFormValues = z.infer<typeof collectionPointSchema>;

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!;

export default function RegisterCollectionPoint() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [lng, setLng] = useState(-52.6695642);
  const [lat, setLat] = useState(-27.0942151);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CollectionPointFormValues>({
    resolver: zodResolver(collectionPointSchema),
  });

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current!,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom: 12,
    });

    map.current.on("click", (e) => {
      if (marker.current) {
        marker.current.remove();
      }
      marker.current = new mapboxgl.Marker()
        .setLngLat([e.lngLat.lng, e.lngLat.lat])
        .addTo(map.current!);
      setLng(parseFloat(e.lngLat.lng.toFixed(4)));
      setLat(parseFloat(e.lngLat.lat.toFixed(4)));
    });
  }, [lng, lat]);

  const onSubmit = async (data: CollectionPointFormValues) => {
    try {
      const result = await fetch("/api/collection-point", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          latitude: lat,
          longitude: lng,
        }),
      });

      if (!result.ok) {
        throw new Error("Failed to add collection point");
      }
      toast({
        title: "Ponto de coleta adicionado com sucesso",
        description: "O ponto de coleta foi adicionado com sucesso",
      });
      window.location.href = "/collection-points";
    } catch {
      toast({
        title: "Erro ao adicionar ponto de coleta",
        description: "Tente novamente mais tarde",
      });
    } finally {
      marker.current?.remove();
      marker.current = null;
    }
  };

  return (
    <div className="min-h-screen bg-green-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/collection-points">
            <Button
              variant="outline"
              className="bg-green-100 text-green-700 hover:bg-green-200 hover:text-green-800"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
            </Button>
          </Link>
        </div>
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-green-800">
              Adicionar ponto de coleta
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="pointName" className="text-green-700">
                  Nome do ponto de coleta
                </Label>
                <Input
                  id="pointName"
                  {...register("name")}
                  className="border-green-300 focus:border-green-500 focus:ring-green-500"
                />
                {errors.name && (
                  <p className="text-red-600 text-sm flex items-center mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-green-700">Localização</Label>
                <div ref={mapContainer} className="h-[400px] rounded-md" />
                <p className="text-sm text-green-600">
                  Clique no mapa para selecionar a localização do ponto de
                  coleta
                </p>
                <p className="text-sm text-green-600">
                  Longitude: {lng} | Latitude: {lat}
                </p>
              </div>
              <Button
                type="submit"
                className="bg-green-600 text-white hover:bg-green-700"
              >
                {isSubmitting ? "Adicionando..." : "Adicionar ponto de coleta"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
