import type { Message } from "./messages";

export async function send<T = unknown>(message: Message): Promise<T> {
  const response = (await chrome.runtime.sendMessage(message)) as {
    ok: boolean;
    data?: T;
    error?: string;
  };
  if (!response?.ok)
    throw new Error(response?.error ?? "Extension unavailable");
  return response.data as T;
}
