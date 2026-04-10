(function () {
  const App = window.App;

  function initRegisterPage() {
    const form = document.querySelector("#registerForm");
    if (!form) return;

    const email = form.querySelector("#registerEmail");
    const password = form.querySelector("#registerPassword");
    const confirm = form.querySelector("#registerConfirm");
    const name = form.querySelector("#registerName");
    const cpf = form.querySelector("#registerCPF");
    const birth = form.querySelector("#registerBirth");
    const phone = form.querySelector("#registerPhone");
    const feedback = form.querySelector("#registerFeedback");
    const clearBtn = form.querySelector("#registerClear");
    const ruleOutput = form.querySelector("#registerRules");
    const submit = form.querySelector("#registerSubmit");
    const backBtn = form.querySelector("#registerBack");

    if (ruleOutput) {
      ruleOutput.value = App.buildPasswordRuleText();
    }

    cpf.addEventListener("input", () => {
      cpf.value = App.formatCPF(cpf.value);
    });

    submit.addEventListener("click", () => {
      App.clearMessage(feedback);
      const emailValue = email.value.trim();
      const passwordValue = password.value;
      const confirmValue = confirm.value;
      const nameValue = name.value.trim();
      const cpfValue = cpf.value.trim();
      const birthValue = birth.value;
      const phoneValue = phone.value.trim();

      if (!emailValue) {
        App.showMessage(feedback, "O e-mail deve ser preenchido.");
        email.focus();
        return;
      }
      if (!App.isValidEmail(emailValue)) {
        App.showMessage(feedback, "O e-mail deve ter formato válido.");
        email.focus();
        return;
      }
      if (!passwordValue) {
        App.showMessage(feedback, "A senha deve ser preenchida.");
        password.focus();
        return;
      }
      if (!confirmValue) {
        App.showMessage(feedback, "A confirmação de senha deve ser preenchida.");
        confirm.focus();
        return;
      }
      const passwordRuleMessage = App.isStrongPassword(passwordValue);
      if (passwordRuleMessage) {
        App.showMessage(feedback, passwordRuleMessage);
        password.focus();
        return;
      }
      if (passwordValue !== confirmValue) {
        App.showMessage(feedback, "A confirmação de senha deve ser igual à senha informada.");
        confirm.focus();
        return;
      }
      if (!nameValue) {
        App.showMessage(feedback, "O nome deve ser preenchido.");
        name.focus();
        return;
      }
      if (App.hasForbiddenNameChars(nameValue)) {
        App.showMessage(feedback, "O nome não pode conter caracteres especiais.");
        name.focus();
        return;
      }
      const words = nameValue.split(/\s+/).filter(Boolean);
      if (words.length < 2) {
        App.showMessage(feedback, "O nome deve ter pelo menos duas palavras.");
        name.focus();
        return;
      }
      if (words[0].length < 2) {
        App.showMessage(feedback, "A primeira palavra do nome deve ter pelo menos 2 caracteres.");
        name.focus();
        return;
      }
      if (!cpfValue) {
        App.showMessage(feedback, "O CPF deve ser preenchido.");
        cpf.focus();
        return;
      }
      if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(cpfValue)) {
        App.showMessage(feedback, "O CPF deve estar no formato NNN.NNN.NNN-NN.");
        cpf.focus();
        return;
      }
      if (!App.isValidCPF(cpfValue)) {
        App.showMessage(feedback, "O CPF informado é inválido.");
        cpf.focus();
        return;
      }
      if (!birthValue) {
        App.showMessage(feedback, "A data de nascimento deve ser preenchida.");
        birth.focus();
        return;
      }
      if (!App.isAdult(birthValue)) {
        App.showMessage(feedback, "O cliente deve ser maior de idade.");
        birth.focus();
        return;
      }
      if (phoneValue && !App.isValidPhone(phoneValue)) {
        App.showMessage(feedback, "O telefone/zap deve ter formato nacional válido.");
        phone.focus();
        return;
      }

      localStorage.setItem("tiav1_registeredEmail", emailValue);
      localStorage.setItem("tiav1_registeredName", nameValue);
      alert("Validação realizada com sucesso");
    });

    clearBtn.addEventListener("click", () => {
      form.reset();
      App.clearMessage(feedback);
      cpf.value = "";
      email.focus();
    });

    backBtn.addEventListener("click", () => {
      App.goBackFallback("index.html");
    });
  }

  App.initRegisterPage = initRegisterPage;
})();
