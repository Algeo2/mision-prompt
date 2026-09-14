const questions = [
  {
    skill: "Claridad y especificidad",
    situation: "Una docente necesita una actividad para estudiantes de séptimo grado sobre clasificación de residuos.",
    options: [
      { id: "a", text: "Haz algo sobre reciclaje." },
      { id: "b", text: "Explícame qué es el reciclaje." },
      { id: "c", text: "Actúa como docente de ciencias. Diseña una actividad grupal de 20 minutos para grado séptimo sobre clasificación de residuos. Incluye objetivo, instrucciones, materiales y una pregunta de cierre." }
    ],
    correctId: "c",
    correctFeedback: "Este prompt incluye rol, contexto, tarea y formato. La IA sabe para quién crea, qué debe producir y cómo entregarlo.",
    incorrectFeedback: "Una petición general deja decisiones importantes a la IA. Faltan el nivel, el propósito, la duración y el formato esperado."
  },
  {
    skill: "Contexto del estudiante",
    situation: "Un profesor quiere ejemplos de ecuaciones cuadráticas adecuados para su grupo de grado décimo.",
    options: [
      { id: "a", text: "Escribe diez ecuaciones difíciles." },
      { id: "b", text: "Crea cinco ejercicios de ecuaciones cuadráticas para estudiantes de grado décimo que conocen factorización. Ordénalos de menor a mayor dificultad e incluye respuestas." },
      { id: "c", text: "Actúa como matemático y habla de ecuaciones." }
    ],
    correctId: "b",
    correctFeedback: "Especificar el grado y los conocimientos previos permite ajustar el vocabulario y la dificultad al grupo real.",
    incorrectFeedback: "Sin el nivel y los conocimientos previos, la respuesta puede resultar demasiado simple, avanzada o poco útil."
  },
  {
    skill: "Definición de rol",
    situation: "Una maestra prepara una explicación accesible sobre fotosíntesis y quiere que la IA adopte una perspectiva pedagógica.",
    options: [
      { id: "a", text: "Actúa como docente de ciencias naturales especializado en aprendizaje activo. Explica la fotosíntesis para grado sexto mediante una analogía cotidiana." },
      { id: "b", text: "Dame toda la información científica sobre fotosíntesis." },
      { id: "c", text: "¿Qué sabes de las plantas?" }
    ],
    correctId: "a",
    correctFeedback: "Asignar un rol relevante orienta el enfoque, el tono y el tipo de conocimientos que la IA debe priorizar.",
    incorrectFeedback: "El tema aparece, pero falta orientar a la IA hacia una explicación pedagógica apropiada para el grupo."
  },
  {
    skill: "Formato de salida",
    situation: "Un docente de historia necesita organizar los principales hechos de la Independencia de Colombia para proyectarlos en clase.",
    options: [
      { id: "a", text: "Resume la Independencia de Colombia de forma interesante." },
      { id: "b", text: "Enumera algunos hechos históricos importantes." },
      { id: "c", text: "Organiza cinco hechos clave de la Independencia de Colombia en una tabla con las columnas: fecha, acontecimiento, personaje y consecuencia. Usa frases breves." }
    ],
    correctId: "c",
    correctFeedback: "Definir columnas y extensión produce un resultado estructurado, consistente y listo para usar o revisar.",
    incorrectFeedback: "La solicitud menciona el contenido, pero no indica cómo organizarlo. Especificar el formato evita respuestas difíciles de aprovechar."
  },
  {
    skill: "Adaptación pedagógica",
    situation: "Una profesora de inglés quiere introducir vocabulario de alimentos a estudiantes de sexto con nivel A1.",
    options: [
      { id: "a", text: "Write an advanced essay about global food systems." },
      { id: "b", text: "Actúa como docente de inglés. Crea un diálogo de ocho líneas para estudiantes de grado sexto, nivel A1, que practique diez alimentos comunes al comprar en una tienda. Incluye traducción al final." },
      { id: "c", text: "Dime palabras de comida en inglés." }
    ],
    correctId: "b",
    correctFeedback: "El prompt adapta dificultad, vocabulario y extensión al nivel A1, además de situar el aprendizaje en un contexto cotidiano.",
    incorrectFeedback: "Nombrar el tema no garantiza que el resultado corresponda a la edad, el nivel de idioma ni el propósito de aprendizaje."
  },
  {
    skill: "Diseño de evaluación",
    situation: "Un docente de Tecnología necesita comprobar la comprensión sobre seguridad digital sin limitarse a preguntas de memoria.",
    options: [
      { id: "a", text: "Haz un examen de tecnología." },
      { id: "b", text: "Escribe preguntas sobre Internet con sus respuestas." },
      { id: "c", text: "Actúa como docente de Tecnología. Diseña una evaluación formativa de 15 minutos sobre seguridad digital para grado décimo: dos casos de decisión, tres preguntas de opción múltiple y una rúbrica breve. Señala respuestas y justificación." }
    ],
    correctId: "c",
    correctFeedback: "La instrucción alinea tema, tiempo, grado, tipos de evidencia y criterios de revisión; así la evaluación responde a un propósito claro.",
    incorrectFeedback: "Faltan el nivel, la duración, el tipo de preguntas y los criterios con los que se comprobará el aprendizaje."
  },
  {
    skill: "Verificación de información",
    situation: "La IA generó cifras y fechas para una presentación que un docente usará mañana con sus estudiantes. ¿Qué instrucción es más responsable?",
    options: [
      { id: "a", text: "Haz que las cifras suenen más convincentes y no menciones dudas." },
      { id: "b", text: "Identifica las afirmaciones verificables, indica qué fuentes confiables debería consultar y marca cualquier dato sobre el que no tengas certeza. No inventes referencias." },
      { id: "c", text: "Reescribe todo con tono académico para que parezca correcto." }
    ],
    correctId: "b",
    correctFeedback: "La IA puede equivocarse. Pedir señales de incertidumbre y luego contrastar con fuentes confiables protege la calidad del material.",
    incorrectFeedback: "Un tono seguro o académico no vuelve verdadero un dato. El docente debe verificar cifras, fechas, citas y fuentes antes de enseñar."
  },
  {
    skill: "Privacidad y protección de datos",
    situation: "Un profesor quiere pedirle a una IA ideas para apoyar a un estudiante con dificultades y tiene un informe que contiene datos personales.",
    options: [
      { id: "a", text: "Copia el informe completo, incluidos nombre, diagnóstico, teléfono y datos familiares, para recibir una recomendación personalizada." },
      { id: "b", text: "Sube una foto del estudiante y pregunta qué dificultad parece tener." },
      { id: "c", text: "Describe la necesidad de forma anónima y general, elimina datos identificables y consulta primero las políticas institucionales antes de usar la herramienta." }
    ],
    correctId: "c",
    correctFeedback: "La minimización y anonimización de datos reduce riesgos. La política institucional debe orientar qué herramientas y datos pueden utilizarse.",
    incorrectFeedback: "No se deben compartir con una IA nombres, diagnósticos, imágenes ni otros datos sensibles de estudiantes sin una base y autorización adecuadas."
  },
  {
    skill: "Mejora iterativa",
    situation: "La instrucción “Crea una actividad sobre cambio climático” produjo una propuesta demasiado extensa y avanzada. ¿Cómo conviene mejorarla?",
    options: [
      { id: "a", text: "Regenera hasta que salga algo bueno." },
      { id: "b", text: "Reduce la actividad anterior a 15 minutos, adáptala a grado octavo, usa materiales disponibles en el salón e incluye tres pasos y una pregunta de cierre." },
      { id: "c", text: "Hazla mejor y más fácil." }
    ],
    correctId: "b",
    correctFeedback: "Iterar consiste en señalar qué debe cambiar: duración, nivel, recursos y estructura. La retroalimentación concreta mejora la siguiente respuesta.",
    incorrectFeedback: "Pedir que sea “mejor” no aclara el problema. Conviene nombrar exactamente qué elementos deben ajustarse."
  },
  {
    skill: "Reto integrador · R + C + T + F",
    situation: "Una coordinadora quiere ayudar a docentes de distintas áreas a reconocer respuestas de IA que requieren revisión crítica.",
    options: [
      { id: "a", text: "Habla como experto en IA y da consejos para profesores." },
      { id: "b", text: "Actúa como formador docente en alfabetización digital. Para docentes de básica y media sin experiencia técnica, diseña una actividad colaborativa de 20 minutos para detectar sesgos, datos inventados y problemas de privacidad en respuestas de IA. Preséntala en una tabla con objetivo, pasos, ejemplo, preguntas de análisis y criterio de logro." },
      { id: "c", text: "Crea una actividad de IA con tabla y ejemplos." }
    ],
    correctId: "b",
    correctFeedback: "Integra los cuatro elementos: rol pertinente, contexto de los participantes, tarea precisa y formato verificable. También incorpora el uso crítico de la IA.",
    incorrectFeedback: "El reto final exige combinar rol, contexto, tarea y formato. Una instrucción parcial deja demasiadas decisiones sin definir."
  }
];

const elements = {
  welcome: document.querySelector("#welcome-screen"),
  quiz: document.querySelector("#quiz-screen"),
  results: document.querySelector("#results-screen"),
  start: document.querySelector("#start-button"),
  restart: document.querySelector("#restart-button"),
  next: document.querySelector("#next-button"),
  counter: document.querySelector("#question-counter"),
  skill: document.querySelector("#question-skill"),
  score: document.querySelector("#score"),
  progress: document.querySelector("#progress-bar"),
  progressTrack: document.querySelector(".progress-track"),
  title: document.querySelector("#question-title"),
  options: document.querySelector("#options"),
  feedback: document.querySelector("#feedback"),
  feedbackIcon: document.querySelector("#feedback-icon"),
  feedbackTitle: document.querySelector("#feedback-title"),
  feedbackText: document.querySelector("#feedback-text")
};

let gameQuestions = [];
let currentIndex = 0;
let score = 0;

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildRound() {
  const regularQuestions = shuffle(questions.slice(0, -1));
  const finalQuestion = questions.at(-1);
  return [...regularQuestions, finalQuestion].map(question => ({
    ...question,
    options: shuffle(question.options)
  }));
}

function showScreen(screen) {
  [elements.welcome, elements.quiz, elements.results].forEach(item => item.classList.add("hidden"));
  screen.classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function startGame() {
  gameQuestions = buildRound();
  currentIndex = 0;
  score = 0;
  elements.score.textContent = score;
  showScreen(elements.quiz);
  renderQuestion();
}

function renderQuestion() {
  const question = gameQuestions[currentIndex];
  const progress = Math.round(((currentIndex + 1) / gameQuestions.length) * 100);

  elements.counter.textContent = `Misión ${currentIndex + 1} de ${gameQuestions.length}`;
  elements.skill.textContent = question.skill;
  elements.title.textContent = question.situation;
  elements.progress.style.width = `${progress}%`;
  elements.progressTrack.setAttribute("aria-valuenow", String(progress));
  elements.options.replaceChildren();
  elements.feedback.className = "feedback hidden";
  elements.next.classList.add("hidden");

  question.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "option-button";
    button.dataset.optionId = option.id;
    button.innerHTML = `<span class="option-letter">${String.fromCharCode(65 + index)}</span><span>${option.text}</span>`;
    button.addEventListener("click", () => selectAnswer(option.id, button));
    elements.options.append(button);
  });
}

function selectAnswer(selectedId, selectedButton) {
  const question = gameQuestions[currentIndex];
  const isCorrect = selectedId === question.correctId;
  const buttons = [...elements.options.querySelectorAll("button")];

  buttons.forEach(button => {
    button.disabled = true;
    if (button.dataset.optionId === question.correctId) button.classList.add("correct");
  });

  if (isCorrect) {
    score += 1;
    elements.score.textContent = score;
  } else {
    selectedButton.classList.add("incorrect");
  }

  elements.feedback.className = `feedback ${isCorrect ? "correct" : "incorrect"}`;
  elements.feedbackIcon.innerHTML = `<span>${isCorrect ? "✓" : "!"}</span>`;
  elements.feedbackTitle.textContent = isCorrect ? "¡Correcto!" : "Revisemos esta respuesta";
  elements.feedbackText.textContent = isCorrect ? question.correctFeedback : question.incorrectFeedback;
  elements.next.textContent = currentIndex === gameQuestions.length - 1 ? "Ver resultado →" : "Siguiente misión →";
  elements.next.classList.remove("hidden");
  elements.next.focus();
}

function advanceGame() {
  currentIndex += 1;
  if (currentIndex < gameQuestions.length) renderQuestion();
  else showResults();
}

function showResults() {
  const percentage = Math.round((score / gameQuestions.length) * 100);
  let result;

  if (score <= 4) {
    result = { icon: "🌱", title: "Explorador de IA", label: "Explorador", message: "Estás comenzando tu viaje. Recuerda aportar contexto, objetivos claros e instrucciones específicas." };
  } else if (score <= 7) {
    result = { icon: "🤖", title: "Docente aumentado", label: "Docente aumentado", message: "Ya sabes comunicarte bastante bien con una IA. Un poco más de contexto y precisión llevará tus prompts al siguiente nivel." };
  } else {
    result = { icon: "🧠", title: "Maestro de Prompts", label: "Maestro de Prompts", message: "Excelente. Sabes estructurar instrucciones claras y usar la Inteligencia Artificial con criterio pedagógico." };
  }

  document.querySelector("#result-medal").textContent = result.icon;
  document.querySelector("#results-title").textContent = result.title;
  document.querySelector("#result-message").textContent = result.message;
  document.querySelector("#final-score").textContent = score;
  document.querySelector("#final-percentage").textContent = `${percentage}%`;
  document.querySelector("#correct-count").textContent = score;
  document.querySelector("#incorrect-count").textContent = gameQuestions.length - score;
  document.querySelector("#level-label").textContent = result.label;
  showScreen(elements.results);
  elements.restart.focus();
}

elements.start.addEventListener("click", startGame);
elements.restart.addEventListener("click", startGame);
elements.next.addEventListener("click", advanceGame);
document.querySelector(".brand").addEventListener("click", event => {
  event.preventDefault();
  showScreen(elements.welcome);
});
