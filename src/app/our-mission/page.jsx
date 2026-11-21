import StaticPage from "@/components/StaticPage";
import { STATIC } from "@/lib/staticContent";
export const metadata = { title: STATIC.mission.en.title };
export default function Page() { return <StaticPage page={STATIC.mission} />; }
