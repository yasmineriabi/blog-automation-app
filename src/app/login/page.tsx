import GuestGuard from "@/auth/GuestGuard";
import LoginSession from "@/sections/login";

export default function LoginPage() {
  return <GuestGuard>  <LoginSession /> </GuestGuard>;
}