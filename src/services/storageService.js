import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebaseClient";

const generateFileName = (file) => {
	const safeBaseName = (file.name || "imagem")
		.replace(/\.[^/.]+$/, "")
		.replace(/[^a-zA-Z0-9-_]/g, "-")
		.slice(0, 40);

	const extension = file.name?.split(".").pop() || "jpg";
	return `${safeBaseName}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension}`;
};

export const uploadImageToFirebaseStorage = async (file) => {
	try {
		const fileName = generateFileName(file);
		const storageRef = ref(storage, `cars/${fileName}`);

		await uploadBytes(storageRef, file, {
			contentType: file.type || "image/jpeg",
			cacheControl: "public,max-age=31536000",
		});

		const downloadUrl = await getDownloadURL(storageRef);

		return {
			success: true,
			url: downloadUrl,
		};
	} catch (error) {
		console.error("Erro no upload para Firebase Storage:", error);
		return {
			success: false,
			error: error.message || "Erro ao fazer upload para Firebase Storage",
		};
	}
};
