"use client";

import { Button } from "@/components/ui/button";

function HomeTemplate() {
  return (
    <div>
      <h1>Home</h1>
      <p>Welcome to the home page</p>
      <Button variant={"destructive"}>Click me</Button>
      <Button variant={"default"}>Click me</Button>
      <Button variant={"outline"}>Click me</Button>
      <Button variant={"secondary"}>Click me</Button>
      <Button variant={"ghost"}>Click me</Button>
      <Button variant={"link"}>Click me</Button>
    </div>
  );
}

export default HomeTemplate;
