import { Request, Response } from 'express';
import { scanFolder, getVideoList, getTreeData } from '../scanner';
import { getSettings } from '../config/settings';

export const getVideos = async (req: Request, res: Response) => {
  const settings = getSettings();
  if (!settings.folder) {
    return res.json([]);
  }
  const videos = getVideoList();
  if (videos.length === 0) {
    await scanFolder(settings.folder);
  }
  res.json(getVideoList());
};

export const getTree = async (req: Request, res: Response) => {
  const settings = getSettings();
  if (!settings.folder) {
    return res.json([]);
  }
  const tree = getTreeData();
  if (tree.length === 0) {
    await scanFolder(settings.folder);
  }
  res.json(getTreeData());
};
