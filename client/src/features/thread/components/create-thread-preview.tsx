import { useGetCommunityById } from "@/features/community/api/get-community";
import SyncLoader from "react-spinners/SyncLoader";

interface CreateThreadPreviewProps {
  communityId: string;
  previewContent: string;
  tags: string[];
}

export const CreateThreadPreview = ({
  communityId,
  tags,
  previewContent,
}: CreateThreadPreviewProps) => {
  const { data: selectedCommunity } = useGetCommunityById({
    id: communityId || "",
  });

  if (!selectedCommunity && communityId) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center ">
        <SyncLoader size={10} color="#533de0" />
      </div>
    );
  }

  return (
    <div className="p-6 text-primary-foreground bg-primary shadow-md rounded-lg h-fit">
      <h2 className="text-lg font-semibold mb-4">Post Preview</h2>
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold">Community:</span>{" "}
          {selectedCommunity?.name || "None selected"}
        </p>

        <h3 className="text-xl font-bold">
          {selectedCommunity?.name || "No Title Yet"}
        </h3>

        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-accent text-white rounded-full text-sm"
            >
              {tag}
            </span>
          ))}
        </div>

        <div
          className="mt-4 border rounded-md p-4 bg-primary  dark:border-muted-foreground"
          dangerouslySetInnerHTML={{
            __html: previewContent || "<p>No content added yet</p>",
          }}
        />
      </div>
    </div>
  );
};
