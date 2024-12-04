import { NextResponse } from "next/server";

import { auth } from "@/services/auth/auth";

export default auth(async function middleware(req) {
  const url = req.nextUrl.clone();

  // Ignorar solicitações para recursos estáticos e API
  const ignoredPaths = ["/_next", "/static", "/favicon.ico", "/api"];
  const isIgnored = ignoredPaths.some((path) => url.pathname.startsWith(path));
  const isStaticFile = /\.(.*)$/.test(url.pathname);
  const session = await auth();

  if (isIgnored || isStaticFile) {
    return NextResponse.next();
  }

  // Definir rotas protegidas e públicas
  const protectedPaths = ["/"];
  const publicPaths = ["/auth"];

  if (session && url.pathname === "/auth") {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // Ignorar rotas públicas
  const isPublicPath = publicPaths.some((path) =>
    url.pathname.startsWith(path)
  );
  if (isPublicPath) {
    return NextResponse.next();
  }

  // Verificar se é uma rota protegida
  const isProtectedPath = protectedPaths.some((path) =>
    url.pathname.startsWith(path)
  );
  if (!isProtectedPath) {
    return NextResponse.next();
  }

  if (!session) {
    // Redirecionar para /auth se o usuário não estiver autenticado
    url.pathname = "/auth";
    return NextResponse.redirect(url);
  }

  // Usuário autenticado, continuar
  return NextResponse.next();
});
