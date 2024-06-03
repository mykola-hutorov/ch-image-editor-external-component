import { EntityLoadConfiguration } from "@sitecore/sc-contenthub-webclient-sdk/dist/contracts/querying/entity-load-configuration";
import { UploadRequest } from "@sitecore/sc-contenthub-webclient-sdk/dist/models/upload/upload-request";
import { ArrayBufferUploadSource } from "@sitecore/sc-contenthub-webclient-sdk/dist/models/upload/array-buffer-upload-source";
import { decode } from "base64-arraybuffer";

const UnderReviewLifeCycleStatus = 543;

const updateEntityPropertiesAsync = async (
  notifier,
  client,
  id,
  assetTitle
) => {
  try {
    const loadConfiguration = EntityLoadConfiguration.Minimal.builder()
      .withProperty("Title")
      .withRelation("FinalLifeCycleStatusToAsset")
      .build();
    const entity = await client.entities.getAsync(id, loadConfiguration);
    
    entity.setPropertyValue("Title", assetTitle);
    const finalLifeCycleStatusToAsset = entity.getRelation(
      "FinalLifeCycleStatusToAsset"
    );
    if (!finalLifeCycleStatusToAsset) {
      notifier.notifyError("Can't set FinalLifeCycleStatusToAsset relation!");
      return;
    } else {
      finalLifeCycleStatusToAsset.setIds([UnderReviewLifeCycleStatus]);
    }

    const entityId = await client.entities.saveAsync(entity);
    notifier.notifySuccess(`Asset properties updated; id: ${entityId}`);
  } catch (err) {
    notifier.notifyError(`Properties or relations update error!`);
    console.error(err);
  }
};

export const loadImage = async (notifier, instance, imageUrl, fileName) => {
  try {
    await instance.loadImageFromURL(imageUrl, fileName);
    instance.ui.activeMenuEvent();
    notifier.notifySuccess("Image is successfully loaded.");
  } catch (err) {
    console.error(err);
  }
};

export const createAsset = async (
  notifier,
  client,
  imageObject,
  assetTitle
) => {
  if (!imageObject) {
    return;
  }

  try {
    const pureBase64 = imageObject.imageBase64?.split(",")[1];
    const uploadSource = new ArrayBufferUploadSource(
      decode(pureBase64),
      imageObject.fullName
    );
    const request = new UploadRequest(
      uploadSource,
      "AssetUploadConfiguration",
      "NewAsset"
    );

    const result = await client.uploads.uploadAsync(request);
    const assetId = result?.content?.asset_id;
    notifier.notifySuccess(
      `Image successfully saved as asset with id: ${assetId}.`
    );

    updateEntityPropertiesAsync(notifier, client, assetId, assetTitle);
  } catch (err) {
    notifier.notifyError("Image upload error!");
    console.error(err);
  }
};
