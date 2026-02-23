export const FALLBACK_CAR_IMAGE = "/amaralcar.png";

export const getPrimaryCarImage = (car) => {
  const images = Array.isArray(car?.images) ? car.images.filter(Boolean) : [];
  return car?.image || images[0] || FALLBACK_CAR_IMAGE;
};

export const getCarGalleryImages = (car) => {
  const images = Array.isArray(car?.images) ? car.images.filter(Boolean) : [];
  const primary = car?.image;

  if (primary && !images.includes(primary)) {
    return [primary, ...images];
  }

  if (images.length > 0) {
    return images;
  }

  return [FALLBACK_CAR_IMAGE];
};

export const handleCarImageError = (event) => {
  const target = event?.currentTarget;
  if (!target) return;

  if (target.dataset.fallbackApplied === "true") {
    return;
  }

  target.dataset.fallbackApplied = "true";
  target.src = FALLBACK_CAR_IMAGE;
};
