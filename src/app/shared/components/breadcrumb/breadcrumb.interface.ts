export interface Breadcrumb {
  label: string;
  translationKey?: string;
  url: string;
  path: string; // explicit path for navigation
  icon?: string;
  queryParams?: { [key: string]: string };
  data?: { [key: string]: unknown };
}

export interface BreadcrumbData {
  label?: string;
  translationKey?: string;
  path: string; // explicit path for navigation
  icon?: string;
  data?: { [key: string]: unknown };
}

export interface BreadcrumbConfig {
  separator?: string;
  showIcons?: boolean;
}
