/**
 * @credits ChatGpt
 * Converts base64 to actual file
 *
 * @param base64
 * @param filename
 * @returns
 */
export function base64ToFile(base64: string, filename: string): File {
  const [metadata, data] = base64.split(",");
  const mime = metadata.match(/:(.*?);/)?.[1];
  const binaryData = atob(data);
  const byteArray = new Uint8Array(binaryData.length);

  for (let i = 0; i < binaryData.length; i++) {
    byteArray[i] = binaryData.charCodeAt(i);
  }

  return new File([byteArray], filename, { type: mime || "image/png" });
}