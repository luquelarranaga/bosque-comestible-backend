const { get } = require("../app");
const {
  servicePatchImage,
  serviceDeleteImage,
} = require("../services/images_services");

const patchImage = async (req, res, next) => {
  const { image_id } = req.params;
  const updatedInfo = req.body;

  try {
    const image = await servicePatchImage(image_id, updatedInfo);
    return res.status(200).send({ image: image });
  } catch (err) {
    next(err);
  }
};

const deleteImage = async (req, res, next) => {
  const { image_id } = req.params;

  try {
    const rowCount = await serviceDeleteImage(image_id);
    if (rowCount === 1) {
      return res.status(204).send();
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  patchImage,
  deleteImage,
};
