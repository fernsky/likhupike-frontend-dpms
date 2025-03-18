export interface Breadcrumb {
  label: string;
  translationKey?: string;
  url: string;
  icon?: string;
  queryParams?: { [key: string]: string };
  data?: { [key: string]: unknown };
}

export interface BreadcrumbData {
  label?: string;
  translationKey?: string;
  icon?: string;
  data?: { [key: string]: unknown };
}

export interface BreadcrumbConfig {
  separator?: string;
  showIcons?: boolean;
}
