import SyncLoader from "react-spinners/SyncLoader";

export const MyLoader = () => {
  return (
    <div className="fixed inset-0 h-screen w-screen flex items-center justify-center">
      <SyncLoader size={15} color="#533de0" />
    </div>
  );
};
