"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
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
import {
  useFetchLoginMutation,
  useLazyFetchAuthQuery,
} from "@/store/api/auth/authSlice";
import { Spinner } from "../ui/spinner";
import { toast } from "sonner";
interface FormDataType {
  email: string;
  password: string;
}

export function LoginModal({ children }: any) {
  const [fetchLogin] = useFetchLoginMutation();
  const [trigger] = useLazyFetchAuthQuery();

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
        // Local Storage 에 저장
        accountRemeber("123");
        setOpen(false);
        trigger();
        toast.success("로그인 되었습니다.");
        window.location.reload();
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

          <form>
            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor="name-1">사용자 Email</Label>
                <Input
                  disabled={isLoading}
                  name="email"
                  value={formData.email}
                  onChange={(e) => handleChange(e)}
                  onKeyDown={handleEnter}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="username-1">사용자 Password</Label>
                <Input
                  disabled={isLoading}
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleChange(e)}
                  onKeyDown={handleEnter}
                />
              </div>
              <div className="flex items-center gap-3">
                <Checkbox
                  disabled={isLoading}
                  name="account"
                  checked={account}
                  onCheckedChange={handleAccount}
                />
                <Label htmlFor="terms">계정정보 기억하기</Label>
              </div>
              <Label className="text-center text-red-500">{error?.login}</Label>
            </div>
            <DialogFooter className="mt-5">
              <Button
                disabled={isLoading}
                className="w-full"
                type="button"
                onClick={handleSubmit}
              >
                {isLoading && <Spinner />}
                Login
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
