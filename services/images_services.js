const {
  updateImage,
  removeImage,
  fetchDisplayImages,
} = require("../models/images_models");
const InvalidInputError = require("../errors/InvalidInputError");
const NotFoundError = require("../errors/NotFoundError");
const doesItemExist = require("../utils/doesItemExist");

const servicePatchImage = async (image_id, updatedInfo) => {
  const regex = /\d/;
  if (regex.test(image_id) === false) {
    throw new InvalidInputError("Invalid image id");
  }

  const isImageFound = await doesItemExist(image_id, "image_id", "images");
  if (isImageFound === false) {
    throw new NotFoundError("Image id not found");
  }
  const image = await updateImage(image_id, updatedInfo);
  return image;
};

const serviceDeleteImage = async (image_id) => {
  const regex = /\d/;
  if (regex.test(image_id) === false) {
    throw new InvalidInputError("Invalid image id");
  }

  const isImageFound = await doesItemExist(image_id, "image_id", "images");
  if (isImageFound === false) {
    throw new NotFoundError("Image id not found");
  }

  const rowCount = await removeImage(image_id);
  return rowCount;
};

const serviceGetDisplayImages = async () => {
  const displayImages = await fetchDisplayImages();
  return displayImages;
};

module.exports = {
  servicePatchImage,
  serviceDeleteImage,
  serviceGetDisplayImages,
};
