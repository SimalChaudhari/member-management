import { ReactElement, useState, useEffect } from 'react';
import {
  Collapse,
  LinkTypeMap,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  alpha,
} from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import IconifyIcon from 'components/base/IconifyIcon';
import { useLocation } from 'react-router-dom';
import { NavItem } from 'data/nav-items';

interface NavItemProps {
  navItem: NavItem;
  Link: OverridableComponent<LinkTypeMap>;
  isCollapsed?: boolean;
  isOpen?: boolean; // Controlled from parent
  onToggle?: (currentState: boolean) => void; // Callback to parent
}

const NavButton = ({
  navItem,
  Link,
  isCollapsed = false,
  isOpen = false,
  onToggle,
}: NavItemProps): ReactElement => {
  const { pathname } = useLocation();
  const [nestedChecked, setNestedChecked] = useState<boolean[]>([]);
  
  // Use controlled state from parent, fallback to local state if not provided
  const checked = isOpen;

  // Reset nested state on dashboard; do not call onToggle(false) here — that would
  // be interpreted by the parent as "open this menu" and the last item would stay open.
  useEffect(() => {
    if (pathname === '/') {
      setNestedChecked([]);
    }
  }, [pathname]);

  const handleNestedChecked = (index: any, value: boolean) => {
    const updatedBooleanArray = [...nestedChecked];
    updatedBooleanArray[index] = value;
    setNestedChecked(updatedBooleanArray);
  };

  const isAnySubmenuActive = (item: NavItem) => {
    if (!item.sublist) return false;
    return item.sublist.some(subItem =>
      pathname === `${item.path}/${subItem.path}` ||
      (subItem.sublist && subItem.sublist.some(nestedItem =>
        pathname === `${item.path}/${subItem.path}/${nestedItem.path}`
      ))
    );
  };

  const isActive = pathname === navItem.path || isAnySubmenuActive(navItem);

  const isSubmenuActive = (subItem: any) => {
    return pathname === `${navItem.path}/${subItem.path}` ||
      (subItem.sublist && subItem.sublist.some((nestedItem: any) =>
        pathname === `${navItem.path}/${subItem.path}/${nestedItem.path}`
      ));
  };

  const isNestedSubmenuActive = (subItem: any, nestedItem: any) => {
    return pathname === `${navItem.path}/${subItem.path}/${nestedItem.path}`;
  };

  return (
    <ListItem
      sx={{
        my: 1.25,
        borderRadius: checked ? 2 : 2,
        bgcolor: checked ? '#FFFFFF' : (isCollapsed && isActive ? alpha('#FFFFFF', 0.15) : 'transparent'),
        color: checked ? '#333333' : (isActive ? '#FFFFFF' : alpha('#FFFFFF', 0.8)),
        position: 'relative',
        '&:hover': {
          backgroundColor: checked ? '#FFFFFF' : alpha('#FFFFFF', 0.1),
          color: checked ? '#333333' : '#FFFFFF',
          transform: checked ? 'none' : (isCollapsed ? 'none' : 'translateX(4px)'),
        },
        transition: 'all 0.2s ease-in-out',
        p: 0,
        // Active indicator for collapsed state
        ...(isCollapsed && isActive && {
          '&::before': {
            content: '""',
            position: 'absolute',
            left: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 4,
            height: '60%',
            backgroundColor: '#FFFFFF',
            borderRadius: '0 4px 4px 0',
          },
        }),
      }}
    >
      {navItem.collapsible ? (
        <>
          <ListItemButton
            component="div"
            onClick={(e) => {
              e.preventDefault();
              // Only toggle collapse when sidebar is expanded; no navigation for parent
              if (!isCollapsed && onToggle) {
                onToggle(checked);
              }
            }}
            sx={{
              backgroundColor: isCollapsed && isActive ? alpha('#FFFFFF', 0.15) : 'transparent',
              color: checked ? '#333333' : (isActive ? '#FFFFFF' : alpha('#FFFFFF', 0.8)),
              borderRadius: checked ? '8px 8px 0 0' : 2,
              overflow: 'hidden',
              justifyContent: isCollapsed ? 'center' : 'flex-start',
              px: isCollapsed ? 1 : 2,
              py: isCollapsed ? 1.5 : 1.25,
              minHeight: isCollapsed ? 48 : 'auto',
              cursor: 'pointer',
              borderLeft: isCollapsed && isActive ? '4px solid #FFFFFF' : 'none',
              '&:hover': {
                backgroundColor: isCollapsed ? (isActive ? alpha('#FFFFFF', 0.2) : alpha('#FFFFFF', 0.1)) : 'transparent',
                color: checked ? '#333333' : '#FFFFFF',
              },
              transition: 'all 0.2s ease-in-out',
            }}
          >
            <ListItemIcon sx={{ color: 'inherit', minWidth: isCollapsed ? 40 : 24, maxWidth: isCollapsed ? 40 : 24, mr: isCollapsed ? 0 : 0, justifyContent: 'center' }}>
              <IconifyIcon icon={navItem.icon as string} width={20} height={20} />
            </ListItemIcon>
            {!isCollapsed && (
              <>
                <ListItemText
                  primary={navItem.title}
                  sx={{ 
                    ml: -0.9, 
                    flex: 1,
                    display: isCollapsed ? 'none' : 'block',
                  }}
                  primaryTypographyProps={{
                    fontSize: '0.875rem',
                    fontWeight: checked ? 600 : 500,
                    whiteSpace: 'nowrap',
                  }}
                />
                <ListItemIcon sx={{ 
                  color: 'inherit', 
                  minWidth: 24, 
                  maxWidth: 24, 
                  ml: 'auto', 
                  flexShrink: 0,
                  display: isCollapsed ? 'none' : 'flex',
                }}>
                  {navItem.collapsible &&
                    (checked ? (
                      <IconifyIcon icon="mingcute:up-fill" width={16} height={16} />
                    ) : (
                      <IconifyIcon icon="mingcute:down-fill" width={16} height={16} />
                    ))}
                </ListItemIcon>
              </>
            )}
          </ListItemButton>
          <Collapse in={checked && !isCollapsed}>
            <List sx={{ bgcolor: '#FFFFFF', borderRadius: '0 0 8px 8px', p: 0.5, pb: 0.5, mt: 0 }}>
              {navItem.sublist?.map((subListItem: any, idx: number) => (
                <ListItem
                  key={idx}
                  sx={{
                    backgroundColor: isSubmenuActive(subListItem) ? '#F5F5F5' : 'transparent',
                    color: '#333333',
                    borderRadius: 2,
                    mb: 1.5,
                    '&:hover': {
                      backgroundColor: '#F5F5F5',
                      color: '#333333',
                    },
                    transition: 'all 0.2s ease-in-out',
                  }}
                >
                  {subListItem.collapsible ? (
                    <>
                      <ListItemButton
                        LinkComponent={Link}
                        onClick={() => {
                          handleNestedChecked(idx, !nestedChecked[idx]);
                        }}
                        sx={{
                          borderRadius: 2,
                          color: '#333333',
                          '&:hover': {
                            backgroundColor: '#F5F5F5',
                          },
                        }}
                      >
                        <ListItemText
                          sx={{ ml: 3.5 }}
                          primary={subListItem.title}
                          primaryTypographyProps={{
                            fontSize: '0.8125rem',
                            fontWeight: nestedChecked[idx] ? 600 : 500,
                            whiteSpace: 'nowrap',
                          }}
                        />
                        <ListItemIcon sx={{ color: 'inherit' }}>
                          {subListItem.collapsible &&
                            (nestedChecked[idx] ? (
                              <IconifyIcon icon="mingcute:up-fill" width={14} height={14} />
                            ) : (
                              <IconifyIcon icon="mingcute:down-fill" width={14} height={14} />
                            ))}
                        </ListItemIcon>
                      </ListItemButton>
                      <Collapse in={nestedChecked[idx]}>
                        <List sx={{ bgcolor: '#FFFFFF', borderRadius: 2, p: 0.5 }}>
                          {subListItem?.sublist?.map(
                            (nestedSubListItem: any, nestedIdx: number) => (
                              <ListItem key={nestedIdx}>
                                <ListItemButton
                                  LinkComponent={Link}
                                  href={
                                    navItem.path !== '/'
                                      ? navItem.path +
                                      '/' +
                                      subListItem.path +
                                      '/' +
                                      nestedSubListItem.path
                                      : nestedSubListItem.path
                                  }
                                  onClick={() => {
                                    // Close the parent menu when a nested submenu item is clicked (optional)
                                    // if (onToggle) {
                                    //   onToggle(false);
                                    // }
                                  }}
                                  sx={{
                                    borderRadius: 2,
                                    mx: 1,
                                    backgroundColor: isNestedSubmenuActive(subListItem, nestedSubListItem) ? '#F5F5F5' : 'transparent',
                                    color: '#333333',
                                    '&:hover': {
                                      backgroundColor: '#F5F5F5',
                                      color: '#333333',
                                    },
                                    transition: 'all 0.2s ease-in-out',
                                  }}
                                >
                                  <ListItemText
                                    sx={{ ml: 5 }}
                                    primary={nestedSubListItem.title}
                                    primaryTypographyProps={{
                                      fontSize: '0.75rem',
                                      fontWeight: 500,
                                    }}
                                  />
                                </ListItemButton>
                              </ListItem>
                            ),
                          )}
                        </List>
                      </Collapse>
                    </>
                  ) : (
                    <ListItemButton
                      LinkComponent={Link}
                      href={navItem.path + '/' + subListItem.path}
                      onClick={() => {
                        // Close the parent menu when a submenu item is clicked (optional - can be removed if you want menu to stay open)
                        // if (onToggle) {
                        //   onToggle(false);
                        // }
                      }}
                      sx={{
                        borderRadius: 2,
                        backgroundColor: isSubmenuActive(subListItem) ? '#F5F5F5' : 'transparent',
                        color: '#333333',
                        py: 0.75,
                        minHeight: 40,
                        '&:hover': {
                          backgroundColor: '#F5F5F5',
                          color: '#333333',
                        },
                        transition: 'all 0.2s ease-in-out',
                      }}
                    >
                      <ListItemText
                        sx={{ ml: 3, my: 0 }}
                        primary={subListItem.title}
                        primaryTypographyProps={{
                          fontSize: '0.8125rem',
                          fontWeight: 500,
                          lineHeight: 1.5,
                          whiteSpace: 'nowrap',
                        }}
                      />
                    </ListItemButton>
                  )}
                </ListItem>
              ))}
            </List>
          </Collapse>
        </>
      ) : (
        <ListItemButton
          LinkComponent={Link}
          href={navItem.path}
          sx={{
            backgroundColor: isCollapsed && isActive ? alpha('#FFFFFF', 0.15) : 'transparent',
            color: isActive ? '#FFFFFF' : alpha('#FFFFFF', 0.8),
            borderRadius: 2,
            overflow: 'hidden',
            justifyContent: isCollapsed ? 'center' : 'flex-start',
            px: isCollapsed ? 1 : 2,
            py: isCollapsed ? 1.5 : 1.25,
            minHeight: isCollapsed ? 48 : 'auto',
            borderLeft: isCollapsed && isActive ? '4px solid #FFFFFF' : 'none',
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: isCollapsed ? (isActive ? alpha('#FFFFFF', 0.2) : alpha('#FFFFFF', 0.1)) : alpha('#FFFFFF', 0.1),
              color: '#FFFFFF',
            },
            transition: 'all 0.2s ease-in-out',
          }}
        >
          <ListItemIcon sx={{ color: 'inherit', minWidth: isCollapsed ? 40 : 24, maxWidth: isCollapsed ? 40 : 24, mr: isCollapsed ? 0 : 0, justifyContent: 'center' }}>
            <IconifyIcon icon={navItem.icon as string} width={20} height={20} />
          </ListItemIcon>
          {!isCollapsed && (
            <ListItemText
              primary={navItem.title}
              sx={{ 
                ml: -0.5, 
                flex: 1,
                display: isCollapsed ? 'none' : 'block',
              }}
              primaryTypographyProps={{
                fontSize: '0.875rem',
                fontWeight: isActive ? 600 : 500,
                whiteSpace: 'nowrap',
              }}
            />
          )}
        </ListItemButton>
      )}
    </ListItem>
  );
};

export default NavButton;
