import { useRouter } from "./useRouter";
import { routes } from "./routes";
import { RootLayout } from "./RootLayout";

const Router = () => {
  const { pathname } = useRouter();
  const matchedRoute = routes.find((route) => route.path === pathname);
  const Page = matchedRoute?.Page ?? routes[0].Page;

  return (
    <RootLayout>
      <Page />
    </RootLayout>
  );
};

export { Router };
