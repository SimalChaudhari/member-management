import { createContext, useContext } from 'react';

interface SidebarContextInterface {
  sidebarExpanded: boolean;
  isSmallScreen: boolean;
}

export const SidebarContext = createContext<SidebarContextInterface>({
  sidebarExpanded: false,
  isSmallScreen: false,
});

export const useSidebar = () => useContext(SidebarContext);

