export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isStrongPassword(password) {
  if (!password || password.length < 6) return "A senha deve ter pelo menos 6 caracteres.";
  if (!/[0-9]/.test(password)) return "A senha deve conter pelo menos um número.";
  if (!/[A-ZÀ-ÖØ-Þ]/.test(password)) return "A senha deve conter pelo menos uma letra maiúscula.";
  if (!/[@#$%&*!?\/\\|\-_.=]/.test(password)) {
    return "A senha deve conter pelo menos um caractere especial permitido.";
  }
  return "";
}

export function isAdult(dateValue) {
  if (!dateValue) return false;

  const birth = new Date(`${dateValue}T00:00:00`);
  const today = new Date();

  let age = today.getFullYear() - birth.getFullYear();
  const month = today.getMonth() - birth.getMonth();

  if (month < 0 || (month === 0 && today.getDate() < birth.getDate())) {
    age -= 1;
  }

  return age >= 18;
}

export function formatMoney(value) {
  return Number(value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function formatDateBR(dateValue) {
  if (!dateValue) return "";
  const cleanDate = String(dateValue).split("T")[0];
  return new Date(`${cleanDate}T00:00:00`).toLocaleDateString("pt-BR");
}

export function addDays(dateValue, days) {
  const date = new Date(`${dateValue}T00:00:00`);
  date.setDate(date.getDate() + Number(days));
  return date.toISOString().split("T")[0];
}