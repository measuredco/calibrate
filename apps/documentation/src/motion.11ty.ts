import { createRequire } from "node:module";

import type { MotionData } from "./_data/motion";
import motionData from "./_data/motion";
import {
  type FoundationsGroup,
  type FoundationsRow,
  renderFoundationsPage,
  type TokenDocument,
  tokenNameToCssVariable,
} from "./_shared/foundations";

interface PageData {
  motion: MotionData;
}

interface MotionToken {
  $description?: string;
  layer?: string;
}

const require = createRequire(import.meta.url);
const msrdTokens =
  require("@measured/calibrate-tokens/msrd") as TokenDocument<MotionToken>;

const getMotionGroup = (name: string): string => name.split(".")[1] ?? "";

const formatMotionGroupLabel = (group: string): string =>
  group.length === 0 ? group : `${group[0].toUpperCase()}${group.slice(1)}`;

// Previews are a TODO — motion needs looping animations per token, so this
// is scaffolded with token name + description only for now.
const motionGroups = Object.entries(msrdTokens.tokens)
  .filter(
    ([name, token]) => name.startsWith("motion.") && token.layer === "semantic",
  )
  .reduce<Map<string, FoundationsRow[]>>((groups, [name, token]) => {
    const group = getMotionGroup(name);
    const row: FoundationsRow = {
      entries: [
        {
          cssVariable: tokenNameToCssVariable(name),
          description: token.$description ?? "",
        },
      ],
      preview: "",
    };

    const rows = groups.get(group);
    if (rows) rows.push(row);
    else groups.set(group, [row]);

    return groups;
  }, new Map());

const groups: FoundationsGroup[] = Array.from(
  motionGroups,
  ([group, rows]) => ({ label: formatMotionGroupLabel(group), rows }),
);

export default class Motion {
  data() {
    return {
      layout: "base.11ty.ts",
      permalink: "/motion/",
      title: motionData.title,
    };
  }

  render(data: PageData): string {
    return renderFoundationsPage({
      docsClass: "docs-motion",
      groups,
      strapline: data.motion.strapline,
      title: data.motion.title,
    });
  }
}
