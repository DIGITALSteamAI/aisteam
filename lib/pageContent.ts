// Page content map - can be expanded with full markdown content later
export const pageContent: Record<string, string> = {
  dashboard: "# Dashboard\n\nDocumentation for this page will be expanded.",
  "projects-listing": "# Projects Listing\n\nDocumentation for this page will be expanded.",
  "project-details": "# Project Details\n\nDocumentation for this page will be expanded.",
  "project-settings": "# Project Settings\n\nDocumentation for this page will be expanded.",
  "tasks-listing": "# Tasks Listing\n\nDocumentation for this page will be expanded.",
  "task-details": "# Task Details\n\nDocumentation for this page will be expanded.",
  "clients-listing": "# Clients Listing\n\nDocumentation for this page will be expanded.",
  "client-details": "# Client Details\n\nDocumentation for this page will be expanded.",
  "contacts-listing": "# Contacts Listing\n\nDocumentation for this page will be expanded.",
  "contact-details": "# Contact Details\n\nDocumentation for this page will be expanded.",
  "tickets-listing": "# Tickets Listing\n\nDocumentation for this page will be expanded.",
  "ticket-details": "# Ticket Details\n\nDocumentation for this page will be expanded.",
  profile: "# Profile\n\nDocumentation for this page will be expanded.",
  "agents-listing": "# Agents Listing\n\nDocumentation for this page will be expanded.",
  "agent-details": "# Agent Details\n\nDocumentation for this page will be expanded.",
};

export function getPageContent(pageKey: string): string {
  return pageContent[pageKey] || "Documentation for this page will be expanded.";
}
