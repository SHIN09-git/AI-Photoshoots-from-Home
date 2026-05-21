export const DEFAULT_USER_ID = "demo_user";

type GlobalWithRuns = typeof globalThis & {
  __studioJobRuns?: Map<string, Promise<void>>;
};

const globalRuns = globalThis as GlobalWithRuns;

export function getJobRuns(): Map<string, Promise<void>> {
  if (!globalRuns.__studioJobRuns) {
    globalRuns.__studioJobRuns = new Map();
  }
  return globalRuns.__studioJobRuns;
}
