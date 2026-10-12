export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json(
    { ok: true, service: "cofre-familiar-rc1" },
    { status: 200, headers: { "cache-control": "no-store" } },
  );
}
