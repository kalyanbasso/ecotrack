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
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "@/hooks/use-toast";

type Companies = {
  id: number;
  name: string;
  email: string;
  address: string;
  phoneNumber: string;
};

const companySchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  address: z.string().min(1, "Endereço é obrigatório"),
  phoneNumber: z
    .string()
    .min(10, "Telefone deve ter no mínimo 10 dígitos")
    .regex(/^\d+$/, "Telefone deve conter apenas números"),
});

type CompanyValues = z.infer<typeof companySchema>;

export default function CompanyListings() {
  const [companies, setCompanies] = useState<Companies[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CompanyValues>({
    resolver: zodResolver(companySchema),
  });

  const onSubmit = async (data: CompanyValues) => {
    const response = await fetch("/api/companies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const newCompany = await response.json();
      setCompanies([...companies, newCompany]);
      toast({
        title: "Sucesso",
        description: "Empresa adicionada com sucesso!",
      });
      setIsDialogOpen(false);
    } else {
      toast({ title: "Erro", description: "Falha ao adicionar empresa" });
    }
  };

  const handleRemoveCompany = async (id: number) => {
    const response = await fetch("/api/companies", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (response.ok) {
      setCompanies(companies.filter((company) => company.id !== id));
    } else {
      console.error("Failed to delete company");
    }
  };

  useEffect(() => {
    const fetchCompanies = async () => {
      const response = await fetch("/api/companies");
      const data = await response.json();
      setCompanies(data);
    };

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
                <Plus className="mr-2 h-4 w-4" />
                Adicionar
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-green-50">
              <DialogHeader>
                <DialogTitle className="text-green-800">
                  Adicionar nova empresa
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
                  <Label htmlFor="email" className="text-green-700">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    className="border-green-300 focus:border-green-500 focus:ring-green-500"
                  />
                  {errors.email && (
                    <p className="text-red-600 text-sm flex items-center mt-1">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="address" className="text-green-700">
                    Endereço
                  </Label>
                  <Input
                    id="address"
                    {...register("address")}
                    className="border-green-300 focus:border-green-500 focus:ring-green-500"
                  />
                  {errors.address && (
                    <p className="text-red-600 text-sm flex items-center mt-1">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.address.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="phoneNumber" className="text-green-700">
                    Telefone
                  </Label>
                  <Input
                    id="phoneNumber"
                    maxLength={11}
                    {...register("phoneNumber")}
                    className="border-green-300 focus:border-green-500 focus:ring-green-500"
                  />
                  {errors.phoneNumber && (
                    <p className="text-red-600 text-sm flex items-center mt-1">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.phoneNumber.message}
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
        <h1 className="text-3xl font-bold text-green-800 mb-6">Empresas</h1>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Endereço</TableHead>
              <TableHead className="w-[100px]">Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {companies.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phoneNumber}</TableCell>
                <TableCell>{user.address}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    onClick={() => handleRemoveCompany(user.id)}
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
