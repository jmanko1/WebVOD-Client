import * as signalR from '@microsoft/signalr';
import ReactPlayer from "react-player";
import { useEffect, useRef, useState } from 'react';

const WatchTogether = () => {
    const [hubConnection, setHubConnection] = useState(null);
    const [videoUrl, setVideoUrl] = useState("");
    const [isPlaying, setIsPlaying] = useState(false);
    const [participants, setParticipants] = useState(0);
    const [initialTime, setInitialTime] = useState(null);

    const playerRef = useRef(null);
    const lastSeekTime = useRef(0);

    useEffect(() => {
        const connection = new signalR.HubConnectionBuilder()
            .withUrl("http://localhost:8080/watch-together")
            .withAutomaticReconnect()
            .build();

        connection.start()

        connection.on("Initialize", (url, playing, time) => {
            setVideoUrl(url);
            setIsPlaying(playing);
            setInitialTime(time);
        })

        connection.on("VideoChanged", (url) => {
            setVideoUrl(url);
            setIsPlaying(false);
            if (playerRef.current) {
                playerRef.current.seekTo(0.0);
            }
        });

        connection.on("Participants", (participants) => {
            setParticipants(participants);
        })

        connection.on("SyncPlayback", (time, playing) => {
            if (playerRef.current) {
                playerRef.current.seekTo(time);
                setIsPlaying(playing);
            }
        });

        connection.on("Seek", (time) => {
            if (playerRef.current) {
                playerRef.current.seekTo(time);
            }
        });

        connection.on("PlayPause", (playing) => {
            setIsPlaying(playing);
        });

        setHubConnection(connection);
        return () => connection.stop();
    }, []);

    const handleSetVideo = () => {
        const newUrl = prompt("Podaj URL wideo:");
        if (newUrl && hubConnection) {
            hubConnection.invoke("SetVideo", newUrl);
        }
    };

    const handleSeek = (time) => {
        if (hubConnection && Math.abs(time - lastSeekTime.current) > 1) {
            lastSeekTime.current = time;
            hubConnection.invoke("Seek", time);
        }
    };

    const handlePlayPause = (playing) => {
        if (hubConnection) {
            hubConnection.invoke("PlayPause", playing);
        }
    };

    return (
        <div className="mt-3 ms-3">
            <button className="btn btn-primary mb-2" onClick={handleSetVideo}>Ustaw wideo</button>
            <ReactPlayer
                ref={playerRef}
                url={videoUrl}
                playing={isPlaying}
                controls
                onPlay={() => handlePlayPause(true)}
                onPause={() => handlePlayPause(false)}
                onSeek={handleSeek}
                onReady={() => {
                    if (initialTime && playerRef.current) {
                        playerRef.current.seekTo(initialTime, 'seconds');
                        setInitialTime(null);
                    }
                }}
            />
            <p className="mt-2">Liczba uczestników: {participants}</p>
        </div>
    );
}

export default WatchTogether;