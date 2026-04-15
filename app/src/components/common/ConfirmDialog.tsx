import { useState, useCallback, useRef } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface ConfirmOptions {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'default' | 'destructive';
}

interface ConfirmState extends ConfirmOptions {
  resolve: (value: boolean) => void;
}

interface ConfirmDialogContextValue {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

export function useConfirmDialog(): ConfirmDialogContextValue & {
  dialog: React.ReactNode;
} {
  const [state, setState] = useState<ConfirmState | null>(null);
  const stateRef = useRef<ConfirmState | null>(null);
  stateRef.current = state;

  const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
      setState({ ...options, resolve });
    });
  }, []);

  const handleClose = useCallback(
    (result: boolean) => {
      const current = stateRef.current;
      if (current) {
        current.resolve(result);
      }
      setState(null);
    },
    []
  );

  const dialog = (
    <AlertDialog
      open={state !== null}
      onOpenChange={(open) => {
        if (!open) handleClose(false);
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{state?.title}</AlertDialogTitle>
          {state?.description ? (
            <AlertDialogDescription>{state.description}</AlertDialogDescription>
          ) : null}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => handleClose(false)}>
            {state?.cancelLabel ?? 'Cancel'}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => handleClose(true)}
            className={cn(
              state?.variant === 'destructive' &&
                buttonVariants({ variant: 'destructive' })
            )}
          >
            {state?.confirmLabel ?? 'Confirm'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return { confirm, dialog };
}
