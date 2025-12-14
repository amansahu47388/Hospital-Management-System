export const validateEmail = (email) => {
  if (!email) return { ok: false, msg: "Email is required" };
  const re = /^\S+@\S+\.\S+$/;
  return { ok: re.test(email), msg: "Enter a valid email" };
};

export const validatePassword = (password) => {
  if (!password) return { ok: false, msg: "Password is required" };
  if (password.length < 8) return { ok: false, msg: "Password must be at least 8 characters" };
  if (!/[A-Z]/.test(password)) return { ok: false, msg: "Password must contain at least one uppercase letter" };
  if (!/[a-z]/.test(password)) return { ok: false, msg: "Password must contain at least one lowercase letter" };
  if (!/[0-9]/.test(password)) return { ok: false, msg: "Password must contain at least one number" };
  if (!/[^A-Za-z0-9]/.test(password)) return { ok: false, msg: "Password must contain at least one special character" };
  return { ok: true };
};