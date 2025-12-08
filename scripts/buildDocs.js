/*
  Build full documentation folder structure under app/kb

  Run with:
  node scripts/buildDocs.js
*/

const fs = require("fs");
const path = require("path");

console.log("Creating Knowledge Base structure...\n");

const root = path.join(process.cwd(), "app", "kb");

// Top level sections
const sections = [
  "dashboard",
  "projects",
  "tasks",
  "businesses",
  "contacts",
  "clients",
  "tickets",
  "agents",
  "settings",
  "profile",
  "assistant"
];

// Project panel subpages
const projectPanels = [
  "branding",
  "web-design",
  "performances",
  "hosting",
  "agency"
];

// Ensure KB root exists
if (!fs.existsSync(root)) {
  fs.mkdirSync(root, { recursive: true });
  console.log("✓ Created folder: app/kb");
} else {
  console.log("✓ app/kb already exists");
}

// Create each top-level section
sections.forEach(section => {
  const sectionDir = path.join(root, section);

  if (!fs.existsSync(sectionDir)) {
    fs.mkdirSync(sectionDir, { recursive: true });
    console.log("✓ Created folder:", sectionDir);
  }

  const pageFile = path.join(sectionDir, "page.tsx");
  if (!fs.existsSync(pageFile)) {
    const content =
      `export default function ${section}DocPage() {\n` +
      `  return (\n` +
      `    <div className="bg-white border rounded-xl p-6">\n` +
      `      <h1 className="text-xl font-semibold mb-4">${section} Documentation</h1>\n` +
      `      <p className="text-sm text-slate-700">This section will contain full documentation for ${section}.</p>\n` +
      `    </div>\n` +
      `  );\n` +
      `}\n`;

    fs.writeFileSync(pageFile, content);
    console.log("  → Created file:", pageFile);
  }
});

// Create project panel subpages
const projectRoot = path.join(root, "projects");

projectPanels.forEach(panel => {
  const panelDir = path.join(projectRoot, panel);

  if (!fs.existsSync(panelDir)) {
    fs.mkdirSync(panelDir, { recursive: true });
    console.log("✓ Created folder:", panelDir);
  }

  const pageFile = path.join(panelDir, "page.tsx");

  if (!fs.existsSync(pageFile)) {
    const funcName = panel.replace(/-/g, "") + "PanelDocPage";

    const content =
      `export default function ${funcName}() {\n` +
      `  return (\n` +
      `    <div className="bg-white border rounded-xl p-6">\n` +
      `      <h1 className="text-xl font-semibold mb-4">${panel} Panel Documentation</h1>\n` +
      `      <p className="text-sm text-slate-700">Documentation coming soon.</p>\n` +
      `    </div>\n` +
      `  );\n` +
      `}\n`;

    fs.writeFileSync(pageFile, content);
    console.log("  → Created file:", pageFile);
  }
});

console.log("\n✔ All documentation folders and pages generated successfully!\n");
