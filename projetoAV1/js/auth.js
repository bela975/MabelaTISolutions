(function () {
  const App = window.App;

  function initHomePage() {
    App.updateLoginLinkVisibility();
    const headerNote = document.querySelector("[data-home-note]");
    if (headerNote && localStorage.getItem("tiav1_loggedIn") === "true") {
      const userName = localStorage.getItem("tiav1_userName") || "Cliente";
      headerNote.textContent = `Acesso ativo para ${userName}.`;
    }
  }

  function initLoginPage() {
    const form = document.querySelector("#loginForm");
    if (!form) return;

    const email = form.querySelector("#loginEmail");
    const password = form.querySelector("#loginPassword");
    const feedback = form.querySelector("#loginFeedback");
    const submit = form.querySelector("#loginSubmit");
    const clearBtn = form.querySelector("#loginClear");

    const savedEmail = localStorage.getItem("tiav1_registeredEmail");
    if (savedEmail && !email.value) email.value = savedEmail;

    submit.addEventListener("click", () => {
      App.clearMessage(feedback);
      const emailValue = email.value.trim();
      const passwordValue = password.value;

      if (!emailValue) {
        App.showMessage(feedback, "O login deve ser preenchido.");
        email.focus();
        return;
      }
      if (!App.isValidEmail(emailValue)) {
        App.showMessage(feedback, "O login deve ter formato de e-mail válido.");
        email.focus();
        return;
      }
      if (!passwordValue) {
        App.showMessage(feedback, "A senha deve ser preenchida.");
        password.focus();
        return;
      }

      localStorage.setItem("tiav1_loggedIn", "true");
      localStorage.setItem("tiav1_userEmail", emailValue);
      localStorage.setItem(
        "tiav1_userName",
        localStorage.getItem("tiav1_registeredName") || "Cliente TI",
      );
      alert("Validação realizada com sucesso");
      location.href = "index.html";
    });

    clearBtn.addEventListener("click", () => {
      form.reset();
      App.clearMessage(feedback);
      email.focus();
    });
  }

  function initPasswordPage() {
    const form = document.querySelector("#passwordForm");
    if (!form) return;

    const email = form.querySelector("#passwordEmail");
    const password = form.querySelector("#passwordNew");
    const confirm = form.querySelector("#passwordConfirm");
    const feedback = form.querySelector("#passwordFeedback");
    const clearBtn = form.querySelector("#passwordClear");
    const ruleOutput = form.querySelector("#passwordRules");

    if (ruleOutput) {
      ruleOutput.value = App.buildPasswordRuleText();
    }

    form.querySelector("#passwordSubmit").addEventListener("click", () => {
      App.clearMessage(feedback);
      const emailValue = email.value.trim();
      const passwordValue = password.value;
      const confirmValue = confirm.value;

      if (!emailValue) {
        App.showMessage(feedback, "O login deve ser preenchido.");
        email.focus();
        return;
      }
      if (!App.isValidEmail(emailValue)) {
        App.showMessage(feedback, "O login deve ter formato de e-mail válido.");
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

      alert("Validação realizada com sucesso");
      App.goBackFallback("login.html");
    });

    clearBtn.addEventListener("click", () => {
      form.reset();
      App.clearMessage(feedback);
      email.focus();
    });
  }

  App.initHomePage = initHomePage;
  App.initLoginPage = initLoginPage;
  App.initPasswordPage = initPasswordPage;
})();
