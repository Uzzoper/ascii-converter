import { describe, expect, it } from "vitest";
import { asciiLineToRuns } from "./asciiFrame";

describe("asciiLineToRuns", () => {
  it("merges adjacent cells with similar colors into one run", () => {
    const runs = asciiLineToRuns([
      { char: "A", color: "#101010" },
      { char: "B", color: "#1f1f1f" },
      { char: "C", color: "#2a2a2a" },
    ]);

    expect(runs).toHaveLength(1);
    expect(runs[0]).toMatchObject({ text: "ABC" });
  });

  it("keeps distant colors in separate runs", () => {
    const runs = asciiLineToRuns([
      { char: "A", color: "#101010" },
      { char: "B", color: "#f0f0f0" },
    ]);

    expect(runs).toHaveLength(2);
    expect(runs[0]).toMatchObject({ text: "A", color: "#101010" });
    expect(runs[1]).toMatchObject({ text: "B", color: "#f0f0f0" });
  });
});
