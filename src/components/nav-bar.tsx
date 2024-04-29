'use client';

import { usePathname } from 'next/navigation';
import { BrowseRoute } from '@/routes';

import { cn } from '@/lib/utils';
import { BodySmall } from '@/components/fonts';
import { LogoIcon } from '@/components/icons';

const NavBar = () => {
  const pathname = usePathname();

  return (
    <div className='flex h-16 flex-row items-center justify-between bg-black px-leftRightCustom'>
      <div className='flex flex-row items-center gap-8'>
        <LogoIcon />

        <nav>
          <BrowseRoute.Link>
            <BodySmall
              className={cn('transition-colors hover:text-primary/50', {
                'text-primary': pathname === BrowseRoute(),
                'text-primary/70': pathname !== BrowseRoute(),
              })}
            >
              BrowseRoute
            </BodySmall>
          </BrowseRoute.Link>
        </nav>
      </div>
    </div>
  );
};

export default NavBar;
