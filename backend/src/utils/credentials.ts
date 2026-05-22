export function generateTeacherCode() {
  return `T-${Math.floor(1000 + Math.random() * 9000)}`
}

export function generateTeacherUsername(fullName: string) {
  const base = fullName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "")
    .slice(0, 18)

  return `${base || "teacher"}_${Math.floor(1000 + Math.random() * 9000)}`
}

export function generatePassword(length = 12) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$"
  let password = ""
  for (let i = 0; i < length; i += 1) {
    password += chars[Math.floor(Math.random() * chars.length)]
  }
  return password
}
