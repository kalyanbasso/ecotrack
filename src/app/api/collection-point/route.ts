import { prisma } from "@/services/database";

import { NextResponse } from "next/server";

// Handler para criar um ponto de coleta
export async function POST(req: Request) {
  const { name, latitude, longitude } = await req.json();
  if (!name || !latitude || !longitude) {
    return NextResponse.json(
      {
        error: "All fields (name, latitude, longitude) are required",
      },
      { status: 400 }
    );
  }

  const company = await prisma.collectionPoint.create({
    data: { name, latitude, longitude },
  });

  return NextResponse.json(company, { status: 201 });
}

// Handler para deletar um veículo
export async function DELETE(req: Request) {
  const { id } = await req.json();

  if (!id) {
    return NextResponse.json(
      { error: "Collection Point ID is required" },
      { status: 400 }
    );
  }

  await prisma.collectionPoint.delete({
    where: { id },
  });

  return NextResponse.json({
    message: "Collection Point deleted successfully",
  });
}

export async function GET() {
  const users = await prisma.collectionPoint.findMany();

  return NextResponse.json(users);
}
