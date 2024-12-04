import { prisma } from "@/services/database";

import { NextResponse } from "next/server";

// Handler para criar um veículo
export async function POST(req: Request) {
  const { name, registrationNumber, capacity, companyId } = await req.json();

  if (!name || !registrationNumber || !capacity || !companyId) {
    return NextResponse.json(
      {
        error:
          "All fields (name, registrationNumber, capacity, companyId) are required",
      },
      { status: 400 }
    );
  }

  const company = await prisma.vehicle.create({
    data: { name, registrationNumber, capacity, companyId },
  });

  return NextResponse.json(company, { status: 201 });
}

// Handler para deletar um veículo
export async function DELETE(req: Request) {
  const { id } = await req.json();

  if (!id) {
    return NextResponse.json(
      { error: "Vehicle ID is required" },
      { status: 400 }
    );
  }

  await prisma.vehicle.delete({
    where: { id },
  });

  return NextResponse.json({ message: "Vehicle deleted successfully" });
}

export async function GET() {
  const vehiclesWithCompanyName = await prisma.vehicle.findMany({
    include: {
      company: {
        select: {
          name: true, // Inclui apenas o campo `name` da empresa
        },
      },
    },
  });

  // Retorne o resultado em JSON
  return NextResponse.json(vehiclesWithCompanyName);
}
