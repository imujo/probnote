import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";
import { FolderId } from "../../../../../../types.global";

type FolderContextProps = {
  parentFolderId: FolderId;
  setParentFolderId: Dispatch<SetStateAction<FolderId>>;
};

export const FolderContext = createContext<FolderContextProps | null>(null);

export function FolderContextProvider({ children }: { children: ReactNode }) {
  const [parentFolderId, setParentFolderId] = useState<FolderId>("base");

  return (
    <FolderContext.Provider value={{ parentFolderId, setParentFolderId }}>
      {children}
    </FolderContext.Provider>
  );
}

export function useFolderContext() {
  const context = useContext(FolderContext);

  if (!context) {
    throw new Error("useTodoContext must be within TodoProvider");
  }

  return context;
}
