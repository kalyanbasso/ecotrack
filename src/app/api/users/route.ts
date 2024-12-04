import { prisma } from "@/services/database";
import bcrypt from "bcryptjs";

import { NextResponse } from "next/server";

// Handler para criar um usuário
export async function POST(req: Request) {
  const { name, email, password } = await req.json();

  if (!name || !email) {
    return NextResponse.json(
      { error: "Name and email are required" },
      { status: 400 }
    );
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { name, email, password: hashPassword },
  });

  return NextResponse.json(user, { status: 201 });
}

// Handler para deletar um usuário
export async function DELETE(req: Request) {
  const { id } = await req.json();

  if (!id) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  await prisma.user.delete({
    where: { id },
  });

  return NextResponse.json({ message: "User deleted successfully" });
}

export async function GET() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  return NextResponse.json(users);
}
