// Type definitions for project settings

export interface ProjectSettings {
  general: GeneralInfoSettings;
  domains: DomainSettings;
  hosting: HostingSettings;
  agent_defaults: AgentDefaultsSettings;
  feature_flags: FeatureFlagsSettings;
}

export interface GeneralInfoSettings {
  name?: string;
  description?: string;
  client?: string;
  status?: string;
}

export interface DomainSettings {
  primary?: string;
  staging?: string;
  development?: string[];
}

export interface HostingSettings {
  provider?: string;
  region?: string;
  ssl_enabled?: boolean;
}

export interface AgentDefaultsSettings {
  default_agent?: string;
  allowed_task_types?: string[];
  auto_execute?: boolean;
}

export interface FeatureFlagsSettings {
  [key: string]: boolean | string | number | null;
}

export type SettingsCategory = keyof ProjectSettings;

export interface SettingsUpdate {
  general?: Partial<GeneralInfoSettings>;
  domains?: Partial<DomainSettings>;
  hosting?: Partial<HostingSettings>;
  agent_defaults?: Partial<AgentDefaultsSettings>;
  feature_flags?: Partial<FeatureFlagsSettings>;
}

