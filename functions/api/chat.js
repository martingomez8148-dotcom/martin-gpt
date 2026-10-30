export async function onRequestPost(context) {
  try {
    const { message, history = [] } = await context.request.json();

    if (!message || typeof message !== "string") {
      return Response.json({ error: "Escribí un mensaje." }, { status: 400 });
    }

    if (!context.env.OPENAI_API_KEY) {
      return Response.json({
        error: "Falta configurar la API de inteligencia artificial."
      }, { status: 500 });
    }

    const messages = [
      {
        role: "system",
        content: "Tu nombre es MARTIN GPT. Sos un asistente de inteligencia artificial útil, claro y amable. Respondé en español."
      },
      ...history.slice(-10),
      { role: "user", content: message }
    ];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${context.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: context.env.OPENAI_MODEL || "gpt-4.1-mini",
        messages,
        temperature: 0.7
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return Response.json({
        error: data.error?.message || "No se pudo obtener una respuesta."
      }, { status: response.status });
    }

    return Response.json({
      reply: data.choices?.[0]?.message?.content || "No recibí una respuesta."
    });
  } catch (error) {
    return Response.json({ error: "Ocurrió un error al procesar el mensaje." }, { status: 500 });
  }
}
