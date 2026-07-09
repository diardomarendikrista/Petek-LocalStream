import { Request, Response } from 'express';
import fs from 'fs-extra';
import mime from 'mime-types';
import { getVideoById } from '../scanner';

export const streamVideo = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const video = getVideoById(id);

  if (!video) {
    return res.status(404).send('Video not found');
  }

  const path = video.path;
  const stat = await fs.stat(path);
  const fileSize = stat.size;
  const range = req.headers.range as string | undefined;

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunksize = (end - start) + 1;
    const file = fs.createReadStream(path, { start, end });
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': mime.lookup(path) || 'video/mp4',
    };
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': mime.lookup(path) || 'video/mp4',
    };
    res.writeHead(200, head);
    fs.createReadStream(path).pipe(res);
  }
};
