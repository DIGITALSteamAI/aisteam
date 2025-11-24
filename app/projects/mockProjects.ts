export type Project = {
  id: string;
  name: string;
  cmsType?: string;
  domain?: string;
  client?: string;
  status?: string;
  lastUpdate?: string;
};

export const mockProjects: Project[] = [
  {
    id: "digitalsteam",
    name: "DigitalSteam",
    cmsType: "wordpress",
    domain: "digitalsteam.ca",
    client: "Danny",
    status: "Active",
    lastUpdate: "Today"
  },
  {
    id: "wartafoods",
    name: "WartaFoods",
    cmsType: "shopify",
    domain: "wartafoods.ca",
    client: "Roman",
    status: "Active",
    lastUpdate: "Yesterday"
  }
];
