"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { Checkbox } from "../ui/checkbox";
import { useFetchLoginMutation } from "@/store/api/auth/authSlice";
import { Loader2, User } from "lucide-react";

interface FormDataType {
  email: string;
  password: string;
}

export function LoginModal({ children }: any) {
  const [fetchLogin] = useFetchLoginMutation();

  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormDataType>({
    email: "",
    password: "",
  });
  const [account, setAccount] = useState<boolean>(false);
  const [error, setError] = useState({
    email: "",
    password: "",
    login: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleAccount = (checked: boolean) => {
    setAccount(checked);
  };

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSubmit();
  };

  const accountRemeber = (token: string) => {
    localStorage.setItem("token", token);
  };

  const handleDialogOpenChange = (value: boolean) => {
    if (isLoading && !value) return;
    setOpen(value);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    const body = {
      email: formData.email,
      password: formData.password,
    };
    try {
      const response = await fetchLogin(body);
      if (response.data.result) {
        accountRemeber("123");
        setOpen(false);
      } else {
        setError((prev) => ({ ...prev, login: response.data.message }));
      }
      // setOpen(false);
    } catch (error) {
      console.error("Server Error : ", error);
      setError((prev) => ({ ...prev, login: "서버 이상" }));
    }
  };

  useEffect(() => {
    setMounted(true);
    setFormData({
      email: "",
      password: "",
    });
    setAccount(false);
    setError({ email: "", password: "", login: "" });
  }, [open]);

  if (!mounted) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={handleDialogOpenChange}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-center">로그인</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
              <p className="text-sm text-muted-foreground">처리 중입니다...</p>
            </div>
          ) : (
            <form>
              <div className="grid gap-4">
                <div className="grid gap-3">
                  <Label htmlFor="name-1">사용자 Email</Label>
                  <Input
                    name="email"
                    value={formData.email}
                    onChange={(e) => handleChange(e)}
                    onKeyDown={handleEnter}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="username-1">사용자 Password</Label>
                  <Input
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleChange(e)}
                    onKeyDown={handleEnter}
                  />
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox
                    name="account"
                    checked={account}
                    onCheckedChange={handleAccount}
                  />
                  <Label htmlFor="terms">계정정보 기억하기</Label>
                </div>
                <Label className="text-center text-red-500">
                  {error?.login}
                </Label>
              </div>
              <DialogFooter className="mt-5">
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="button" onClick={handleSubmit}>
                  Save changes
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
