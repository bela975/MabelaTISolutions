(function () {
  const App = window.App;

  const SERVICES = [
    { id: "cloud", label: "Implantação em nuvem", price: 980, days: 3 },
    { id: "support", label: "Suporte remoto premium", price: 180, days: 1 },
    { id: "security", label: "Auditoria de segurança", price: 1450, days: 5 },
    { id: "backup", label: "Backup gerenciado", price: 420, days: 2 },
    { id: "dev", label: "Pequenas evoluções em software", price: 760, days: 4 },
  ];

  function createRequestRow(request, onDelete) {
    const tr = document.createElement("tr");
    tr.dataset.requestId = request.id;
    tr.innerHTML = `
      <td>${request.orderDateBR}</td>
      <td>${request.number}</td>
      <td>${request.serviceLabel}</td>
      <td>${request.status}</td>
      <td>${request.priceBR}</td>
      <td>${request.forecastDateBR}</td>
      <td><button type="button" class="btn btn-danger btn-delete-request">Excluir</button></td>
    `;
    tr.querySelector(".btn-delete-request").addEventListener("click", () => onDelete(request.id));
    return tr;
  }

  function initCartPage() {
    const page = document.querySelector("#cartPage");
    if (!page) return;

    const userNameLabel = page.querySelector("#loggedUserName");
    const userEmailLabel = page.querySelector("#loggedUserEmail");
    const select = page.querySelector("#serviceSelect");
    const priceLabel = page.querySelector("#servicePrice");
    const timeLabel = page.querySelector("#serviceTime");
    const forecastLabel = page.querySelector("#serviceForecast");
    const statusLabel = page.querySelector("#serviceStatus");
    const addBtn = page.querySelector("#serviceAdd");
    const tableBody = page.querySelector("#requestsBody");

    const loggedName =
      localStorage.getItem("tiav1_userName") ||
      localStorage.getItem("tiav1_registeredName") ||
      "Cliente TI";
    const loggedEmail =
      localStorage.getItem("tiav1_userEmail") ||
      localStorage.getItem("tiav1_registeredEmail") ||
      "cliente@empresa.com";

    if (userNameLabel) userNameLabel.textContent = loggedName;
    if (userEmailLabel) userEmailLabel.textContent = loggedEmail;

    const requests = [
      { id: 1, orderDate: "2026-01-10", number: 101, service: "backup", status: "Concluída" },
      { id: 2, orderDate: "2026-01-18", number: 102, service: "support", status: "Em andamento" },
      { id: 3, orderDate: "2026-02-02", number: 103, service: "cloud", status: "Aguardando início" },
    ];

    let nextId = 4;
    let nextNumber = 104;

    function getService(serviceId) {
      return SERVICES.find((item) => item.id === serviceId) || SERVICES[0];
    }

    function updateServicePreview() {
      const service = getService(select.value);
      const today = new Date();
      priceLabel.textContent = App.moneyBR(service.price);
      timeLabel.textContent = `${service.days} ${service.days === 1 ? "dia útil" : "dias úteis"}`;
      forecastLabel.textContent = App.formatDateBR(App.addDays(today, service.days));
      statusLabel.textContent = "EM ELABORAÇÃO";
    }

    function renderTable() {
      tableBody.innerHTML = "";
      const sorted = [...requests].sort((a, b) => new Date(a.orderDate) - new Date(b.orderDate));
      sorted.forEach((request) => {
        const service = getService(request.service);
        const orderDate = new Date(request.orderDate + "T00:00:00");
        const row = createRequestRow(
          {
            id: request.id,
            orderDateBR: App.formatDateBR(orderDate),
            number: request.number,
            serviceLabel: service.label,
            status: request.status,
            priceBR: App.moneyBR(service.price),
            forecastDateBR: App.formatDateBR(App.addDays(orderDate, service.days)),
          },
          deleteRequest,
        );
        tableBody.appendChild(row);
      });
    }

    function deleteRequest(id) {
      const index = requests.findIndex((item) => item.id === id);
      if (index >= 0) {
        requests.splice(index, 1);
        renderTable();
      }
    }

    select.innerHTML = SERVICES.map(
      (service) => `<option value="${service.id}">${service.label}</option>`,
    ).join("");
    select.value = SERVICES[0].id;
    updateServicePreview();
    renderTable();

    select.addEventListener("change", updateServicePreview);

    addBtn.addEventListener("click", () => {
      const service = getService(select.value);
      const today = new Date();
      requests.push({
        id: nextId++,
        orderDate: App.escapeDateForInput(today),
        number: nextNumber++,
        service: service.id,
        status: "EM ELABORAÇÃO",
      });
      renderTable();
      updateServicePreview();
    });
  }

  App.initCartPage = initCartPage;
})();
