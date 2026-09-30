
    const loginPage = document.getElementById("loginPage");
    const dashboardPage = document.getElementById("dashboardPage");
    const loginForm = document.getElementById("loginForm");
    const loginError = document.getElementById("loginError");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const rememberMe = document.getElementById("rememberMe");
    const navDashboard = document.getElementById("navDashboard");
    const navInventory = document.getElementById("navInventory");
    const navShipments = document.getElementById("navShipments");
    const navCustomers = document.getElementById("navCustomers");
    const breadcrumbText = document.getElementById("breadcrumbText");
    const dashboardMainContent = document.getElementById("dashboardMainContent");
    const tableTitle = document.getElementById("tableTitle");
    const tableHeaders = document.getElementById("tableHeaders");
    const tableBody = document.getElementById("tableBody");
    const panelActions = document.getElementById("panelActions");
    const moduleToolbar = document.getElementById("moduleToolbar");

    const loginCardView = document.getElementById("loginCardView");
    const registerCardView = document.getElementById("registerCardView");
    const showRegisterLink = document.getElementById("showRegisterLink");
    const showLoginLink = document.getElementById("showLoginLink");
    const registerForm = document.getElementById("registerForm");
    const regCompany = document.getElementById("regCompany");
    const regUsername = document.getElementById("regUsername");
    const regPassword = document.getElementById("regPassword");
    const registerError = document.getElementById("registerError");
    const forgotPasswordModal = document.getElementById("forgotPasswordModal");
    const forgotPasswordLink = document.getElementById("forgotPasswordLink");
    const closeForgotPassword = document.getElementById("closeForgotPassword");
    const forgotPasswordForm = document.getElementById("forgotPasswordForm");
    const resetEmail = document.getElementById("resetEmail");
    const resetOtp = document.getElementById("resetOtp");
    const newPassword = document.getElementById("newPassword");
    const confirmPassword = document.getElementById("confirmPassword");
    const forgotPasswordStepEmail = document.getElementById("forgotPasswordStepEmail");
    const forgotPasswordStepOtp = document.getElementById("forgotPasswordStepOtp");
    const forgotPasswordStepNew = document.getElementById("forgotPasswordStepNew");
    const verifyOtpBtn = document.getElementById("verifyOtpBtn");
    const backToEmailStep = document.getElementById("backToEmailStep");
    const backToOtpStep = document.getElementById("backToOtpStep");

    let currentRole = "Admin";
    let currentView = "dashboard";
    let currentUser = "admin";
    let selectedInventoryId = null;
    let selectedShipmentId = null;
    let selectedCustomerId = null;

    const STORAGE_KEYS = {
      inventory: "coaltrack_inventory",
      shipments: "coaltrack_shipments",
      customers: "coaltrack_customers",
      forgotPassword: "coaltrack_forgot_password"
    };

    const defaultInventory = [
      { id: "INV-1001", itemName: "Anthracite Grade A", location: "Korba Yard", quantity: "18,500 Tons", status: "Healthy", lastUpdated: "2 min ago" },
      { id: "INV-1002", itemName: "Bituminous Grade B", location: "Nagpur Route", quantity: "12,340 Tons", status: "Healthy", lastUpdated: "15 min ago" },
      { id: "INV-1003", itemName: "Lignite Premium", location: "Bina Depot", quantity: "9,120 Tons", status: "Low Stock", lastUpdated: "35 min ago" },
      { id: "INV-1004", itemName: "Coking Coal Supreme", location: "Raigarh Plant", quantity: "7,900 Tons", status: "Critical", lastUpdated: "8 min ago" },
      { id: "INV-1005", itemName: "Steam Coal Industrial", location: "Durg Terminal", quantity: "6,480 Tons", status: "Low Stock", lastUpdated: "42 min ago" }
    ];

    const defaultShipments = [
      { id: "SHIP-901", shipmentId: "SHIP-901", source: "Korba Mine", destination: "Nagpur Terminal", quantity: "1,250 Tons", dispatchDate: "2026-09-15", deliveryDate: "2026-09-20", status: "In Transit" },
      { id: "SHIP-902", shipmentId: "SHIP-902", source: "Raigarh Yard", destination: "Bhilai Plant", quantity: "980 Tons", dispatchDate: "2026-09-12", deliveryDate: "2026-09-18", status: "Delayed" },
      { id: "SHIP-903", shipmentId: "SHIP-903", source: "Bilaspur Depot", destination: "Durg Hub", quantity: "1,450 Tons", dispatchDate: "2026-09-10", deliveryDate: "2026-09-17", status: "Delivered" },
      { id: "SHIP-904", shipmentId: "SHIP-904", source: "Wardha Route", destination: "Jamshedpur Foundry", quantity: "860 Tons", dispatchDate: "2026-09-19", deliveryDate: "2026-09-26", status: "Pending" }
    ];

    const defaultCustomers = [
      { id: "CUST-101", customerName: "Riya Sharma", companyName: "Apex Steel Corp", email: "riya@apexsteel.com", phoneNumber: "+91 98765 43210", address: "Bhilai, Chhattisgarh", status: "Active", username: "apex" },
      { id: "CUST-102", customerName: "Naman Verma", companyName: "Kalyani Coalworks", email: "naman@kalyani.co", phoneNumber: "+91 91234 56789", address: "Raigarh, Chhattisgarh", status: "Pending", username: "kalyani" },
      { id: "CUST-103", customerName: "Aisha Khan", companyName: "Green Mines Ltd.", email: "aisha@greenmines.in", phoneNumber: "+91 99881 11222", address: "Nagpur, Maharashtra", status: "Active", username: "green" }
    ];

    const credentials = {
      admin: { password: "admin123", role: "Admin", email: "admin@coaltrack.com" },
      manager: { password: "manager123", role: "Manager", email: "manager@coaltrack.com" },
      customer: { password: "customer123", role: "Customer", email: "customer@coaltrack.com" }
    };

    const dashboardData = {
      Admin: {
        stats: [
          { label: "Total Customers", value: "1,248", icon: "fa-solid fa-users", accent: "orange" },
          { label: "Total Orders", value: "3,842", icon: "fa-solid fa-file-invoice", accent: "blue" },
          { label: "Total Shipments", value: "1,964", icon: "fa-solid fa-truck-fast", accent: "green" },
          { label: "Coal Inventory", value: "52,400 Tons", icon: "fa-solid fa-cubes", accent: "orange" }
        ],
        activities: [
          "New coal order approved from Jindal Steel",
          "Shipment #CS-2094 reached warehouse in Korba",
          "Inventory updated for Anthracite grade",
          "Customer payment received from Green Mines"
        ],
        tableTitle: "Inventory Overview",
        rows: [
          ["Anthracite", "Korba Yard", "18,500 Tons", "Healthy", "2 min ago"],
          ["Bituminous", "Nagpur Route", "12,340 Tons", "In Transit", "15 min ago"],
          ["Lignite", "Bina Depot", "9,120 Tons", "Low Stock", "35 min ago"],
          ["Coking Coal", "Raigarh Plant", "7,900 Tons", "Critical", "8 min ago"],
          ["Semi-Coking", "Bilaspur Depot", "14,200 Tons", "Healthy", "21 min ago"]
        ]
      },
      Manager: {
        stats: [
          { label: "Orders", value: "1,132", icon: "fa-solid fa-bag-shopping", accent: "orange" },
          { label: "Inventory", value: "21,480 Tons", icon: "fa-solid fa-boxes-stacked", accent: "blue" },
          { label: "Shipments", value: "864", icon: "fa-solid fa-shipping-fast", accent: "green" },
          { label: "Reports", value: "39", icon: "fa-solid fa-chart-pie", accent: "orange" }
        ],
        activities: [
          "Dispatch schedule updated for East branch",
          "Two trucks delayed due to weather alerts",
          "Inventory reconciliation completed",
          "Weekly transport report shared with ops team"
        ],
        tableTitle: "Shipment Monitoring",
        rows: [
          ["Coal Lot 301", "Raigarh", "1,220 Tons", "On Time", "8 min ago"],
          ["Coal Lot 402", "Bilaspur", "980 Tons", "Delayed", "19 min ago"],
          ["Coal Lot 515", "Korba", "1,540 Tons", "In Transit", "31 min ago"]
        ]
      },
      Customer: {
        stats: [
          { label: "My Orders", value: "24", icon: "fa-solid fa-bag-shopping", accent: "orange" },
          { label: "My Shipments", value: "9", icon: "fa-solid fa-truck", accent: "blue" },
          { label: "Delivery Status", value: "6 On Time", icon: "fa-solid fa-truck-ramp-box", accent: "green" },
          { label: "Notifications", value: "3", icon: "fa-solid fa-bell", accent: "orange" }
        ],
        activities: [
          "Order #C-188 approved and scheduled",
          "Shipment #S-076 is in transit",
          "Your delivery window is updated",
          "New support message from logistics team"
        ],
        tableTitle: "My Orders",
        rows: [
          ["Grade A Coal", "Raigarh Plant", "800 Tons", "Dispatched", "2 hours ago"],
          ["Grade B Coal", "Bina Depot", "620 Tons", "Pending", "4 hours ago"],
          ["Grade C Coal", "Korba Yard", "450 Tons", "Delivered", "Yesterday"]
        ]
      }
    };

    let inventoryData = JSON.parse(localStorage.getItem(STORAGE_KEYS.inventory) || "null") || defaultInventory;
    let shipmentData = JSON.parse(localStorage.getItem(STORAGE_KEYS.shipments) || "null") || defaultShipments;
    let customerData = JSON.parse(localStorage.getItem(STORAGE_KEYS.customers) || "null") || defaultCustomers;

    function saveInventoryData() {
      localStorage.setItem(STORAGE_KEYS.inventory, JSON.stringify(inventoryData));
    }

    function saveShipmentData() {
      localStorage.setItem(STORAGE_KEYS.shipments, JSON.stringify(shipmentData));
    }

    function saveCustomerData() {
      localStorage.setItem(STORAGE_KEYS.customers, JSON.stringify(customerData));
    }

    function ensureUserAccount(username, password, role, email) {
      credentials[username] = { password, role, email: email || credentials[username]?.email || `${username}@coaltrack.local` };
    }

    function setActiveNav(target) {
      [navDashboard, navInventory, navShipments, navCustomers].forEach((item) => {
        if (!item) return;
        item.classList.toggle("active", item === target);
      });
    }

    function formatDisplayDate(dateValue) {
      if (!dateValue) return "—";
      const date = new Date(dateValue);
      if (Number.isNaN(date.getTime())) return dateValue;
      return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
    }

    function statusBadge(status) {
      const normalized = (status || "").toLowerCase();
      const base = "status-tag";
      if (normalized.includes("healthy") || normalized.includes("active") || normalized.includes("delivered")) {
        return `${base} ${normalized.includes("delivered") ? "" : ""}`;
      }
      if (normalized.includes("delay") || normalized.includes("critical") || normalized.includes("pending")) {
        return `${base}`;
      }
      if (normalized.includes("low") || normalized.includes("in transit") || normalized.includes("reserved")) {
        return `${base}`;
      }
      return base;
    }

    function getSelectedEntity(module) {
      if (module === "inventory") return inventoryData.find((item) => item.id === selectedInventoryId) || null;
      if (module === "shipments") return shipmentData.find((item) => item.id === selectedShipmentId) || null;
      if (module === "customers") return customerData.find((item) => item.id === selectedCustomerId) || null;
      return null;
    }

    function setSelection(module, id) {
      if (module === "inventory") {
        selectedInventoryId = id;
      } else if (module === "shipments") {
        selectedShipmentId = id;
      } else if (module === "customers") {
        selectedCustomerId = id;
      }
      document.querySelectorAll(".module-row").forEach((row) => {
        const shouldSelect = row.dataset.id === id;
        row.classList.toggle("selected", shouldSelect);
      });
    }

    function openForgotPasswordModal() {
      if (forgotPasswordModal) {
        forgotPasswordModal.classList.add("visible");
        forgotPasswordModal.setAttribute("aria-hidden", "false");
        showForgotPasswordStep("email");
      }
    }

    function closeForgotPasswordModal() {
      if (forgotPasswordModal) {
        forgotPasswordModal.classList.remove("visible");
        forgotPasswordModal.setAttribute("aria-hidden", "true");
      }
      if (forgotPasswordForm) forgotPasswordForm.reset();
      showForgotPasswordStep("email");
    }

    function showForgotPasswordStep(step) {
      const map = {
        email: forgotPasswordStepEmail,
        otp: forgotPasswordStepOtp,
        new: forgotPasswordStepNew
      };
      Object.entries(map).forEach(([key, node]) => {
        if (!node) return;
        node.classList.toggle("visible", key === step);
      });
    }

    function generateOtp() {
      return String(Math.floor(100000 + Math.random() * 900000));
    }

    function saveForgotPasswordState(payload) {
      localStorage.setItem(STORAGE_KEYS.forgotPassword, JSON.stringify(payload));
    }

    function getForgotPasswordState() {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.forgotPassword) || "null") || {};
    }

    function resetPasswordFlow() {
      const email = (resetEmail.value || "").trim();
      const otp = generateOtp();
      saveForgotPasswordState({ email, otp, verified: false, passwordReset: false });
      alert(`OTP sent to ${email}. Demo OTP: ${otp}`);
      showForgotPasswordStep("otp");
      resetOtp.focus();
    }

    function renderModuleToolbar(module) {
      if (!moduleToolbar || !panelActions) return;
      const isAdmin = currentRole === "Admin";
      const isManager = currentRole === "Manager";
      const isCustomer = currentRole === "Customer";

      if (module === "inventory") {
        const selectedItem = getSelectedEntity("inventory");
        panelActions.innerHTML = isAdmin
          ? `
            <button type="button" class="mini-btn" data-role="add" data-module="inventory">Add Inventory</button>
            <button type="button" class="mini-btn" data-role="edit" data-module="inventory" ${selectedItem ? "" : "disabled"}>Edit Inventory</button>
            <button type="button" class="mini-btn danger-btn" data-role="delete" data-module="inventory" ${selectedItem ? "" : "disabled"}>Delete Inventory</button>
          `
          : '<button type="button" class="mini-btn" disabled>View Only</button>';

        const locations = [...new Set(inventoryData.map((item) => item.location))];
        moduleToolbar.style.display = "flex";
        moduleToolbar.innerHTML = `
          <div class="toolbar-fields">
            <input id="inventorySearch" class="search-field" type="text" placeholder="Search Inventory" />
            <select id="inventoryStatusFilter" class="filter-select">
              <option value="All">All Status</option>
              <option value="Healthy">Healthy</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Critical">Critical</option>
              <option value="In Transit">In Transit</option>
            </select>
            <select id="inventoryLocationFilter" class="filter-select">
              <option value="All">All Locations</option>
              ${locations.map((location) => `<option value="${location}">${location}</option>`).join("")}
            </select>
          </div>
        `;
      } else if (module === "shipments") {
        const selectedItem = getSelectedEntity("shipments");
        panelActions.innerHTML = isAdmin || currentRole === "Manager"
          ? `
            <button type="button" class="mini-btn" data-role="add" data-module="shipments" ${!isAdmin ? "disabled" : ""}>Create Shipment</button>
            <button type="button" class="mini-btn" data-role="edit" data-module="shipments" ${selectedItem && isAdmin ? "" : "disabled"}>Edit Shipment</button>
            <button type="button" class="mini-btn danger-btn" data-role="delete" data-module="shipments" ${selectedItem && isAdmin ? "" : "disabled"}>Delete Shipment</button>
          `
          : '<button type="button" class="mini-btn" disabled>View Only</button>';

        moduleToolbar.style.display = "flex";
        moduleToolbar.innerHTML = `
          <div class="toolbar-fields">
            <input id="shipmentSearch" class="search-field" type="text" placeholder="Search Shipment" />
          </div>
        `;
      } else if (module === "customers") {
        const selectedItem = getSelectedEntity("customers");
        panelActions.innerHTML = isAdmin
          ? `
            <button type="button" class="mini-btn" data-role="add" data-module="customers">Add Customer</button>
            <button type="button" class="mini-btn" data-role="edit" data-module="customers" ${selectedItem ? "" : "disabled"}>Edit Customer</button>
            <button type="button" class="mini-btn danger-btn" data-role="delete" data-module="customers" ${selectedItem ? "" : "disabled"}>Delete Customer</button>
          `
          : '<button type="button" class="mini-btn" disabled>View Only</button>';

        moduleToolbar.style.display = "flex";
        moduleToolbar.innerHTML = `
          <div class="toolbar-fields">
            <input id="customerSearch" class="search-field" type="text" placeholder="Search Customer" />
          </div>
        `;
      } else {
        panelActions.innerHTML = '<button class="mini-btn">View All</button>';
        moduleToolbar.style.display = "none";
        moduleToolbar.innerHTML = "";
      }

      bindModuleActionButtons();
    }

    function renderInventoryTable() {
      const search = (document.getElementById("inventorySearch") || { value: "" }).value.trim().toLowerCase();
      const filterStatus = (document.getElementById("inventoryStatusFilter") || { value: "All" }).value;
      const filterLocation = (document.getElementById("inventoryLocationFilter") || { value: "All" }).value;

      const filtered = inventoryData.filter((item) => {
        const matchesText = !search || [item.itemName, item.location, item.quantity, item.status].join(" ").toLowerCase().includes(search);
        const matchesStatus = filterStatus === "All" || item.status === filterStatus;
        const matchesLocation = filterLocation === "All" || item.location === filterLocation;
        return matchesText && matchesStatus && matchesLocation;
      });

      if (tableHeaders) {
        tableHeaders.innerHTML = `
          <th>Item Name</th>
          <th>Location</th>
          <th>Quantity</th>
          <th>Status</th>
          <th>Last Updated</th>
        `;
      }

      if (tableTitle) tableTitle.textContent = "Inventory Management";
      if (tableBody) {
        tableBody.innerHTML = filtered.map((item) => `
          <tr class="module-row ${selectedInventoryId === item.id ? "selected" : ""}" data-id="${item.id}" data-module="inventory">
            <td>${item.itemName}</td>
            <td>${item.location}</td>
            <td>${item.quantity}</td>
            <td><span class="status-tag">${item.status}</span></td>
            <td>${item.lastUpdated}</td>
          </tr>
        `).join("") || '<tr><td colspan="5" style="text-align:center; padding: 1.5rem; color:#94a3b8;">No inventory items match your filters.</td></tr>';
      }

      bindModuleSelectionHandlers();
    }

    function renderShipmentTable() {
      const search = (document.getElementById("shipmentSearch") || { value: "" }).value.trim().toLowerCase();
      const filtered = shipmentData.filter((item) => {
        const matchesText = !search || [item.shipmentId, item.source, item.destination, item.status, item.quantity].join(" ").toLowerCase().includes(search);
        return matchesText;
      });

      if (tableHeaders) {
        tableHeaders.innerHTML = `
          <th>Shipment ID</th>
          <th>Source</th>
          <th>Destination</th>
          <th>Quantity</th>
          <th>Dispatch Date</th>
          <th>Delivery Date</th>
          <th>Status</th>
        `;
      }

      if (tableTitle) tableTitle.textContent = "Shipment Management";
      if (tableBody) {
        tableBody.innerHTML = filtered.map((item) => `
          <tr class="module-row ${selectedShipmentId === item.id ? "selected" : ""}" data-id="${item.id}" data-module="shipments">
            <td>${item.shipmentId}</td>
            <td>${item.source}</td>
            <td>${item.destination}</td>
            <td>${item.quantity}</td>
            <td>${formatDisplayDate(item.dispatchDate)}</td>
            <td>${formatDisplayDate(item.deliveryDate)}</td>
            <td><span class="status-tag">${item.status}</span></td>
          </tr>
        `).join("") || '<tr><td colspan="7" style="text-align:center; padding: 1.5rem; color:#94a3b8;">No shipments match your search.</td></tr>';
      }

      bindModuleSelectionHandlers();
    }

    function renderCustomerTable() {
      const search = (document.getElementById("customerSearch") || { value: "" }).value.trim().toLowerCase();
      let filtered = [];

      if (currentRole === "Customer") {
        const currentCustomer = customerData.find((customer) => customer.username === currentUser) || customerData[0];
        filtered = currentCustomer ? [currentCustomer] : [];
      } else if (currentRole === "Manager") {
        filtered = customerData;
      } else {
        filtered = customerData.filter((customer) => {
          if (!search) return true;
          return [customer.customerName, customer.companyName, customer.email, customer.phoneNumber].join(" ").toLowerCase().includes(search);
        });
      }

      if (currentRole === "Customer" && search) {
        filtered = filtered.filter((customer) => [customer.customerName, customer.companyName, customer.email].join(" ").toLowerCase().includes(search));
      }

      if (tableHeaders) {
        tableHeaders.innerHTML = `
          <th>Customer Name</th>
          <th>Company Name</th>
          <th>Email</th>
          <th>Phone Number</th>
          <th>Address</th>
          <th>Status</th>
        `;
      }

      if (tableTitle) tableTitle.textContent = currentRole === "Customer" ? "My Customer Information" : "Customer Management";
      if (tableBody) {
        tableBody.innerHTML = filtered.map((customer) => `
          <tr class="module-row ${selectedCustomerId === customer.id ? "selected" : ""}" data-id="${customer.id}" data-module="customers">
            <td>${customer.customerName}</td>
            <td>${customer.companyName}</td>
            <td>${customer.email}</td>
            <td>${customer.phoneNumber}</td>
            <td>${customer.address}</td>
            <td><span class="status-tag">${customer.status}</span></td>
          </tr>
        `).join("") || '<tr><td colspan="6" style="text-align:center; padding: 1.5rem; color:#94a3b8;">No customer records found.</td></tr>';
      }

      bindModuleSelectionHandlers();
    }

    function bindModuleSelectionHandlers() {
      document.querySelectorAll(".module-row").forEach((row) => {
        row.addEventListener("click", () => {
          const module = row.dataset.module;
          const id = row.dataset.id;
          if (module === "inventory") setSelection("inventory", id);
          if (module === "shipments") setSelection("shipments", id);
          if (module === "customers") setSelection("customers", id);
          renderModuleToolbar(module);
        });
      });
    }

    function bindModuleActionButtons() {
      document.querySelectorAll("[data-role]").forEach((button) => {
        button.addEventListener("click", () => {
          const { module, role } = button.dataset;
          if (role === "add") openEntityModal(module);
          if (role === "edit") {
            const item = getSelectedEntity(module);
            if (item) openEntityModal(module, item);
          }
          if (role === "delete") {
            const item = getSelectedEntity(module);
            if (!item) return;
            const label = module === "inventory" ? item.itemName : module === "shipments" ? item.shipmentId : item.companyName;
            if (window.confirm(`Are you sure you want to delete ${label}?`)) {
              if (module === "inventory") {
                inventoryData = inventoryData.filter((entry) => entry.id !== item.id);
                saveInventoryData();
                selectedInventoryId = null;
                renderInventoryModule();
              } else if (module === "shipments") {
                shipmentData = shipmentData.filter((entry) => entry.id !== item.id);
                saveShipmentData();
                selectedShipmentId = null;
                renderShipmentModule();
              } else {
                customerData = customerData.filter((entry) => entry.id !== item.id);
                saveCustomerData();
                selectedCustomerId = null;
                renderCustomerModule();
              }
            }
          }
        });
      });
    }

    function openEntityModal(module, item = null) {
      const form = document.getElementById("entityForm");
      const modal = document.getElementById("entityModal");
      const title = document.getElementById("entityModalTitle");
      const fieldContainer = document.getElementById("entityFormFields");

      if (!form || !modal || !title || !fieldContainer) return;

      form.dataset.module = module;
      form.dataset.editId = item ? item.id : "";

      let fields = "";
      if (module === "inventory") {
        title.textContent = item ? "Edit Inventory Item" : "Add Inventory Item";
        fields = `
          <div class="form-row">
            <div class="field-block"><label>Item Name</label><input class="form-field" name="itemName" value="${item?.itemName || ""}" required /></div>
            <div class="field-block"><label>Location</label><input class="form-field" name="location" value="${item?.location || ""}" required /></div>
          </div>
          <div class="form-row">
            <div class="field-block"><label>Quantity</label><input class="form-field" name="quantity" value="${item?.quantity || ""}" required /></div>
            <div class="field-block"><label>Status</label><select class="form-field" name="status"><option value="Healthy" ${item?.status === "Healthy" ? "selected" : ""}>Healthy</option><option value="Low Stock" ${item?.status === "Low Stock" ? "selected" : ""}>Low Stock</option><option value="Critical" ${item?.status === "Critical" ? "selected" : ""}>Critical</option><option value="In Transit" ${item?.status === "In Transit" ? "selected" : ""}>In Transit</option></select></div>
          </div>
          <div class="field-block"><label>Last Updated</label><input class="form-field" name="lastUpdated" value="${item?.lastUpdated || "Just now"}" required /></div>
        `;
      }

      if (module === "shipments") {
        title.textContent = item ? "Edit Shipment" : "Create Shipment";
        fields = `
          <div class="form-row">
            <div class="field-block"><label>Shipment ID</label><input class="form-field" name="shipmentId" value="${item?.shipmentId || ""}" required /></div>
            <div class="field-block"><label>Quantity</label><input class="form-field" name="quantity" value="${item?.quantity || ""}" required /></div>
          </div>
          <div class="form-row">
            <div class="field-block"><label>Source</label><input class="form-field" name="source" value="${item?.source || ""}" required /></div>
            <div class="field-block"><label>Destination</label><input class="form-field" name="destination" value="${item?.destination || ""}" required /></div>
          </div>
          <div class="form-row">
            <div class="field-block"><label>Dispatch Date</label><input class="form-field" name="dispatchDate" type="date" value="${item?.dispatchDate || ""}" required /></div>
            <div class="field-block"><label>Delivery Date</label><input class="form-field" name="deliveryDate" type="date" value="${item?.deliveryDate || ""}" required /></div>
          </div>
          <div class="field-block"><label>Status</label><select class="form-field" name="status"><option value="Pending" ${item?.status === "Pending" ? "selected" : ""}>Pending</option><option value="In Transit" ${item?.status === "In Transit" ? "selected" : ""}>In Transit</option><option value="Delayed" ${item?.status === "Delayed" ? "selected" : ""}>Delayed</option><option value="Delivered" ${item?.status === "Delivered" ? "selected" : ""}>Delivered</option></select></div>
        `;
      }

      if (module === "customers") {
        title.textContent = item ? "Edit Customer" : "Add Customer";
        fields = `
          <div class="form-row">
            <div class="field-block"><label>Customer Name</label><input class="form-field" name="customerName" value="${item?.customerName || ""}" required /></div>
            <div class="field-block"><label>Company Name</label><input class="form-field" name="companyName" value="${item?.companyName || ""}" required /></div>
          </div>
          <div class="form-row">
            <div class="field-block"><label>Email</label><input class="form-field" name="email" type="email" value="${item?.email || ""}" required /></div>
            <div class="field-block"><label>Phone Number</label><input class="form-field" name="phoneNumber" value="${item?.phoneNumber || ""}" required /></div>
          </div>
          <div class="field-block"><label>Address</label><textarea class="textarea-field" name="address" rows="3" required>${item?.address || ""}</textarea></div>
          <div class="field-block"><label>Status</label><select class="form-field" name="status"><option value="Active" ${item?.status === "Active" ? "selected" : ""}>Active</option><option value="Pending" ${item?.status === "Pending" ? "selected" : ""}>Pending</option><option value="Inactive" ${item?.status === "Inactive" ? "selected" : ""}>Inactive</option></select></div>
        `;
      }

      fieldContainer.innerHTML = fields;
      modal.classList.add("visible");
    }

    function closeEntityModal() {
      const modal = document.getElementById("entityModal");
      if (modal) modal.classList.remove("visible");
    }

    function saveEntityForm(event) {
      event.preventDefault();
      const form = event.currentTarget;
      const module = form.dataset.module;
      const serialized = Object.fromEntries(new FormData(form).entries());

      if (module === "inventory") {
        const index = inventoryData.findIndex((item) => item.id === form.dataset.editId);
        const entry = {
          id: form.dataset.editId || `INV-${Date.now()}`,
          itemName: serialized.itemName.trim(),
          location: serialized.location.trim(),
          quantity: serialized.quantity.trim(),
          status: serialized.status,
          lastUpdated: serialized.lastUpdated.trim() || "Just now"
        };
        if (index >= 0) inventoryData[index] = entry;
        else inventoryData.unshift(entry);
        saveInventoryData();
        selectedInventoryId = entry.id;
        renderInventoryModule();
      }

      if (module === "shipments") {
        const index = shipmentData.findIndex((item) => item.id === form.dataset.editId);
        const entry = {
          id: form.dataset.editId || `SHIP-${Date.now()}`,
          shipmentId: serialized.shipmentId.trim(),
          source: serialized.source.trim(),
          destination: serialized.destination.trim(),
          quantity: serialized.quantity.trim(),
          dispatchDate: serialized.dispatchDate,
          deliveryDate: serialized.deliveryDate,
          status: serialized.status
        };
        if (index >= 0) shipmentData[index] = entry;
        else shipmentData.unshift(entry);
        saveShipmentData();
        selectedShipmentId = entry.id;
        renderShipmentModule();
      }

      if (module === "customers") {
        const index = customerData.findIndex((item) => item.id === form.dataset.editId);
        const entry = {
          id: form.dataset.editId || `CUST-${Date.now()}`,
          customerName: serialized.customerName.trim(),
          companyName: serialized.companyName.trim(),
          email: serialized.email.trim(),
          phoneNumber: serialized.phoneNumber.trim(),
          address: serialized.address.trim(),
          status: serialized.status,
          username: serialized.email.trim().split("@")[0].toLowerCase()
        };
        if (index >= 0) customerData[index] = { ...customerData[index], ...entry };
        else customerData.unshift(entry);
        saveCustomerData();
        selectedCustomerId = entry.id;
        renderCustomerModule();
      }

      closeEntityModal();
    }

    function renderInventoryModule() {
      currentView = "inventory";
      setActiveNav(navInventory);
      if (breadcrumbText) breadcrumbText.textContent = "Dashboard / Inventory Management";
      if (dashboardMainContent) dashboardMainContent.style.display = "none";
      renderModuleToolbar("inventory");
      renderInventoryTable();
      renderCharts();
    }

    function renderShipmentModule() {
      currentView = "shipments";
      setActiveNav(navShipments);
      if (breadcrumbText) breadcrumbText.textContent = "Dashboard / Shipment Management";
      if (dashboardMainContent) dashboardMainContent.style.display = "none";
      renderModuleToolbar("shipments");
      renderShipmentTable();
      renderCharts();
    }

    function renderCustomerModule() {
      currentView = "customers";
      setActiveNav(navCustomers);
      if (breadcrumbText) breadcrumbText.textContent = "Dashboard / Customer Management";
      if (dashboardMainContent) dashboardMainContent.style.display = "none";
      renderModuleToolbar("customers");
      renderCustomerTable();
      renderCharts();
    }

    function renderCharts() {
      if (!window.Chart) return;

      const shipmentLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
      const shipmentValues = [120, 160, 145, 180, 220, 210];
      const inventoryValues = Object.values(
        inventoryData.reduce((acc, item) => {
          acc[item.status] = (acc[item.status] || 0) + 1;
          return acc;
        }, {})
      );
      const inventoryLabels = ["Healthy", "Low Stock", "Critical", "In Transit"];
      const customerValues = [12, 18, 30, 42, 55, 68];
      const orderValues = [40, 62, 54, 78, 58, 66];

      const chartMap = [
        { id: "monthlyShipmentsChart", type: "bar", labels: shipmentLabels, values: shipmentValues, color: "#f59e0b", title: "Monthly Shipments" },
        { id: "inventoryDistributionChart", type: "doughnut", labels: inventoryLabels, values: inventoryValues, color: "#10b981", title: "Inventory Distribution" },
        { id: "customerGrowthChart", type: "line", labels: shipmentLabels, values: customerValues, color: "#f59e0b", title: "Customer Growth" },
        { id: "orderStatisticsChart", type: "radar", labels: ["Pending", "In Transit", "Delayed", "Delivered"], values: orderValues, color: "#34d399", title: "Order Statistics" }
      ];

      chartMap.forEach((chartDef) => {
        const canvas = document.getElementById(chartDef.id);
        if (!canvas) return;

        const prevInstance = Chart.getChart(canvas);
        if (prevInstance) prevInstance.destroy();

        new Chart(canvas, {
          type: chartDef.type,
          data: {
            labels: chartDef.labels,
            datasets: [{
              label: chartDef.title,
              data: chartDef.values,
              backgroundColor: chartDef.type === "bar"
                ? "rgba(245, 158, 11, 0.7)"
                : chartDef.type === "doughnut"
                  ? ["rgba(16, 185, 129, 0.75)", "rgba(245, 158, 11, 0.75)", "rgba(244, 63, 94, 0.75)", "rgba(59, 130, 246, 0.75)"]
                  : chartDef.type === "line"
                    ? "rgba(245, 158, 11, 0.7)"
                    : "rgba(52, 211, 153, 0.5)",
              borderColor: chartDef.type === "bar" || chartDef.type === "line" ? "#f59e0b" : "#0f172a",
              tension: 0.3,
              fill: chartDef.type === "line",
              pointRadius: 4,
              borderWidth: 2,
              borderDash: chartDef.type === "radar" ? [5, 5] : []
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: chartDef.type !== "bar", labels: { color: "#cbd5e1" } }
            },
            scales: chartDef.type === "radar" || chartDef.type === "line" || chartDef.type === "bar"
              ? {
                  x: { ticks: { color: "#cbd5e1" }, grid: { color: "rgba(148, 163, 184, 0.15)" } },
                  y: { ticks: { color: "#cbd5e1" }, grid: { color: "rgba(148, 163, 184, 0.15)" } }
                }
              : { }
          }
        });
      });
    }

    function showDashboard(username, role) {
      currentUser = username;
      currentRole = role;
      loginPage.style.display = "none";
      dashboardPage.style.display = "flex";

      const welcomeMsg = document.getElementById("welcomeMessage");
      const topUser = document.getElementById("topUserName");
      const avatarInitial = document.getElementById("avatarInitial");

      if (welcomeMsg) welcomeMsg.textContent = `Welcome ${username} (${role}) to CoalTrack Supply Chain Management System`;
      if (topUser) topUser.textContent = username;
      if (avatarInitial) avatarInitial.textContent = username.charAt(0).toUpperCase();

      renderDashboard(role);
    }

    function renderDashboard(role) {
      const data = dashboardData[role];
      if (!data) return;

      const statsGrid = document.getElementById("statsGrid");
      const activityList = document.getElementById("activityList");
      const tableBodyRef = document.getElementById("tableBody");

      if (statsGrid) {
        statsGrid.innerHTML = data.stats.map((item) => `
          <div class="stat-card">
            <div class="stat-icon ${item.accent}">
              <i class="${item.icon}"></i>
            </div>
            <div class="stat-content">
              <span>${item.label}</span>
              <strong>${item.value}</strong>
            </div>
          </div>
        `).join("");
      }

      if (activityList) {
        activityList.innerHTML = data.activities.map((item) => `
          <li>
            <span class="dot"></span>
            <span>${item}</span>
          </li>
        `).join("");
      }

      if (tableTitle) tableTitle.textContent = data.tableTitle;
      if (tableBodyRef) {
        tableBodyRef.innerHTML = data.rows.map((row) => `
          <tr>
            <td>${row[0]}</td>
            <td>${row[1]}</td>
            <td>${row[2]}</td>
            <td><span class="status-tag">${row[3]}</span></td>
            <td>${row[4]}</td>
          </tr>
        `).join("");
      }

      if (dashboardMainContent) dashboardMainContent.style.display = "block";
      if (moduleToolbar) moduleToolbar.style.display = "none";
      renderCharts();
    }

    function showLogin() {
      loginPage.style.display = "flex";
      dashboardPage.style.display = "none";
      if (loginCardView) loginCardView.style.display = "block";
      if (registerCardView) registerCardView.style.display = "none";
      if (moduleToolbar) moduleToolbar.style.display = "none";
    }

    const togglePassBtn = document.querySelector(".toggle-password");
    if (togglePassBtn) {
      togglePassBtn.addEventListener("click", function () {
        const isPassword = passwordInput.type === "password";
        passwordInput.type = isPassword ? "text" : "password";
        this.innerHTML = isPassword
          ? '<i class="fa-regular fa-eye-slash"></i>'
          : '<i class="fa-regular fa-eye"></i>';
      });
    }

    if (showRegisterLink) {
      showRegisterLink.addEventListener("click", (e) => {
        e.preventDefault();
        if (loginCardView) loginCardView.style.display = "none";
        if (registerCardView) registerCardView.style.display = "block";
        if (registerError) registerError.textContent = "";
      });
    }

    if (showLoginLink) {
      showLoginLink.addEventListener("click", (e) => {
        e.preventDefault();
        if (registerCardView) registerCardView.style.display = "none";
        if (loginCardView) loginCardView.style.display = "block";
        if (loginError) loginError.textContent = "";
      });
    }

    if (registerForm) {
      registerForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const company = regCompany.value.trim();
        const newUname = regUsername.value.trim().toLowerCase();
        const newPass = regPassword.value.trim();

        if (!company) {
          registerError.textContent = "Please enter your company name.";
          regCompany.focus();
          return;
        }
        if (!newUname) {
          registerError.textContent = "Please choose a username.";
          regUsername.focus();
          return;
        }
        if (!newPass) {
          registerError.textContent = "Please choose a password.";
          regPassword.focus();
          return;
        }

        ensureUserAccount(newUname, newPass, "Customer", `${newUname}@coaltrack.local`);
        customerData.unshift({
          id: `CUST-${Date.now()}`,
          customerName: `${company} Customer`,
          companyName: company,
          email: `${newUname}@coaltrack.local`,
          phoneNumber: "Not provided",
          address: "Not provided",
          status: "Active",
          username: newUname
        });
        saveCustomerData();

        registerError.textContent = "";
        alert(`Account successfully created for ${company}! Welcome to CoalTrack.`);
        showDashboard(newUname, "Customer");
      });
    }

    if (navDashboard) {
      navDashboard.addEventListener("click", (e) => {
        e.preventDefault();
        currentView = "dashboard";
        setActiveNav(navDashboard);
        if (breadcrumbText) breadcrumbText.textContent = "Dashboard / Overview";
        if (dashboardMainContent) dashboardMainContent.style.display = "block";
        renderDashboard(currentRole);
      });
    }

    if (navInventory) {
      navInventory.addEventListener("click", (e) => {
        e.preventDefault();
        renderInventoryModule();
      });
    }

    if (navShipments) {
      navShipments.addEventListener("click", (e) => {
        e.preventDefault();
        renderShipmentModule();
      });
    }

    if (navCustomers) {
      navCustomers.addEventListener("click", (e) => {
        e.preventDefault();
        renderCustomerModule();
      });
    }

    if (closeForgotPassword) {
      closeForgotPassword.addEventListener("click", closeForgotPasswordModal);
    }

    if (forgotPasswordLink) {
      forgotPasswordLink.addEventListener("click", (event) => {
        event.preventDefault();
        openForgotPasswordModal();
      });
    }

    if (forgotPasswordForm) {
      forgotPasswordForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const email = (resetEmail.value || "").trim();
        const state = getForgotPasswordState();

        if (event.submitter && event.submitter.type === "submit" && event.submitter.textContent.includes("Update Password")) {
          const newValue = newPassword.value.trim();
          const confirmValue = confirmPassword.value.trim();

          if (!newValue || !confirmValue) {
            alert("Please enter and confirm your new password.");
            return;
          }

          if (newValue !== confirmValue) {
            alert("Passwords do not match.");
            return;
          }

          const userMatch = Object.entries(credentials).find(([username, user]) => user.email === state.email);
          if (!userMatch) {
            alert("No matching email was found for password reset.");
            return;
          }

          const [username, userData] = userMatch;
          userData.password = newValue;
          credentials[username] = userData;
          saveForgotPasswordState({ ...state, verified: true, passwordReset: true });
          alert("Password updated successfully.");
          closeForgotPasswordModal();
          return;
        }

        if (!email) {
          alert("Please enter your email address.");
          resetEmail.focus();
          return;
        }

        const knownEmail = Object.values(credentials).some((user) => user.email === email);
        if (!knownEmail) {
          alert("Email not found. Please enter a registered account email.");
          return;
        }
        resetPasswordFlow();
      });
    }

    if (verifyOtpBtn) {
      verifyOtpBtn.addEventListener("click", () => {
        const state = getForgotPasswordState();
        const enteredOtp = (resetOtp.value || "").trim();
        if (!enteredOtp) {
          alert("Please enter your OTP.");
          resetOtp.focus();
          return;
        }
        if (enteredOtp !== state.otp) {
          alert("Invalid OTP. Please try again.");
          return;
        }
        saveForgotPasswordState({ ...state, verified: true });
        showForgotPasswordStep("new");
      });
    }

    if (backToEmailStep) {
      backToEmailStep.addEventListener("click", () => showForgotPasswordStep("email"));
    }

    if (backToOtpStep) {
      backToOtpStep.addEventListener("click", () => showForgotPasswordStep("otp"));
    }

    const entityForm = document.getElementById("entityForm");
    if (entityForm) {
      entityForm.addEventListener("submit", saveEntityForm);
    }

    document.getElementById("entityModalClose")?.addEventListener("click", closeEntityModal);
    document.getElementById("cancelEntityModal")?.addEventListener("click", closeEntityModal);

    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", function () {
        localStorage.removeItem("coaltrackRemembered");
        if (loginError) loginError.textContent = "";
        if (loginForm) loginForm.reset();
        showLogin();
      });
    }

    if (loginForm) {
      loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const enteredUser = usernameInput.value.trim().toLowerCase();
        const enteredPassword = passwordInput.value.trim();

        if (!enteredUser) {
          loginError.textContent = "Please enter your username.";
          usernameInput.focus();
          return;
        }

        if (!enteredPassword) {
          loginError.textContent = "Please enter your password.";
          passwordInput.focus();
          return;
        }

        const user = credentials[enteredUser];

        if (user && enteredPassword === user.password) {
          loginError.textContent = "";
          if (rememberMe && rememberMe.checked) {
            localStorage.setItem("coaltrackRemembered", JSON.stringify({ username: enteredUser, role: user.role }));
          } else {
            localStorage.removeItem("coaltrackRemembered");
          }
          showDashboard(enteredUser, user.role);
        } else {
          loginError.textContent = "Invalid Username or Password.";
          alert("Invalid Username or Password. If you are a new customer, please click 'Create an account' below.");
          passwordInput.focus();
        }
      });
    }

    const savedSession = JSON.parse(localStorage.getItem("coaltrackRemembered") || "null");
    if (savedSession) {
      if (usernameInput) usernameInput.value = savedSession.username;
      showDashboard(savedSession.username, savedSession.role);
    } else {
      showLogin();
    }

    document.addEventListener("input", (event) => {
      if (event.target && event.target.id === "inventorySearch") renderInventoryTable();
      if (event.target && event.target.id === "shipmentSearch") renderShipmentTable();
      if (event.target && event.target.id === "customerSearch") renderCustomerTable();
      if (event.target && event.target.id === "inventoryStatusFilter") renderInventoryTable();
      if (event.target && event.target.id === "inventoryLocationFilter") renderInventoryTable();
    });

    document.addEventListener("change", (event) => {
      if (event.target && event.target.id === "inventoryStatusFilter") renderInventoryTable();
      if (event.target && event.target.id === "inventoryLocationFilter") renderInventoryTable();
    });
  