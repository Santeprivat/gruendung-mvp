export async function fetchHello() {
  const response = await fetch(
    "https://jsonplaceholder.typicode.com/todos/1"
  );

  if (!response.ok) {
    throw new Error("API error");
  }

  return response.json();
}

