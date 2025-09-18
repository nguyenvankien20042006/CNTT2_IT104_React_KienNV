import { Spin } from "antd";
import { Suspense } from "react";

const LazyLoader = ({ children }: { children: React.ReactNode }) => {
  return <Suspense fallback={<Spin />}>{children}</Suspense>;
};

export default LazyLoader;
