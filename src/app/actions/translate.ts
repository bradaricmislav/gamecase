export async function translateToCroatian(text: string): Promise<string> {
  if (!text) return "";

  try {
    const res = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
        text,
      )}&langpair=en|hr`,
    );
    const data = await res.json();
    return data.responseData?.translatedText || text;
  } catch (error) {
    console.error("Error while trasnlating:", error);
    return text;
  }
}
