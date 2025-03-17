export interface Breadcrumb {
  label: string;
  labelNp?: string;
  url: string;
  icon?: string;
  queryParams?: { [key: string]: string };
}

export interface BreadcrumbConfig {
  showHomeIcon?: boolean;
  separator?: string;
  showIcons?: boolean;
  maxItems?: number;
  responsive?: boolean;
}
