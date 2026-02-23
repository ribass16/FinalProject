export const resizeAndConvertToBase64 = (
  file,
  maxWidth = 900,
  maxHeight = 675,
  quality = 0.75
) => {
  return new Promise((resolve, reject) => {
    // Le o ficheiro como data URL
    const reader = new FileReader();

    reader.onerror = () => reject(new Error(`Erro ao ler o ficheiro: ${file.name}`));

    reader.onload = (readerEvent) => {
      // Carrega a imagem num elemento <img> para obter dimensões reais
      const img = new Image();

      img.onerror = () => reject(new Error(`Imagem inválida: ${file.name}`));

      img.onload = () => {
        let { width, height } = img;

        // Ajusta o tamanho
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        // Converte para JPEG
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        
        // Fundo branco para imagens com transparência (PNG → JPEG)
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        resolve(canvas.toDataURL('image/jpeg', quality));
      };

      img.src = readerEvent.target.result;
    };

    reader.readAsDataURL(file);
  });
};
