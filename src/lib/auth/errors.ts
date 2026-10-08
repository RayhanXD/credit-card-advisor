export function authErrorMessage(message: string) {
  const m = message.toLowerCase();
  if (m.includes("invalid login")) return "Check your email and password and try again.";
  if (m.includes("already registered") || m.includes("user already")) {
    return "An account with this email already exists. Sign in instead.";
  }
  if (m.includes("email not confirmed")) {
    return "This email still needs to be confirmed. Try signing in again in a moment.";
  }
  if (m.includes("password")) return message;
  return "Something went wrong. Please try again.";
}
