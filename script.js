
/*
 CPP RESIDENT MANAGEMENT SYSTEM
 Demonstration application - fictional resident data only
*/

// -----------------------------
// SAMPLE DATA
// -----------------------------

const sampleResidents = [
    {
        id: 1,
        name: "Marcus Reed",
        jurisdiction: "Richmond",
        placement: "2026-01-15",
        release: "Until age 21",
        caseManager: "Mr. Allen",
        phase: "Platinum",
        risk: "High",
        tier: "IV"
    },
    {
        id: 2,
        name: "Jalen Brooks",
        jurisdiction: "Norfolk",
        placement: "2026-02-20",
        release: "12-18 months",
        caseManager: "Ms. Carter",
        phase: "Diamond II",
        risk: "High",
        tier: "IV"
    },
    {
        id: 3,
        name: "Tyrese Coleman",
        jurisdiction: "Hampton",
        placement: "2026-03-10",
        release: "Until age 21",
        caseManager: "Mr. Allen",
        phase: "Gold",
        risk: "High",
        tier: "Serious Offender"
    },
    {
        id: 4,
        name: "Andre Mercer",
        jurisdiction: "Chesapeake",
        placement: "2026-04-05",
        release: "15-21 months",
        caseManager: "Ms. Carter",
        phase: "Silver",
        risk: "High",
        tier: "IV"
    }
];

const sampleAppointments = [
    {
        id: 1,
        residentId: 1,
        date: "2026-11-17",
        time: "09:00",
        type: "Medical Check",
        transport: "Yes"
    },
    {
        id: 2,
        residentId: 2,
        date: "2026-11-18",
        time: "13:30",
        type: "Court Review",
        transport: "Yes"
    },
    {
        id: 3,
        residentId: 3,
        date: "2026-11-19",
        time: "10:00",
        type: "Telehealth",
        transport: "No"
    }
];

const programs = [
    "LifeBuild",
    "ART Group",
    "SA Group",
    "C-Tech",
    "Parks & Recreation"
];

// -----------------------------
// LOCAL DEMO STORAGE
// -----------------------------

function loadData(key, fallback) {
    try {
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : fallback;
    } catch (error) {
        console.error("Could not load demo data:", error);
        return fallback;
    }
}

let residents = loadData(
    "cpp_demo_residents",
    sampleResidents
);

let appointments = loadData(
    "cpp_demo_appointments",
    sampleAppointments
);

function saveData() {
    try {
        localStorage.setItem(
            "cpp_demo_residents",
            JSON.stringify(residents)
        );

        localStorage.setItem(
            "cpp_demo_appointments",
            JSON.stringify(appointments)
        );
    } catch (error) {
        alert("Unable to save demo data in this browser.");
    }
}

// -----------------------------
// NAVIGATION
// -----------------------------

function showPage(pageId) {
    document.querySelectorAll(".page").forEach(page => {
        page.hidden = page.id !== pageId;
    });

    const pageNames = [
        "dashboard",
        "residents",
        "appointments",
        "groups",
        "reports",
        "staff",
        "settings"
    ];

    document.querySelectorAll(".sidebar button")
        .forEach((button, index) => {
            button.classList.toggle(
                "active",
                pageNames[index] === pageId
            );
        });

    refreshApplication();
}

// -----------------------------
// HELPER FUNCTIONS
// -----------------------------

function getResidentName(id) {
    const resident = residents.find(
        item => item.id === id
    );

    return resident ? resident.name : "Unknown Resident";
}

function formatDate(date) {
    if (!date) return "";

    const parts = date.split("-");

    if (parts.length !== 3) return date;

    return `${parts[1]}/${parts[2]}/${parts[0]}`;
}

function formatTime(time) {
    if (!time) return "";

    const [hours, minutes] = time.split(":").map(Number);

    const suffix = hours >= 12 ? "PM" : "AM";
    const hour = hours % 12 || 12;

    return `${hour}:${String(minutes).padStart(2, "0")} ${suffix}`;
}

function makeCell(row, value) {
    const cell = document.createElement("td");
    cell.textContent = String(value ?? "");
    row.appendChild(cell);
    return cell;
}

function makeButton(label, action) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = label;
    button.style.margin = "4px";
    button.style.padding = "8px 12px";
    button.style.cursor = "pointer";
    button.addEventListener("click", action);
    return button;
}

// -----------------------------
// DASHBOARD
// -----------------------------

function updateDashboard() {
    document.getElementById("totalResidents").textContent =
        residents.length;

    document.getElementById("totalAppointments").textContent =
        appointments.filter(
       item => !item.type.toLowerCase().includes("court")
        ).length;

    document.getElementById("totalCourtDates").textContent =
        appointments.filter(
       item => item.type.toLowerCase().includes("court")
        ).length;

    document.getElementById("totalPrograms").textContent =
        programs.length;

    // Replace the sample appointment rows with live demo data.
    const tableBody = document.querySelector(
        "#dashboard table tbody"
    );

    if (!tableBody) return;

    tableBody.replaceChildren();

    const sortedAppointments = [...appointments].sort(
        (a, b) =>
            `${a.date}T${a.time}`.localeCompare(
                `${b.date}T${b.time}`
            )
    );

    sortedAppointments.forEach(appointment => {
        const row = document.createElement("tr");

        makeCell(
            row,
            getResidentName(appointment.residentId)
        );
        makeCell(row, formatDate(appointment.date));
        makeCell(row, formatTime(appointment.time));
        makeCell(row, appointment.type);
        makeCell(row, appointment.transport);

        tableBody.appendChild(row);
    });
}

// -----------------------------
// RESIDENT MANAGEMENT
// -----------------------------

function displayResidents() {
    const container = document.getElementById("residentList");

    if (!container) return;

    container.replaceChildren();

    const search = document.createElement("input");
    search.type = "search";
    search.placeholder = "Search residents...";
    search.style.marginBottom = "15px";
    search.style.width = "100%";

    const table = document.createElement("table");

    function renderRows(filter = "") {
        table.replaceChildren();

        const header = document.createElement("tr");

        [
            "Resident",
            "Jurisdiction",
            "Placement Date",
            "Release",
            "Case Manager",
            "Phase",
            "Risk",
            "Tier",
            "Actions"
        ].forEach(title => {
            const th = document.createElement("th");
            th.textContent = title;
            header.appendChild(th);
        });

        table.appendChild(header);

        residents
            .filter(resident =>
                resident.name.toLowerCase()
                    .includes(filter.toLowerCase())
            )
            .forEach(resident => {
                const row = document.createElement("tr");

                makeCell(row, resident.name);
                makeCell(row, resident.jurisdiction);
                makeCell(row, formatDate(resident.placement));
                makeCell(row, resident.release);
                makeCell(row, resident.caseManager);
                makeCell(row, resident.phase);
                makeCell(row, resident.risk);
                makeCell(row, resident.tier);

                const actions = document.createElement("td");

                actions.appendChild(
                    makeButton("Edit", () => {
                        editResident(resident.id);
                    })
                );

                actions.appendChild(
                    makeButton("Delete", () => {
                        deleteResident(resident.id);
                    })
                );

                row.appendChild(actions);
                table.appendChild(row);
            });
    }

    search.addEventListener("input", () => {
        renderRows(search.value);
    });

    container.appendChild(search);
    container.appendChild(table);

    renderRows();
}

function addResident() {
    const name = prompt("Enter fictional resident name:");
    if (!name || !name.trim()) return;

    const jurisdiction = prompt(
        "Enter jurisdiction:",
        "Virginia Beach"
    );

    if (jurisdiction === null) return;

    const placement = prompt(
        "Placement date (YYYY-MM-DD):",
        "2026-11-07"
    );

    if (placement === null) return;

    if (!isValidDate(placement)) {
        alert("Enter a valid date in YYYY-MM-DD format.");
        return;
    }

    const release = prompt(
        "Anticipated release:",
        "12-18 months"
    );

    if (release === null) return;

    const caseManager = prompt(
        "Case manager:",
        "Demo Manager"
    );

    if (caseManager === null) return;

    const phase = prompt(
        "Transition phase:",
        "Orientation"
    );

    if (phase === null) return;

    const risk = prompt("Risk status:", "High");
    if (risk === null) return;

    const tier = prompt("Tier:", "IV");
    if (tier === null) return;

    residents.push({
        id: Date.now(),
        name: name.trim(),
        jurisdiction,
        placement,
        release,
        caseManager,
        phase,
        risk,
        tier
    });

    saveData();
    refreshApplication();
}

function editResident(id) {
    const resident = residents.find(item => item.id === id);

    if (!resident) return;

    const name = prompt("Resident name:", resident.name);
    if (name === null || !name.trim()) return;

    const jurisdiction = prompt(
        "Jurisdiction:",
        resident.jurisdiction
    );
    if (jurisdiction === null) return;

    const phase = prompt(
        "Transition phase:",
        resident.phase
    );
    if (phase === null) return;

    const caseManager = prompt(
        "Case manager:",
        resident.caseManager
    );
    if (caseManager === null) return;

    const release = prompt(
        "Anticipated release:",
        resident.release
    );
    if (release === null) return;

    const risk = prompt("Risk status:", resident.risk);
    if (risk === null) return;

    const tier = prompt("Tier:", resident.tier);
    if (tier === null) return;

    resident.name = name.trim();
    resident.jurisdiction = jurisdiction;
    resident.phase = phase;
    resident.caseManager = caseManager;
    resident.release = release;
    resident.risk = risk;
    resident.tier = tier;

    saveData();
    refreshApplication();
}

function deleteResident(id) {
    const resident = residents.find(item => item.id === id);

    if (!resident) return;

    const confirmed = confirm(
        `Delete ${resident.name} from the demo records?`
    );

    if (!confirmed) return;

    residents = residents.filter(item => item.id !== id);

    appointments = appointments.filter(
        item => item.residentId !== id
    );

    saveData();
    refreshApplication();
}

// -----------------------------
// APPOINTMENT MANAGEMENT
// -----------------------------

function isValidDate(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return false;
    }

    const date = new Date(value + "T12:00:00");

    return !Number.isNaN(date.getTime()) &&
        date.getFullYear() === Number(value.slice(0, 4)) &&
        date.getMonth() + 1 === Number(value.slice(5, 7)) &&
        date.getDate() === Number(value.slice(8, 10));
}

function addAppointment() {
    if (residents.length === 0) {
        alert("Add a resident first.");
        return;
    }

    const residentList = residents.map(
        resident => `${resident.id}: ${resident.name}`
    ).join("\n");

    const chosenId = prompt(
        "Enter the resident ID:\n\n" + residentList
    );

    if (chosenId === null) return;

    const residentId = Number(chosenId);

    if (!residents.some(item => item.id === residentId)) {
        alert("Resident ID not found.");
        return;
    }

    const date = prompt(
        "Appointment date (YYYY-MM-DD):",
        "2026-11-20"
    );

    if (date === null) return;

    if (!isValidDate(date)) {
        alert("Enter a valid date in YYYY-MM-DD format.");
        return;
    }

    const time = prompt(
        "Appointment time (HH:MM, 24-hour format):",
        "10:00"
    );

    if (time === null) return;

    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) {
        alert("Enter time in HH:MM format.");
        return;
    }

    const type = prompt(
        "Appointment type:",
        "Medical Check"
    );

    if (!type || !type.trim()) return;

    const transport = prompt(
        "Transportation required? Yes or No:",
        "Yes"
    );

    if (transport === null) return;

    appointments.push({
        id: Date.now(),
        residentId,
        date,
        time,
        type: type.trim(),
        transport
    });

    saveData();
    refreshApplication();
}

function displayAppointments() {
    const section = document.getElementById("appointments");

    let container = document.getElementById(
        "appointmentList"
    );

    if (!container) {
        container = document.createElement("div");
        container.id = "appointmentList";
        section.appendChild(container);
    }

    container.replaceChildren();

    const table = document.createElement("table");
    const header = document.createElement("tr");

    ["Resident", "Date", "Time", "Type", "Transport", "Actions"]
        .forEach(title => {
            const th = document.createElement("th");
            th.textContent = title;
            header.appendChild(th);
        });

    table.appendChild(header);

    appointments.forEach(appointment => {
        const row = document.createElement("tr");

        makeCell(row, getResidentName(appointment.residentId));
        makeCell(row, formatDate(appointment.date));
        makeCell(row, formatTime(appointment.time));
        makeCell(row, appointment.type);
        makeCell(row, appointment.transport);

        const actions = document.createElement("td");

        actions.appendChild(
            makeButton("Delete", () => {
                if (!confirm("Delete this appointment?")) return;

                appointments = appointments.filter(
                    item => item.id !== appointment.id
                );

                saveData();
                refreshApplication();
            })
        );

        row.appendChild(actions);
        table.appendChild(row);
    });

    container.appendChild(table);
}

// -----------------------------
// REPORTS
// -----------------------------

function generateReport() {
    if (!residents.length) {
        alert("There are no residents to report.");
        return;
    }

    const headings = [
        "Name",
        "Jurisdiction",
        "Placement Date",
        "Anticipated Release",
        "Case Manager",
        "Phase",
        "Risk Status",
        "Tier"
    ];

    const rows = residents.map(resident => [
        resident.name,
        resident.jurisdiction,
        resident.placement,
        resident.release,
        resident.caseManager,
        resident.phase,
        resident.risk,
        resident.tier
    ]);

    function csvValue(value) {
        let text = String(value ?? "");

        // Prevent spreadsheet formula execution.
        if (/^[\s]*[=+\-@]/.test(text)) {
            text = "'" + text;
        }

        return '"' + text.replace(/"/g, '""') + '"';
    }

    const csv = [headings, ...rows]
        .map(row => row.map(csvValue).join(","))
        .join("\r\n");

    const blob = new Blob([csv], {
        type: "text/csv;charset=utf-8"
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "CPP-Demo-Resident-Report.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
}

// -----------------------------
// BUTTON CONNECTIONS
// -----------------------------

function connectButtons() {
    const addResidentButton = document.querySelector(
        "#residents .action-button"
    );

    if (addResidentButton) {
        addResidentButton.addEventListener(
            "click",
            addResident
        );
    }

    const addAppointmentButton = document.querySelector(
        "#appointments .action-button"
    );

    if (addAppointmentButton) {
        addAppointmentButton.addEventListener(
            "click",
            addAppointment
        );
    }

    const reportButton = document.querySelector(
        "#reports .action-button"
    );

    if (reportButton) {
        reportButton.addEventListener(
            "click",
            generateReport
        );
    }
}

// -----------------------------
// REFRESH APPLICATION
// -----------------------------

function refreshApplication() {
    updateDashboard();
    displayResidents();
    displayAppointments();
}

// -----------------------------
// START APPLICATION
// -----------------------------

document.addEventListener("DOMContentLoaded", () => {
    connectButtons();
    refreshApplication();
    showPage("dashboard");

    console.log("CPP Resident Management Demo loaded.");
});

/* =====================================
   CPP GROUPS & CLASSES MANAGEMENT
   FEATURE #1
===================================== */

const cppPrograms = [
    {
        name: "LifeBuild",
        schedule: "Monday / Wednesday"
    },
    {
        name: "ART Group",
        schedule: "Mon / Tue / Wed, 2:45-3:45 PM"
    },
    {
        name: "SA Group",
        schedule: "Thursday, 3:30-5:30 PM"
    },
    {
        name: "C-Tech",
        schedule: "Not currently scheduled"
    },
    {
        name: "Parks & Recreation",
        schedule: "Scheduled sessions"
    }
];

// Store program enrollment in the browser.
// Fictional demonstration data only.

let cppEnrollment = {};

try {
    cppEnrollment = JSON.parse(
        localStorage.getItem("cpp_program_enrollment") || "{}"
    );
} catch (error) {
    cppEnrollment = {};
}

function saveCppEnrollment() {
    localStorage.setItem(
        "cpp_program_enrollment",
        JSON.stringify(cppEnrollment)
    );
}

// Create the Groups & Classes interface.

function setupCppPrograms() {
    const section = document.getElementById("groups");

    if (!section) return;

    // Remove the original static program list.
    const oldPanel = section.querySelector(".panel");
    if (oldPanel) oldPanel.remove();

    let manager = document.getElementById("cppProgramManager");

    if (!manager) {
        manager = document.createElement("div");
        manager.id = "cppProgramManager";
        section.appendChild(manager);
    }

    manager.replaceChildren();

    const formPanel = document.createElement("div");
    formPanel.className = "panel";

    const heading = document.createElement("h3");
    heading.textContent = "Assign Resident to Program";
    formPanel.appendChild(heading);

    const residentSelect = document.createElement("select");
    residentSelect.style.marginRight = "10px";

    residents.forEach(resident => {
        const option = document.createElement("option");
        option.value = resident.id;
        option.textContent = resident.name;
        residentSelect.appendChild(option);
    });

    const programSelect = document.createElement("select");
    programSelect.style.marginRight = "10px";

    cppPrograms.forEach(program => {
        const option = document.createElement("option");
        option.value = program.name;
        option.textContent = program.name;
        programSelect.appendChild(option);
    });

    const assignButton = document.createElement("button");
    assignButton.className = "action-button";
    assignButton.textContent = "Assign to Program";

    assignButton.addEventListener("click", () => {
        const residentId = Number(residentSelect.value);
        const programName = programSelect.value;

        if (!residentId) {
            alert("Please add a resident first.");
            return;
        }

        if (!cppEnrollment[programName]) {
            cppEnrollment[programName] = [];
        }

        if (cppEnrollment[programName].includes(residentId)) {
            alert("Resident is already enrolled.");
            return;
        }

        cppEnrollment[programName].push(residentId);

        saveCppEnrollment();
        setupCppPrograms();
    });

    formPanel.appendChild(residentSelect);
    formPanel.appendChild(programSelect);
    formPanel.appendChild(assignButton);
    manager.appendChild(formPanel);

    // Display all programs and enrolled residents.

    cppPrograms.forEach(program => {
        const panel = document.createElement("div");
        panel.className = "panel";

        const title = document.createElement("h3");
        title.textContent = program.name;

        const schedule = document.createElement("p");
        schedule.textContent = "Schedule: " + program.schedule;

        const enrolledIds = cppEnrollment[program.name] || [];

        const validIds = enrolledIds.filter(id =>
            residents.some(resident => resident.id === id)
        );

        const count = document.createElement("p");
        count.textContent =
            "Enrolled Residents: " + validIds.length;

        panel.appendChild(title);
        panel.appendChild(schedule);
        panel.appendChild(count);

        if (validIds.length === 0) {
            const empty = document.createElement("p");
            empty.textContent = "No residents enrolled.";
            panel.appendChild(empty);
        }

        validIds.forEach(id => {
            const resident = residents.find(
                item => item.id === id
            );

            if (!resident) return;

            const row = document.createElement("div");
            row.style.padding = "8px 0";

            const name = document.createElement("span");
            name.textContent = resident.name + "  ";

            const removeButton = document.createElement("button");
            removeButton.textContent = "Remove";
            removeButton.style.padding = "6px 12px";
            removeButton.style.cursor = "pointer";

            removeButton.addEventListener("click", () => {
                cppEnrollment[program.name] =
                    cppEnrollment[program.name].filter(
                        residentId => residentId !== id
                    );

                saveCppEnrollment();
                setupCppPrograms();
            });

            row.appendChild(name);
            row.appendChild(removeButton);
            panel.appendChild(row);
        });

        manager.appendChild(panel);
    });
}

// Initialize program management.

document.addEventListener("DOMContentLoaded", () => {
    setupCppPrograms();

    const groupsButton = [...document.querySelectorAll(
        ".sidebar button"
    )].find(button =>
        button.textContent.trim() === "Groups & Classes"
    );

    if (groupsButton) {
        groupsButton.addEventListener(
            "click",
            setupCppPrograms
        );
    }
});

/* ==========================================
   CODE #5 - ADVANCED APPOINTMENTS
   CPP Resident Management System
   Fictional demonstration data only
========================================== */

// This upgrades the existing appointments page.
// It preserves the resident and program features.

let cppEditingAppointmentId = null;

function cppNewAppointmentId() {
    return Math.max(
        0,
        ...appointments.map(item => Number(item.id) || 0)
    ) + 1;
}

// Replace the original appointment display function.

displayAppointments = function () {
    const section = document.getElementById("appointments");
    if (!section) return;

    let manager = document.getElementById(
        "cppAdvancedAppointments"
    );

    if (!manager) {
        manager = document.createElement("div");
        manager.id = "cppAdvancedAppointments";
        section.appendChild(manager);
    }

    manager.replaceChildren();

    // APPOINTMENT FORM

    const panel = document.createElement("div");
    panel.className = "panel";

    panel.innerHTML = `
        <h3 id="cppFormTitle">Schedule New Appointment</h3>

        <form id="cppAppointmentForm">
            <div style="
                display:grid;
                grid-template-columns:repeat(auto-fit,minmax(200px,1fr));
                gap:15px;
                margin-bottom:18px;
            ">

                <label>
                    Resident
                    <select id="cppApptResident"
                        required style="width:100%">
                    </select>
                </label>

                <label>
                    Appointment Type
                    <select id="cppApptType"
                        required style="width:100%">
                        <option>Medical Check</option>
                        <option>Medical Appointment</option>
                        <option>Dental Appointment</option>
                        <option>Court Review</option>
                        <option>Court Hearing</option>
                        <option>Telehealth</option>
                        <option>Counseling</option>
                        <option>Other</option>
                    </select>
                </label>

                <label>
                    Appointment Date
                    <input id="cppApptDate"
                        type="date" required
                        style="width:100%">
                </label>

                <label>
                    Appointment Time
                    <input id="cppApptTime"
                        type="time" required
                        style="width:100%">
                </label>

                <label>
                    Location
                    <input id="cppApptLocation"
                        type="text"
                        maxlength="120"
                        placeholder="Facility or court"
                        style="width:100%">
                </label>

                <label>
                    Transportation Required
                    <select id="cppApptTransport"
                        style="width:100%">
                        <option>Yes</option>
                        <option>No</option>
                    </select>
                </label>

                <label>
                    Transport Staff
                    <input id="cppApptStaff"
                        type="text"
                        maxlength="100"
                        placeholder="Assigned staff"
                        style="width:100%">
                </label>

                <label>
                    Appointment Status
                    <select id="cppApptStatus"
                        style="width:100%">
                        <option>Scheduled</option>
                        <option>Completed</option>
                        <option>Canceled</option>
                    </select>
                </label>

            </div>

            <button type="submit"
                class="action-button"
                id="cppSaveAppointment">
                Save Appointment
            </button>

            <button type="button"
                id="cppCancelEdit"
                style="padding:13px;margin-left:10px">
                Clear Form
            </button>
        </form>
    `;

    manager.appendChild(panel);

    const form = panel.querySelector("#cppAppointmentForm");
    const field = id => panel.querySelector("#" + id);

    const residentSelect = field("cppApptResident");

    residents.forEach(resident => {
        const option = document.createElement("option");
        option.value = resident.id;
        option.textContent = resident.name;
        residentSelect.appendChild(option);
    });

    // Save a new or updated appointment.

    form.addEventListener("submit", event => {
        event.preventDefault();

        const residentId = Number(
            field("cppApptResident").value
        );

        if (!residents.some(r => r.id === residentId)) {
            alert("Please select a valid resident.");
            return;
        }

        const date = field("cppApptDate").value;
        const time = field("cppApptTime").value;

        if (!isValidDate(date)) {
            alert("Please enter a valid date.");
            return;
        }

        if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) {
            alert("Please enter a valid time.");
            return;
        }

        const transport = field("cppApptTransport").value;

        const updated = {
            residentId: residentId,
            type: field("cppApptType").value,
            date: date,
            time: time,
            location: field("cppApptLocation").value.trim(),
            transport: transport,
            transportStaff: transport === "Yes"
                ? field("cppApptStaff").value.trim()
                : "",
            status: field("cppApptStatus").value
        };

        if (cppEditingAppointmentId !== null) {
            const existing = appointments.find(
                a => a.id === cppEditingAppointmentId
            );

            if (!existing) {
                alert("Appointment could not be found.");
                return;
            }

            Object.assign(existing, updated);
        } else {
            appointments.push({
                id: cppNewAppointmentId(),
                ...updated
            });
        }

        cppEditingAppointmentId = null;

        saveData();
        refreshApplication();

        alert("Appointment saved successfully.");
    });

    field("cppCancelEdit").addEventListener("click", () => {
        cppEditingAppointmentId = null;
        displayAppointments();
    });

    // APPOINTMENT RECORDS

    const listPanel = document.createElement("div");
    listPanel.className = "panel";

    const listTitle = document.createElement("h3");
    listTitle.textContent = "Appointment Records";
    listPanel.appendChild(listTitle);

    const search = document.createElement("input");
    search.type = "search";
    search.placeholder = "Search resident or appointment...";
    search.style.width = "100%";
    search.style.marginBottom = "12px";
    listPanel.appendChild(search);

    const statusFilter = document.createElement("select");
    statusFilter.style.marginBottom = "15px";

    ["All", "Scheduled", "Completed", "Canceled"]
        .forEach(status => {
            const option = document.createElement("option");
            option.value = status;
            option.textContent = status;
            statusFilter.appendChild(option);
        });

    listPanel.appendChild(statusFilter);

    const tableWrapper = document.createElement("div");
    tableWrapper.style.overflowX = "auto";

    const table = document.createElement("table");
    tableWrapper.appendChild(table);
    listPanel.appendChild(tableWrapper);
    manager.appendChild(listPanel);

    function renderTable() {
        table.replaceChildren();

        const header = document.createElement("tr");

        [
            "Resident",
            "Date",
            "Time",
            "Type",
            "Location",
            "Transport",
            "Transport Staff",
            "Status",
            "Actions"
        ].forEach(title => {
            const th = document.createElement("th");
            th.textContent = title;
            header.appendChild(th);
        });

        table.appendChild(header);

        const query = search.value.toLowerCase();

        const filtered = [...appointments]
            .filter(appt => {
                const name = getResidentName(
                    appt.residentId
                ).toLowerCase();

                const matchesSearch =
                    name.includes(query) ||
                    appt.type.toLowerCase().includes(query) ||
                    (appt.location || "")
                        .toLowerCase().includes(query);

                const currentStatus =
                    appt.status || "Scheduled";

                const matchesStatus =
                    statusFilter.value === "All" ||
                    currentStatus === statusFilter.value;

                return matchesSearch && matchesStatus;
            })
            .sort((a, b) =>
                (a.date + a.time).localeCompare(
                    b.date + b.time
                )
            );

        filtered.forEach(appt => {
            const row = document.createElement("tr");

            makeCell(
                row,
                getResidentName(appt.residentId)
            );
            makeCell(row, formatDate(appt.date));
            makeCell(row, formatTime(appt.time));
            makeCell(row, appt.type);
            makeCell(row, appt.location || "Not specified");
            makeCell(row, appt.transport);
            makeCell(row, appt.transportStaff || "-");
            makeCell(row, appt.status || "Scheduled");

            const actions = document.createElement("td");

            actions.appendChild(
                makeButton("Edit", () => {
                    cppEditingAppointmentId = appt.id;

                    field("cppApptResident").value =
                        appt.residentId;

                    const typeSelect = field("cppApptType");

                    if (![...typeSelect.options].some(
                        option => option.value === appt.type
                    )) {
                        const option = new Option(
                            appt.type, appt.type
                        );
                        typeSelect.add(option);
                    }

                    typeSelect.value = appt.type;
                    field("cppApptDate").value = appt.date;
                    field("cppApptTime").value = appt.time;
                    field("cppApptLocation").value =
                        appt.location || "";
                    field("cppApptTransport").value =
                        appt.transport || "No";
                    field("cppApptStaff").value =
                        appt.transportStaff || "";
                    field("cppApptStatus").value =
                        appt.status || "Scheduled";

                    field("cppFormTitle").textContent =
                        "Edit Appointment";

                    field("cppSaveAppointment").textContent =
                        "Update Appointment";

                    panel.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
                })
            );

            actions.appendChild(
                makeButton("Delete", () => {
                    if (!confirm(
                        "Delete this appointment?"
                    )) return;

                    appointments = appointments.filter(
                        item => item.id !== appt.id
                    );

                    saveData();
                    refreshApplication();
                })
            );

            row.appendChild(actions);
            table.appendChild(row);
        });

        if (filtered.length === 0) {
            const row = document.createElement("tr");
            const cell = document.createElement("td");
            cell.colSpan = 9;
            cell.textContent = "No matching appointments.";
            row.appendChild(cell);
            table.appendChild(row);
        }
    }

    search.addEventListener("input", renderTable);
    statusFilter.addEventListener("change", renderTable);

    renderTable();
};

// Replace the original Add Appointment button.
// This prevents both the old and new appointment forms
// from opening at the same time.

document.addEventListener("DOMContentLoaded", () => {
    const section = document.getElementById("appointments");

    if (!section) return;

    const oldButton = section.querySelector(
        ".action-button"
    );

    if (oldButton) {
        oldButton.remove();
    }

    cppEditingAppointmentId = null;
    displayAppointments();
});

/* ==========================================
   CODE #6 - ADVANCED RESIDENT MANAGEMENT
   CPP Resident Management System
   Fictional demonstration data only
========================================== */

let cppEditingResidentId = null;

// Upgrade the existing Residents tab.
// Existing resident records are preserved.

displayResidents = function () {
    const section = document.getElementById("residents");
    const container = document.getElementById("residentList");

    if (!section || !container) return;

    container.replaceChildren();

    // CREATE RESIDENT FORM

    const formPanel = document.createElement("div");
    formPanel.className = "panel";

    formPanel.innerHTML = `
        <h3 id="cppResidentFormTitle">
            Add New Resident
        </h3>

        <form id="cppResidentForm">

            <div class="cpp-resident-grid">

                <label>
                    Resident Name
                    <input id="cppResidentName"
                        type="text" required
                        maxlength="100"
                        placeholder="Fictional resident name">
                </label>

                <label>
                    Jurisdiction
                    <input id="cppJurisdiction"
                        type="text"
                        maxlength="100"
                        placeholder="City or county">
                </label>

                <label>
                    Probation Officer
                    <input id="cppPO"
                        type="text"
                        maxlength="100"
                        placeholder="PO name">
                </label>

                <label>
                    Probation Officer Phone
                    <input id="cppPOPhone"
                        type="tel"
                        maxlength="25"
                        placeholder="Demo phone number">
                </label>

                <label>
                    Placement Date
                    <input id="cppPlacement"
                        type="date" required>
                </label>

                <label>
                    Anticipated Release
                    <input id="cppRelease"
                        type="text"
                        maxlength="100"
                        placeholder="12-18 months or Until age 21">
                </label>

                <label>
                    Case Manager
                    <input id="cppCaseManager"
                        type="text"
                        maxlength="100"
                        placeholder="Assigned case manager">
                </label>

                <label>
                    CAP Counselor
                    <input id="cppCounselor"
                        type="text"
                        maxlength="100"
                        placeholder="Assigned counselor">
                </label>

                <label>
                    Transition Phase
                    <select id="cppPhase">
                        <option>Orientation</option>
                        <option>Bronze</option>
                        <option>Silver</option>
                        <option>Gold</option>
                        <option>Diamond I</option>
                        <option>Diamond II</option>
                        <option>Platinum</option>
                    </select>
                </label>

                <label>
                    Risk Status
                    <select id="cppRisk">
                        <option>High</option>
                        <option>Moderate</option>
                        <option>Low</option>
                        <option>Not Assessed</option>
                    </select>
                </label>

                <label>
                    Vocational Tier
                    <select id="cppTier">
                        <option>IV</option>
                        <option>III</option>
                        <option>II</option>
                        <option>I</option>
                        <option>Serious Offender</option>
                        <option>Not Assigned</option>
                    </select>
                </label>

                <label>
                    Additional Notes
                    <textarea id="cppResidentNotes"
                        rows="3"
                        maxlength="1000"
                        placeholder="Demo notes only"></textarea>
                </label>

            </div>

            <button type="submit"
                class="action-button"
                id="cppSaveResident">
                Save Resident
            </button>

            <button type="button"
                id="cppClearResident"
                class="cpp-secondary-button">
                Clear Form
            </button>

        </form>
    `;

    container.appendChild(formPanel);

    const form = formPanel.querySelector("#cppResidentForm");

    const field = id => formPanel.querySelector("#" + id);

    const fieldMap = {
        name: "cppResidentName",
        jurisdiction: "cppJurisdiction",
        probationOfficer: "cppPO",
        poPhone: "cppPOPhone",
        placement: "cppPlacement",
        release: "cppRelease",
        caseManager: "cppCaseManager",
        capCounselor: "cppCounselor",
        phase: "cppPhase",
        risk: "cppRisk",
        tier: "cppTier",
        notes: "cppResidentNotes"
    };

    function clearForm() {
        form.reset();
        cppEditingResidentId = null;

        field("cppResidentFormTitle").textContent =
            "Add New Resident";

        field("cppSaveResident").textContent =
            "Save Resident";
    }

    function selectValue(element, value) {
        const text = String(value || "");

        if (element.tagName === "SELECT" &&
            text &&
            ![...element.options].some(
                option => option.value === text
            )) {
            element.add(new Option(text, text));
        }

        element.value = text;
    }

    // SAVE NEW RESIDENT OR UPDATE EXISTING RESIDENT

    form.addEventListener("submit", event => {
        event.preventDefault();

        const name = field("cppResidentName").value.trim();
        const placement = field("cppPlacement").value;

        if (!name) {
            alert("Please enter a resident name.");
            return;
        }

        if (!isValidDate(placement)) {
            alert("Please enter a valid placement date.");
            return;
        }

        const details = {};

        Object.entries(fieldMap).forEach(([key, id]) => {
            details[key] = field(id).value.trim();
        });

        if (cppEditingResidentId !== null) {
            const existing = residents.find(
                resident => resident.id === cppEditingResidentId
            );

            if (!existing) {
                alert("Resident record not found.");
                return;
            }

            Object.assign(existing, details);
        } else {
            const nextId = Math.max(
                0,
                ...residents.map(
                    resident => Number(resident.id) || 0
                )
            ) + 1;

            residents.push({
                id: nextId,
                ...details
            });
        }

        cppEditingResidentId = null;

        saveData();
        refreshApplication();

        alert("Resident record saved successfully.");
    });

    field("cppClearResident").addEventListener(
        "click",
        clearForm
    );

    // SEARCH AND RESIDENT TABLE

    const tablePanel = document.createElement("div");
    tablePanel.className = "panel";

    const title = document.createElement("h3");
    title.textContent = "Resident Records";
    tablePanel.appendChild(title);

    const search = document.createElement("input");
    search.type = "search";
    search.placeholder =
        "Search by resident, jurisdiction, case manager or phase...";
    search.style.width = "100%";
    search.style.marginBottom = "16px";

    tablePanel.appendChild(search);

    const count = document.createElement("p");
    tablePanel.appendChild(count);

    const tableWrapper = document.createElement("div");
    tableWrapper.style.overflowX = "auto";

    const table = document.createElement("table");
    tableWrapper.appendChild(table);

    tablePanel.appendChild(tableWrapper);
    container.appendChild(tablePanel);

    function renderResidentTable() {
        table.replaceChildren();

        const headings = [
            "Resident",
            "Jurisdiction",
            "Placement",
            "Release",
            "Probation Officer",
            "PO Phone",
            "Case Manager",
            "CAP Counselor",
            "Phase",
            "Risk",
            "Tier",
            "Actions"
        ];

        const header = document.createElement("tr");

        headings.forEach(text => {
            const th = document.createElement("th");
            th.textContent = text;
            header.appendChild(th);
        });

        table.appendChild(header);

        const query = search.value.trim().toLowerCase();

        const filtered = residents.filter(resident => {
            return [
                resident.name,
                resident.jurisdiction,
                resident.caseManager,
                resident.phase,
                resident.probationOfficer,
                resident.capCounselor
            ].some(value =>
                String(value || "")
                    .toLowerCase()
                    .includes(query)
            );
        });

        count.textContent =
            `Showing ${filtered.length} of ${residents.length} residents`;

        filtered.forEach(resident => {
            const row = document.createElement("tr");

            [
                resident.name,
                resident.jurisdiction,
                formatDate(resident.placement),
                resident.release,
                resident.probationOfficer,
                resident.poPhone,
                resident.caseManager,
                resident.capCounselor,
                resident.phase,
                resident.risk,
                resident.tier
            ].forEach(value => {
                makeCell(row, value || "-");
            });

            const actions = document.createElement("td");

            const editButton = makeButton("Edit", () => {
                cppEditingResidentId = resident.id;

                Object.entries(fieldMap).forEach(
                    ([key, id]) => {
                        selectValue(
                            field(id),
                            resident[key] || ""
                        );
                    }
                );

                field("cppResidentFormTitle").textContent =
                    "Edit Resident: " + resident.name;

                field("cppSaveResident").textContent =
                    "Update Resident";

                formPanel.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            });

            const deleteButton = makeButton(
                "Delete",
                () => {
                    cppEditingResidentId = null;
                    deleteResident(resident.id);
                }
            );

            actions.appendChild(editButton);
            actions.appendChild(deleteButton);

            row.appendChild(actions);
            table.appendChild(row);
        });

        if (filtered.length === 0) {
            const row = document.createElement("tr");
            const cell = document.createElement("td");
            cell.colSpan = headings.length;
            cell.textContent = "No matching residents.";
            row.appendChild(cell);
            table.appendChild(row);
        }
    }

    search.addEventListener(
        "input",
        renderResidentTable
    );

    renderResidentTable();
};

// REMOVE THE ORIGINAL ADD RESIDENT BUTTON
// The new form replaces the old pop-up workflow.

document.addEventListener("DOMContentLoaded", () => {
    const section = document.getElementById("residents");

    if (!section) return;

    const oldButton = section.querySelector(
        ":scope > .action-button"
    );

    if (oldButton) {
        oldButton.remove();
    }

    cppEditingResidentId = null;
    displayResidents();
});

/* ==========================================
   CODE #7 - ADVANCED REPORTS
   CPP Resident Management System
   Fictional demonstration data only
========================================== */

(function () {
    "use strict";

    const reportTypes = {
        residents: "CPP Resident Roster",
        appointments: "CPP Appointments & Court Dates",
        programs: "CPP Groups & Classes"
    };

    let selectedReport = "residents";

    // Collect the latest information each time
    // a report is requested.

    function getReportData(type) {
        if (type === "residents") {
            return {
                headers: [
                    "Resident",
                    "Jurisdiction",
                    "Placement Date",
                    "Anticipated Release",
                    "Probation Officer",
                    "PO Phone",
                    "Case Manager",
                    "CAP Counselor",
                    "Transition Phase",
                    "Risk Status",
                    "Vocational Tier"
                ],
                rows: residents.map(r => [
                    r.name,
                    r.jurisdiction,
                    formatDate(r.placement),
                    r.release,
                    r.probationOfficer || "",
                    r.poPhone || "",
                    r.caseManager,
                    r.capCounselor || "",
                    r.phase,
                    r.risk,
                    r.tier
                ])
            };
        }

        if (type === "appointments") {
            const sorted = [...appointments].sort(
                (a, b) =>
                    (a.date + a.time).localeCompare(
                        b.date + b.time
                    )
            );

            return {
                headers: [
                    "Resident",
                    "Date",
                    "Time",
                    "Appointment Type",
                    "Location",
                    "Transportation",
                    "Transport Staff",
                    "Status"
                ],
                rows: sorted.map(a => [
                    getResidentName(a.residentId),
                    formatDate(a.date),
                    formatTime(a.time),
                    a.type,
                    a.location || "",
                    a.transport,
                    a.transportStaff || "",
                    a.status || "Scheduled"
                ])
            };
        }

        if (type === "programs") {
            const enrollment =
                typeof cppEnrollment !== "undefined"
                    ? cppEnrollment
                    : {};

            const allPrograms =
                typeof cppPrograms !== "undefined"
                    ? cppPrograms
                    : [];

            const rows = [];

            allPrograms.forEach(program => {
                const ids = enrollment[program.name] || [];

                const enrolled = residents.filter(
                    r => ids.includes(r.id)
                );

                if (enrolled.length === 0) {
                    rows.push([
                        program.name,
                        program.schedule,
                        "No residents enrolled",
                        0
                    ]);
                } else {
                    enrolled.forEach(resident => {
                        rows.push([
                            program.name,
                            program.schedule,
                            resident.name,
                            enrolled.length
                        ]);
                    });
                }
            });

            return {
                headers: [
                    "Program",
                    "Schedule",
                    "Resident",
                    "Total Enrolled"
                ],
                rows
            };
        }

        return { headers: [], rows: [] };
    }

    // Build a safe table without placing resident
    // information into raw HTML.

    function buildReportTable(data) {
        const table = document.createElement("table");

        const thead = document.createElement("thead");
        const headerRow = document.createElement("tr");

        data.headers.forEach(heading => {
            const th = document.createElement("th");
            th.textContent = heading;
            headerRow.appendChild(th);
        });

        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement("tbody");

        data.rows.forEach(values => {
            const tr = document.createElement("tr");

            values.forEach(value => {
                const td = document.createElement("td");
                td.textContent = String(value ?? "");
                tr.appendChild(td);
            });

            tbody.appendChild(tr);
        });

        table.appendChild(tbody);
        return table;
    }

    // Make exported CSV values safe for
    // spreadsheet software to open.

    function csvCell(value) {
        let text = String(value ?? "");

        if (/^\s*[=+\-@\t\r]/.test(text)) {
            text = "'" + text;
        }

        return '"' + text.replace(/"/g, '""') + '"';
    }

    function exportSelectedReport() {
        const data = getReportData(selectedReport);

        const lines = [
            data.headers,
            ...data.rows
        ].map(row =>
            row.map(csvCell).join(",")
        );

        const csv = "\uFEFF" + lines.join("\r\n");

        const blob = new Blob([csv], {
            type: "text/csv;charset=utf-8"
        });

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download =
            "CPP-Demo-" + selectedReport + ".csv";

        document.body.appendChild(link);
        link.click();
        link.remove();

        setTimeout(() => {
            URL.revokeObjectURL(url);
        }, 1000);
    }

    function setupReports() {
        const section = document.getElementById("reports");
        if (!section) return;

        // Remove the original Generate Report button.
        // This prevents the older CSV handler from
        // interfering with the new report center.

        const oldButton = section.querySelector(
            ":scope > .action-button"
        );

        if (oldButton) {
            oldButton.remove();
        }

        const center = document.createElement("div");
        center.id = "cppReportsCenter";

        const controls = document.createElement("div");
        controls.className = "panel cpp-report-controls";

        const heading = document.createElement("h3");
        heading.textContent = "Select a Report";
        controls.appendChild(heading);

        const select = document.createElement("select");
        select.id = "cppReportType";

        Object.entries(reportTypes).forEach(
            ([value, label]) => {
                const option = document.createElement("option");
                option.value = value;
                option.textContent = label;
                select.appendChild(option);
            }
        );

        controls.appendChild(select);

        function actionButton(label, callback) {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "action-button";
            button.textContent = label;
            button.addEventListener("click", callback);
            controls.appendChild(button);
        }

        const preview = document.createElement("div");
        preview.id = "cppReportPrintArea";
        preview.className = "panel";

        function updatePreview() {
            selectedReport = select.value;

            const data = getReportData(selectedReport);

            preview.replaceChildren();

            const title = document.createElement("h2");
            title.textContent = reportTypes[selectedReport];

            const subtitle = document.createElement("p");
            subtitle.textContent =
                "CPP Resident Management System - Demo Report";

            const generated = document.createElement("p");
            generated.textContent =
                "Generated: " + new Date().toLocaleString();

            const count = document.createElement("p");
            count.textContent =
                "Report rows: " + data.rows.length;

            const wrapper = document.createElement("div");
            wrapper.className = "cpp-report-table";

            wrapper.appendChild(buildReportTable(data));

            preview.appendChild(title);
            preview.appendChild(subtitle);
            preview.appendChild(generated);
            preview.appendChild(count);
            preview.appendChild(wrapper);
        }

        select.addEventListener("change", updatePreview);

        actionButton("Generate / Refresh", updatePreview);

        actionButton("Print Report", () => {
            updatePreview();
            window.print();
        });

        actionButton("Export CSV", exportSelectedReport);

        center.appendChild(controls);
        center.appendChild(preview);
        section.appendChild(center);

        updatePreview();

        // Refresh report preview whenever the
        // Reports navigation tab is selected.

        const reportNav = [...document.querySelectorAll(
            ".sidebar button"
        )].find(button =>
            button.textContent.trim() === "Reports"
        );

        if (reportNav) {
            reportNav.addEventListener(
                "click",
                updatePreview
            );
        }
    }

    document.addEventListener(
        "DOMContentLoaded",
        setupReports
    );
})();

/* ==========================================
   CODE #8 - CPP STAFF ACCESS MANAGEMENT
   Demo mode - no real authentication
========================================== */

(function () {
  "use strict";

  const staffKey = "cpp_demo_staff_v8";

  const defaultStaff = [
    {
      id: 1,
      name: "Jordan Miller",
      role: "Administrator",
      status: "Active"
    },
    {
      id: 2,
      name: "Taylor Brooks",
      role: "Supervisor",
      status: "Active"
    },
    {
      id: 3,
      name: "Morgan Davis",
      role: "Staff",
      status: "Active"
    }
  ];

  function loadStaff() {
    try {
      const saved = JSON.parse(localStorage.getItem(staffKey));
      if (Array.isArray(saved)) return saved;
    } catch (error) {
      console.warn("Unable to load demo staff:", error);
    }
    return defaultStaff.map(member => ({ ...member }));
  }

  let staff = loadStaff();

  function saveStaff() {
    localStorage.setItem(staffKey, JSON.stringify(staff));
  }

  function createStaffPanel() {
    let panel = document.getElementById("cpp-staff-v8");
    if (panel) return panel;

    panel = document.createElement("section");
    panel.id = "cpp-staff-v8";
    panel.style.cssText =
      "padding:24px;background:#f3f6fb;min-height:75vh;color:#102849;";

    panel.innerHTML = `
      <h1>Staff Access Management</h1>
      <p>Manage demonstration staff accounts and roles.</p>

      <div style="background:white;padding:20px;
                  border-radius:12px;margin-top:20px;">
        <h2>Add Staff Member</h2>

        <form id="cpp-add-staff-form"
              style="display:flex;gap:12px;flex-wrap:wrap;">
          <input id="cpp-staff-name" type="text"
                 placeholder="Staff full name"
                 maxlength="100" required
                 style="padding:12px;flex:1;min-width:180px;">

          <select id="cpp-staff-role"
                  style="padding:12px;min-width:150px;">
            <option>Staff</option>
            <option>Supervisor</option>
            <option>Administrator</option>
          </select>

          <button type="submit"
                  style="background:#0759ca;color:white;
                         padding:12px 20px;border:0;
                         border-radius:7px;cursor:pointer;">
            Add Staff
          </button>
        </form>
      </div>

      <div style="background:white;padding:20px;
                  border-radius:12px;margin-top:20px;">
        <h2>Staff Directory</h2>
        <div style="overflow-x:auto;">
          <table style="width:100%;border-collapse:collapse;">
            <thead>
              <tr style="background:#e8f0fa;">
                <th style="padding:12px;">Name</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="cpp-staff-table"></tbody>
          </table>
        </div>
      </div>

      <div style="background:white;padding:20px;
                  border-radius:12px;margin-top:20px;">
        <h2>Role Permissions (Demonstration)</h2>
        <p><b>Administrator:</b> All features and staff management.</p>
        <p><b>Supervisor:</b> Resident records, appointments,
           groups, classes, and reports.</p>
        <p><b>Staff:</b> Resident records, appointments,
           and group schedules.</p>
        <p style="color:#a0522d;">
          These permissions are informational only.
          They do not enforce security.
        </p>
      </div>
    `;

    const form = panel.querySelector("#cpp-add-staff-form");

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      const nameInput = panel.querySelector("#cpp-staff-name");
      const roleInput = panel.querySelector("#cpp-staff-role");
      const name = nameInput.value.trim();

      if (!name) return;

      staff.push({
        id: Date.now() + Math.random(),
        name: name,
        role: roleInput.value,
        status: "Active"
      });

      saveStaff();
      nameInput.value = "";
      renderStaff();
    });

    panel.addEventListener("click", function (event) {
      const button = event.target.closest("button[data-staff-action]");
      if (!button) return;

      const id = Number(button.dataset.staffId);
      const member = staff.find(item => item.id === id);
      if (!member) return;

      const action = button.dataset.staffAction;

      if (action === "toggle") {
        member.status =
          member.status === "Active" ? "Disabled" : "Active";
      }

      if (action === "edit") {
        const newName = prompt("Enter staff name:", member.name);
        if (newName === null) return;

        const cleanName = newName.trim();
        if (!cleanName) {
          alert("Staff name cannot be empty.");
          return;
        }

        const newRole = prompt(
          "Enter role: Staff, Supervisor, or Administrator",
          member.role
        );

        if (newRole === null) return;

        const validRoles = [
          "Staff",
          "Supervisor",
          "Administrator"
        ];

        const matchedRole = validRoles.find(
          role => role.toLowerCase() === newRole.trim().toLowerCase()
        );

        if (!matchedRole) {
          alert("Please enter a valid role.");
          return;
        }

        member.name = cleanName;
        member.role = matchedRole;
      }

      if (action === "delete") {
        if (!confirm("Remove this demo staff member?")) return;
        staff = staff.filter(item => item.id !== id);
      }

      saveStaff();
      renderStaff();
    });

    return panel;
  }

  function renderStaff() {
    const tbody = document.getElementById("cpp-staff-table");
    if (!tbody) return;

    tbody.replaceChildren();

    staff.forEach(function (member) {
      const row = document.createElement("tr");
      row.style.borderBottom = "1px solid #e0e5ef";

      [member.name, member.role, member.status].forEach(function (value) {
        const cell = document.createElement("td");
        cell.textContent = value;
        cell.style.padding = "12px";
        row.appendChild(cell);
      });

      const actions = document.createElement("td");
      actions.style.padding = "12px";

      [
        ["edit", "Edit"],
        ["toggle", member.status === "Active" ? "Disable" : "Enable"],
        ["delete", "Remove"]
      ].forEach(function ([action, label]) {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = label;
        button.dataset.staffAction = action;
        button.dataset.staffId = member.id;
        button.style.cssText =
          "margin:3px;padding:8px;border:1px solid #ccd7ea;" +
          "border-radius:5px;background:#eef4ff;cursor:pointer;";
        actions.appendChild(button);
      });

      row.appendChild(actions);
      tbody.appendChild(row);
    });
  }

  function showStaffPanel() {
    const panel = createStaffPanel();

    // Locate the existing Staff Access content area.
    const sections = Array.from(
      document.querySelectorAll(
        "main section, .content section, .main-content section"
      )
    );

    const existing = document.getElementById("staff-access");

    let target = existing;

    if (!target) {
      target = sections.find(section => {
        const heading = section.querySelector("h1,h2");
        return heading &&
          heading.textContent.trim().toLowerCase().includes("staff access");
      });
    }

    if (target) {
      if (!target.contains(panel)) {
        target.appendChild(panel);
      }
    } else {
      const main = document.querySelector(
        "main, .main-content, .content"
      );

      if (!main) {
        alert("Staff content area not found.");
        return;
      }

      if (!main.contains(panel)) {
        main.appendChild(panel);
      }
    }

    // Hide this extension whenever another tab is selected.
    panel.hidden = false;
    panel.style.display = "block";
    renderStaff();
  }

  function initializeStaffAccess() {
    const buttons = Array.from(
      document.querySelectorAll(".sidebar button, nav button")
    );

    const staffButton = buttons.find(button =>
      button.textContent.trim() === "Staff Access"
    );

    if (!staffButton) {
      console.warn("CPP Staff Access navigation not found.");
      return;
    }

    staffButton.addEventListener("click", function () {
      // Allow the original tab navigation to run first.
      setTimeout(showStaffPanel, 0);
    });

    buttons.forEach(button => {
      if (button === staffButton) return;

      button.addEventListener("click", function () {
        const panel = document.getElementById("cpp-staff-v8");
        if (panel) panel.style.display = "none";
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeStaffAccess);
  } else {
    initializeStaffAccess();
  }
})();


/* ==========================================
   CODE #9 - CPP SETTINGS
   Demonstration settings only
========================================== */

(function () {
  "use strict";

  const SETTINGS_KEY = "cpp_demo_settings_v9";

  const defaults = {
    facility: "CPP Resident Management",
    phone: "",
    theme: "light",
    rowsPerPage: "10"
  };

  function loadSettings() {
    try {
      const saved = JSON.parse(localStorage.getItem(SETTINGS_KEY));
      return { ...defaults, ...(saved || {}) };
    } catch {
      return { ...defaults };
    }
  }

  let settings = loadSettings();

  function saveSettings() {
    localStorage.setItem(
      SETTINGS_KEY,
      JSON.stringify(settings)
    );
  }

  function createSettingsPanel() {
    let panel = document.getElementById("cpp-settings-v9");
    if (panel) return panel;

    panel = document.createElement("section");
    panel.id = "cpp-settings-v9";

    panel.style.cssText = `
      padding:24px;
      color:#102849;
      background:#f3f6fb;
      min-height:75vh;
    `;

    panel.innerHTML = `
      <h1>System Settings</h1>
      <p>Configure your CPP demonstration application.</p>

      <div style="background:white;padding:20px;
                  border-radius:12px;margin:20px 0;">
        <h2>Facility Information</h2>

        <label for="cpp-facility-name">Facility Name</label>
        <input id="cpp-facility-name" type="text"
               maxlength="100"
               style="display:block;padding:12px;
                      width:100%;max-width:500px;
                      margin:8px 0 16px;">

        <label for="cpp-facility-phone">Contact Phone</label>
        <input id="cpp-facility-phone" type="tel"
               maxlength="30"
               style="display:block;padding:12px;
                      width:100%;max-width:500px;
                      margin:8px 0 16px;">

        <button id="cpp-save-settings"
                style="padding:12px 20px;background:#0759ca;
                       color:white;border:0;border-radius:7px;">
          Save Settings
        </button>
      </div>

      <div style="background:white;padding:20px;
                  border-radius:12px;margin:20px 0;">
        <h2>Dashboard Preferences</h2>

        <label for="cpp-theme">Theme Preference</label>
        <select id="cpp-theme"
                style="display:block;padding:12px;margin:8px 0 16px;">
          <option value="light">Light</option>
          <option value="dark">Dark (future feature)</option>
        </select>

        <label for="cpp-page-size">Preferred Rows Per Page</label>
        <select id="cpp-page-size"
                style="display:block;padding:12px;margin:8px 0;">
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
        </select>

        <p>Preferences are saved for future feature integration.</p>
      </div>

      <div style="background:white;padding:20px;
                  border-radius:12px;margin:20px 0;">
        <h2>Data Management</h2>

        <button id="cpp-export-demo"
                style="padding:12px;background:#0759ca;
                       color:white;border:0;border-radius:7px;">
          Export Demo Backup
        </button>

        <p style="margin-top:12px;">
          This backup contains only CPP demonstration
          settings and demo staff data.
        </p>
      </div>

      <div style="background:white;padding:20px;
                  border-radius:12px;margin:20px 0;">
        <h2>System Information</h2>
        <p><b>Application:</b> CPP Resident Management System</p>
        <p><b>Version:</b> 0.9 Demo</p>
        <p><b>Environment:</b> Local browser prototype</p>

        <button id="cpp-reset-settings"
                style="padding:12px;background:#a92f2f;
                       color:white;border:0;border-radius:7px;">
          Reset Settings
        </button>
      </div>
    `;

    panel.querySelector("#cpp-save-settings")
      .addEventListener("click", function () {
        settings.facility = panel
          .querySelector("#cpp-facility-name").value.trim();

        settings.phone = panel
          .querySelector("#cpp-facility-phone").value.trim();

        settings.theme = panel
          .querySelector("#cpp-theme").value;

        settings.rowsPerPage = panel
          .querySelector("#cpp-page-size").value;

        saveSettings();
        alert("Demo settings saved successfully.");
      });

    panel.querySelector("#cpp-reset-settings")
      .addEventListener("click", function () {
        if (!confirm("Restore default demo settings?")) return;

        settings = { ...defaults };
        saveSettings();
        populateSettings();
        alert("Settings restored.");
      });

    panel.querySelector("#cpp-export-demo")
      .addEventListener("click", function () {
        let demoStaff = [];

        try {
          demoStaff = JSON.parse(
            localStorage.getItem("cpp_demo_staff_v8")
          ) || [];
        } catch {
          demoStaff = [];
        }

        const backup = {
          app: "CPP Resident Management Demo",
          version: "0.9",
          exportedAt: new Date().toISOString(),
          settings: settings,
          demoStaff: demoStaff
        };

        const blob = new Blob(
          [JSON.stringify(backup, null, 2)],
          { type: "application/json" }
        );

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = "CPP-Demo-Backup.json";
        link.click();

        setTimeout(() => URL.revokeObjectURL(url), 1000);
      });

    return panel;
  }

  function populateSettings() {
    const panel = document.getElementById("cpp-settings-v9");
    if (!panel) return;

    panel.querySelector("#cpp-facility-name").value =
      settings.facility;

    panel.querySelector("#cpp-facility-phone").value =
      settings.phone;

    panel.querySelector("#cpp-theme").value =
      settings.theme;

    panel.querySelector("#cpp-page-size").value =
      settings.rowsPerPage;
  }

  function showSettings() {
    const panel = createSettingsPanel();

    let target = document.getElementById("settings");

    if (!target) {
      target = Array.from(
        document.querySelectorAll(
          "main section, .content section, .main-content section"
        )
      ).find(section => {
        const heading = section.querySelector("h1,h2");

        return heading &&
          heading.textContent.trim().toLowerCase() === "settings";
      });
    }

    if (target) {
      if (!target.contains(panel)) target.appendChild(panel);
    } else {
      const main = document.querySelector(
        "main, .main-content, .content"
      );

      if (!main) {
        alert("Settings content area not found.");
        return;
      }

      if (!main.contains(panel)) main.appendChild(panel);
    }

    panel.hidden = false;
    panel.style.display = "block";
    populateSettings();
  }

  function initializeSettings() {
    const buttons = Array.from(
      document.querySelectorAll(".sidebar button, nav button")
    );

    const settingsButton = buttons.find(button =>
      button.textContent.trim() === "Settings"
    );

    if (!settingsButton) {
      console.warn("Settings navigation button not found.");
      return;
    }

    settingsButton.addEventListener("click", function () {
      setTimeout(showSettings, 0);
    });

    buttons.forEach(button => {
      if (button === settingsButton) return;

      button.addEventListener("click", function () {
        const panel = document.getElementById("cpp-settings-v9");

        if (panel) {
          panel.style.display = "none";
        }
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initializeSettings
    );
  } else {
    initializeSettings();
  }
})();

/* ==========================================
   CODE #10 - ADVANCED CPP DASHBOARD
   Demonstration dashboard enhancement
========================================== */

(function () {
  "use strict";

  const panelId = "cpp-dashboard-v10";

  function getStaffCount() {
    try {
      const saved = JSON.parse(
        localStorage.getItem("cpp_demo_staff_v8")
      );

      if (Array.isArray(saved)) {
        return saved.filter(
          member => member.status === "Active"
        ).length;
      }
    } catch (error) {
      console.warn("Unable to read demo staff:", error);
    }

    return 3; // Default demonstration staff
  }

  function makeCard(label, value, description) {
    const card = document.createElement("div");

    card.style.cssText = `
      background:white;
      padding:22px;
      border-radius:12px;
      border:1px solid #dce5f2;
      flex:1 1 190px;
      min-width:0;
    `;

    const heading = document.createElement("h3");
    heading.textContent = label;
    heading.style.cssText =
      "font-size:16px;margin:0 0 12px;color:#344b6c;";

    const number = document.createElement("div");
    number.textContent = value;
    number.style.cssText =
      "font-size:34px;font-weight:bold;color:#0759ca;";

    const details = document.createElement("p");
    details.textContent = description;
    details.style.cssText =
      "font-size:13px;color:#64748b;margin:8px 0 0;";

    card.append(heading, number, details);

    return card;
  }

  function findNavigationButton(name) {
    return Array.from(
      document.querySelectorAll(".sidebar button, nav button")
    ).find(button => button.textContent.trim() === name);
  }

  function addShortcut(container, label, destination) {
    const button = document.createElement("button");

    button.type = "button";
    button.textContent = label;

    button.style.cssText = `
      background:#0759ca;
      color:white;
      padding:12px 18px;
      border:0;
      border-radius:8px;
      cursor:pointer;
      margin:5px;
    `;

    button.addEventListener("click", () => {
      const nav = findNavigationButton(destination);

      if (nav) {
        nav.click();
      } else {
        alert(destination + " navigation not found.");
      }
    });

    container.appendChild(button);
  }

  function createDashboardPanel() {
    let panel = document.getElementById(panelId);

    if (panel) return panel;

    panel = document.createElement("section");
    panel.id = panelId;

    panel.style.cssText = `
      padding:24px;
      background:#f3f6fb;
      color:#102849;
      min-height:75vh;
    `;

    const title = document.createElement("h1");
    title.textContent = "CPP Management Dashboard";

    const subtitle = document.createElement("p");
    subtitle.textContent =
      "Resident management and scheduling overview — Demo Mode";

    const cards = document.createElement("div");
    cards.id = "cpp-dashboard-cards";

    cards.style.cssText = `
      display:flex;
      gap:15px;
      flex-wrap:wrap;
      margin:25px 0;
    `;

    const quickBox = document.createElement("div");
    quickBox.style.cssText = `
      background:white;
      padding:20px;
      border-radius:12px;
      margin-bottom:20px;
    `;

    const quickTitle = document.createElement("h2");
    quickTitle.textContent = "Quick Actions";

    const quickButtons = document.createElement("div");

    addShortcut(quickButtons, "View Residents", "Residents");
    addShortcut(quickButtons, "View Appointments", "Appointments");
    addShortcut(quickButtons, "Groups & Classes", "Groups & Classes");
    addShortcut(quickButtons, "Generate Reports", "Reports");

    quickBox.append(quickTitle, quickButtons);

    const upcomingBox = document.createElement("div");
    upcomingBox.style.cssText = `
      background:white;
      padding:20px;
      border-radius:12px;
      margin-bottom:20px;
    `;

    const upcomingTitle = document.createElement("h2");
    upcomingTitle.textContent = "Upcoming Activity";

    const upcomingDescription = document.createElement("p");
    upcomingDescription.textContent =
      "Open Appointments or Groups & Classes to review " +
      "current demonstration schedules.";

    const upcomingButtons = document.createElement("div");

    addShortcut(
      upcomingButtons,
      "Appointments & Court Dates",
      "Appointments"
    );

    addShortcut(
      upcomingButtons,
      "Group Schedules",
      "Groups & Classes"
    );

    upcomingBox.append(
      upcomingTitle,
      upcomingDescription,
      upcomingButtons
    );

    const searchBox = document.createElement("div");
    searchBox.style.cssText = `
      background:white;
      padding:20px;
      border-radius:12px;
      margin-bottom:20px;
    `;

    const searchTitle = document.createElement("h2");
    searchTitle.textContent = "Resident Search";

    const searchInput = document.createElement("input");
    searchInput.type = "search";
    searchInput.placeholder = "Enter resident name";
    searchInput.setAttribute("aria-label", "Resident name");

    searchInput.style.cssText = `
      padding:12px;
      width:100%;
      max-width:380px;
      margin-right:10px;
      border:1px solid #ccd7ea;
      border-radius:7px;
    `;

    const searchButton = document.createElement("button");
    searchButton.type = "button";
    searchButton.textContent = "Open Residents";

    searchButton.style.cssText = `
      padding:12px 18px;
      background:#0759ca;
      color:white;
      border:0;
      border-radius:7px;
      cursor:pointer;
    `;

    searchButton.addEventListener("click", () => {
      const nav = findNavigationButton("Residents");

      if (nav) {
        nav.click();
      }

      // Name is retained in the search field;
      // existing resident search is not automatically filtered.
    });

    searchBox.append(searchTitle, searchInput, searchButton);

    panel.append(
      title,
      subtitle,
      cards,
      quickBox,
      upcomingBox,
      searchBox
    );

    return panel;
  }

  function refreshDashboard() {
    const cards = document.getElementById("cpp-dashboard-cards");
    if (!cards) return;

    cards.replaceChildren();

    cards.append(
      makeCard(
        "Residents",
        "4",
        "Sample resident roster count"
      ),
      makeCard(
        "Active Staff",
        String(getStaffCount()),
        "Demonstration staff accounts"
      ),
      makeCard(
        "Appointments",
        "—",
        "Open the appointment schedule"
      ),
      makeCard(
        "Groups & Classes",
        "—",
        "Open the group schedule"
      )
    );
  }

  function showDashboard() {
    const panel = createDashboardPanel();

    let target = document.getElementById("dashboard");

    if (!target) {
      target = Array.from(
        document.querySelectorAll(
          "main section, .content section, .main-content section"
        )
      ).find(section => {
        const heading = section.querySelector("h1,h2");
        return heading &&
          heading.textContent.trim().toLowerCase() === "dashboard";
      });
    }

    if (target) {
      if (!target.contains(panel)) target.appendChild(panel);
    } else {
      const main = document.querySelector(
        "main, .main-content, .content"
      );

      if (!main) {
        alert("Dashboard content area not found.");
        return;
      }

      if (!main.contains(panel)) main.appendChild(panel);
    }

    panel.hidden = false;
    panel.style.display = "block";

    refreshDashboard();
  }

  function initializeDashboard() {
    const buttons = Array.from(
      document.querySelectorAll(".sidebar button, nav button")
    );

    const dashboardButton = findNavigationButton("Dashboard");

    if (!dashboardButton) {
      console.warn("Dashboard navigation not found.");
      return;
    }

    dashboardButton.addEventListener("click", function () {
      setTimeout(showDashboard, 0);
    });

    buttons.forEach(button => {
      if (button === dashboardButton) return;

      button.addEventListener("click", function () {
        const panel = document.getElementById(panelId);

        if (panel) {
          panel.style.display = "none";
        }
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initializeDashboard
    );
  } else {
    initializeDashboard();
  }
})();

/* ==========================================
   CODE #11 - LIVE DASHBOARD AND SEARCH
   Works with existing Code #10
   Demonstration data only
========================================== */

(function () {
  "use strict";

  const countLabels = {
    Residents: "Residents",
    Appointments: "Appointments",
    "Groups & Classes": "Groups & Classes"
  };

  const counts = {};

  function findNav(name) {
    return Array.from(
      document.querySelectorAll(".sidebar button, nav button")
    ).find(button => button.textContent.trim() === name);
  }

  function visible(element) {
    return !!element &&
      element.getClientRects().length > 0 &&
      getComputedStyle(element).visibility !== "hidden";
  }

  function getContentTables() {
    const main = document.querySelector(
      "main, .main-content, .content"
    );

    if (!main) return [];

    return Array.from(main.querySelectorAll("table"))
      .filter(visible);
  }

 

function getResidentTable() {
  const residentList = document.getElementById("residentList");

  if (!residentList) {
    return null;
  }

  return residentList.querySelector("table");
}



  function getRows(table) {
    if (!table) return [];

    const body = table.tBodies[0];
    if (!body) return [];

    return Array.from(body.rows).filter(row =>
      row.cells.length > 0 &&
      !row.querySelector("td[colspan]")
    );
  }

  function filterResidentTable(name) {
    const table = getResidentTable();

    if (!table) {
      alert(
        "The resident table could not be identified. " +
        "Open the Residents tab and check its table."
      );
      return;
    }

    const rows = getRows(table);
    const search = name.trim().toLowerCase();

    let matches = 0;

    rows.forEach(row => {
      const text = row.textContent.toLowerCase();
      const matched = !search || text.includes(search);

      row.style.display = matched ? "" : "none";

      if (matched) matches++;
    });

   
const oldMessage = document.getElementById(
  "cpp-search-feedback-v11"
);

if (oldMessage) {
  oldMessage.remove();
}


    table.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }

  function collectCount(sectionName) {
    const nav = findNav(sectionName);
    if (!nav) return;

    // Collect only when this is the selected section.
    const active = nav.classList.contains("active") ||
      nav.getAttribute("aria-current") === "page" ||
      nav.getAttribute("aria-selected") === "true";

    if (!active) return;

    let table = null;

    if (sectionName === "Residents") {
      table = getResidentTable();
    } else {
      table = getContentTables()[0] || null;
    }

    if (table) {
      counts[sectionName] = getRows(table).length;
    }
  }

  function updateDashboardCards() {
    const cards = document.getElementById(
      "cpp-dashboard-cards"
    );

    if (!cards) return;

    Array.from(cards.children).forEach(card => {
      const heading = card.querySelector("h3");
      if (!heading) return;

      const label = heading.textContent.trim();

      if (!(label in countLabels)) return;

      const valueElement = card.querySelector("div");
      const description = card.querySelector("p");

      if (!valueElement || !description) return;

      if (typeof counts[label] === "number") {
        valueElement.textContent = counts[label];

        description.textContent =
          "Count from demonstration table";
      } else if (label === "Residents") {
        valueElement.textContent = "—";
        description.textContent =
          "Open Residents to load the count";
      }
    });
  }

  function initializeLiveDashboard() {
    const dashboard = findNav("Dashboard");
    const residentNav = findNav("Residents");

    if (!dashboard || !residentNav) {
      console.warn("CPP dashboard navigation unavailable.");
      return;
    }

    // Read a section's table after opening it.
    Object.keys(countLabels).forEach(name => {
      const nav = findNav(name);
      if (!nav) return;

      nav.addEventListener("click", function () {
        setTimeout(() => collectCount(name), 150);
      });
    });

    dashboard.addEventListener("click", function () {
      setTimeout(updateDashboardCards, 150);
    });

    // Attach to the search button created by Code #10.
    function connectSearch() {
      const panel = document.getElementById(
        "cpp-dashboard-v10"
      );

      if (!panel || panel.dataset.searchV11 === "ready") {
        return;
      }

      const input = panel.querySelector(
        'input[type="search"]'
      );

      const button = Array.from(
        panel.querySelectorAll("button")
      ).find(item =>
        item.textContent.trim() === "Open Residents"
      );

      if (!input || !button) return;

      panel.dataset.searchV11 = "ready";

      button.addEventListener("click", function () {
        const name = input.value;

        setTimeout(() => {
        // filterResidentTable(name);
        }, 200);
      });

      input.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
          event.preventDefault();
          button.click();
        }
      });
    }

    // Code #10 creates the panel when Dashboard opens.
    dashboard.addEventListener("click", function () {
      setTimeout(connectSearch, 100);
    });

    connectSearch();
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initializeLiveDashboard
    );
  } else {
    initializeLiveDashboard();
  }
})();


/* CODE #11 - RESIDENT SEARCH CONNECTION FIX */

(function () {
  "use strict";

  function connectResidentSearch() {
    const dashboard = document.getElementById("cpp-dashboard-v10");

    if (!dashboard || dashboard.dataset.searchFixConnected) {
      return;
    }

    const dashboardInput = dashboard.querySelector(
      'input[type="search"]'
    );

    const searchButton = Array.from(
      dashboard.querySelectorAll("button")
    ).find(button =>
      button.textContent.trim() === "Open Residents"
    );

    if (!dashboardInput || !searchButton) return;

    dashboard.dataset.searchFixConnected = "true";

    // Run after the previous dashboard navigation handlers.
    searchButton.addEventListener("click", function () {
      const name = dashboardInput.value.trim();

      setTimeout(function () {
        const residentList = document.getElementById("residentList");

        if (!residentList) return;

        const residentSearch = residentList.querySelector(
          'input[type="search"]'
        );

        if (!residentSearch) return;

        residentSearch.value = name;

        residentSearch.dispatchEvent(
          new Event("input", { bubbles: true })
        );

      }, 350);
    });
  }

  function initializeSearchFix() {
    const buttons = Array.from(
      document.querySelectorAll(".sidebar button, nav button")
    );

    const dashboardButton = buttons.find(button =>
      button.textContent.trim() === "Dashboard"
    );

    if (dashboardButton) {
      dashboardButton.addEventListener("click", function () {
        setTimeout(connectResidentSearch, 150);
      });
    }

    connectResidentSearch();
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initializeSearchFix
    );
  } else {
    initializeSearchFix();
  }
})();

/* ==========================================
   CODE #12 - LIVE DASHBOARD COUNTS
   PART 1 - RESIDENTS AND STAFF
========================================== */

(function () {
  "use strict";

  function updateLiveCounts() {
    const cards = document.getElementById(
      "cpp-dashboard-cards"
    );

    if (!cards) return;

    const cardList = Array.from(cards.children);

    function updateCard(label, count, description) {
      const card = cardList.find(item => {
        const heading = item.querySelector("h3");
        return heading &&
          heading.textContent.trim() === label;
      });

      if (!card) return;

      const value = card.querySelector("div");
      const details = card.querySelector("p");

      if (value) value.textContent = String(count);
      if (details) details.textContent = description;
    }

    // Read the demonstration resident collection.
    if (
      typeof residents !== "undefined" &&
      Array.isArray(residents)
    ) {
      updateCard(
        "Residents",
        residents.length,
        "Total demonstration residents"
      );
    }

    // Read saved demonstration staff accounts.
    try {
      const saved = JSON.parse(
        localStorage.getItem("cpp_demo_staff_v8")
      );

      if (Array.isArray(saved)) {
        const active = saved.filter(
          member => member.status === "Active"
        );

        updateCard(
          "Active Staff",
          active.length,
          "Active demonstration staff"
        );
      }
    } catch (error) {
      console.warn("Unable to read demo staff.", error);
    }
  }

  function initializeLiveCounts() {
    const buttons = Array.from(
      document.querySelectorAll(
        ".sidebar button, nav button"
      )
    );

    const dashboardButton = buttons.find(
      button =>
        button.textContent.trim() === "Dashboard"
    );

    if (!dashboardButton) return;

    dashboardButton.addEventListener("click", function () {
      // Allow the existing dashboard to render first.
      setTimeout(updateLiveCounts, 300);
    });

    setTimeout(updateLiveCounts, 300);
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initializeLiveCounts
    );
  } else {
    initializeLiveCounts();
  }
})();


/* ==========================================
   CODE #12 - PART 3
   LIVE GROUPS & CLASSES COUNT
========================================== */

(function () {
  "use strict";

  function updateGroupsCount() {
    const cards = document.getElementById(
      "cpp-dashboard-cards"
    );

    if (!cards) return;

    const groupCard = Array.from(cards.children).find(card => {
      const heading = card.querySelector("h3");

      return heading &&
        heading.textContent.trim() === "Groups & Classes";
    });

    if (!groupCard) return;

    if (
      typeof cppPrograms === "undefined" ||
      !Array.isArray(cppPrograms)
    ) {
      console.warn("CPP programs are not available.");
      return;
    }

    const number = groupCard.querySelector("div");
    const description = groupCard.querySelector("p");

    if (number) {
      number.textContent = String(cppPrograms.length);
    }

    if (description) {
      description.textContent =
        "Total demonstration groups and classes";
    }
  }

  function initializeGroupsCount() {
    const dashboardButton = Array.from(
      document.querySelectorAll(
        ".sidebar button, nav button"
      )
    ).find(button =>
      button.textContent.trim() === "Dashboard"
    );

    if (!dashboardButton) return;

    dashboardButton.addEventListener("click", function () {
      setTimeout(updateGroupsCount, 400);
    });

    setTimeout(updateGroupsCount, 400);
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initializeGroupsCount
    );
  } else {
    initializeGroupsCount();
  }
})();


/* ==========================================
   CODE #14 - APPOINTMENT ALERT CENTER
   CPP Resident Management System
   Fictional demonstration records only
========================================== */

(function () {
  "use strict";

  const PANEL_ID = "cpp-alert-center-v14";

  function localDate(value) {
    if (!value) return null;

    const dateText = String(value).slice(0, 10);
    const parts = dateText.split("-").map(Number);

    if (parts.length !== 3) return null;

    const [year, month, day] = parts;

    const date = new Date(year, month - 1, day);

    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      return null;
    }

    date.setHours(0, 0, 0, 0);
    return date;
  }

  function daysUntil(value) {
    const appointmentDate = localDate(value);
    if (!appointmentDate) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return Math.round(
      (appointmentDate - today) / 86400000
    );
  }

  function getAlerts() {
    if (
      typeof appointments === "undefined" ||
      !Array.isArray(appointments)
    ) {
      return [];
    }

    
return appointments
  .filter(item =>
    !["completed", "cancelled"].includes(
      String(item.status || "Scheduled").toLowerCase()
    )
  )
  .map(item => {

        const days = daysUntil(item.date);

        if (days === null) return null;

        const type = String(item.type || "");
        const isCourt = type.toLowerCase().includes("court");

        let status = "Scheduled";

        if (days < 0) {
          status = "Past scheduled date";
        } else if (days === 0) {
          status = "Today";
        } else if (days <= 7) {
          status = isCourt
            ? "Court reminder"
            : "Due soon";
        }

        return {
          ...item,
          days,
          isCourt,
          status
        };
      })
      .filter(Boolean)
      .sort((a, b) => {
        return a.days - b.days;
      });
  }

  function getResidentLabel(id) {
    if (typeof getResidentName === "function") {
      return getResidentName(id);
    }

    return "Resident record";
  }

  function createAlertCenter() {
    let panel = document.getElementById(PANEL_ID);

    if (panel) return panel;

    const dashboard = document.getElementById("dashboard");

    if (!dashboard) return null;

    panel = document.createElement("div");
    panel.id = PANEL_ID;

    panel.style.cssText = `
      background:white;
      border:1px solid #dce5f2;
      border-radius:12px;
      padding:24px;
      margin:24px 0;
      color:#102849;
    `;

    const heading = document.createElement("h2");
    heading.textContent = "Appointment Alert Center";

    const description = document.createElement("p");
    description.textContent =
      "Upcoming reminders and past scheduled dates " +
      "for demonstration appointments.";

    const summary = document.createElement("div");
    summary.id = "cpp-alert-summary-v14";

    summary.style.cssText = `
      display:flex;
      flex-wrap:wrap;
      gap:12px;
      margin:20px 0;
    `;

    const tableWrapper = document.createElement("div");
    tableWrapper.style.overflowX = "auto";

    const table = document.createElement("table");
    table.style.cssText = `
      width:100%;
      border-collapse:collapse;
      font-size:14px;
    `;

    const headers = [
      "Resident",
      "Date",
      "Type",
      "Status"
    ];

    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");

    headers.forEach(label => {
      const th = document.createElement("th");
      th.textContent = label;
      th.style.cssText = `
        text-align:left;
        background:#e8f0fa;
        padding:12px;
      `;
      headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);

    const tbody = document.createElement("tbody");
    tbody.id = "cpp-alert-rows-v14";

    table.append(thead, tbody);
    tableWrapper.appendChild(table);

    panel.append(
      heading,
      description,
      summary,
      tableWrapper
    );

    dashboard.appendChild(panel);

    return panel;
  }

  function addSummary(container, title, count, color) {
    const box = document.createElement("div");

    box.style.cssText = `
      border-left:4px solid ${color};
      background:#f3f6fb;
      border-radius:8px;
      padding:14px;
      flex:1 1 160px;
    `;

    const label = document.createElement("div");
    label.textContent = title;

    const value = document.createElement("strong");
    value.textContent = String(count);
    value.style.fontSize = "28px";

    box.append(label, value);
    container.appendChild(box);
  }

  function refreshAlerts() {
    const panel = createAlertCenter();
    if (!panel) return;

    const alerts = getAlerts();

    const summary = document.getElementById(
      "cpp-alert-summary-v14"
    );

    const tbody = document.getElementById(
      "cpp-alert-rows-v14"
    );

    summary.replaceChildren();
    tbody.replaceChildren();

    const dueSoon = alerts.filter(item =>
      item.days >= 0 && item.days <= 7
    );

    const courtSoon = dueSoon.filter(item => item.isCourt);

    const past = alerts.filter(item => item.days < 0);

    addSummary(
      summary,
      "Due Within 7 Days",
      dueSoon.length,
      "#0d6efd"
    );

    addSummary(
      summary,
      "Court Reminders",
      courtSoon.length,
      "#9333ea"
    );

    addSummary(
      summary,
      "Past Scheduled Dates",
      past.length,
      "#d97706"
    );

    // Show past dates and appointments due within 7 days.
    const visibleAlerts = alerts.filter(
      item => item.days <= 7
    );

    if (visibleAlerts.length === 0) {
      const row = document.createElement("tr");
      const cell = document.createElement("td");

      cell.colSpan = 4;
      cell.textContent =
        "No appointments requiring attention right now.";
      cell.style.padding = "16px";

      row.appendChild(cell);
      tbody.appendChild(row);
      return;
    }

    visibleAlerts.forEach(item => {
      const row = document.createElement("tr");

      if (item.isCourt) {
        row.style.background = "#f5edff";
      } else if (item.days < 0) {
        row.style.background = "#fff5e8";
      }

      const values = [
        getResidentLabel(item.residentId),
        item.date,
        item.type,
        item.status
      ];

      values.forEach(value => {
        const cell = document.createElement("td");

        cell.textContent = String(value ?? "");
        cell.style.cssText = `
          padding:12px;
          border-bottom:1px solid #e2e8f0;
        `;

        row.appendChild(cell);
      });

      tbody.appendChild(row);
    });
  }

  function initializeAlertCenter() {
    const dashboardButton = Array.from(
      document.querySelectorAll(
        ".sidebar button, nav button"
      )
    ).find(button =>
      button.textContent.trim() === "Dashboard"
    );

    if (dashboardButton) {
      dashboardButton.addEventListener("click", function () {
        setTimeout(refreshAlerts, 200);
      });
    }

    refreshAlerts();
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initializeAlertCenter
    );
  } else {
    initializeAlertCenter();
  }
})();


/* ==========================================
   CODE #15 - APPOINTMENT STATUS TRACKING
   CPP Resident Management Demo
========================================== */

(function () {
  "use strict";

  const PANEL_ID = "cpp-status-panel-v15";

  const statuses = [
    "Scheduled",
    "Completed",
    "Cancelled",
    "Rescheduled"
  ];

  function getAppointments() {
    if (
      typeof appointments !== "undefined" &&
      Array.isArray(appointments)
    ) {
      return appointments;
    }

    return [];
  }

  function createStatusPanel() {
    let panel = document.getElementById(PANEL_ID);
    if (panel) return panel;

    const section = document.getElementById("appointments");
    if (!section) return null;

    panel = document.createElement("div");
    panel.id = PANEL_ID;

    panel.style.cssText = `
      background:white;
      padding:24px;
      margin:24px 0;
      border:1px solid #dce5f2;
      border-radius:12px;
      color:#102849;
    `;

    panel.innerHTML = `
      <h2>Appointment Status Management</h2>
      <p>Update saved demonstration appointment records.</p>

      <div style="display:grid;gap:15px;
                  max-width:650px;margin-top:20px;">

        <label for="cpp-v15-appointment">
          Select Appointment
        </label>
        <select id="cpp-v15-appointment"
                style="padding:12px;">
        </select>

        <label for="cpp-v15-status">
          Appointment Status
        </label>
        <select id="cpp-v15-status"
                style="padding:12px;">
          <option>Scheduled</option>
          <option>Completed</option>
          <option>Cancelled</option>
          <option>Rescheduled</option>
        </select>

        <label for="cpp-v15-date">Appointment Date</label>
        <input id="cpp-v15-date"
               type="date"
               style="padding:12px;">

        <label for="cpp-v15-time">Appointment Time</label>
        <input id="cpp-v15-time"
               type="time"
               style="padding:12px;">

        <button id="cpp-v15-save"
                type="button"
                style="background:#0759ca;
                       color:white;
                       border:0;
                       padding:13px;
                       border-radius:7px;
                       cursor:pointer;">
          Save Appointment Changes
        </button>

        <p id="cpp-v15-message" role="status"></p>
      </div>
    `;

    section.appendChild(panel);

    panel.querySelector("#cpp-v15-appointment")
      .addEventListener("change", populateSelection);

    panel.querySelector("#cpp-v15-save")
      .addEventListener("click", saveChanges);

    return panel;
  }

  function getSelectedAppointment() {
    const panel = document.getElementById(PANEL_ID);
    if (!panel) return null;

    const select = panel.querySelector("#cpp-v15-appointment");
    const index = Number(select.value);

    if (select.value === "") return null;

    return getAppointments()[index] || null;
  }

  function populateSelection() {
    const panel = document.getElementById(PANEL_ID);
    const item = getSelectedAppointment();

    if (!panel || !item) return;

    panel.querySelector("#cpp-v15-status").value =
      statuses.includes(item.status)
        ? item.status
        : "Scheduled";

    panel.querySelector("#cpp-v15-date").value =
      String(item.date || "").slice(0, 10);

    const time = String(item.time || "");
    panel.querySelector("#cpp-v15-time").value =
      /^\d{2}:\d{2}/.test(time) ? time.slice(0, 5) : "";
  }

  function refreshStatusPanel() {
    const panel = createStatusPanel();
    if (!panel) return;

    const select = panel.querySelector("#cpp-v15-appointment");
    const previous = select.value;

    select.replaceChildren();

    const records = getAppointments();

    records.forEach((item, index) => {
      const option = document.createElement("option");
      option.value = String(index);

      const resident =
        typeof getResidentName === "function"
          ? getResidentName(item.residentId)
          : "Resident";

      option.textContent =
        resident + " - " +
        item.date + " - " +
        item.type;

      select.appendChild(option);
    });

    if (records.length === 0) {
      const option = document.createElement("option");
      option.value = "";
      option.textContent = "No appointments available";
      select.appendChild(option);
    } else if (
      Array.from(select.options).some(
        option => option.value === previous
      )
    ) {
      select.value = previous;
    }

    populateSelection();
  }

  function saveChanges() {
    const panel = document.getElementById(PANEL_ID);
    const item = getSelectedAppointment();

    if (!panel || !item) {
      alert("Select an appointment first.");
      return;
    }

    const status =
      panel.querySelector("#cpp-v15-status").value;

    const date =
      panel.querySelector("#cpp-v15-date").value;

    const time =
      panel.querySelector("#cpp-v15-time").value;

    if (!statuses.includes(status)) {
      alert("Select a valid status.");
      return;
    }

    if (!date || !time) {
      alert("Enter a valid appointment date and time.");
      return;
    }

    // Preserve existing values for saving.
    const oldValues = {
      status: item.status,
      date: item.date,
      time: item.time
    };

    item.status = status;
    item.date = date;
    item.time = time;

    try {
      saveData();
      refreshApplication();

      refreshStatusPanel();

      panel.querySelector("#cpp-v15-message").textContent =
        "Appointment changes saved successfully.";

    } catch (error) {
      item.status = oldValues.status;
      item.date = oldValues.date;
      item.time = oldValues.time;

      console.error(error);
      alert("Unable to save appointment changes.");
    }
  }

  function initializeStatusTracking() {
    const buttons = Array.from(
      document.querySelectorAll(
        ".sidebar button, nav button"
      )
    );

    const appointmentButton = buttons.find(
      button =>
        button.textContent.trim() === "Appointments"
    );

    if (appointmentButton) {
      appointmentButton.addEventListener("click", function () {
        setTimeout(refreshStatusPanel, 200);
      });
    }

    refreshStatusPanel();
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initializeStatusTracking
    );
  } else {
    initializeStatusTracking();
  }
})();


/* ==========================================
   CODE #16 - APPOINTMENT HISTORY & REPORTS
   CPP Resident Management System
   Fictional demonstration data only
========================================== */

(function () {
  "use strict";

  const PANEL_ID = "cpp-history-v16";
  const DATA_KEY = "cpp_demo_appointments";

  let historyRecords = [];

  function loadHistory() {
    try {
      const saved = localStorage.getItem(DATA_KEY);

      if (saved !== null) {
        const records = JSON.parse(saved);
        if (Array.isArray(records)) return records;
      }
    } catch (error) {
      console.warn("Unable to load appointment history.", error);
    }

    // Use the active demo array if no saved copy exists.
    if (
      typeof appointments !== "undefined" &&
      Array.isArray(appointments)
    ) {
      return appointments.slice();
    }

    return [];
  }

  function residentName(item) {
    if (typeof getResidentName === "function") {
      return getResidentName(item.residentId);
    }

    return "Resident ID: " + (item.residentId ?? "Unknown");
  }

  function appointmentStatus(item) {
    const status = String(item.status || "Scheduled").trim();
    return status || "Scheduled";
  }

  function createHistoryPanel() {
    let panel = document.getElementById(PANEL_ID);
    if (panel) return panel;

    const section = document.getElementById("appointments");
    if (!section) return null;

    panel = document.createElement("section");
    panel.id = PANEL_ID;

    panel.style.cssText = `
      background:white;
      padding:24px;
      margin:24px 0;
      border:1px solid #dce5f2;
      border-radius:12px;
      color:#102849;
    `;

    panel.innerHTML = `
      <h2>Appointment History & Status Reports</h2>
      <p>Review and export demonstration appointment history.</p>

      <div style="display:flex;gap:12px;
                  flex-wrap:wrap;margin:20px 0;">

        <div style="flex:1;min-width:180px;">
          <label for="cpp-history-search">
            Search Resident
          </label>
          <input id="cpp-history-search"
                 type="search"
                 placeholder="Enter resident name"
                 style="width:100%;padding:12px;
                        margin-top:7px;">
        </div>

        <div style="flex:1;min-width:180px;">
          <label for="cpp-history-status">
            Filter by Status
          </label>
          <select id="cpp-history-status"
                  style="width:100%;padding:12px;
                         margin-top:7px;">
            <option value="All">All Statuses</option>
            <option>Scheduled</option>
            <option>Completed</option>
            <option>Cancelled</option>
            <option>Rescheduled</option>
          </select>
        </div>
      </div>

      <div id="cpp-history-summary"
           style="display:flex;gap:12px;
                  flex-wrap:wrap;margin:20px 0;">
      </div>

      <div style="display:flex;gap:10px;
                  flex-wrap:wrap;margin-bottom:18px;">

        <button id="cpp-history-refresh"
                type="button"
                style="background:#0759ca;color:white;
                       padding:12px 18px;border:0;
                       border-radius:7px;cursor:pointer;">
          Refresh History
        </button>

        <button id="cpp-history-export"
                type="button"
                style="background:#147d54;color:white;
                       padding:12px 18px;border:0;
                       border-radius:7px;cursor:pointer;">
          Export History CSV
        </button>
      </div>

      <p id="cpp-history-count" role="status"></p>

      <div style="overflow-x:auto;">
        <table style="width:100%;border-collapse:collapse;">
          <thead>
            <tr style="background:#e8f0fa;">
              <th style="padding:12px;text-align:left;">Resident</th>
              <th style="padding:12px;text-align:left;">Date</th>
              <th style="padding:12px;text-align:left;">Time</th>
              <th style="padding:12px;text-align:left;">Type</th>
              <th style="padding:12px;text-align:left;">Status</th>
            </tr>
          </thead>
          <tbody id="cpp-history-rows"></tbody>
        </table>
      </div>
    `;

    section.appendChild(panel);

    panel.querySelector("#cpp-history-search")
      .addEventListener("input", renderHistory);

    panel.querySelector("#cpp-history-status")
      .addEventListener("change", renderHistory);

    panel.querySelector("#cpp-history-refresh")
      .addEventListener("click", refreshHistory);

    panel.querySelector("#cpp-history-export")
      .addEventListener("click", exportHistory);

    return panel;
  }

  function getFilteredRecords() {
    const panel = document.getElementById(PANEL_ID);
    if (!panel) return [];

    const search = panel
      .querySelector("#cpp-history-search")
      .value.trim().toLowerCase();

    const status = panel
      .querySelector("#cpp-history-status")
      .value;

    return historyRecords.filter(item => {
      const nameMatches = residentName(item)
        .toLowerCase()
        .includes(search);

      const statusMatches =
        status === "All" ||
        appointmentStatus(item).toLowerCase() ===
          status.toLowerCase();

      return nameMatches && statusMatches;
    });
  }

  function makeSummaryCard(label, count) {
    const box = document.createElement("div");

    box.style.cssText = `
      background:#f3f6fb;
      padding:15px;
      border:1px solid #dce5f2;
      border-radius:9px;
      flex:1 1 125px;
    `;

    const title = document.createElement("div");
    title.textContent = label;
    title.style.color = "#344b6c";

    const value = document.createElement("strong");
    value.textContent = String(count);
    value.style.fontSize = "27px";

    box.append(title, value);
    return box;
  }

  function renderHistory() {
    const panel = createHistoryPanel();
    if (!panel) return;

    const tbody = panel.querySelector("#cpp-history-rows");
    const summary = panel.querySelector("#cpp-history-summary");
    const countText = panel.querySelector("#cpp-history-count");

    tbody.replaceChildren();
    summary.replaceChildren();

    const statuses = [
      "Scheduled",
      "Completed",
      "Cancelled",
      "Rescheduled"
    ];

    statuses.forEach(status => {
      const count = historyRecords.filter(
        item => appointmentStatus(item).toLowerCase() ===
          status.toLowerCase()
      ).length;

      summary.appendChild(makeSummaryCard(status, count));
    });

    const filtered = getFilteredRecords();

    countText.textContent =
      "Showing " + filtered.length +
      " of " + historyRecords.length + " appointments";

    if (filtered.length === 0) {
      const row = document.createElement("tr");
      const cell = document.createElement("td");

      cell.colSpan = 5;
      cell.textContent = "No matching appointments found.";
      cell.style.padding = "15px";

      row.appendChild(cell);
      tbody.appendChild(row);
      return;
    }

    filtered
      .slice()
      .sort((a, b) =>
        String(b.date || "").localeCompare(
          String(a.date || "")
        )
      )
      .forEach(item => {
        const row = document.createElement("tr");

        const values = [
          residentName(item),
          item.date || "",
          item.time || "",
          item.type || "",
          appointmentStatus(item)
        ];

        values.forEach(value => {
          const cell = document.createElement("td");

          cell.textContent = String(value);
          cell.style.cssText = `
            padding:12px;
            border-bottom:1px solid #e2e8f0;
          `;

          row.appendChild(cell);
        });

        tbody.appendChild(row);
      });
  }

  function refreshHistory() {
    historyRecords = loadHistory();
    renderHistory();
  }

  function escapeCSV(value) {
    let text = String(value ?? "");

    // Prevent spreadsheet formula execution from CSV fields.
    if (/^[\s]*[=+\-@]/.test(text)) {
      text = "'" + text;
    }

    return '"' + text.replace(/"/g, '""') + '"';
  }

  function exportHistory() {
    const records = getFilteredRecords();

    const rows = [
      ["Resident", "Date", "Time", "Type", "Status"]
    ];

    records.forEach(item => {
      rows.push([
        residentName(item),
        item.date || "",
        item.time || "",
        item.type || "",
        appointmentStatus(item)
      ]);
    });

    const csv = rows
      .map(row => row.map(escapeCSV).join(","))
      .join("\r\n");

    const blob = new Blob(
      [csv],
      { type: "text/csv;charset=utf-8;" }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "CPP-Demo-Appointment-History.csv";

    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function initializeHistory() {
    const buttons = Array.from(
      document.querySelectorAll(
        ".sidebar button, nav button"
      )
    );

    const appointmentsButton = buttons.find(
      button => button.textContent.trim() === "Appointments"
    );

    if (appointmentsButton) {
      appointmentsButton.addEventListener("click", function () {
        setTimeout(refreshHistory, 250);
      });
    }

    refreshHistory();
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initializeHistory
    );
  } else {
    initializeHistory();
  }
})();


/* ==========================================
   CODE #17 - DASHBOARD STATISTICS FIX
   CPP Resident Management System
   Demonstration records only
========================================== */

(function () {
  "use strict";

  const DATA_KEY = "cpp_demo_appointments";
  const SUMMARY_ID = "cpp-status-summary-v17";

  function getSavedAppointments() {
    try {
      const saved = localStorage.getItem(DATA_KEY);

      if (saved !== null) {
        const records = JSON.parse(saved);

        if (Array.isArray(records)) {
          return records;
        }
      }
    } catch (error) {
      console.warn("Unable to load appointments.", error);
    }

    if (
      typeof appointments !== "undefined" &&
      Array.isArray(appointments)
    ) {
      return appointments;
    }

    return null;
  }

  function getStatus(item) {
    return String(item.status || "Scheduled")
      .trim()
      .toLowerCase();
  }

  function countStatus(records, status) {
    return records.filter(
      item => getStatus(item) === status.toLowerCase()
    ).length;
  }

  function updateAppointmentCard(records) {
    const cards = document.getElementById(
      "cpp-dashboard-cards"
    );

    if (!cards) return;

    const card = Array.from(cards.children).find(item => {
      const heading = item.querySelector("h3");

      return heading &&
        heading.textContent.trim() === "Appointments";
    });

    if (!card) return;

    const number = card.querySelector("div");
    const description = card.querySelector("p");

    if (number) {
      number.textContent = String(records.length);
    }

    if (description) {
      description.textContent =
        "Total saved demonstration appointments";
    }
  }

  function createSummaryPanel() {
    let panel = document.getElementById(SUMMARY_ID);

    if (panel) return panel;

    const dashboard = document.getElementById(
      "cpp-dashboard-v10"
    );

    if (!dashboard) return null;

    panel = document.createElement("section");
    panel.id = SUMMARY_ID;

    panel.style.cssText = `
      background:white;
      padding:22px;
      margin:20px 0;
      border:1px solid #dce5f2;
      border-radius:12px;
    `;

    const title = document.createElement("h2");
    title.textContent = "Appointment Status Summary";

    const description = document.createElement("p");
    description.textContent =
      "Live summary of saved demonstration appointments.";

    const summary = document.createElement("div");
    summary.id = "cpp-status-cards-v17";

    summary.style.cssText = `
      display:flex;
      flex-wrap:wrap;
      gap:12px;
      margin-top:18px;
    `;

    panel.append(title, description, summary);

    const existingCards = document.getElementById(
      "cpp-dashboard-cards"
    );

    if (existingCards) {
      existingCards.insertAdjacentElement(
        "afterend",
        panel
      );
    } else {
      dashboard.appendChild(panel);
    }

    return panel;
  }

  function makeStatusCard(label, count, color) {
    const card = document.createElement("div");

    card.style.cssText = `
      flex:1 1 130px;
      padding:16px;
      background:#f3f6fb;
      border-left:4px solid ${color};
      border-radius:8px;
    `;

    const heading = document.createElement("div");
    heading.textContent = label;
    heading.style.cssText =
      "font-size:14px;color:#344b6c;";

    const number = document.createElement("strong");
    number.textContent = String(count);
    number.style.cssText =
      "font-size:29px;display:block;margin-top:8px;";

    card.append(heading, number);

    return card;
  }

  function updateDashboardStatistics() {
    const records = getSavedAppointments();

    if (!records) {
      console.warn("Appointment data not available.");
      return;
    }

    updateAppointmentCard(records);

    const panel = createSummaryPanel();
    if (!panel) return;

    const container = document.getElementById(
      "cpp-status-cards-v17"
    );

    if (!container) return;

    container.replaceChildren();

    const scheduled = countStatus(
      records,
      "scheduled"
    );

    const completed = countStatus(
      records,
      "completed"
    );

    const cancelled = countStatus(
      records,
      "cancelled"
    );

    const rescheduled = countStatus(
      records,
      "rescheduled"
    );

    const court = records.filter(item =>
      String(item.type || "")
        .toLowerCase()
        .includes("court")
    ).length;

    container.append(
      makeStatusCard(
        "Scheduled",
        scheduled,
        "#0d6efd"
      ),
      makeStatusCard(
        "Completed",
        completed,
        "#16a34a"
      ),
      makeStatusCard(
        "Cancelled",
        cancelled,
        "#dc2626"
      ),
      makeStatusCard(
        "Rescheduled",
        rescheduled,
        "#d97706"
      ),
      makeStatusCard(
        "Court Dates",
        court,
        "#9333ea"
      )
    );
  }

  function initializeStatistics() {
    const buttons = Array.from(
      document.querySelectorAll(
        ".sidebar button, nav button"
      )
    );

    const dashboardButton = buttons.find(
      button =>
        button.textContent.trim() === "Dashboard"
    );

    if (dashboardButton) {
      dashboardButton.addEventListener(
        "click",
        function () {
          // Run after earlier dashboard updates.
          setTimeout(updateDashboardStatistics, 600);
        }
      );
    }

    setTimeout(updateDashboardStatistics, 600);
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initializeStatistics
    );
  } else {
    initializeStatistics();
  }
})();


/* ==========================================
   CODE #18 - RESIDENT PROFILE MANAGEMENT
   CPP Resident Management System
   Fictional demonstration data only
========================================== */

(function () {
  "use strict";

  const PANEL_ID = "cpp-resident-profile-v18";
  const NOTES_KEY = "cpp_demo_profile_notes_v18";

  function readArray(key) {
    try {
      const data = JSON.parse(localStorage.getItem(key));
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.warn("Unable to read demo records:", error);
      return [];
    }
  }

  function getResidents() {
    return readArray("cpp_demo_residents");
  }

  function getAppointments() {
    return readArray("cpp_demo_appointments");
  }

  function getNotes() {
    try {
      const data = JSON.parse(localStorage.getItem(NOTES_KEY));
      return data && typeof data === "object" &&
        !Array.isArray(data) ? data : {};
    } catch {
      return {};
    }
  }

  function residentKey(resident) {
    return String(resident.id ?? resident.name);
  }

  function selectedResident() {
    const select = document.getElementById(
      "cpp-profile-select-v18"
    );

    if (!select || select.value === "") return null;

    return getResidents()[Number(select.value)] || null;
  }

  function createElement(tag, text) {
    const element = document.createElement(tag);
    element.textContent = String(text ?? "");
    return element;
  }

  function makeSection(title) {
    const section = document.createElement("div");
    section.style.cssText =
      "background:#f3f6fb;padding:18px;" +
      "border-radius:10px;margin-top:18px;";

    section.appendChild(createElement("h3", title));
    return section;
  }

  function makeDetail(parent, label, value) {
    const line = createElement(
      "p",
      label + ": " + (value || "Not specified")
    );
    line.style.margin = "8px 0";
    parent.appendChild(line);
  }

  function createProfilePanel() {
    let panel = document.getElementById(PANEL_ID);
    if (panel) return panel;

    const residentPage = document.getElementById("residents");
    if (!residentPage) return null;

    panel = document.createElement("section");
    panel.id = PANEL_ID;

    panel.style.cssText =
      "background:white;padding:24px;margin:24px 0;" +
      "border:1px solid #dce5f2;border-radius:12px;" +
      "color:#102849;";

    const title = createElement(
      "h2", "Individual Resident Profiles"
    );

    const description = createElement(
      "p", "View fictional resident information and progress notes."
    );

    const label = createElement("label", "Select Resident");
    label.htmlFor = "cpp-profile-select-v18";

    const select = document.createElement("select");
    select.id = "cpp-profile-select-v18";
    select.style.cssText =
      "display:block;width:100%;max-width:650px;" +
      "padding:12px;margin:10px 0 20px;";

    const details = document.createElement("div");
    details.id = "cpp-profile-details-v18";

    panel.append(title, description, label, select, details);

    residentPage.appendChild(panel);

    select.addEventListener("change", renderProfile);

    return panel;
  }

  function refreshProfileList() {
    const panel = createProfilePanel();
    if (!panel) return;

    const select = document.getElementById(
      "cpp-profile-select-v18"
    );

    const previousKey = selectedResident()
      ? residentKey(selectedResident())
      : null;

    select.replaceChildren();

    const records = getResidents();

    records.forEach((resident, index) => {
      const option = document.createElement("option");
      option.value = String(index);
      option.textContent = resident.name || "Unnamed resident";
      select.appendChild(option);
    });

    if (records.length === 0) {
      const option = document.createElement("option");
      option.value = "";
      option.textContent = "No residents available";
      select.appendChild(option);
    } else if (previousKey !== null) {
      const index = records.findIndex(
        resident => residentKey(resident) === previousKey
      );

      if (index !== -1) select.value = String(index);
    }

    renderProfile();
  }

  function renderProfile() {
    const container = document.getElementById(
      "cpp-profile-details-v18"
    );

    if (!container) return;
    container.replaceChildren();

    const resident = selectedResident();

    if (!resident) {
      container.appendChild(
        createElement("p", "Select a resident to view a profile.")
      );
      return;
    }

    // Basic resident details
    const info = makeSection("Resident Information");

    makeDetail(info, "Resident", resident.name);
    makeDetail(info, "Jurisdiction", resident.jurisdiction);
    makeDetail(
      info,
      "Placement Date",
      resident.placementDate || resident.placement
    );
    makeDetail(
      info,
      "Release",
      resident.release || resident.anticipatedRelease
    );
    makeDetail(
      info,
      "Case Manager",
      resident.caseManager
    );
    makeDetail(
      info,
      "Transition Phase",
      resident.phase || resident.transitionPhase
    );
    makeDetail(
      info,
      "Risk Status",
      resident.risk || resident.riskStatus
    );

    container.appendChild(info);

    // Appointments associated with this resident
    const appointmentSection = makeSection(
      "Resident Appointment History"
    );

    const residentAppointments = getAppointments().filter(
      appointment =>
        resident.id != null &&
        String(appointment.residentId) === String(resident.id)
    );

    if (residentAppointments.length === 0) {
      appointmentSection.appendChild(
        createElement("p", "No linked appointments found.")
      );
    } else {
      residentAppointments
        .slice()
        .sort((a, b) =>
          String(b.date || "").localeCompare(
            String(a.date || "")
          )
        )
        .forEach(appointment => {
          const line = createElement(
            "p",
            (appointment.date || "") + " — " +
            (appointment.type || "Appointment") + " — " +
            (appointment.status || "Scheduled")
          );

          line.style.cssText =
            "padding:9px 0;border-bottom:1px solid #dce5f2;";

          appointmentSection.appendChild(line);
        });
    }

    container.appendChild(appointmentSection);

    // Groups and classes placeholder until the existing
    // enrollment structure is connected.
   
/* ==========================================
   CODE #19 - GROUPS & CLASSES PARTICIPATION
   CONNECT RESIDENT PROFILES TO ENROLLMENT
========================================== */

const programSection = makeSection(
  "Groups & Classes Participation"
);

let savedEnrollment = {};

try {
  savedEnrollment = JSON.parse(
    localStorage.getItem("cpp_program_enrollment") || "{}"
  );
} catch (error) {
  console.warn("Unable to load program enrollment.", error);
}

const enrolledPrograms = [];

if (
  typeof cppPrograms !== "undefined" &&
  Array.isArray(cppPrograms)
) {
  cppPrograms.forEach(program => {
    const enrolledIds = savedEnrollment[program.name];

    if (
      Array.isArray(enrolledIds) &&
      enrolledIds.some(
        id => String(id) === String(resident.id)
      )
    ) {
      enrolledPrograms.push(program);
    }
  });
}

const total = document.createElement("p");

total.textContent =
  "Total Enrolled Programs: " + enrolledPrograms.length;

total.style.fontWeight = "bold";

programSection.appendChild(total);

if (enrolledPrograms.length === 0) {

  programSection.appendChild(
    createElement(
      "p",
      "This resident is not currently enrolled in any programs."
    )
  );

} else {

  enrolledPrograms.forEach(program => {

    const programBox = document.createElement("div");

    programBox.style.cssText = `
      background:white;
      border:1px solid #dce5f2;
      padding:14px;
      margin:10px 0;
      border-radius:8px;
    `;

    const programName = document.createElement("strong");
    programName.textContent = program.name;

    const schedule = document.createElement("p");
    schedule.textContent =
      "Schedule: " + (program.schedule || "Not specified");

    const status = document.createElement("p");
    status.textContent = "Enrollment: Enrolled";
    status.style.color = "#147d54";

    programBox.append(
      programName,
      schedule,
      status
    );

    programSection.appendChild(programBox);

  });

}

container.appendChild(programSection);


    // Demonstration progress notes
    const notesSection = makeSection("Progress Notes");

    const allNotes = getNotes();
    const key = residentKey(resident);
    const savedNotes = Array.isArray(allNotes[key])
      ? allNotes[key]
      : [];

    const notesList = document.createElement("div");

    if (savedNotes.length === 0) {
      notesList.appendChild(
        createElement("p", "No demonstration notes saved.")
      );
    }

    savedNotes.forEach(note => {
      const entry = document.createElement("p");
      entry.style.cssText =
        "background:white;padding:12px;" +
        "border-radius:7px;white-space:pre-wrap;";

      entry.textContent =
        note.date + " — " + note.text;

      notesList.appendChild(entry);
    });

    const noteInput = document.createElement("textarea");
    noteInput.placeholder =
      "Enter fictional demonstration progress note...";
    noteInput.rows = 4;
    noteInput.maxLength = 2000;
    noteInput.setAttribute(
      "aria-label", "Demonstration progress note"
    );

    noteInput.style.cssText =
      "display:block;width:100%;padding:12px;" +
      "margin:15px 0;box-sizing:border-box;";

    const saveButton = document.createElement("button");
    saveButton.type = "button";
    saveButton.textContent = "Save Progress Note";

    saveButton.style.cssText =
      "background:#0759ca;color:white;" +
      "border:0;border-radius:7px;" +
      "padding:12px 20px;cursor:pointer;";

    saveButton.addEventListener("click", function () {
      const noteText = noteInput.value.trim();

      if (!noteText) {
        alert("Enter a demonstration note first.");
        return;
      }

      const updatedNotes = getNotes();

      if (!Array.isArray(updatedNotes[key])) {
        updatedNotes[key] = [];
      }

      updatedNotes[key].push({
        date: new Date().toLocaleString(),
        text: noteText
      });

      try {
        localStorage.setItem(
          NOTES_KEY,
          JSON.stringify(updatedNotes)
        );

        renderProfile();
      } catch (error) {
        console.error(error);
        alert("Unable to save demonstration note.");
      }
    });

    notesSection.append(notesList, noteInput, saveButton);
    container.appendChild(notesSection);
  }

  function initializeProfiles() {
    const buttons = Array.from(
      document.querySelectorAll(
        ".sidebar button, nav button"
      )
    );

    const residentButton = buttons.find(
      button => button.textContent.trim() === "Residents"
    );

    if (residentButton) {
      residentButton.addEventListener("click", function () {
        setTimeout(refreshProfileList, 250);
      });
    }

    refreshProfileList();
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initializeProfiles
    );
  } else {
    initializeProfiles();
  }
})();


/* ==========================================
   CODE #20 - RESIDENT PROGRESS TRACKING
   CPP Resident Management System
   Fictional demonstration data only
========================================== */

(function () {
  "use strict";

  const PANEL_ID = "cpp-progress-v20";
  const DATA_KEY = "cpp_demo_attendance_v20";

  function readJSON(key, fallback) {
    try {
      const value = localStorage.getItem(key);
      return value === null ? fallback : JSON.parse(value);
    } catch {
      return fallback;
    }
  }

  function getSelectedResident() {
    const select = document.getElementById(
      "cpp-profile-select-v18"
    );

    const residents = readJSON("cpp_demo_residents", []);

    if (!select || !Array.isArray(residents)) return null;
    if (select.value === "") return null;

    return residents[Number(select.value)] || null;
  }

  function getPrograms(resident) {
    const enrollment = readJSON(
      "cpp_program_enrollment", {}
    );

    if (!resident || !enrollment) return [];

    if (
      typeof cppPrograms === "undefined" ||
      !Array.isArray(cppPrograms)
    ) {
      return [];
    }

    return cppPrograms.filter(program => {
      const ids = enrollment[program.name];

      return Array.isArray(ids) && ids.some(
        id => String(id) === String(resident.id)
      );
    });
  }

  function getData() {
    const data = readJSON(DATA_KEY, {});

    return data && typeof data === "object" &&
      !Array.isArray(data) ? data : {};
  }

  function saveData(data) {
    try {
      localStorage.setItem(DATA_KEY, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error("Attendance save failed:", error);
      alert("Unable to save demonstration attendance.");
      return false;
    }
  }

  function recordKey(resident, programName) {
    return JSON.stringify([
      String(resident.id),
      programName
    ]);
  }

  function makeText(tag, value) {
    const element = document.createElement(tag);
    element.textContent = String(value ?? "");
    return element;
  }

  function createPanel() {
    let panel = document.getElementById(PANEL_ID);
    if (panel) return panel;

    const profile = document.getElementById(
      "cpp-resident-profile-v18"
    );

    if (!profile) return null;

    panel = document.createElement("section");
    panel.id = PANEL_ID;

    panel.style.cssText = `
      background:#f3f6fb;
      padding:20px;
      border-radius:10px;
      margin-top:20px;
      color:#102849;
    `;

    panel.innerHTML = `
      <h2>Resident Progress & Attendance</h2>
      <p>Record fictional program participation.</p>

      <div style="display:grid;gap:12px;max-width:650px;">

        <label for="cpp-v20-program">
          Enrolled Program
        </label>
        <select id="cpp-v20-program"
                style="padding:12px;"></select>

        <label for="cpp-v20-date">Attendance Date</label>
        <input type="date" id="cpp-v20-date"
               style="padding:12px;">

        <label for="cpp-v20-attendance">
          Attendance
        </label>
        <select id="cpp-v20-attendance"
                style="padding:12px;">
          <option>Present</option>
          <option>Absent</option>
          <option>Excused</option>
        </select>

        <button id="cpp-v20-save"
                type="button"
                style="background:#0759ca;color:white;
                       padding:12px;border:0;
                       border-radius:7px;cursor:pointer;">
          Save Attendance
        </button>

        <label for="cpp-v20-progress">
          Program Completion Status
        </label>
        <select id="cpp-v20-progress"
                style="padding:12px;">
          <option>In Progress</option>
          <option>Completed</option>
        </select>

        <button id="cpp-v20-save-progress"
                type="button"
                style="background:#147d54;color:white;
                       padding:12px;border:0;
                       border-radius:7px;cursor:pointer;">
          Save Program Progress
        </button>
      </div>

      <p id="cpp-v20-message" role="status"></p>
      <div id="cpp-v20-summary"></div>
      <div id="cpp-v20-history"></div>
    `;

    profile.appendChild(panel);

    panel.querySelector("#cpp-v20-program")
      .addEventListener("change", renderDetails);

    panel.querySelector("#cpp-v20-save")
      .addEventListener("click", saveAttendance);

    panel.querySelector("#cpp-v20-save-progress")
      .addEventListener("click", saveProgress);

    // Default to the current local calendar date.
    const now = new Date();
    const localToday = new Date(
      now.getTime() - now.getTimezoneOffset() * 60000
    ).toISOString().slice(0, 10);

    panel.querySelector("#cpp-v20-date").value = localToday;

    return panel;
  }

  function getSelection() {
    const resident = getSelectedResident();

    const select = document.getElementById(
      "cpp-v20-program"
    );

    const programs = getPrograms(resident);

    const program = programs.find(
      item => item.name === select?.value
    );

    return { resident, program };
  }

  function refreshPanel() {
    const panel = createPanel();
    if (!panel) return;

    const select = panel.querySelector("#cpp-v20-program");
    const previous = select.value;
    const programs = getPrograms(getSelectedResident());

    select.replaceChildren();

    programs.forEach(program => {
      const option = document.createElement("option");
      option.value = program.name;
      option.textContent = program.name;
      select.appendChild(option);
    });

    if (programs.length === 0) {
      const option = document.createElement("option");
      option.value = "";
      option.textContent = "No enrolled programs";
      select.appendChild(option);
    } else if (
      programs.some(program => program.name === previous)
    ) {
      select.value = previous;
    }

    renderDetails();
  }

  function renderDetails() {
    const panel = document.getElementById(PANEL_ID);
    if (!panel) return;

    const summary = panel.querySelector("#cpp-v20-summary");
    const history = panel.querySelector("#cpp-v20-history");

    summary.replaceChildren();
    history.replaceChildren();

    const { resident, program } = getSelection();

    const disabled = !resident || !program;

    panel.querySelector("#cpp-v20-save").disabled = disabled;
    panel.querySelector("#cpp-v20-save-progress").disabled = disabled;

    if (disabled) {
      summary.appendChild(
        makeText("p", "Select a resident enrolled in a program.")
      );
      return;
    }

    const key = recordKey(resident, program.name);
    const record = getData()[key] || {};
    const entries = Array.isArray(record.attendance)
      ? record.attendance
      : [];

    panel.querySelector("#cpp-v20-progress").value =
      record.progress === "Completed"
        ? "Completed"
        : "In Progress";

    summary.appendChild(
      makeText("h3", "Attendance Summary — " + program.name)
    );

    ["Present", "Absent", "Excused"].forEach(status => {
      const count = entries.filter(
        item => item.status === status
      ).length;

      summary.appendChild(
        makeText("p", status + ": " + count)
      );
    });

    summary.appendChild(
      makeText(
        "p",
        "Program Status: " +
        (record.progress || "In Progress")
      )
    );

    history.appendChild(makeText("h3", "Attendance History"));

    if (entries.length === 0) {
      history.appendChild(
        makeText("p", "No attendance records saved.")
      );
    } else {
      entries.slice().sort(
        (a, b) => b.date.localeCompare(a.date)
      ).forEach(entry => {
        const line = makeText(
          "p",
          entry.date + " — " + entry.status
        );

        line.style.cssText =
          "padding:9px;border-bottom:1px solid #ccd7ea;";

        history.appendChild(line);
      });
    }
  }

  function saveAttendance() {
    const { resident, program } = getSelection();
    if (!resident || !program) return;

    const panel = document.getElementById(PANEL_ID);

    const date = panel.querySelector("#cpp-v20-date").value;
    const status = panel.querySelector(
      "#cpp-v20-attendance"
    ).value;

    if (!date) {
      alert("Select an attendance date.");
      return;
    }

    const data = getData();
    const key = recordKey(resident, program.name);

    const record = data[key] || {
      progress: "In Progress",
      attendance: []
    };

    if (!Array.isArray(record.attendance)) {
      record.attendance = [];
    }

    // Update the existing entry if this date was recorded.
    const existing = record.attendance.find(
      item => item.date === date
    );

    if (existing) {
      existing.status = status;
    } else {
      record.attendance.push({ date, status });
    }

    data[key] = record;

    if (saveData(data)) {
      panel.querySelector("#cpp-v20-message").textContent =
        "Attendance saved successfully.";
      renderDetails();
    }
  }

  function saveProgress() {
    const { resident, program } = getSelection();
    if (!resident || !program) return;

    const panel = document.getElementById(PANEL_ID);
    const progress = panel.querySelector(
      "#cpp-v20-progress"
    ).value;

    const data = getData();
    const key = recordKey(resident, program.name);

    const record = data[key] || {
      progress: "In Progress",
      attendance: []
    };

    record.progress = progress;
    data[key] = record;

    if (saveData(data)) {
      panel.querySelector("#cpp-v20-message").textContent =
        "Program progress saved successfully.";
      renderDetails();
    }
  }

  function initializeProgress() {
    const residentsButton = Array.from(
      document.querySelectorAll(".sidebar button, nav button")
    ).find(button =>
      button.textContent.trim() === "Residents"
    );

    if (residentsButton) {
      residentsButton.addEventListener("click", function () {
        setTimeout(refreshPanel, 350);
      });
    }

    const profileSelect = document.getElementById(
      "cpp-profile-select-v18"
    );

    if (profileSelect) {
      profileSelect.addEventListener("change", function () {
        refreshPanel();
      });
    }

    refreshPanel();
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initializeProgress
    );
  } else {
    initializeProgress();
  }
})();
