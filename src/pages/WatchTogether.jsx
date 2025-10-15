import * as signalR from '@microsoft/signalr';
import ReactPlayer from "react-player";
import React, { useEffect, useRef, useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { Link } from 'react-router-dom';
import OtpInput from "react-otp-input";

const WatchTogether = () => {
    const [connection, setConnection] = useState(null);
    const [roomId, setRoomId] = useState("");
    const [accessCode, setAccessCode] = useState("");

    const [room, setRoom] = useState(null);

    const [videoId, setVideoId] = useState("");
    const [videoUrl, setVideoUrl] = useState("");
    const [videoTitle, setVideoTitle] = useState("");
    const [isPlaying, setIsPlaying] = useState(false);
    const [participants, setParticipants] = useState([]);
    const [initialTime, setInitialTime] = useState(null);
    const [countdown, setCountdown] = useState(null);
    const videoRef = useRef(null);
    const lastSeekTime = useRef(0);

    const [newMessage, setNewMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const chatContainerRef = useRef(null);

    const [roomIdCopied, setRoomIdCopied] = useState(false);
    const [accessCodeCopied, setAccessCodeCopied] = useState(false);

    const [newUrl, setNewUrl] = useState("");

    const [error, setError] = useState(null);

    const { user } = useUser();

    const api = import.meta.env.VITE_API_URL;
    const countdownValue = 3;

    useEffect(() => {
        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl(`${api}/watch-together`, {
               accessTokenFactory: () => localStorage.getItem("jwt") || "",
            })
            .build();

        setConnection(newConnection);
        document.title = "Wspólne oglądanie - WebVOD";
    }, []);

    useEffect(() => {
        if(connection) {
            connection.start().then(() => {
                connection.on("Initialize", (initialParams) => {
                    setVideoUrl(initialParams.videoUrl);
                    setInitialTime(initialParams.initialTime);
                    setIsPlaying(initialParams.isPlaying);
                    setParticipants(initialParams.participants);
                    setVideoTitle(initialParams.videoTitle);
                    setVideoId(initialParams.videoId);

                    if(initialParams.countdown) {
                        let counter = Math.ceil(initialParams.countdown);
                        setCountdown(counter);

                        const fraction = (initialParams.countdown - Math.floor(initialParams.countdown)) * 1000;

                        setTimeout(() => {
                            counter--;
                            setCountdown(counter > 0 ? counter : null);
                            if(counter <= 0) {
                                setIsPlaying(true);
                                return;
                            }

                            const interval = setInterval(() => {
                                counter--;
                                setCountdown(counter > 0 ? counter : null);
                                if(counter <= 0) {
                                    clearInterval(interval);
                                    setIsPlaying(true);
                                }
                            }, 1000);
                        }, fraction);
                    }
                });

                connection.on("ParticipantsUpdate", (participantsUpdate) => {
                    setParticipants(participantsUpdate.participants);
                    setMessages((prev) => [...prev, participantsUpdate.message]);
                });

                connection.on("ReceiveMessage", (receivedMessage) => {
                    setMessages((prev) => [...prev, receivedMessage]);
                });

                connection.on("VideoChanged", (video) => {
                    setVideoUrl(video.videoUrl);
                    setVideoTitle(video.title);
                    setVideoId(video.id);
                    setIsPlaying(false);
                    if (videoRef.current) {
                        videoRef.current.seekTo(0.0, "seconds");
                    }

                    let counter = countdownValue;
                    setCountdown(counter);
                    const interval = setInterval(() => {
                        counter--;
                        if (counter > 0) {
                            setCountdown(counter);
                        } else {
                            clearInterval(interval);
                            setCountdown(null);
                            setIsPlaying(true);
                        }
                    }, 1000);
                });

                connection.on("Seek", (time) => {
                    if (videoRef.current) {
                        videoRef.current.seekTo(time, "seconds");
                    }
                });

                connection.on("PlayPause", (playing) => {
                    setIsPlaying(playing);
                });
            }).catch((err) => { ; });
        }

        return () => connection?.stop();
    }, [connection]);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo({
                top: chatContainerRef.current.scrollHeight,
                behavior: "smooth"
            });
        }
    }, [messages]);

    const createNewRoom = async () => {
        setError(null);
        setMessages([]);

        if(!connection) return;

        try {
            const newRoom = await connection.invoke("CreateRoom");
            setRoom(newRoom);
            setRoomId("");
            setAccessCode("");
            setNewMessage("");
            setRoomIdCopied(false);
            setAccessCodeCopied(false);
            setNewUrl("");
        } catch(err) {
            const rawMessage = err.message.split("HubException:")[1]?.trim() || err.message;
            setError(rawMessage);
        }
    }

    const joinRoom = async (e) => {
        e.preventDefault();
        
        setError(null);
        setMessages([]);

        if(!connection) return;

        const roomIdRegex = /^[A-Za-z0-9]{12}$/;
        if(!roomIdRegex.test(roomId)) return;

        const accessCodeRegex = /^[A-Za-z0-9]{6}$/;
        if(!accessCodeRegex.test(accessCode)) return;

        try {
            await connection.invoke("JoinRoom", roomId, accessCode);
            setRoom({ roomId, accessCode });
            setRoomId("");
            setAccessCode("");
            setNewMessage("");
            setRoomIdCopied(false);
            setAccessCodeCopied(false);
            setNewUrl("");
        } catch(err) {
            const rawMessage = err.message.split("HubException:")[1]?.trim() || err.message;
            setError(rawMessage);
        }
    }

    const sendMessage = async () => {
        setError(null);

        if (!newMessage.trim() || newMessage.length > 200) return;

        try {
            await connection.invoke("SendMessage", newMessage);
            setMessages((prev) => [...prev, { 
                sender: {
                    login: user.login,
                    imageUrl: user.imageUrl
                },
                message: newMessage,
                messageType: "USER"
            }]);
            setNewMessage("");
        } catch(err) {
            const rawMessage = err.message.split("HubException:")[1]?.trim() || err.message;
            setError(rawMessage);
        }
    }

    const handleSetVideo = async () => {
        setError(null);

        setIsPlaying(false);
        if (videoRef.current)
            videoRef.current.seekTo(0.0, "seconds");

        if (connection) {
            try {
                await connection.invoke("SetVideo", newUrl);
                setNewUrl("");
            } catch(err) {
                const rawMessage = err.message.split("HubException:")[1]?.trim() || err.message;
                setError(rawMessage);
            }
        }
    }

    const handleSeek = async (time) => {
        setError(null);

        if (connection && Math.abs(time - lastSeekTime.current) > 1) {
            lastSeekTime.current = time;
            
            try {
                await connection.invoke("Seek", time);
            } catch(err) {
                const rawMessage = err.message.split("HubException:")[1]?.trim() || err.message;
                setError(rawMessage);
            }
        }
    };

    const handlePlayPause = async (playing) => {
        setError(null);

        if (connection && videoRef.current) {
            setIsPlaying(playing);
            const time = videoRef.current.getCurrentTime();
            
            try {
                await connection.invoke("PlayPause", playing, time);
            } catch(err) {
                const rawMessage = err.message.split("HubException:")[1]?.trim() || err.message;
                setError(rawMessage);
            }
        }
    };

    const leaveRoom = async () => {
        setError(null);
        
        if(!connection) return;

        try {
            await connection.invoke("LeaveRoom");
            setRoom(null);
        } catch(err) {
            const rawMessage = err.message.split("HubException:")[1]?.trim() || err.message;
            setError(rawMessage);
        }
    }

    const handleRoomIdCopy = async () => {
        if (roomIdCopied) return;

        await navigator.clipboard.writeText(room.roomId);
        setRoomIdCopied(true);
        setTimeout(() => setRoomIdCopied(false), 3000);
    }

    const handleAccessCodeCopy = async () => {
        if (accessCodeCopied) return;

        await navigator.clipboard.writeText(room.accessCode);
        setAccessCodeCopied(true);
        setTimeout(() => setAccessCodeCopied(false), 3000);
    }

    if(room) {
        return (
            <div className="container mt-5">
                <div className="row">
                    <div className="col-12 col-lg-8 mb-4 mb-lg-0">
                        <div className="mb-2 input-group">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Podaj adres URL filmu na WebVOD..."
                                value={newUrl}
                                onChange={(e) => setNewUrl(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSetVideo()}
                                disabled={!!countdown}
                            />
                            <button className="btn btn-primary" disabled={!!countdown} onClick={handleSetVideo}>Załaduj</button>
                        </div>
                        <div className="ratio ratio-16x9 position-relative">
                            <ReactPlayer
                                width={""}
                                height={""}
                                style={{backgroundColor: "black"}}
                                ref={videoRef}
                                url={videoUrl ? api + videoUrl : ""}
                                playing={isPlaying}
                                controls={!countdown}
                                onPlay={() => handlePlayPause(true)}
                                onPause={() => handlePlayPause(false)}
                                onSeek={handleSeek}
                                onReady={() => {
                                    if (initialTime && videoRef.current) {
                                        videoRef.current.seekTo(initialTime, "seconds");
                                        setInitialTime(null);
                                    }
                                }}
                            />

                            {countdown && (
                                <div className="d-flex justify-content-center align-items-center"
                                    style={{
                                        fontSize: "6rem",
                                        fontWeight: "bold",
                                        color: "white",
                                        textShadow: "0 0 10px black"
                                    }}>
                                    {countdown}
                                </div>
                            )}
                        </div>
                        {videoTitle && videoId && (
                            <div className="mt-3">
                                <a
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="text-black" 
                                    style={{ textDecoration: "none" }} 
                                    href={`/videos/${videoId}`}
                                >
                                    <h1 className="mb-0">{videoTitle}</h1>
                                </a>
                            </div>
                        )}
                    </div>
                    <div className="col-12 col-lg-4">
                        <div className="mb-2">
                            Identyfikator pokoju:
                            <div>
                                <strong>{room.roomId}</strong>
                                <i
                                    className={`bi ${roomIdCopied ? "bi-clipboard-check" : "bi-clipboard"} ms-1`}
                                    role={`${roomIdCopied ? "" : "button"}`}
                                    title={roomIdCopied ? "Skopiowano" : "Kopiuj identyfikator pokoju"}
                                    onClick={handleRoomIdCopy}
                                />
                                <i
                                    className="fa-solid fa-arrow-right-from-bracket text-danger ms-2"
                                    title="Opuść pokój"
                                    onClick={leaveRoom}
                                    role="button"
                                />
                            </div>
                        </div>
                        <div className="mb-2">
                            Kod dostępu: <strong>{room.accessCode}</strong>
                            <i
                                className={`bi ${accessCodeCopied ? "bi-clipboard-check" : "bi-clipboard"} ms-1`}
                                    role={`${accessCodeCopied ? "" : "button"}`}
                                title={accessCodeCopied ? "Skopiowano" : "Kopiuj kod dostępu"}
                                onClick={handleAccessCodeCopy}
                            />
                        </div>
                        <div className="mb-3">
                            Uczestnicy ({participants.length}):
                            {participants.map((p, i) => {
                                const isLast = i === participants.length - 1;
                                const isFirst = i === 0;

                                return (
                                    <div key={p.login}>
                                        <a 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="fw-bold text-black" 
                                            style={{ textDecoration: "none" }} 
                                            href={`/channels/${p.login}`}
                                        >
                                            <img src={p.imageUrl ? api + p.imageUrl : "https://agrinavia.pl/wp-content/uploads/2022/03/zdjecie-profilowe-1.jpg"} alt="Awatar" width="25px" height="25px" className="object-fit-cover rounded-circle me-1" />
                                            {p.login}
                                        </a>
                                    </div>
                                );     
                            })}
                        </div>
                        {error && (
                            <div className="mb-3 alert alert-danger" role="alert">
                                {error}
                            </div>
                        )}
                        <div>
                            <div className="mb-2">Czat pokoju:</div>
                            <div ref={chatContainerRef} className="border p-3" style={{ height: "400px", overflowY: "auto", background: "#f8f9fa" }}>
                                {messages.map((msg, index) => (
                                    <div 
                                        key={index} 
                                        className={`d-flex mb-1 ${(msg.sender.login === user.login && msg.messageType === "USER") ? "justify-content-end" : "justify-content-start"}`}
                                    >
                                        {msg.messageType === "USER" ? (
                                            <div className={`p-2 rounded ${msg.sender.login === user.login ? "bg-primary text-white" : "bg-light"}`} style={{ maxWidth: "70%" }}>
                                                {msg.sender.login != user.login && 
                                                    <a 
                                                        target="_blank" 
                                                        rel="noopener noreferrer" 
                                                        className="fw-bold text-black me-1" 
                                                        style={{ textDecoration: "none" }} 
                                                        href={`/channels/${msg.sender.login}`}
                                                        title={msg.sender.login}
                                                    >
                                                        <img src={msg.sender.imageUrl ? api + msg.sender.imageUrl : "https://agrinavia.pl/wp-content/uploads/2022/03/zdjecie-profilowe-1.jpg"} alt="Awatar" width="25px" height="25px" className="object-fit-cover rounded-circle me-1" />
                                                    </a>
                                                }
                                                {msg.message}
                                            </div>
                                        ): (
                                            <div className="p-2 rounded bg-light" style={{ maxWidth: "70%" }}>
                                                {msg.message}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                                    placeholder="Podaj treść wiadomości..."
                                />
                                <button className="btn btn-primary" onClick={sendMessage}>
                                    <span className="material-symbols-outlined d-flex justify-content-center align-items-center">
                                        send
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto mt-5 text-center">
            <div className="row mb-2">
                <div className="col">
                    <h1 style={{fontSize: "28px"}}>Wspólne oglądanie filmów</h1>
                </div>
            </div>
            <div className="row mb-3">
                <div className="col">
                    {user ? 
                    "Oglądaj w grupie filmy dostępne na WebVOD." 
                    : "Zaloguj się, aby oglądać w grupie filmy dostępne na WebVOD."
                    }
                </div>
            </div>
            {user ? (
                <>
                    <div className="row mb-2">
                        <div className="col">
                            <button className="btn btn-primary" onClick={createNewRoom} type="button">
                                Utwórz nowy pokój
                            </button>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <button className="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#joiningForm">
                                Dołącz do pokoju
                            </button>
                        </div>
                    </div>
                    <div className="row justify-content-center mx-auto collapse mt-3" id="joiningForm" style={{maxWidth: "600px"}}>
                        <div className="col card card-body">
                            <form onSubmit={joinRoom}>
                                <div className="mb-3">
                                    <label htmlFor="roomId" className="form-label">Identyfikator pokoju</label>
                                    <input
                                        type="text"
                                        id="roomId"
                                        className="form-control mx-auto"
                                        style={{backgroundColor: "#f4f1f7", maxWidth: "325px"}}
                                        value={roomId}
                                        onChange={(e) => setRoomId(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="accessCode" className="form-label">Kod dostępu</label>
                                    <OtpInput
                                        value={accessCode}
                                        onChange={setAccessCode}
                                        id="accessCode"
                                        numInputs={6}
                                        renderSeparator={<span style={{ width: "5px" }}></span>}
                                        inputType="text"
                                        renderInput={(props) => <input {...props} />}
                                        containerStyle={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                        }}                        
                                        inputStyle={{
                                            border: "1px solid #dee2e6",
                                            backgroundColor: "#f4f1f7",
                                            borderRadius: "50%",
                                            width: "50px",
                                            height: "50px",
                                        }}
                                        focusStyle={{
                                            outline: "none"
                                        }}
                                    />
                                </div>
                                <div>
                                    <button type="submit" className="btn btn-primary">Dołącz</button>
                                </div>
                            </form>
                        </div>
                    </div>
                    {error && (
                        <div className="row mx-auto mt-3" style={{maxWidth: "600px"}}>
                            <div className="col">
                                <div className="alert alert-danger" role="alert">{error}</div>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <div className="row">
                    <div className="col">
                        <Link to="/login" className="btn btn-primary">Zaloguj się</Link>
                    </div>
                </div>
            )}
        </div>
    );
}

export default WatchTogether;