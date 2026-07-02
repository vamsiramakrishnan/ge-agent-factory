// Render tests for the shared primitives. The DOM comes from happy-dom via
// ./test-setup (imported FIRST — see its header for the ESM-hoisting reason),
// scoped to this package's tests rather than the global preload so the rest
// of the suite — which sometimes branches on `typeof window` — is untouched.
import { unregisterDom } from "./test-setup";
import { afterAll, afterEach, describe, expect, test } from "bun:test";
import { cleanup, fireEvent, render } from "@testing-library/react";
import { Inbox } from "lucide-react";
import { Button, ButtonLink, buttonClass } from "./Button";
import { EmptyState } from "./EmptyState";
import { Stat } from "./Stat";
import { Field, Select, CONTROL_CLASS } from "./Field";
import { Segmented } from "./Segmented";
import { cx } from "./cx";

afterEach(cleanup);
// Restore clean globals for the rest of the single-process suite (see
// test-setup.ts — parts of it branch on `typeof window`).
afterAll(unregisterDom);

describe("cx", () => {
  test("joins truthy parts only", () => {
    expect(cx("a", false, null, undefined, "b")).toBe("a b");
  });
});

describe("Button", () => {
  test("renders variants from one recipe table", () => {
    expect(buttonClass({ variant: "primary" })).toContain("bg-primary");
    expect(buttonClass({ variant: "outline" })).toContain("border-outline/30");
    expect(buttonClass({ variant: "ghost" })).toContain("hover:bg-primary/10");
  });

  test("loading disables and shows the canonical spinner", () => {
    const { container, getByRole } = render(<Button loading>Build</Button>);
    const button = getByRole("button", { name: /build/i });
    expect(button.hasAttribute("disabled")).toBe(true);
    expect(container.querySelector(".animate-spin")).not.toBeNull();
  });

  test("click fires; disabled click does not", () => {
    let clicks = 0;
    const first = render(<Button onClick={() => { clicks += 1; }}>Go</Button>);
    fireEvent.click(first.getByRole("button", { name: "Go" }));
    expect(clicks).toBe(1);
    cleanup();
    const second = render(<Button disabled onClick={() => { clicks += 1; }}>Go</Button>);
    fireEvent.click(second.getByRole("button", { name: "Go" }));
    expect(clicks).toBe(1);
  });

  test("ButtonLink renders an anchor with the same recipe", () => {
    const { getByRole } = render(<ButtonLink href="#/fleet" variant="ghost">View</ButtonLink>);
    const link = getByRole("link", { name: "View" });
    expect(link.getAttribute("href")).toBe("#/fleet");
    expect(link.className).toContain("text-primary");
  });
});

describe("EmptyState", () => {
  test("renders icon, title, detail, and action", () => {
    const { getByText, getByRole } = render(
      <EmptyState
        icon={Inbox}
        title="No agents in the fleet yet"
        detail="Build one from the Pipeline."
        action={<Button size="sm">Open Pipeline</Button>}
      />,
    );
    expect(getByText("No agents in the fleet yet")).toBeDefined();
    expect(getByText("Build one from the Pipeline.")).toBeDefined();
    expect(getByRole("button", { name: "Open Pipeline" })).toBeDefined();
  });
});

describe("Stat", () => {
  test("renders label over value in both sizes", () => {
    const first = render(<Stat label="Mode" value="local" />);
    expect(first.getByText("Mode")).toBeDefined();
    expect(first.getByText("local")).toBeDefined();
    cleanup();
    const second = render(<Stat size="md" label="Total" value={42} />);
    expect(second.container.firstElementChild?.className).toContain("rounded-lg");
    expect(second.getByText("42")).toBeDefined();
  });
});

describe("Field/Select", () => {
  test("associates label with control and applies the canonical recipe", () => {
    const { getByLabelText } = render(
      <Field label="Target">
        <Select value="preview" onChange={() => {}}>
          <option value="preview">Preview</option>
        </Select>
      </Field>,
    );
    const select = getByLabelText("Target") as HTMLSelectElement;
    expect(select.tagName).toBe("SELECT");
    expect(select.className).toContain(CONTROL_CLASS.split(" ")[0]);
  });
});

describe("Segmented", () => {
  test("marks the active segment and fires onChange with the value", () => {
    let value = "all";
    const { getByRole, getByText } = render(
      <Segmented
        aria-label="Kind"
        options={[{ value: "all", label: "All" }, { value: "build", label: "Builds", count: 3 }]}
        value={value}
        onChange={(next) => { value = next; }}
      />,
    );
    const active = getByRole("button", { name: /all/i });
    expect(active.getAttribute("aria-pressed")).toBe("true");
    fireEvent.click(getByRole("button", { name: /builds/i }));
    expect(value).toBe("build");
    expect(getByText("3")).toBeDefined();
  });
});
