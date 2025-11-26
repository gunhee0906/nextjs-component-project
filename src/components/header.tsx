"use client";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Search, User } from "lucide-react";
import { LoginModal } from "./modal/loginModal";
import { JWTPayload } from "@/lib/auth";
import { DarkModeButton } from "./ui/darkmode";
import { useFetchAuthQuery } from "@/store/api/auth/authSlice";
import NotificationDrawer from "./modal/notiModal";
import { useAppSelector } from "@/store/hooks";
import UserModal from "./modal/userModal";
interface Props {
  auth: JWTPayload | null;
  sidebar: string | undefined;
  // email , token
}
export default function Header({ auth, sidebar }: Props) {
  // auth : email , token 값 존재

  useFetchAuthQuery();

  // Store 에 저장되어 있는 User Data ( email & name )
  const user = useAppSelector((state) => state.user);

  return (
    <>
      <header className="flex-shrink-0">
        <div className="z-10 flex h-14 items-center gap-4 border-b bg-background px-6">
          <SidebarTrigger />
          <div className="flex-1">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                placeholder="검색..."
                className="w-full rounded-md border border-input bg-background pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <DarkModeButton />

            <NotificationDrawer />

            {user?.email ? (
              <UserModal>
                <Button variant="outline" size="icon">
                  <User className="h-4 w-4" />
                </Button>
              </UserModal>
            ) : (
              <LoginModal>
                <Button variant={"outline"} size={"icon"}>
                  <User className="h-4 w-4" />
                </Button>
              </LoginModal>
            )}
          </div>
        </div>
        {/* <div className="sticky top-0 z-10 flex h-8 items-center gap-4 border-b bg-background px-6"></div> */}
      </header>
    </>
  );
}
