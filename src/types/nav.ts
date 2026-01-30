/**
 * Navigation Item Configuration Types
 */

export interface NavItemBase {
  title: string;
  icon?: string;
}

export interface NavItemLeaf extends NavItemBase {
  path: string;
}

export interface NavItemBranch extends NavItemBase {
  children: NavItemLeaf[];
}

export type NavItemConfig = NavItemLeaf | NavItemBranch; 