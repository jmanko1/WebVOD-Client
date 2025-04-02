import Hls from "hls.js";
import { useEffect, useState, useRef } from "react";

const VideoPlayer = ({ url }) => {
    const [hlsInstance, setHlsInstance] = useState(null);
    const [levels, setLevels] = useState([]);
    const [isAuto, setIsAuto] = useState(true);
    const [currentQuality, setCurrentQuality] = useState("");
    const [currentLevel, setCurrentLevel] = useState(-1);
    
    const [changedQuality, setChangedQuality] = useState(false);

    const videoRef = useRef(null);

    useEffect(() => {
        const video = videoRef.current;
    
        if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(url);
            hls.attachMedia(video);
            setHlsInstance(hls);
        
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                setLevels(hls.levels);
                video.play();
            });
        
            hls.on(Hls.Events.LEVEL_SWITCHED, (event, data) => {
                setCurrentQuality(`${hls.levels[data.level].height}p`);
                // if (isAuto) {
                //     // setCurrentQuality(`Auto (${hls.levels[data.level].height}p)`);
                //     setCurrentQuality(`${hls.levels[data.level].height}p`);
                // }
                // setCurrentLevel(data.level);
            });
        } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = url;
            video.addEventListener("loadedmetadata", () => video.play());
        } else {
            alert("Twoja przeglądarka nie obsługuje HLS!");
        }
    
        return () => {
            if (hlsInstance) hlsInstance.destroy();
        };
    }, [url]);

    const changeQuality = (index) => {
        if(changedQuality) return;

        if (!hlsInstance || index === currentLevel) return;
        
        if (index === -1) {
            //   setCurrentQuality("Auto");
            hlsInstance.currentLevel = -1;
            setCurrentLevel(-1);
            setIsAuto(true);
        } else {
            //   setCurrentQuality(`${levels[index].height}p`);
            // setCurrentQuality("Auto");
            hlsInstance.currentLevel = index;
            setCurrentLevel(index);
            setIsAuto(false);
        }

        setChangedQuality(true);
        setTimeout(() => setChangedQuality(false), 2000);
    };

    return (
        <>
            <div>
                <video ref={videoRef} controls></video>
            </div>
            <div className="mt-2">
                {levels.map((level, index) => (
                    <button
                        key={index}
                        onClick={() => changeQuality(index)}
                        className={`quality-button ${!isAuto && currentLevel === index ? "quality-button-active" : ""}`}
                    >
                        {level.height}p
                    </button>
                ))}
                <button
                    onClick={() => changeQuality(-1)}
                    className={`quality-button ${isAuto ? "quality-button-active" : ""}`}
                >
                    Auto{isAuto && currentQuality && ` (${currentQuality})`}
                </button>
            </div>
        </>
    )
}

export default VideoPlayer;