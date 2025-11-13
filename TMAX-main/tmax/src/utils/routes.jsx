
import axios from "axios";

export async function getOptimizedRoute(start, end) {
  const apiKey = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6ImQ5MTk5N2E3YzhmYTQ5NTg4MGQwZDVlNjY5YjkyMjhhIiwiaCI6Im11cm11cjY0In0=";
  const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${start.lng},${start.lat}&end=${end.lng},${end.lat}`;

  try {
    const res = await axios.get(url);
    return res.data;
  } catch (err) {
    console.error("Erro ao gerar rota:", err);
  }
}
