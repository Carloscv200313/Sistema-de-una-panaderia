export const empleados = async () => {
  // Hacer la llamada a la API desde el cliente
  const response = await fetch('/api/empleados');
  const data = await response.json();
  return data;
};
