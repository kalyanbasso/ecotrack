"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Building2, Truck, LogOut, MapPin } from "lucide-react";
import { useSession, signOut } from "next-auth/react";

export default function Dashboard() {
  const session = useSession();
  const cards = [
    {
      title: "Lista de usuários",
      description: "Visualizar e gerenciar contas de usuários",
      icon: Users,
      link: "/users",
    },
    {
      title: "Empresas",
      description: "Visualizar e gerenciar empresas",
      icon: Building2,
      link: "/companies",
    },
    {
      title: "Veículos",
      description: "Visualizar e gerenciar veículos",
      icon: Truck,
      link: "/vehicles",
    },
    {
      title: "Pontos de coleta",
      description: "Visualizar e gerenciar pontos de coleta",
      icon: MapPin,
      link: "/collection-points",
    },
  ];

  return (
    <div className="min-h-screen bg-green-50 p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-green-800">Dashboard</h1>
        <div className="flex items-center space-x-4">
          <p className="text-green-700">Olá, {session.data?.user?.name}</p>
          <Button
            onClick={() => signOut()}
            variant="outline"
            className="bg-green-100 text-green-700 hover:bg-green-200 hover:text-green-800"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <Link href={card.link} key={index}>
            <Card className="bg-green-100 hover:bg-green-200 transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center text-green-800">
                  <card.icon className="mr-2 h-6 w-6" />
                  {card.title}
                </CardTitle>
                <CardDescription className="text-green-600">
                  {card.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-green-700">Clique para ver</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
