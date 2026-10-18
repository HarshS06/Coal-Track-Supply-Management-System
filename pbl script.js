// State Variables
let total = 1000;
let pendingDemand = 0;
let activeDemander = "";

// User Session
let loggedInUser = "";
let loggedInRole = "";

// Handle Login and toggle view controls
function loginUser() {
    let name = document.getElementById('userName').value.trim();
    let role = document.getElementById('userRole').value;

    if (!name) {
        alert("Please enter your name.");
        return;
    }

    loggedInUser = name;
    loggedInRole = role;

    // Show User Details
    document.getElementById('currentUserName').innerText = loggedInUser;
    document.getElementById('currentUserRole').innerText = loggedInRole.toUpperCase();

    // Hide Login, Show Dashboard
    document.getElementById('loginSection').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('hidden');

    // Role-Based Visibility Control
    if (loggedInRole === 'demander') {
        document.getElementById('demanderPortal').classList.remove('hidden');
        document.getElementById('supplierPortal').classList.add('hidden');
    } else if (loggedInRole === 'supplier') {
        document.getElementById('supplierPortal').classList.remove('hidden');
        document.getElementById('demanderPortal').classList.add('hidden');
    }

    updateUI();
}

function logoutUser() {
    loggedInUser = "";
    loggedInRole = "";
    document.getElementById('loginSection').classList.remove('hidden');
    document.getElementById('dashboard').classList.add('hidden');
}

// Refresh Display Metrics
function updateUI() {
    document.getElementById('total').innerText = total;
    document.getElementById('requested').innerText = pendingDemand;
    document.getElementById('remaining').innerText = total;

    // Update active demand details on supplier dashboard
    let demandInfo = document.getElementById('activeDemandInfo');
    if (demandInfo) {
        demandInfo.innerText = pendingDemand > 0 
            ? `${pendingDemand} Tons by "${activeDemander}"` 
            : "No pending demands";
    }
}

// Helper for Logs
function addLog(msg) {
    let li = document.createElement('li');
    li.innerText = msg;
    document.getElementById('logList').appendChild(li);
}

// DEMANDER: Submit Coal Demand
function requestCoal() {
    let qty = parseFloat(document.getElementById('demandQty').value);

    if (isNaN(qty) || qty <= 0) {
        alert("Please enter a valid positive quantity.");
        return;
    }

    if (qty > total) {
        alert("Requested quantity exceeds current stock!");
        return;
    }

    pendingDemand += qty;
    activeDemander = loggedInUser;

    addLog(`[DEMAND] "${loggedInUser}" requested ${qty} tons of coal.`);
    document.getElementById('demandQty').value = "";

    updateUI();
}

// SUPPLIER: Approve Coal Demand
function approveDemand() {
    if (pendingDemand <= 0) {
        alert("No pending demand to approve.");
        return;
    }

    total -= pendingDemand;
    addLog(`[SUPPLY] Approved and dispatched ${pendingDemand} tons to "${activeDemander}".`);

    pendingDemand = 0;
    activeDemander = "";

    updateUI();
}

// SUPPLIER: Add Stock
function addStock() {
    let qty = parseFloat(prompt("Enter incoming coal stock quantity (tons):"));

    if (isNaN(qty) || qty <= 0) {
        alert("Invalid quantity.");
        return;
    }

    total += qty;
    addLog(`[STOCK] Added ${qty} tons of new coal to stock.`);

    updateUI();
}

// SUPPLIER: Reset Data
function resetData() {
    total = 1000;
    pendingDemand = 0;
    activeDemander = "";
    document.getElementById('logList').innerHTML = "";
    updateUI();
}