"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { login } from "../actions";

export default function Login() {
  return (
    <main className="mx-auto flex flex-col w-full h-full min-h-screen max-w-7xl gap-4 justify-center items-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>
            Please enter your email and password to login
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Email"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="*****"
                />
              </div>
              <div className="flex flex-col space-y-1.5 items-center">
                <p className="text-sm text-muted-foreground">
                  Don{"’"}t have an account yet?{" "}
                  <Link className="underline text-foreground" href="/register">
                    Sign Up
                  </Link>
                </p>
                <Button formAction={login} className="w-full">
                  Sign In
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
