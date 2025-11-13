"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function NotiDropdown({ children }: any) {
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent className="w-40" align="end">
          <DropdownMenuLabel>File Actions</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem onSelect={() => setShowNewDialog(true)}>
              New File...
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setShowShareDialog(true)}>
              Share...
            </DropdownMenuItem>
            <DropdownMenuItem disabled>Download</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New File</DialogTitle>
            <DialogDescription>
              Provide a name for your new file. Click create when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Share File</DialogTitle>
            <DialogDescription>
              Anyone with the link will be able to view this file.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Send Invite</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
