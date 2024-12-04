import { prisma } from "@/services/database";
import bcrypt from "bcryptjs";

export async function getUserFromDb(email: string, password: string) {
  try {
    // Encontre o usuário pelo email
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      return null; // Retorna null se o usuário não existir
    }

    // Compare a senha fornecida com o hash armazenado
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return null; // Retorna null se a senha for inválida
    }

    return user; // Retorna o usuário se tudo estiver correto
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}
