export async function http(...args: Parameters<typeof fetch>) {
  const response = await fetch(...args);
  if (!response.ok) {
    const error: any = new Error(`${response.status}: ${response.statusText}`);
    const clone = response.clone();
    const body = await clone.json().catch(() => null);
    const message = body?.message ?? response.statusText;
    error.status = response.status;
    error.text = message;
    throw error;
  }

  return response;
}
