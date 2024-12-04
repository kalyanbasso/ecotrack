"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, MapPin, Plus, Trash2, X } from "lucide-react";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!;

interface CollectionPoint {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  createdAt: Date;
}

export default function CollectionPoints() {
  const [collectionPoints, setCollectionPoints] = useState<CollectionPoint[]>(
    []
  );
  const [selectedPoint, setSelectedPoint] = useState<CollectionPoint | null>(
    null
  );
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    if (selectedPoint && mapContainer.current) {
      if (map.current) map.current.remove();

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [selectedPoint.longitude, selectedPoint.latitude],
        zoom: 12,
      });

      marker.current = new mapboxgl.Marker()
        .setLngLat([selectedPoint.longitude, selectedPoint.latitude])
        .addTo(map.current);
    }
  }, [selectedPoint]);

  useEffect(() => {
    const fetchCollectionPoints = async () => {
      const response = await fetch("/api/collection-point");
      const data = await response.json();
      setCollectionPoints(data);
    };

    fetchCollectionPoints();
  }, []);

  const handleDelete = (id: number) => {
    setCollectionPoints(collectionPoints.filter((point) => point.id !== id));
    if (selectedPoint && selectedPoint.id === id) {
      setSelectedPoint(null);
    }
  };

  return (
    <div className="min-h-screen bg-green-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <Link href="/">
            <Button
              variant="outline"
              className="bg-green-100 text-green-700 hover:bg-green-200 hover:text-green-800"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
            </Button>
          </Link>
          <Link href="/collection-points/create">
            <Button className="bg-green-600 text-white hover:bg-green-700">
              <Plus className="mr-2 h-4 w-4" />
              Adicionar
            </Button>
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-green-800 mb-6">
          Pontos de coleta
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Latitude</TableHead>
                  <TableHead>Longitude</TableHead>
                  <TableHead>Criado em</TableHead>
                  <TableHead>Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {collectionPoints.map((point) => (
                  <TableRow key={point.id}>
                    <TableCell>{point.name}</TableCell>
                    <TableCell>{point.latitude.toFixed(4)}</TableCell>
                    <TableCell>{point.longitude.toFixed(4)}</TableCell>
                    <TableCell>
                      {format(point.createdAt, "dd/MM/yyyy")}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          className="text-blue-500 hover:text-blue-700 hover:bg-blue-100"
                          onClick={() => setSelectedPoint(point)}
                        >
                          <MapPin className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          className="text-red-500 hover:text-red-700 hover:bg-red-100"
                          onClick={() => handleDelete(point.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div>
            {selectedPoint ? (
              <Card className="bg-white shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-2xl font-bold text-green-800">
                    {selectedPoint.name}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedPoint(null)}
                    className="text-green-600 hover:text-green-800 hover:bg-green-100"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div ref={mapContainer} className="h-[400px] rounded-md" />
                  <div className="mt-4 text-sm text-green-600">
                    <p>Latitude: {selectedPoint.latitude.toFixed(4)}</p>
                    <p>Longitude: {selectedPoint.longitude.toFixed(4)}</p>
                    <p>
                      Criado em: {format(selectedPoint.createdAt, "dd/MM/yyyy")}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-white shadow-lg">
                <CardContent className="flex items-center justify-center h-[400px] text-green-600">
                  Selecione um ponto de coleta para visualizar no mapa.
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
