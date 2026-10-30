export async function onRequestGet() {
  return Response.json({
    status: "ok",
    app: "MARTIN GPT",
    message: "El servidor está funcionando correctamente."
  });
}
