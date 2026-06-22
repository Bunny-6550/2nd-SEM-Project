const API_URL = "http://127.0.0.1:8000";

export async function sendMessage(message) {
  const response = await fetch(
    `${API_URL}/chat`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message
      })
    }
  );

  return await response.json();
}

export async function uploadImage(file) {
  const formData = new FormData();

  formData.append("file", file);

  const response = await fetch(
    `${API_URL}/upload`,
    {
      method: "POST",
      body: formData
    }
  );

  return await response.json();
}

export async function newChat() {
  const response = await fetch(
    `${API_URL}/new-chat`,
    {
      method: "POST"
    }
  );

  return await response.json();
}