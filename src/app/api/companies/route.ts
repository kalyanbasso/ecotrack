import { prisma } from "@/services/database";

import { NextResponse } from "next/server";

// Handler para criar uma empresa
export async function POST(req: Request) {
  const { name, email, address, phoneNumber } = await req.json();

  if (!name || !email) {
    return NextResponse.json(
      { error: "Name and email are required" },
      { status: 400 }
    );
  }

  const company = await prisma.company.create({
    data: { name, email, address, phoneNumber },
  });

  return NextResponse.json(company, { status: 201 });
}

// Handler para deletar uma empresa
export async function DELETE(req: Request) {
  const { id } = await req.json();

  if (!id) {
    return NextResponse.json(
      { error: "Company ID is required" },
      { status: 400 }
    );
  }

  const vehicle = await prisma.vehicle.findFirst({
    where: { companyId: id },
  });

  if (vehicle) {
    return NextResponse.json(
      { error: "Empresa com veículos cadastrados" },
      { status: 401 }
    );
  }

  await prisma.company.delete({
    where: { id },
  });

  return NextResponse.json({ message: "Company deleted successfully" });
}

export async function GET() {
  const users = await prisma.company.findMany();

  return NextResponse.json(users);
}
