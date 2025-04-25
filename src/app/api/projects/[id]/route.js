import { prisma } from "@/lib/prisma";

export async function GET(_request, { params }) {
  const { id } = await params;
  if (!id) return new Response("Bad Request", { status: 400 });

  const project = await prisma.project.findUnique({
    where: { id },
  });

  if (!project) return new Response("Not Found", { status: 404 });
  return Response.json(project);
}
