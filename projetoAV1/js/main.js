(function () {
  const App = window.App;

  document.addEventListener("DOMContentLoaded", () => {
    App.updateLoginLinkVisibility();
    const page = document.body.dataset.page;

    if (page === "home" && typeof App.initHomePage === "function") App.initHomePage();
    if (page === "login" && typeof App.initLoginPage === "function") App.initLoginPage();
    if (page === "password" && typeof App.initPasswordPage === "function") App.initPasswordPage();
    if (page === "register" && typeof App.initRegisterPage === "function") App.initRegisterPage();
    if (page === "cart" && typeof App.initCartPage === "function") App.initCartPage();
  });
})();
