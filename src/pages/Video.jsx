import { useParams } from "react-router-dom"
import "../styles/Video.css";

const Video = () => {
    const { id } = useParams();

    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col">
                    <div>
                        <video controls>
                            <source src="https://static.videezy.com/system/resources/previews/000/008/452/original/Dark_Haired_Girl_Pensive_Looks_at_Camera.mp4" type="video/mp4" />
                        </video>
                    </div>
                    <div>
                        <h1>Dark Haired Girl Pensive Looks at Camera</h1>
                    </div>
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-1 p-0">
                                <img style={{width: "50px", height: "50px"}} className="rounded-5" src="https://yt3.ggpht.com/Pk-75p67kN439_PkvOvIywqwXw4X8-3iBYP0KahdMliVznX5BNkti8Q4yEz7NcENMtEErjVJ=s88-c-k-c0x00ffffff-no-rj" />
                            </div>
                            <div className="col">
                                <h3>TheCranberries</h3>
                            </div>
                            <div className="btn-group col offset-3" role="group" aria-label="Basic example">
                                <button type="button" className="btn btn-danger rounded-end-2">
                                    <i className="fa-regular fa-heart"></i>
                                    <span className="ms-1">25 521</span>
                                </button>
                                <button type="button" className="btn btn-primary rounded-start-2 ms-2">
                                    <i className="fa-solid fa-share"></i>
                                    <span className="ms-1">Skopiuj link</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div>
                        <h2>Podobne filmy</h2>
                    </div>
                    <div className="container p-0">
                        <div className="row mb-3">
                            <div className="col">
                                <img className="thumbnail" src="https://i.ytimg.com/vi/_oedcuHCQwU/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAzgbQf8zwIHwVWrZPqC2Q0V6OVRQ" />
                                <span>19:23</span>
                            </div>
                            <div className="col">
                                <div className="container">
                                    <div className="row">
                                        <div className="col title">Wiedźmin 3: Dziki Gon - Jaskinia Snów - Droga ku zagładzie NG+</div>
                                    </div>
                                    <div className="row">
                                        <div className="col author">Szablo Mario</div>
                                    </div>
                                    <div className="row">
                                        <div className="col details">72 062 wyświetleń, 24.06.2021</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <img className="thumbnail" src="https://i.ytimg.com/vi/_oedcuHCQwU/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAzgbQf8zwIHwVWrZPqC2Q0V6OVRQ" />
                                <span>19:23</span>
                            </div>
                            <div className="col">
                                <div className="container">
                                    <div className="row">
                                        <div className="col title">Wiedźmin 3: Dziki Gon - Jaskinia Snów - Droga ku zagładzie NG+</div>
                                    </div>
                                    <div className="row">
                                        <div className="col author">Szablo Mario</div>
                                    </div>
                                    <div className="row">
                                        <div className="col details">72 062 wyświetleń, 24.06.2021</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Video;