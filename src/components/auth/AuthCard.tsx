import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function AuthCard({ children }: Props) {
  return <div className="p-6 card sm:p-8">{children}</div>;
}
