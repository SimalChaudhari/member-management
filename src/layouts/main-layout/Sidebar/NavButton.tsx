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
}

const NavButton = ({ navItem, Link }: NavItemProps): ReactElement => {
  const { pathname } = useLocation();
  const [checked, setChecked] = useState(false);
  const [nestedChecked, setNestedChecked] = useState<boolean[]>([]);

  useEffect(() => {
    if (pathname === '/') {
      setChecked(false);
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

  return (
    <ListItem
      sx={{
        my: 1.25,
        borderRadius: 2,
        bgcolor: isActive ? 'background.red' : 'transparent',
        color: isActive ? '#FFFFFF' : alpha('#FFFFFF', 0.8),
        '&:hover': {
          backgroundColor: alpha('#FFFFFF', 0.1),
          color: '#FFFFFF',
          transform: 'translateX(4px)',
        },
        transition: 'all 0.2s ease-in-out',
      }}
    >
      {navItem.collapsible ? (
        <>
          <ListItemButton 
            LinkComponent={Link} 
            onClick={() => setChecked(!checked)}
            sx={{
              backgroundColor: checked ? alpha('#FFFFFF', 0.15) : 'transparent',
              color: checked ? '#FFFFFF' : alpha('#FFFFFF', 0.8),
              borderRadius: 2,
              '&:hover': {
                backgroundColor: alpha('#FFFFFF', 0.1),
                color: '#FFFFFF',
              },
              transition: 'all 0.2s ease-in-out',
            }}
          >
            <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>
              <IconifyIcon icon={navItem.icon as string} width={20} height={20} />
            </ListItemIcon>
            <ListItemText 
              primary={navItem.title}
              primaryTypographyProps={{
                fontSize: '0.875rem',
                fontWeight: checked ? 600 : 500,
              }}
            />
            <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>
              {navItem.collapsible &&
                (checked ? (
                  <IconifyIcon icon="mingcute:up-fill" width={16} height={16} />
                ) : (
                  <IconifyIcon icon="mingcute:down-fill" width={16} height={16} />
                ))}
            </ListItemIcon>
          </ListItemButton>
          <Collapse in={checked}>
            <List sx={{ mt: 1 }}>
              {navItem.sublist?.map((subListItem: any, idx: number) => (
                <ListItem
                  key={idx}
                  sx={{
                    backgroundColor: pathname === `${navItem.path}/${subListItem.path}` ? alpha('#FFFFFF', 0.15) : 'transparent',
                    color: pathname === `${navItem.path}/${subListItem.path}` ? '#FFFFFF' : alpha('#FFFFFF', 0.7),
                    borderRadius: 2,
                    mx: 1,
                    '&:hover': {
                      backgroundColor: alpha('#FFFFFF', 0.1),
                      color: '#FFFFFF',
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
                          '&:hover': {
                            backgroundColor: alpha('#FFFFFF', 0.1),
                          },
                        }}
                      >
                        <ListItemText 
                          sx={{ ml: 3.5 }}
                          primary={subListItem.title}
                          primaryTypographyProps={{
                            fontSize: '0.8125rem',
                            fontWeight: nestedChecked[idx] ? 600 : 500,
                          }}
                        />
                        <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>
                          {subListItem.collapsible &&
                            (nestedChecked[idx] ? (
                              <IconifyIcon icon="mingcute:up-fill" width={14} height={14} />
                            ) : (
                              <IconifyIcon icon="mingcute:down-fill" width={14} height={14} />
                            ))}
                        </ListItemIcon>
                      </ListItemButton>
                      <Collapse in={nestedChecked[idx]}>
                        <List>
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
                                  sx={{
                                    borderRadius: 2,
                                    mx: 1,
                                    '&:hover': {
                                      backgroundColor: alpha('#FFFFFF', 0.1),
                                    },
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
                      sx={{
                        borderRadius: 2,
                        '&:hover': {
                          backgroundColor: alpha('#FFFFFF', 0.1),
                        },
                      }}
                    >
                      <ListItemText 
                        sx={{ ml: 3 }}
                        primary={subListItem.title}
                        primaryTypographyProps={{
                          fontSize: '0.8125rem',
                          fontWeight: 500,
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
            opacity: navItem.active ? 1 : 0.8,
            borderRadius: 2,
            '&:hover': {
              backgroundColor: alpha('#FFFFFF', 0.1),
              opacity: 1,
            },
            transition: 'all 0.2s ease-in-out',
          }}
        >
          <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>
            <IconifyIcon icon={navItem.icon as string} width={20} height={20} />
          </ListItemIcon>
          <ListItemText 
            primary={navItem.title}
            primaryTypographyProps={{
              fontSize: '0.875rem',
              fontWeight: isActive ? 600 : 500,
            }}
          />
        </ListItemButton>
      )}
    </ListItem>
  );
};

export default NavButton;
