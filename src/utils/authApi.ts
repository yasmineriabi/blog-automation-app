export async function loginApi(email: string, password: string) {
  const res = await fetch('http://localhost:3000/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  return { ok: res.ok, data };
}

export async function signupApi(username: string, email: string, password: string, confirmPassword: string) {
  const res = await fetch('http://localhost:3000/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password, confirmPassword }),
  });
  const data = await res.json();
  return { ok: res.ok, data };
} 