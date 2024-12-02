import { ScenePlayer } from "./player";


export const Scene = () => {
  
  const music = {
    id: "yao9ww00ul4",
    title: "Visuals - Your Name (4K)",
    thumbnail: "https://i.ytimg.com/vi/yao9ww00ul4/maxresdefault.jpg"
  }

  return (
    <div className="scene-wrapper">
      <ScenePlayer music={music} />
    </div>
  );
};