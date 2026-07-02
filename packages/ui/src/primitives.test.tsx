// Render tests for the shared primitives. The DOM comes from happy-dom via
// ./test-setup (imported FIRST — see its header for the ESM-hoisting reason),
// scoped to this package's tests rather than the global preload so the rest
// of the suite — which sometimes branches on `typeof window` — is untouched.
import { unregisterDom } from "./test-setup";
import { afterAll, afterEach, describe, expect, test } from "bun:test";
import { act, cleanup, fireEvent, render } from "@testing-library/react";
import { Inbox } from "lucide-react";
import { Button, ButtonLink, buttonClass } from "./Button";
import { EmptyState } from "./EmptyState";
import { Stat } from "./Stat";
import { Field, Select, CONTROL_CLASS } from "./Field";
import { Segmented } from "./Segmented";
import { CommandChip } from "./CommandChip";
import { PageHeader } from "./PageHeader";
import { Section } from "./Section";
import { StatusChip } from "./StatusChip";
import { normalizeStatus, runStatusStyle } from "./status";
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

describe("CommandChip", () => {
  test("renders the command text with the $ prefix", () => {
    const { getByText } = render(<CommandChip command="ge mcp deploy" />);
    expect(getByText("ge mcp deploy")).toBeDefined();
    expect(getByText("$")).toBeDefined();
  });

  test("exposes a copy button that survives a click", async () => {
    // Don't assert on the clipboard itself — happy-dom may not provide one;
    // the component's try/catch makes the click a no-op in that case. The
    // async act() flushes the post-await state update either way.
    const { getByRole } = render(<CommandChip command="ge up --data" />);
    const button = getByRole("button", { name: "Copy command" });
    await act(async () => { fireEvent.click(button); });
    expect(getByRole("button", { name: "Copy command" })).toBeDefined();
  });
});

describe("PageHeader", () => {
  test("renders eyebrow, title, subtitle, meta, and actions with the header rule", () => {
    const { container, getByText, getByRole } = render(
      <PageHeader
        eyebrow="Spec to deploy"
        title="Pipeline"
        subtitle="The build & deploy flow."
        meta={<span>3 specs</span>}
        actions={<Button size="sm">Refresh</Button>}
      />,
    );
    expect(getByText("Spec to deploy").className).toContain("uppercase");
    const heading = getByRole("heading", { level: 1 });
    expect(heading.textContent).toBe("Pipeline");
    expect(heading.className).toContain("text-2xl");
    expect(getByText("The build & deploy flow.")).toBeDefined();
    expect(getByText("3 specs")).toBeDefined();
    expect(getByRole("button", { name: "Refresh" })).toBeDefined();
    const header = container.firstElementChild!;
    expect(header.tagName).toBe("HEADER");
    expect(header.className).toContain("border-b");
    expect(header.className).toContain("pb-6");
    expect(header.className).toContain("mb-6");
  });

  test("size lg scales the title; children render full-width below the row", () => {
    const { getByRole, getByText } = render(
      <PageHeader size="lg" title="Readiness">
        <div>scope controls</div>
      </PageHeader>,
    );
    expect(getByRole("heading", { level: 1 }).className).toContain("text-3xl");
    expect(getByText("scope controls")).toBeDefined();
  });
});

describe("Section", () => {
  test("renders the card frame with title, description, and actions", () => {
    const { container, getByText, getByRole } = render(
      <Section
        title="Repair Runs"
        description="who can move it"
        actions={<Button size="sm">Show blocked</Button>}
      >
        <div>body</div>
      </Section>,
    );
    const card = container.firstElementChild!;
    expect(card.tagName).toBe("SECTION");
    expect(card.className).toContain("editorial-micro-card");
    expect(card.className).toContain("p-5");
    const title = getByText("Repair Runs");
    expect(title.tagName).toBe("H2");
    expect(title.className).toContain("font-semibold");
    expect(getByText("who can move it")).toBeDefined();
    expect(getByRole("button", { name: "Show blocked" })).toBeDefined();
    expect(getByText("body")).toBeDefined();
  });
});

describe("run status vocabulary", () => {
  test("normalizeStatus folds the many raw verbs into five states", () => {
    expect(normalizeStatus("queued")).toBe("pending");
    expect(normalizeStatus("in_progress")).toBe("running");
    expect(normalizeStatus("in-progress")).toBe("running");
    expect(normalizeStatus("pending_approval")).toBe("blocked");
    expect(normalizeStatus("completed")).toBe("done");
    expect(normalizeStatus("skipped")).toBe("done");
    // Terminal cancel/timeout states are failures, not "about to start".
    expect(normalizeStatus("cancelled")).toBe("failed");
    expect(normalizeStatus("canceled")).toBe("failed");
    expect(normalizeStatus("timed out")).toBe("failed");
    expect(normalizeStatus("TIMEOUT")).toBe("failed");
    // Unknown / empty / nullish fall through to pending.
    expect(normalizeStatus("definitely-not-a-status")).toBe("pending");
    expect(normalizeStatus("")).toBe("pending");
    expect(normalizeStatus(null)).toBe("pending");
    expect(normalizeStatus(undefined)).toBe("pending");
  });

  test("runStatusStyle exposes one palette entry per normalized status", () => {
    expect(runStatusStyle("done").dotClass).toContain("status-passed");
    expect(runStatusStyle("failed").dotClass).toContain("status-failed");
    expect(runStatusStyle("blocked").dotClass).toContain("status-blocked");
    expect(runStatusStyle("running").dotClass).toContain("status-running");
    expect(runStatusStyle("pending").dotClass).toContain("status-queued");
    expect(runStatusStyle("running").icon).toBe("◐");
  });

  test("StatusChip normalizes raw statuses and pulses only while running", () => {
    const done = render(<StatusChip status="completed" />);
    expect(done.getByText("Done")).toBeDefined();
    expect(done.container.querySelector(".animate-pulse")).toBeNull();
    cleanup();
    const running = render(<StatusChip status="in_progress" />);
    expect(running.getByText("Running")).toBeDefined();
    expect(running.container.querySelector(".animate-pulse")).not.toBeNull();
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
