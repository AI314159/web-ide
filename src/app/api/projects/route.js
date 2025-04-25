import { prisma } from "@/lib/prisma";

export async function GET(request) {
  const userId = request.headers.get("user-id");
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const projects = await prisma.project.findMany({ where: { userId } });
  return Response.json(projects);
}

export async function POST(request) {
  const { name, userId } = await request.json();
  if (!userId || !name) return new Response("Bad Request", { status: 400 });

  const project = await prisma.project.create({
    data: { name, userId },
  });
  return Response.json(project);
}

export async function PUT(request) {
  const { id, code } = await request.json();
  if (!id || code === undefined) return new Response("Bad Request", { status: 400 });

  const project = await prisma.project.update({
    where: { id },
    data: { code },
  });
  return Response.json(project);
}
