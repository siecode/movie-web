'use client';

import React, { ReactNode, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useNavigationStore } from '@/providers/navigation/navigation-provider';
import { Home } from '@/routes';

import { useEffectOnce } from '@/hooks/use-effect-once';
import { Dialog, DialogContent } from '@/components/ui/dialog';

const Media = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  const { lastActiveRoute } = useNavigationStore();

  useEffectOnce(() => setIsMounted(true));

  return (
    <Dialog
      defaultOpen={true}
      onOpenChange={() =>
        router.push(lastActiveRoute ?? Home(), { scroll: false })
      }
    >
      {isMounted && <DialogContent>{children}</DialogContent>}
    </Dialog>
  );
};

export default Media;
