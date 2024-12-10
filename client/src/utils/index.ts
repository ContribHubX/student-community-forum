import { toast } from "react-toastify";

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

/**
 * Converts a plain JavaScript object into a FormData object.
 *
 * @param {Record<string, any>} obj
 * @returns {FormData}
 */
export const objectToFormData = (obj: Record<string, any>): FormData => {
  const formData = new FormData();
  
  // Iterate over each key-value pair in the object
  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    
    // If the value is an array, append each item as a separate field
    if (Array.isArray(value)) {
      value.forEach((item) => formData.append(key, item));
    } else {
      formData.append(key, value);
    }
  });
  
  return formData;
};



/**
 * Function to blend color with black
 * @credits ChatGPT
 * @param color
 * @param ratio
 * @returns
 */

export const blendWithBlack = (color: string, ratio: number): string => {
  let r: number, g: number, b: number;

  // Convert hex color to RGB
  if (color.startsWith("#")) {
    const hex = color.slice(1);
    r = parseInt(hex.slice(0, 2), 16);
    g = parseInt(hex.slice(2, 4), 16);
    b = parseInt(hex.slice(4, 6), 16);
  } else {
    // Assume it's in rgb format
    const rgb = color.match(/\d+/g);
    if (rgb) {
      r = parseInt(rgb[0]);
      g = parseInt(rgb[1]);
      b = parseInt(rgb[2]);
    } else {
      throw new Error("Invalid color format");
    }
  }

  // Blend the color with black
  r = Math.round(r * (1 - ratio));
  g = Math.round(g * (1 - ratio));
  b = Math.round(b * (1 - ratio));

  return `rgb(${r}, ${g}, ${b})`;
};

export const sanitizeContent = (html: string) => {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;

  const images = tempDiv.querySelectorAll("img");
  images.forEach((img) => img.remove());

  return tempDiv.innerHTML;
};

// Utility function to extract video ID
export const extractVideoId = (url: string) => {
  const regex =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};


// Utility function to get all the errors of zod
export const handleFormErrors = (errors: Record<string, any>) => {
  Object.values(errors).forEach((error) => {
    if (error?.message) {
      toast.error(error.message);
    }
  });
};

/** 
 * 
 */
export const extractFileName = (url: string): string => {
  const splitted = url.substring(url.lastIndexOf("/") + 1);
  return splitted;
}

/**
 * Shuffle alogorithm
 */
export function shuffle (elements: any[]): any[] {
  let counter = elements.length - 1;
  
  while (counter > 0) {
    const temp = elements[counter];
    elements[counter] = elements[0];
    elements[0] = temp;
    counter--;
  }

  return elements;
  
}