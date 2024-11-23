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

export const truncateText = (text: string, maxLength: number) => {
  return text.length > maxLength ? `${text.slice(0, maxLength)}..` : text;
};

/**
 * Converts a FormData object into a plain JavaScript object.
 *
 * @param {FormData} formData
 * @returns {Record<string, any>}
 */
export const formDataToObject = (formData: FormData): Record<string, any> => {
  const obj: Record<string, any> = {};
  formData.forEach((value, key) => {
    if (obj[key]) {
      if (Array.isArray(obj[key])) {
        obj[key].push(value);
      } else {
        obj[key] = [obj[key], value];
      }
    } else {
      obj[key] = value;
    }
  });
  return obj;
};
