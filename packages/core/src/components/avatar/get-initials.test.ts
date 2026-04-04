import { describe, expect, it } from "vitest";
import { getClbrInitials } from "./get-initials";

describe("getClbrInitials", () => {
  it("covers the general matrix (up to 3 initials)", () => {
    expect(getClbrInitials("X")).toBe("X");
    expect(getClbrInitials("Prince")).toBe("P");
    expect(getClbrInitials("Lovely Paul")).toBe("LP");
    expect(getClbrInitials("Felix Mathieu Wien")).toBe("FMW");
    expect(getClbrInitials("Alexandria Ocasio-Cortez")).toBe("AOC");
    expect(getClbrInitials("IKEA Customer Service")).toBe("ICS");
    expect(getClbrInitials("Priya Shankar-Lee-Brown")).toBe("PS");
    expect(getClbrInitials("Mary Jane Ng")).toBe("MJN");
    expect(getClbrInitials("Ai-my Watts Chang")).toBe("AWC");
    expect(getClbrInitials("Lysette Leighton-Amaro Quartz")).toBe("LLQ");
    expect(getClbrInitials("Jack Shu Wellington-Chan")).toBe("JSW");
    expect(getClbrInitials("Phan Văn Trường")).toBe("PVT");
  });

  it("handles lowercase surname particles", () => {
    expect(getClbrInitials("lowercase mcdonald")).toBe("Lm");
    expect(getClbrInitials("Cassidy da Silva")).toBe("Cd");
    expect(getClbrInitials("Hunter van Dijk Haas")).toBe("Hv");
    expect(getClbrInitials("Jenny d’Orsay")).toBe("Jd");
    expect(getClbrInitials("Jessica de’Anth-Hansel")).toBe("Jd");
    expect(getClbrInitials("Antonio Clark-d’Jonge")).toBe("ACd");
  });

  it("handles hyphenated first names", () => {
    expect(getClbrInitials("Bethany-Anne Irving")).toBe("BI");
    expect(getClbrInitials("BethanyAnne Irving")).toBe("BI");
    expect(getClbrInitials("Bethany-Anne Hannah Irving")).toBe("BHI");
  });

  it("uses first + last for four or more words where no lowercase particle exists", () => {
    expect(getClbrInitials("Brent Christian Nathaniel Marks")).toBe("BM");
    expect(getClbrInitials("Random Potato SYD Corp")).toBe("RC");
    expect(getClbrInitials("Miss Jones Customer Care")).toBe("MC");
    expect(getClbrInitials("Bobby Johnny Five-Names Jimmy Smith")).toBe("BS");
    expect(getClbrInitials("Philip Long Name Reginald van Smith")).toBe("Pv");
    expect(getClbrInitials("Sara von Long Name Baker Watson")).toBe("Sv");
    expect(getClbrInitials("George R R Martin")).toBe("GM");
  });

  it("disregards unsupported leading characters and unsupported scripts", () => {
    expect(getClbrInitials("Magic Ball 8")).toBeUndefined();
    expect(getClbrInitials("Formula1 Racing")).toBe("FR");
    expect(getClbrInitials("日本語")).toBeUndefined();
    expect(getClbrInitials("🥛 milk it")).toBeUndefined();
    expect(getClbrInitials("doughnut boi 🍩")).toBe("Db");
  });
});
