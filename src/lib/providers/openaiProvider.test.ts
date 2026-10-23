import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { OpenAIImageProvider } from "./openaiProvider";

const input = { prompt: "Test portrait", referenceImages: [] };
const bytes = Buffer.from("synthetic-image");
const fetchMock = vi.fn<typeof fetch>();

beforeEach(() => {
  vi.stubEnv("OPENAI_API_KEY", "test-only-not-a-real-key");
  vi.stubEnv("OPENAI_BASE_URL", "https://sdk-test.invalid/v1");
  vi.stubEnv("OPENAI_IMAGE_MODEL", "gpt-image-1");
  vi.stubEnv("OPENAI_IMAGE_SIZE", "1024x1536");
  vi.stubEnv("OPENAI_IMAGE_OUTPUT_FORMAT", "png");
  vi.stubGlobal("fetch", fetchMock);
  fetchMock.mockReset();
  fetchMock.mockImplementation(async () => Response.json({ data: [{ b64_json: bytes.toString("base64") }] }));
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("OpenAI image SDK contract", () => {
  it("sends generation options and decodes base64 images", async () => {
    const result = await new OpenAIImageProvider().generate({ ...input, count: 2, seed: "fixture" });
    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toBe("https://sdk-test.invalid/v1/images/generations");
    expect(JSON.parse(init!.body as string)).toMatchObject({
      model: "gpt-image-1", prompt: input.prompt, n: 2,
      size: "1024x1536", output_format: "png", quality: "auto"
    });
    expect(result[0]).toMatchObject({ buffer: bytes, mimeType: "image/png", seed: "fixture-1" });
  });

  it("uploads reference bytes as multipart image edits", async () => {
    await new OpenAIImageProvider().generate({
      ...input,
      referenceImages: [{ url: "unused", buffer: bytes, filename: "reference.png", mimeType: "image/png" }],
      settings: { identityStrength: "strong", locationConsistency: "normal", creativity: "safe" }
    });
    const [url, init] = fetchMock.mock.calls.at(-1)!;
    expect(String(url)).toBe("https://sdk-test.invalid/v1/images/edits");
    const form = init!.body as FormData;
    expect(form).toBeInstanceOf(FormData);
    expect(form.get("input_fidelity")).toBe("high");
    const file = form.get("image[]") as File;
    expect(file.name).toBe("reference.png");
    expect(file.type).toBe("image/png");
    expect(Buffer.from(await file.arrayBuffer())).toEqual(bytes);
  });

  it("supports URL-only image responses", async () => {
    fetchMock.mockResolvedValueOnce(Response.json({ data: [{ url: "https://sdk-test.invalid/result.png" }] }));
    fetchMock.mockResolvedValueOnce(new Response(bytes));
    const result = await new OpenAIImageProvider().generate(input);
    expect(result[0].buffer).toEqual(bytes);
    expect(fetchMock.mock.calls[1][0]).toBe("https://sdk-test.invalid/result.png");
  });

  it("rejects empty results", async () => {
    fetchMock.mockResolvedValueOnce(Response.json({ data: [] }));
    await expect(new OpenAIImageProvider().generate(input)).rejects.toThrow("returned no images");
  });

  it("propagates API errors without generating a success result", async () => {
    fetchMock.mockResolvedValueOnce(Response.json({ error: { message: "invalid size", type: "invalid_request_error" } }, { status: 400 }));
    await expect(new OpenAIImageProvider().generate(input)).rejects.toThrow("invalid size");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("does not make a request without a configured key", async () => {
    vi.stubEnv("OPENAI_API_KEY", "");
    await expect(new OpenAIImageProvider().generate(input)).rejects.toThrow("OPENAI_API_KEY is required");
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
