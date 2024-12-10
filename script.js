
// Função para decodificar entidades HTML
function decodeHTMLEntities(text) {
  const element = document.createElement('div');
  if (text) {
    element.innerHTML = text;
    return element.textContent || element.innerText;
  }
  return '';
}

// Função para escapar caracteres especiais para XML
function escapeXML(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// Função para gerar o GIFT
function generateGIFT(questionText, title = "Título da Questão") {
  const decodedText = decodeHTMLEntities(questionText);
  const lines = decodedText.split("\n").filter(line => line.trim() !== "");
  const question = lines[0]; // Primeira linha é o enunciado
  const alternatives = lines.slice(1); // Restante são as alternativas

  if (!question || alternatives.length === 0) {
    throw new Error("O enunciado ou as alternativas estão vazios.");
  }

  let gift = `::${title}::\n`;
  gift += question + " {\n";

  alternatives.forEach((alt) => {
    if (alt.startsWith("*")) {
      gift += `=${alt.slice(1).trim()}\n`; // Alternativa correta
    } else {
      gift += `~${alt.trim()}\n`; // Alternativas incorretas
    }
  });

  gift += "}";
  return gift;
}

// Função para gerar o XML Moodle
function generateXML(questionText, title = "Título da Questão") {
  const decodedText = decodeHTMLEntities(questionText);
  const lines = decodedText.split("\n").filter(line => line.trim() !== "");
  const question = lines[0]; // Primeira linha é o enunciado
  const alternatives = lines.slice(1); // Restante são as alternativas

  if (!question || alternatives.length === 0) {
    throw new Error("O enunciado ou as alternativas estão vazios.");
  }

  let xml = `<question type="multichoice">
  <name>
    <text>${escapeXML(title)}</text>
  </name>
  <questiontext format="html">
    <text>${escapeXML(question)}</text>
  </questiontext>`;

  alternatives.forEach((alt) => {
    const isCorrect = alt.startsWith("*");
    const text = alt.slice(isCorrect ? 1 : 0).trim();

    xml += `
  <answer fraction="${isCorrect ? 100 : 0}">
    <text>${escapeXML(text)}</text>
    <feedback>
      <text>${isCorrect ? "Correto!" : "Resposta incorreta."}</text>
    </feedback>
  </answer>`;
  });

  xml += `
</question>`;
  return xml;
}

// Exemplo de entrada do texto com entidades HTML
const questionText = `Qual &eacute; a capital do Brasil?
1. S&atilde;o Paulo
*2. Bras&iacute;lia
3. Rio de Janeiro
4. Belo Horizonte`;

// Função para exportar para GIFT e XML
function exportQuestion() {
  try {
    const giftOutput = generateGIFT(questionText, "Capital do Brasil");
    const xmlOutput = generateXML(questionText, "Capital do Brasil");

    console.log("Exportação para GIFT:");
    console.log(giftOutput);
    console.log("\nExportação para XML Moodle:");
    console.log(xmlOutput);
  } catch (error) {
    console.error("Erro ao gerar exportações:", error.message);
  }
}

// Chamada da função para gerar as exportações
exportQuestion();

// resultado.html 
 // Função para obter os dados da URL
 function getQueryParams() {
  const params = {};
  const queryString = window.location.search.substring(1);
  const regex = /([^&=]+)=([^&]*)/g;
  let m;
  while (m = regex.exec(queryString)) {
      params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
  }
  return params;
}

// Função para exibir os dados
function displayResults() {
  const params = getQueryParams();
  document.getElementById("giftOutput").textContent = params.gift || "Nenhum dado GIFT disponível.";
  document.getElementById("xmlOutput").textContent = params.xml || "Nenhum dado XML disponível.";
}

// Chama a função para exibir os resultados
displayResults();