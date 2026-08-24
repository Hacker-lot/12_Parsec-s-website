const exposedVariables = Object.entries(process.env).filter(([name]) => name.startsWith('VITE_'))

const forbiddenName = /(secret|private|password|passwd|token|service.?role|api.?key)/i
const forbiddenValue = /(?:sb_secret_|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|sk-[A-Za-z0-9_-]{20,})/

const unsafe = exposedVariables.filter(
  ([name, value]) => forbiddenName.test(name) || forbiddenValue.test(value || ''),
)

if (unsafe.length > 0) {
  const names = unsafe.map(([name]) => name).join(', ')
  console.error(`Refusing to build: sensitive values must never use the VITE_ prefix (${names}).`)
  process.exit(1)
}

console.log('Security check passed: no sensitive VITE_ variables detected.')
