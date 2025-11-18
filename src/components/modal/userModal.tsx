"use client";

import { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useFetchLogoutMutation } from "@/store/api/auth/authSlice";
import { toast } from "sonner";
import { DialogDescription, DialogTitle } from "../ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export default function UserModal({ children }: { children: React.ReactNode }) {
  const [useLogout] = useFetchLogoutMutation();
  const [open, setOpen] = useState<boolean>(false);
  const navigate = useRouter();
  const handleLogout = async () => {
    const response = await useLogout({});
    if (response.data.result) {
      navigate.push("/");
      setOpen(false);
      toast.success("로그아웃 되었습니다.");
    }
  };
  return (
    <Drawer open={open} onOpenChange={setOpen} direction="right">
      <DrawerTrigger asChild>{children}</DrawerTrigger>

      <DrawerContent className="h-screen top-0 right-0 left-auto mt-0 w-[400px] rounded-none">
        <div className="flex flex-col h-full">
          <DrawerHeader className="border-b">
            <DialogTitle>My Info</DialogTitle>
            <DialogDescription>
              나의 정보를 보거나 수정할 수 있습니다.
            </DialogDescription>
          </DrawerHeader>

          <div className="flex-1 overflow-y-auto">
            <Avatar className="w-36 h-36 justify-center flex items-center">
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>

          <DrawerFooter className="border-t">
            <Button variant="outline" onClick={() => handleLogout()}>
              로그아웃
            </Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
