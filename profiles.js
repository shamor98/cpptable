
/* CODE #8 - CPP Resident Profiles
   Fictional training data only.
   Does not replace existing application code.
*/

(() => {
  const STORAGE_KEY = "cpp_demo_profile_notes_v1";

  const styles = document.createElement("style");
  styles.textContent = `
    .cpp-profile-btn {
      background: #0755c9;
      color: white;
      border: 0;
      padding: 8px 12px;
      border-radius: 6px;
      cursor: pointer;
      margin: 4px;
    }
    .cpp-profile-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,.55);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 99999;
      padding: 20px;
    }
    .cpp-profile-panel {
      background: white;
      color: #142c4e;
      border-radius: 12px;
      padding: 24px;
      width: 100%;
      max-width: 680px;
      max-height: 90vh;
      overflow-y: auto;
      font-family: Arial, sans-serif;
    }
    .cpp-profile-panel h2 {
      margin-top: 0;
    }
    .cpp-profile-field {
      padding: 10px 0;
      border-bottom: 1px solid #ddd;
    }
    .cpp-profile-panel textarea {
      width: 100%;
      min-height: 110px;
      padding: 10px;
      box-sizing: border-box;
    }
    .cpp-profile-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 16px;
    }
  `;
  document.head.appendChild(styles);

  const getNotes = () => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch {
      return {};
    }
  };

  function openProfile(row, headers) {
    const cells = [...row.cells].map(cell =>
      cell.innerText.replace("View Profile", "").trim()
    );

    const nameIndex = headers.findIndex(h =>
      h.includes("name") || h.includes("resident")
    );

    const name = cells[nameIndex >= 0 ? nameIndex : 0]
      .split("\n")[0]
      .trim();

    if (!name) return;

    const overlay = document.createElement("div");
    overlay.className = "cpp-profile-overlay";

    const panel = document.createElement("div");
    panel.className = "cpp-profile-panel";

    const title = document.createElement("h2");
    title.textContent = "Resident Profile: " + name;
    panel.appendChild(title);

    const subtitle = document.createElement("p");
    subtitle.textContent = "CPP Resident Management System - Training Demo";
    panel.appendChild(subtitle);

    headers.forEach((heading, index) => {
      if (
        !heading ||
        heading.includes("action") ||
        heading.includes("profile")
      ) return;

      const field = document.createElement("div");
      field.className = "cpp-profile-field";

      const label = document.createElement("strong");
      label.textContent = heading + ": ";

      const value = document.createElement("span");
      value.textContent = cells[index] || "Not entered";

      field.append(label, value);
      panel.appendChild(field);
    });

    const notesHeading = document.createElement("h3");
    notesHeading.textContent = "Resident Progress Notes";
    panel.appendChild(notesHeading);

    const notesInput = document.createElement("textarea");
    notesInput.placeholder = "Enter fictional training notes...";
    notesInput.value = getNotes()[name] || "";
    panel.appendChild(notesInput);

    const actions = document.createElement("div");
    actions.className = "cpp-profile-actions";

    const closeButton = document.createElement("button");
    closeButton.textContent = "Close";
    closeButton.type = "button";

    const saveButton = document.createElement("button");
    saveButton.textContent = "Save Notes";
    saveButton.type = "button";
    saveButton.className = "cpp-profile-btn";

    const close = () => overlay.remove();

    closeButton.addEventListener("click", close);

    saveButton.addEventListener("click", () => {
      try {
        const notes = getNotes();
        notes[name] = notesInput.value;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
        alert("Demo profile notes saved!");
        close();
      } catch {
        alert("Unable to save notes in this browser.");
      }
    });

    actions.append(closeButton, saveButton);
    panel.appendChild(actions);
    overlay.appendChild(panel);

    overlay.addEventListener("click", event => {
      if (event.target === overlay) close();
    });

    document.body.appendChild(overlay);
  }

  function addProfileButtons() {
    document.querySelectorAll("table").forEach(table => {
      const headerRow = table.querySelector("thead tr");
      const tbody = table.querySelector("tbody");

      if (!headerRow || !tbody) return;

      const headers = [...headerRow.cells].map(cell =>
        cell.textContent.trim().toLowerCase()
      );

      const hasName = headers.some(h =>
        h.includes("resident") || h.includes("name")
      );

      const isResidentTable = hasName && headers.some(h =>
        h.includes("phase") ||
        h.includes("placement") ||
        h.includes("jurisdiction")
      );

      if (!isResidentTable) return;

      tbody.querySelectorAll("tr").forEach(row => {
        if (!row.cells.length || row.querySelector(".cpp-profile-btn")) {
          return;
        }

        const lastCell = row.cells[row.cells.length - 1];

        const button = document.createElement("button");
        button.textContent = "View Profile";
        button.className = "cpp-profile-btn";
        button.type = "button";

        button.addEventListener("click", () => {
          openProfile(row, headers);
        });

        if (headers.some(h => h.includes("action"))) {
          lastCell.appendChild(button);
        } else {
          const actionCell = row.insertCell();
          actionCell.appendChild(button);
        }
      });
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    addProfileButtons();

    const observer = new MutationObserver(() => {
      addProfileButtons();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  });
})();
