const chatBox = document.getElementById("chat-box");

function printMessage(sender, message) {
  const div = document.createElement("div");
  div.className = sender;
  div.innerText = (sender === 'user' ? '👤' : '🔮') + ' ' + message;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function handleInput() {
  const input = document.getElementById("user-input");
  const text = input.value.trim();
  if (!text) return;

  printMessage("user", text);
  input.value = "";

  const nlpText = nlp(text.toLowerCase());
  let responded = false;

  if (nlpText.has("hola") || nlpText.has("buenas")) {
    respond("Saludos, noble alma. ¿Qué buscas en esta tierra maldita?");
    responded = true;

  } else if (nlpText.has("quién eres") || nlpText.has("quien sos") || nlpText.has("qué sos")) {
    respond("Soy Oraculum, sabio entre las sombras, testigo del tiempo y la ruina.");
    responded = true;

  } else if (nlpText.has("hora")) {
    const hour = new Date().getHours();
    const minutes = new Date().getMinutes().toString().padStart(2, "0");
    respond(`Las campanas han marcado la hora ${hour}:${minutes}... El destino se acerca.`);
    responded = true;

  } else if (nlpText.has("clima") || nlpText.has("tiempo")) {
    getWeather();
    responded = true;

  } else if (nlpText.has("consejo") || nlpText.has("frase") || nlpText.has("sabiduría")) {
    getAdvice();
    responded = true;

  } else if (nlpText.has("ayuda") || nlpText.has("necesito")) {
    respond("Todo aquel que clama por auxilio carga ya una cruz invisible... ¿qué te aflige?");
    responded = true;

  } else if (nlpText.has("adiós") || nlpText.has("chau") || nlpText.has("hasta luego")) {
    respond("Que los vientos te sean propicios, viajero.");
    responded = true;

  } else if (nlpText.questions().out('array').length > 0) {
    respond("Tu pregunta resuena en los ecos del abismo... pero la respuesta aún es niebla.");
    responded = true;
  }

  if (!responded) {
    respond("No comprendo tu lengua, viajero... Sé más claro o pregunta por 'hora', 'clima' o 'consejo'.");
  }
}

function respond(text) {
  setTimeout(() => printMessage("bot", text), 500);
}

async function getAdvice() {
  try {
    const res = await fetch("https://api.adviceslip.com/advice");
    const data = await res.json();
    respond(`He consultado las estrellas... y ellas dicen: "${data.slip.advice}"`);
  } catch {
    respond("Los vientos no han traído consejo esta vez...");
  }
}

async function getWeather() {
  if (!navigator.geolocation) {
    respond("No puedo ver el clima sin tu posición en este mundo...");
    return;
  }

  navigator.geolocation.getCurrentPosition(async (position) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    try {
      const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
      const data = await res.json();
      const temp = data.current_weather.temperature;
      const wind = data.current_weather.windspeed;
      respond(`En tus tierras hace ${temp}°C, y el viento sopla a ${wind} km/h. El cielo murmura secretos.`);
    } catch {
      respond("El clima se oculta tras un velo de errores...");
    }
  }, () => {
    respond("No puedo ver el clima sin tu ubicación, viajero.");
  });
}
