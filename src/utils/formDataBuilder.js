export function buildFormData(data, fileFieldName, file) {
  const formData = new FormData();
  
  for (const key in data) {
    formData.append(key, data[key]);
  }

  if (file) {
    formData.append(fileFieldName, file);
  }

  return formData;
}