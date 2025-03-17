import { RoleType } from '@app/core/models/role.enum';

export interface NavItem {
  id: string;
  label: string;
  labelNp: string;
  icon: string;
  route?: string;
  roles?: RoleType[];
  children?: NavItem[];
  badge?: NavBadge;
  metadata?: NavItemMetadata;
  analytics?: NavAnalytics;
}

export interface NavBadge {
  value: number;
  color: 'primary' | 'accent' | 'warn';
  pulse?: boolean;
  tooltip?: string;
}

export interface NavItemMetadata {
  description?: string;
  descriptionNp?: string;
  keywords?: string[];
  order?: number;
  isNew?: boolean;
  isUpdated?: boolean;
  expiresAt?: Date;
  requiredPermissions?: string[];
  featureFlag?: string;
  environment?: ('development' | 'staging' | 'production')[];
}

export interface NavAnalytics {
  trackingId?: string;
  category?: string;
  action?: string;
  properties?: Record<string, unknown>;
}

export interface NavState {
  expandedItems: Set<string>;
  activeRoute: string | null;
  isCollapsed: boolean;
  lastInteractionTime?: Date;
}

export interface NavConfig {
  animationsEnabled: boolean;
  collapsible: boolean;
  expandOnHover: boolean;
  showBadges: boolean;
  showIcons: boolean;
  showTooltips: boolean;
  multilingual: boolean;
  defaultExpanded: boolean;
  hoverDelay: number;
  transitionDuration: number;
  badgeConfig: NavBadgeConfig;
  accessibilityConfig: NavAccessibilityConfig;
}

export interface NavBadgeConfig {
  position: 'right' | 'overlay';
  showZero: boolean;
  maxValue: number;
  pulseAnimation: boolean;
  backgroundColor?: string;
  textColor?: string;
}

export interface NavAccessibilityConfig {
  announceRouteChanges: boolean;
  keyboardShortcuts: boolean;
  focusIndicatorColor?: string;
  highContrastSupport: boolean;
  reduceMotion: boolean;
  screenReaderInstructions?: {
    navigation: string;
    expanded: string;
    collapsed: string;
    hasChildren: string;
    badge: string;
  };
}

export interface NavTheme {
  backgroundColor?: string;
  textColor?: string;
  activeBackgroundColor?: string;
  activeTextColor?: string;
  hoverBackgroundColor?: string;
  hoverTextColor?: string;
  borderColor?: string;
  iconColor?: string;
  activeIconColor?: string;
  fontFamily?: string;
  fontSize?: string;
  itemHeight?: string;
  itemPadding?: string;
  borderRadius?: string;
}

export interface NavStatistics {
  totalItems: number;
  expandedCount: number;
  visibleItems: number;
  activeItem?: NavItem;
  lastClickedItem?: {
    item: NavItem;
    timestamp: Date;
  };
  loadTime?: number;
  renderTime?: number;
}

export enum NavEventType {
  ITEM_CLICK = 'ITEM_CLICK',
  EXPAND_TOGGLE = 'EXPAND_TOGGLE',
  COLLAPSE_TOGGLE = 'COLLAPSE_TOGGLE',
  ROUTE_CHANGE = 'ROUTE_CHANGE',
  HOVER_START = 'HOVER_START',
  HOVER_END = 'HOVER_END',
  CONFIG_CHANGE = 'CONFIG_CHANGE',
  ERROR = 'ERROR',
}

export interface NavEvent {
  type: NavEventType;
  timestamp: Date;
  itemId?: string;
  data?: unknown;
  metadata?: {
    userId?: string;
    sessionId?: string;
    deviceInfo?: string;
    position?: { x: number; y: number };
  };
}

export type NavItemClickHandler = (item: NavItem, event: MouseEvent) => void;
export type NavStateChangeHandler = (newState: NavState) => void;
export type NavErrorHandler = (error: Error, context?: string) => void;

export interface NavItemRenderContext {
  item: NavItem;
  level: number;
  isExpanded: boolean;
  isActive: boolean;
  hasChildren: boolean;
  parentItem?: NavItem;
  index: number;
}
