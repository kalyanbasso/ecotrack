"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, ArrowLeft, Plus, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/hooks/use-toast";

type Vehicle = {
  id: number;
  name: string;
  registrationNumber: string;
  capacity: number;
  companyId: string;
  company: {
    name: string;
  };
};

type Companies = {
  id: number;
  name: string;
  email: string;
  address: string;
  phoneNumber: string;
};

const vehicleSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  registrationNumber: z.string().min(1, "Placa é obrigatória"),
  capacity: z.number().min(1, "Capacidade é obrigatória"),
  companyId: z.string().min(1, "Empresa é obrigatória"),
});

type VehicleValues = z.infer<typeof vehicleSchema>;

export default function UserListings() {
  const [vehicles, setVehicle] = useState<Vehicle[]>([]);
  const [companies, setCompanies] = useState<Companies[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<VehicleValues>({
    resolver: zodResolver(vehicleSchema),
  });

  const onSubmit = async (data: VehicleValues) => {
    const response = await fetch("/api/vehicles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const createdVehicle = await response.json();
      setVehicle([...vehicles, createdVehicle]);
      toast({
        title: "Sucesso",
        description: "Veículo adicionado com sucesso!",
      });
      setIsDialogOpen(false);
    } else {
      toast({ title: "Erro", description: "Falha ao adicionar veículo" });
    }
  };

  const handleRemoveVehicle = async (id: number) => {
    const response = await fetch("/api/vehicles", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (response.ok) {
      setVehicle(vehicles.filter((vehicle) => vehicle.id !== id));
    } else {
      console.error("Failed to delete vehicle");
    }
  };

  useEffect(() => {
    const fetchVehicle = async () => {
      const response = await fetch("/api/vehicles");
      const data = await response.json();
      setVehicle(data);
    };

    const fetchCompanies = async () => {
      const response = await fetch("/api/companies");
      const data = await response.json();
      setCompanies(data);
    };

    fetchVehicle();
    fetchCompanies();
  }, []);

  return (
    <div className="min-h-screen bg-green-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Link href="/">
            <Button
              variant="outline"
              className="bg-green-100 text-green-700 hover:bg-green-200 hover:text-green-800"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
            </Button>
          </Link>
          <Dialog open={isDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => setIsDialogOpen(true)}
                className="bg-green-600 text-white hover:bg-green-700"
              >
                <Plus className="mr-2 h-4 w-4" /> Adicionar
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-green-50">
              <DialogHeader>
                <DialogTitle className="text-green-800">
                  Adicionar novo veículo
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-green-700">
                    Nome
                  </Label>
                  <Input
                    id="name"
                    {...register("name")}
                    className="border-green-300 focus:border-green-500 focus:ring-green-500"
                  />
                  {errors.name && (
                    <p className="text-red-600 text-sm flex items-center mt-1">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label
                    htmlFor="registrationNumber"
                    className="text-green-700"
                  >
                    Placa
                  </Label>
                  <Input
                    id="registrationNumber"
                    {...register("registrationNumber")}
                    className="border-green-300 focus:border-green-500 focus:ring-green-500"
                  />
                  {errors.registrationNumber && (
                    <p className="text-red-600 text-sm flex items-center mt-1">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.registrationNumber.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="capacity" className="text-green-700">
                    Capacidade
                  </Label>
                  <Input
                    id="capacity"
                    type="number"
                    {...register("capacity", { valueAsNumber: true })}
                    className="border-green-300 focus:border-green-500 focus:ring-green-500"
                  />
                  {errors.capacity && (
                    <p className="text-red-600 text-sm flex items-center mt-1">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.capacity.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company" className="text-green-700">
                    Company
                  </Label>
                  <Controller
                    name="companyId"
                    control={control}
                    defaultValue="" // Ajuste o valor padrão conforme necessário
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange} // Atualiza o valor no react-hook-form
                        value={field.value} // Define o valor controlado
                      >
                        <SelectTrigger className="border-green-300 focus:border-green-500 focus:ring-green-500">
                          <SelectValue placeholder="Select a company" />
                        </SelectTrigger>
                        <SelectContent>
                          {companies.map((company) => (
                            <SelectItem
                              key={company.id}
                              value={company.id.toString()}
                            >
                              {company.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.companyId && (
                    <p className="text-red-600 text-sm flex items-center mt-1">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.companyId.message}
                    </p>
                  )}
                </div>
                <Button
                  type="submit"
                  className="bg-green-600 text-white hover:bg-green-700"
                >
                  Adicionar
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <h1 className="text-3xl font-bold text-green-800 mb-6">Veículos</h1>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Placa</TableHead>
              <TableHead>Capacidade</TableHead>
              <TableHead>Empresa</TableHead>
              <TableHead className="w-[100px]">Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vehicles.map((vehicle) => (
              <TableRow key={vehicle.id}>
                <TableCell>{vehicle.name}</TableCell>
                <TableCell>{vehicle.registrationNumber}</TableCell>
                <TableCell>{vehicle.capacity}</TableCell>
                <TableCell>{vehicle.company.name}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    onClick={() => handleRemoveVehicle(vehicle.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
