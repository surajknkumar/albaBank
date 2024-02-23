'use client';
import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Image from 'next/image';
import { LOGO } from '@svgs';
import { ListItemIcon, ListItemText, MenuItem, MenuList } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { SIDE_MENU } from '@utils/constants';
import { useAppSelector } from '@app/store/redux/hooks';
import { getPermissionsMapping } from '@app/store/redux/selectors';

export function SideNav() {
  const router = useRouter();
  const pathName = usePathname();
  const permissions = useAppSelector(getPermissionsMapping);
  const [sidMenu, setSideMenu] = useState(SIDE_MENU);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    setSelectedIndex(
      SIDE_MENU.findIndex((menuItem) => {
        const path = pathName?.split('/')[1];
        if (path === 'client') return true;
        return menuItem.slug.slice(1) === path;
      })
    );
  }, [pathName]);

  useEffect(() => {
    setSideMenu(
      SIDE_MENU.map((item) =>
        item.title !== 'Approvals'
          ? item
          : { ...item, active: permissions ? permissions.includes('APPROVE_WITHDRAWAL_REQUEST') : false }
      )
    );
  }, [permissions]);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', margin: '24px 0 60px' }}>
        <Image height={50} width={100} src={LOGO} alt="alba Logo" priority />
      </Box>
      <MenuList>
        {sidMenu &&
          sidMenu.map(
            (nav, navIndex) =>
              nav.active && (
                <Link
                  href={`${nav.slug}`}
                  key={nav.slug}
                  onClick={() => {
                    router.push(nav.slug);
                    setSelectedIndex(navIndex);
                  }}
                >
                  <MenuItem
                    selected={navIndex === selectedIndex}
                    style={{
                      padding: 20,
                      background: navIndex === selectedIndex ? '#fff' : '',
                      textAlign: 'start'
                    }}
                  >
                    <ListItemIcon>
                      <Image height={25} width={25} src={nav.image} alt="navigation" priority />
                    </ListItemIcon>
                    <ListItemText
                      primaryTypographyProps={{
                        fontWeight: 500,
                        lineHeight: '18px',
                        color: '#221C35'
                      }}
                    >
                      {nav.title}
                    </ListItemText>
                  </MenuItem>
                </Link>
              )
          )}
      </MenuList>
    </Box>
  );
}
