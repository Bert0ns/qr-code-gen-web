export const formatJson = (text: string) => {
  try {
    if (!text.trim()) return text;
    const parsedData = JSON.parse(text);
    return JSON.stringify(parsedData, null, 2);
  } catch {
    return text;
  }
};
