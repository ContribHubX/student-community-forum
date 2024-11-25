import { lighten } from "polished";

export const statusColors = {
  finished: {
    text: "#0047FF",
    background: lighten(0.45, "#0047FF"),
  },
  active: {
    text: "#2DCD5B",
    background: lighten(0.45, "#2DCD5B"),
  },
  archived: {
    text: "#FFB200",
    background: lighten(0.45, "#FFB200"),
  },
};
