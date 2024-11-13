function getFormDataHelper(obj: any) {
  const formData = new FormData();

  Object.keys(obj).forEach((key) => {
    const dataCopy = obj[key as keyof typeof obj];

    if (typeof dataCopy !== "object") {
      formData.append(key, dataCopy);
    } else formData.append(key, JSON.stringify(dataCopy));
  });
  return formData;
}
function getFormFileHelper(file?: File) {
  const formData = new FormData();
  if (file) formData.append("file", file);
  return formData;
}

export default getFormDataHelper;
export { getFormFileHelper };
