import GuestGuard from "@/auth/GuestGuard";
import SignupSession from "@/sections/signup";

export default function SignupPage() {
  return <GuestGuard>  <SignupSession /> </GuestGuard>;
}