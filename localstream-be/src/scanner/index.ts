import fs from 'fs-extra';
import path from 'path';
import crypto from 'crypto';

export interface Video {
  id: string;
  name: string;
  path: string;
  folder: string;
  size: number;
}

export interface FolderTree {
  name: string;
  folders: FolderTree[];
  videos: Video[];
}

let videoList: Video[] = [];
let treeData: FolderTree[] = [];

const supportedExtensions = ['.mp4', '.mkv', '.avi', '.mov', '.webm', '.m4v'];

export const getVideoList = () => videoList;
export const getTreeData = () => treeData;
export const getVideoById = (id: string) => videoList.find(v => v.id === id);

export const scanFolder = async (rootPath: string) => {
  const newVideoList: Video[] = [];
  
  const scanRecursive = async (currentPath: string): Promise<FolderTree> => {
    const tree: FolderTree = {
      name: path.basename(currentPath),
      folders: [],
      videos: []
    };

    if (!(await fs.pathExists(currentPath))) return tree;

    const items = await fs.readdir(currentPath);

    for (const item of items) {
      const fullPath = path.join(currentPath, item);
      const stat = await fs.stat(fullPath);

      if (stat.isDirectory()) {
        const subTree = await scanRecursive(fullPath);
        if (subTree.folders.length > 0 || subTree.videos.length > 0) {
          tree.folders.push(subTree);
        }
      } else if (stat.isFile()) {
        const ext = path.extname(item).toLowerCase();
        if (supportedExtensions.includes(ext)) {
          const video: Video = {
            id: crypto.createHash('md5').update(fullPath).digest('hex'),
            name: item,
            path: fullPath,
            folder: path.basename(currentPath),
            size: stat.size
          };
          tree.videos.push(video);
          newVideoList.push(video);
        }
      }
    }

    return tree;
  };

  const newTree = await scanRecursive(rootPath);
  treeData = [newTree];
  videoList = newVideoList;
};
