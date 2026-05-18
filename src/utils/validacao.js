// src/utils/validacao.js
//
// CORREÇÃO (SEGURANÇA + CLEAN CODE): Validações centralizadas.
// Antes: cada screen tinha sua própria validação inconsistente.
// Agora: funções puras e reutilizáveis.
//
// [BUG FIX] validarTrilha: comparação de nível corrigida.
//           Antes: niveisValidos.includes(nivel?.toLowerCase()) comparava
//           "fácil" contra ["Fácil", "Médio", "Difícil"] — nunca batia.
//           Agora: array normalizado para lowercase e sem acento,
//           alinhado com o valor salvo pelo FormTrilha (.toLowerCase()).

export function validarEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function validarTelefone(tel) {
  // Aceita formatos: (XX) 9XXXX-XXXX ou somente dígitos (10-11)
  const digits = tel.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 11;
}

export function validarReserva({ data, horario, pessoas }) {
  const erros = [];

  // Data: formato dd/mm/aaaa
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(data.trim())) {
    erros.push("Data inválida. Use o formato DD/MM/AAAA.");
  }

  // Horário: formato HH:MM
  if (!/^\d{2}:\d{2}$/.test(horario.trim())) {
    erros.push("Horário inválido. Use o formato HH:MM.");
  }

  // Pessoas: número entre 1 e 50
  const num = parseInt(pessoas, 10);
  if (isNaN(num) || num < 1 || num > 50) {
    erros.push("Número de pessoas deve ser entre 1 e 50.");
  }

  return erros;
}

export function validarTrilha({ nome, nivel, local, imagemURL }) {
  const erros = [];

  // ✅ BUG FIX: array em lowercase para bater com nivel?.trim().toLowerCase()
  // FormTrilha salva o nível como lowercase (ex: "facil", "medio", "dificil")
  const niveisValidos = ["facil", "fácil", "medio", "médio", "dificil", "difícil"];

  if (!nome || nome.trim().length < 3) {
    erros.push("Nome da trilha deve ter ao menos 3 caracteres.");
  }

  if (!nivel || !niveisValidos.includes(nivel.trim().toLowerCase())) {
    erros.push("Nível inválido. Use: Fácil, Médio ou Difícil.");
  }

  if (!local || local.trim().length < 3) {
    erros.push("Local deve ter ao menos 3 caracteres.");
  }

  if (imagemURL && !/^https?:\/\/.+/.test(imagemURL.trim())) {
    erros.push("URL da imagem inválida. Deve começar com http:// ou https://.");
  }

  return erros;
}