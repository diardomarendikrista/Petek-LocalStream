import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Folder, Film, ChevronRight, ChevronDown } from "lucide-react";

function FolderNode({ folder }: { folder: any }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="pl-2 mt-2">
      <div
        className="flex items-center cursor-pointer text-blue-400 hover:text-blue-300 gap-2 py-1"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
        <Folder size={20} />
        <span className="font-bold text-lg">{folder.name}</span>
      </div>

      {isOpen && (
        <div className="pl-6 border-l border-gray-700 ml-3 mt-2 space-y-3">
          {folder.folders?.map((subFolder: any, idx: number) => (
            <FolderNode
              key={`folder-${idx}`}
              folder={subFolder}
            />
          ))}

          {folder.videos?.map((v: any) => (
            <div
              key={v.id}
              className="flex flex-col gap-2 p-3 bg-gray-900 rounded-lg border border-gray-800"
            >
              <div className="flex items-center gap-2 text-gray-200">
                <Film
                  size={18}
                  className="text-gray-400"
                />
                <span className="font-medium">{v.name}</span>
              </div>
              <video
                controls
                className="w-full max-w-2xl rounded bg-black"
              >
                <source
                  src={`/stream/${v.id}`}
                  type="video/mp4"
                />
                Your browser does not support HTML5 video.
              </video>
            </div>
          ))}

          {!folder.folders?.length && !folder.videos?.length && (
            <div className="text-gray-500 text-sm py-1">Empty folder</div>
          )}
        </div>
      )}
    </div>
  );
}

export default function WebUI() {
  const { data: tree } = useQuery({
    queryKey: ["tree"],
    queryFn: () => axios.get("/api/tree").then((res) => res.data),
  });

  return (
    <div className="bg-gray-800 shadow-lg border border-gray-700 mt-1">
      <h2 className="text-xl font-bold m-2 md:m-4">Files & Folders</h2>
      <div className="space-y-1 md:space-y-2">
        {tree && tree.length > 0 ? (
          <>
            {tree[0].folders?.map((subFolder: any, idx: number) => (
              <FolderNode
                key={`folder-${idx}`}
                folder={subFolder}
              />
            ))}

            {tree[0].videos?.map((v: any) => (
              <div
                key={v.id}
                className="flex flex-col gap-2 p-3 bg-gray-900 rounded-lg border border-gray-800"
              >
                <div className="flex items-center gap-2 text-gray-200">
                  <Film
                    size={18}
                    className="text-gray-400"
                  />
                  <span className="font-medium">{v.name}</span>
                </div>
                <video
                  controls
                  className="w-full max-w-2xl rounded bg-black"
                >
                  <source
                    src={`/stream/${v.id}`}
                    type="video/mp4"
                  />
                  Your browser does not support HTML5 video.
                </video>
              </div>
            ))}

            {!tree[0].folders?.length && !tree[0].videos?.length && (
              <div className="text-gray-400 py-2">
                The selected folder is empty.
              </div>
            )}
          </>
        ) : (
          <div className="text-gray-400">
            No videos found. Set a folder in Settings.
          </div>
        )}
      </div>
    </div>
  );
}
