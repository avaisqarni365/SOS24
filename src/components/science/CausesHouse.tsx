import { hy } from "@/lib/hyphenate";
import CausesHouseClient from "./CausesHouseClient";
import { CAUSES } from "@/data/causes";

/** Server wrapper: hyphenates the texts at build time, then hands them to the interactive part. */
export default function CausesHouse() {
  const causes = CAUSES.map((c) => ({ ...c, what: hy(c.what), fix: hy(c.fix), signs: c.signs.map(hy) }));
  return <CausesHouseClient causes={causes} />;
}
