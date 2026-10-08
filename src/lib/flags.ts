/** Demo personas stay available locally and on preview. Production sets this to "false". */
export function demoProfilesEnabled(): boolean {
  const flag = process.env.NEXT_PUBLIC_ENABLE_DEMO_PROFILES;
  if (flag === "false") return false;
  if (flag === "true") return true;
  return process.env.NODE_ENV !== "production";
}
