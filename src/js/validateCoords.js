export default function validateCoords(value) {
  if (typeof value !== 'string') {
    throw new Error('Координаты должны быть строкой');
  }

  let str = value.trim();
  if (!str) {
    throw new Error('Введите координаты');
  }

  const hasOpen = str.startsWith('[');
  const hasClose = str.endsWith(']');
  if (hasOpen && hasClose) {
    str = str.slice(1, -1).trim();
  } else if (hasOpen || hasClose) {
    throw new Error('Некорректные скобки');
  }

  // Типографский минус U+2212 → обычный дефис U+002D
  str = str.replace(/\u2212/g, '-');

  const parts = str.split(',');
  if (parts.length !== 2) {
    throw new Error('Ожидается два числа через запятую');
  }

  const latStr = parts[0].trim();
  const lonStr = parts[1].trim();
  if (!latStr || !lonStr) {
    throw new Error('Оба значения должны быть заполнены');
  }

  const latitude = Number(latStr);
  const longitude = Number(lonStr);

  if (!Number.isFinite(latitude)) {
    throw new Error('Широта должна быть числом');
  }
  if (!Number.isFinite(longitude)) {
    throw new Error('Долгота должна быть числом');
  }
  if (latitude < -90 || latitude > 90) {
    throw new Error('Широта должна быть в диапазоне от -90 до 90');
  }
  if (longitude < -180 || longitude > 180) {
    throw new Error('Долгота должна быть в диапазоне от -180 до 180');
  }

  return { latitude, longitude };
}
