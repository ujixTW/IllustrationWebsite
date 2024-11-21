import { formatFullISODateString, formatISOTimeString } from "./dateHelper";

function getFormDataHelper(obj: any) {
  const formData = new FormData();

  Object.keys(obj).forEach((key) => {
    const dataCopy = obj[key as keyof typeof obj];

    if (Array.isArray(dataCopy)) {
      dataCopy.forEach((item) => {
        appendFormData(formData, item, key);
      });
    } else {
      appendFormData(formData, dataCopy, key);
    }
  });
  return formData;
}
function appendFormData(formData: FormData, data: any, key: string) {
  if (data instanceof Date) {
    data = formatFullISODateString(data) + " " + formatISOTimeString(data);
  }
  if (
    typeof data !== "object" ||
    data instanceof Blob ||
    data instanceof Date
  ) {
    formData.append(key, data);
  } else {
    formData.append(key, JSON.stringify(data));
  }
}
function getFormFileHelper(file?: File) {
  const formData = new FormData();
  if (file) formData.append("file", file);
  return formData;
}

export default getFormDataHelper;
export { getFormFileHelper };
