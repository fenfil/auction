import { PropsWithChildren } from "react";
import { Toaster } from "./ui/sonner";

export const DesignProvider = ({ children }: PropsWithChildren) => {
  return (
    <>
      {children}
      <Toaster />
    </>
  );
};
