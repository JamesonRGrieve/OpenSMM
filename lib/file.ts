// lib/file-utils.ts
import path from 'path';
import { readChunk } from 'read-chunk';
import { fileTypeFromBuffer } from 'file-type';
import { stat, unlink } from 'fs/promises';
import sharp from 'sharp';
import ffmpeg from 'fluent-ffmpeg';
import { Logger } from './logger';

const logger = new Logger('filesystem');

const supportedImageMimes = ['image/png', 'image/jpeg', 'image/avif', 'image/gif', 'image/webp'];

const supportedVideoMimes = [
  'video/webm',
  'video/ogg',
  'video/avi',
  'video/quicktime',
  'video/mpeg',
  'video/mp4',
  'video/3gpp',
  'video/3gpp2',
  'video/h261',
  'video/h263',
  'video/h264',
  'video/x-flv',
  'video/x-matroska',
  'video/x-ms-wmv',
];

export function getUserDataDir(userId: string) {
  return path.join(process.cwd(), 'data', 'fileuploads', userId);
}

export async function processFile(dir: string, filename: string): Promise<boolean> {
  logger.log('debug', `Processing file ${filename}`);
  const filePath = path.join(dir, filename);
  const buffer = readChunk.readChunkSync(filePath, { length: 4100 });
  const type = await fileTypeFromBuffer(buffer);

  if (!type) {
    logger.log('warn', 'Could not determine file type');
    return false;
  }

  logger.log('debug', `File is of type ${type.mime}`);

  if (supportedImageMimes.includes(type.mime)) {
    await imageThumbs(dir, filename);
    return true;
  } else if (supportedVideoMimes.includes(type.mime)) {
    await videoThumbs(dir, filename);
    return true;
  } else {
    logger.log('warn', `Unsupported file type: ${type.mime}`);
    logger.log('warn', 'Removing unsupported file');

    try {
      await unlink(filePath);
      logger.log('info', `Successfully removed file ${filename}`);
    } catch (err) {
      logger.log('error', 'Error removing file');
    }

    return false;
  }
}

async function imageThumbs(dir: string, filename: string) {
  const inputPath = path.join(dir, filename);
  const outputPath = path.join(dir, 'thumbnails', `${filename}0.webp`);

  await sharp(inputPath)
    .webp()
    .resize({
      fit: 'contain',
      width: 200,
    })
    .toFile(outputPath);
}

async function videoThumbs(dir: string, filename: string) {
  return new Promise<void>((resolve, reject) => {
    const inputPath = path.join(dir, filename);
    const thumbnailsDir = path.join(dir, 'thumbnails');

    ffmpeg(inputPath)
      .on('end', async () => {
        logger.log('debug', 'Video thumbnails step 1/2 (ffmpeg - screenshots) complete');

        // Assuming ffmpeg creates a screenshot, convert it to webp
        const screenshotName = `${filename}0.png`;
        const inputScreenshotPath = path.join(thumbnailsDir, screenshotName);
        const outputScreenshotPath = path.join(thumbnailsDir, `${filename}0.webp`);

        await sharp(inputScreenshotPath).webp().toFile(outputScreenshotPath);

        logger.log('debug', 'Video thumbnails step 2/2 (sharp - conversion) complete');
        resolve();
      })
      .on('error', (err) => {
        logger.log('error', `Error creating thumbnails: ${err.message}`);
        reject(err);
      })
      .takeScreenshots({
        count: 1,
        size: '300x200',
        folder: thumbnailsDir,
      });
  });
}

export async function fileInfo(filePath: string) {
  logger.log('debug', `Getting file info for file ${path.basename(filePath)}`);

  const buffer = readChunk.readChunkSync(filePath, { length: 4100 });
  const type = await fileTypeFromBuffer(buffer);
  const stats = await stat(filePath);

  let description = '';
  if (type && supportedVideoMimes.includes(type.mime)) {
    description = 'video';
  } else if (type && supportedImageMimes.includes(type.mime)) {
    description = 'image';
  }

  return {
    name: path.basename(filePath),
    length: stats.size,
    ext: type?.ext,
    mime: type?.mime,
    description,
    path: filePath,
  };
}
