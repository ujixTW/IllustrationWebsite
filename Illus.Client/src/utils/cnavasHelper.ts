import { Area } from "react-easy-crop";

const readFile = async (_file: File) =>
  new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result), false);
    reader.readAsDataURL(_file);
  });

const createImage = (url: string) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (err) => reject(err));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });

async function getCroppedImg(
  imgSrc: string,
  pixelCrop: Area,
  archive?: { height: number; width: number },
  flip = { horizontal: false, vertical: false }
) {
  const image = (await createImage(imgSrc)) as HTMLImageElement;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const [width, height] = [image.width, image.height];

  canvas.width = width;
  canvas.height = height;

  ctx.translate(width / 2, height / 2);
  ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
  ctx.translate(-width / 2, -height / 2);

  ctx.drawImage(image, 0, 0);

  const croopedCanvas = document.createElement("canvas");
  const croopedCtx = croopedCanvas.getContext("2d");

  if (!croopedCtx) return null;

  croopedCanvas.width = archive ? archive.width : pixelCrop.width;
  croopedCanvas.height = archive ? archive.height : pixelCrop.height;

  croopedCtx.drawImage(
    canvas,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    croopedCanvas.width,
    croopedCanvas.height
  );

  return new Promise((resolve) => {
    croopedCanvas.toBlob((file) => {
      if (file) resolve(file);
    }, "image/png");
  });
}

async function getCroppedImgFromFile(
  img: File,
  pixelCrop: Area,
  archive?: { height: number; width: number },
  flip = { horizontal: false, vertical: false }
) {
  try {
    const originUrl = (await readFile(img)) as string;

    const cuttingImgBlob = (await getCroppedImg(
      originUrl,
      pixelCrop,
      archive,
      flip
    )) as Blob;

    const cuttingImg = await new File([cuttingImgBlob], "cuttingImg.png", {
      type: "image/png",
    });
    return cuttingImg;
  } catch (e) {
    console.log(e);
  }
}

async function getImgLength(img: File) {
  const imgUrl = (await readFile(img)) as string;
  const image = (await createImage(imgUrl)) as HTMLImageElement;

  return { width: image.width, height: image.height };
}

export { getCroppedImg, getCroppedImgFromFile, getImgLength };
