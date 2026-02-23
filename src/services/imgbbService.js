import { resizeAndConvertToBase64 } from '../utils/imageResize';


export const uploadImageToImgBB = async (file) => {
  try {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      return { success: false, error: 'Formato inválido. Use JPG, PNG, WEBP ou GIF.' };
    }

    // Limite de 15MB antes de redimensionar
    const maxSize = 15 * 1024 * 1024;
    if (file.size > maxSize) {
      return { success: false, error: 'Imagem muito grande. Máximo 15MB.' };
    }

    const base64 = await resizeAndConvertToBase64(file);
    return { success: true, url: base64, displayUrl: base64 };
  } catch (error) {
    console.error('Erro ao processar imagem:', error);
    return { success: false, error: error.message || 'Erro ao processar imagem' };
  }
};


export const uploadMultipleImages = async (files) => {
  try {
    const results = await Promise.all(
      Array.from(files).map((file) => uploadImageToImgBB(file))
    );

    const successResults = results.filter((r) => r.success);
    const failedResults  = results.filter((r) => !r.success);

    if (failedResults.length > 0) {
      console.warn('Algumas imagens falharam:', failedResults);
    }

    if (successResults.length === 0) {
      return {
        success: false,
        errors: failedResults.map((r) => r.error),
      };
    }

    return {
      success: true,
      urls: successResults.map((r) => r.url),
      displayUrls: successResults.map((r) => r.displayUrl),
      failed: failedResults.length,
      total: files.length,
    };
  } catch (error) {
    console.error('Erro ao processar imagens:', error);
    return { success: false, errors: [error.message] };
  }
};
