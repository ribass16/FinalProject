const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;
const IMGBB_UPLOAD_URL = 'https://api.imgbb.com/1/upload';

/**
 * Faz upload de uma única imagem para o ImgBB
 * @param {File} file - Ficheiro de imagem
 * @returns {Promise<{success: boolean, url?: string, error?: string}>}
 */
export const uploadImageToImgBB = async (file) => {
  try {
    // Validar tipo de ficheiro
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return { success: false, error: 'Formato inválido. Use JPG, PNG ou WEBP.' };
    }

    // Validar tamanho (máx 32MB no ImgBB)
    const maxSize = 32 * 1024 * 1024; // 32MB
    if (file.size > maxSize) {
      return { success: false, error: 'Imagem muito grande. Máximo 32MB.' };
    }

    // Converter ficheiro para base64
    const base64 = await convertToBase64(file);
    
    // Preparar FormData
    const formData = new FormData();
    formData.append('key', IMGBB_API_KEY);
    formData.append('image', base64.split(',')[1]); // Remove "data:image/...;base64,"

    // Fazer upload
    const response = await fetch(`${IMGBB_UPLOAD_URL}?key=${IMGBB_API_KEY}`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (data.success) {
      return {
        success: true,
        url: data.data.url,
        displayUrl: data.data.display_url,
        deleteUrl: data.data.delete_url,
      };
    } else {
      return {
        success: false,
        error: data.error?.message || 'Erro ao fazer upload',
      };
    }
  } catch (error) {
    console.error('Erro no upload para ImgBB:', error);
    return {
      success: false,
      error: error.message || 'Erro ao fazer upload',
    };
  }
};

/**
 * Faz upload de múltiplas imagens para o ImgBB
 * @param {File[]} files - Array de ficheiros de imagem
 * @returns {Promise<{success: boolean, urls?: string[], errors?: string[]}>}
 */
export const uploadMultipleImages = async (files) => {
  try {
    console.log(`A fazer upload de ${files.length} imagens para ImgBB...`);
    
    const uploadPromises = files.map((file, index) => 
      uploadImageToImgBB(file).then(result => ({
        ...result,
        index,
        filename: file.name,
      }))
    );

    const results = await Promise.all(uploadPromises);

    const successResults = results.filter(r => r.success);
    const failedResults = results.filter(r => !r.success);

    if (failedResults.length > 0) {
      console.warn('Algumas imagens falharam:', failedResults);
    }

    if (successResults.length === 0) {
      return {
        success: false,
        errors: failedResults.map(r => `${r.filename}: ${r.error}`),
      };
    }

    return {
      success: true,
      urls: successResults.map(r => r.url),
      displayUrls: successResults.map(r => r.displayUrl),
      failed: failedResults.length,
      total: files.length,
    };
  } catch (error) {
    console.error('Erro ao fazer upload múltiplo:', error);
    return {
      success: false,
      errors: [error.message],
    };
  }
};

/**
 * Converte ficheiro para base64
 * @param {File} file 
 * @returns {Promise<string>}
 */
const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};
