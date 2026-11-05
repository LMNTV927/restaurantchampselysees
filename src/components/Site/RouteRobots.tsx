import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { isNoindexPath } from "@/lib/seoRouting";

// Head-only policy: booking, tracking and reservation components stay untouched.
export function RouteRobots() {
  const { pathname } = useLocation();
  return (
    <Helmet defer={false}>
      <meta name="robots" content={isNoindexPath(pathname) ? "noindex, nofollow" : "index, follow"} />
    </Helmet>
  );
}