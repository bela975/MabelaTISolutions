(function () {
  const App = (window.App = window.App || {});

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const PASSWORD_ALLOWED_SPECIALS = /[@#$%&*!?\/\\|\-_.=]/;
  const PASSWORD_FORBIDDEN_SPECIALS = /[{}\[\]¨̈´`~^:;<>,'"“‘’]/;
  const NAME_FORBIDDEN_SPECIALS = /[@#$%&*!?\/\\|\-_.=\[\]{}¨̈´`~^:;<>,'"“‘’]/;
  const PHONE_RE = /^\(?\d{2}\)?\s?(?:9?\d{4})-?\d{4}$/;

  function moneyBR(value) {
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  function formatDateBR(date) {
    return date.toLocaleDateString("pt-BR");
  }

  function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  function escapeDateForInput(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function showMessage(target, text, type = "error") {
    if (!target) return;
    target.textContent = text;
    target.classList.remove("is-error", "is-success");
    target.classList.add(type === "success" ? "is-success" : "is-error");
  }

  function clearMessage(target) {
    if (!target) return;
    target.textContent = "";
    target.classList.remove("is-error", "is-success");
  }

  function isValidEmail(email) {
    return EMAIL_RE.test(email.trim());
  }

  function buildPasswordRuleText() {
    return [
      "Regra de senha:",
      "• minimo de 6 caracteres;",
      "• pelo menos 1 numero;",
      "• pelo menos 1 letra maiuscula;",
      "• pelo menos 1 caractere especial permitido:",
      "  @ # $ % & * ! ? / \\ | - _ + . =",
      "• caracteres NAO permitidos:",
      "  ¨ ̈ { } [ ] ´ ` ~ ^ : ; < > , “ ‘",
    ].join("\n");
  }

  function isStrongPassword(password) {
    if (!password || password.length < 6) {
      return "A senha deve ter pelo menos 6 caracteres.";
    }
    if (!/[0-9]/.test(password)) {
      return "A senha deve conter pelo menos um numero.";
    }
    if (!/[A-ZÀ-ÖØ-Þ]/.test(password)) {
      return "A senha deve conter pelo menos uma letra maiuscula.";
    }
    if (!PASSWORD_ALLOWED_SPECIALS.test(password)) {
      return "A senha deve conter pelo menos um caractere especial permitido.";
    }
    if (PASSWORD_FORBIDDEN_SPECIALS.test(password)) {
      return "A senha contem caractere nao permitido.";
    }
    return "";
  }

  function hasForbiddenNameChars(name) {
    return NAME_FORBIDDEN_SPECIALS.test(name);
  }

  function isValidPhone(phone) {
    return PHONE_RE.test(phone);
  }

  function cpfOnlyDigits(value) {
    return value.replace(/\D/g, "").slice(0, 11);
  }

  function formatCPF(value) {
    const digits = cpfOnlyDigits(value);
    const parts = [];
    parts.push(digits.slice(0, 3));
    if (digits.length > 3) parts.push("." + digits.slice(3, 6));
    if (digits.length > 6) parts.push("." + digits.slice(6, 9));
    if (digits.length > 9) parts.push("-" + digits.slice(9, 11));
    return parts.join("");
  }

  function isValidCPF(value) {
    const cpf = cpfOnlyDigits(value);
    if (cpf.length !== 11) return false;
    if (/^(\d)\1+$/.test(cpf)) return false;

    const calcDigit = (base, factor) => {
      let sum = 0;
      for (let i = 0; i < base.length; i++) {
        sum += Number(base[i]) * (factor - i);
      }
      const mod = (sum * 10) % 11;
      return mod === 10 ? 0 : mod;
    };

    const digit1 = calcDigit(cpf.slice(0, 9), 10);
    const digit2 = calcDigit(cpf.slice(0, 10), 11);
    return digit1 === Number(cpf[9]) && digit2 === Number(cpf[10]);
  }

  function isAdult(dateValue) {
    if (!dateValue) return false;
    const birth = new Date(dateValue + "T00:00:00");
    if (Number.isNaN(birth.getTime())) return false;

    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age -= 1;
    }
    return age >= 18;
  }

  function updateLoginLinkVisibility() {
    const requestLinks = document.querySelectorAll('[data-requires-login="true"]');
    if (!requestLinks.length) return;
    const loggedIn = localStorage.getItem("tiav1_loggedIn") === "true";
    requestLinks.forEach((link) => {
      link.hidden = !loggedIn;
    });
  }

  function goBackFallback(fallbackUrl) {
    if (history.length > 1) {
      history.back();
      return;
    }
    location.href = fallbackUrl;
  }

  App.moneyBR = moneyBR;
  App.formatDateBR = formatDateBR;
  App.addDays = addDays;
  App.escapeDateForInput = escapeDateForInput;
  App.showMessage = showMessage;
  App.clearMessage = clearMessage;
  App.isValidEmail = isValidEmail;
  App.buildPasswordRuleText = buildPasswordRuleText;
  App.isStrongPassword = isStrongPassword;
  App.hasForbiddenNameChars = hasForbiddenNameChars;
  App.isValidPhone = isValidPhone;
  App.cpfOnlyDigits = cpfOnlyDigits;
  App.formatCPF = formatCPF;
  App.isValidCPF = isValidCPF;
  App.isAdult = isAdult;
  App.updateLoginLinkVisibility = updateLoginLinkVisibility;
  App.goBackFallback = goBackFallback;
})();
