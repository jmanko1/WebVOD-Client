import { useEffect, useRef, useState } from "react";
import { formatDatetime } from "../../utils/datetime";
import { useNavigate } from "react-router-dom";

const TagProposalsModal = ({videoId, onAcceptReject}) => {
    const [proposals, setProposals] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const pageSize = 10;

    const api = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();

    const listRef = useRef(null);

    useEffect(() => {
        const fetchTagsPropositions = async () => {
            if(!hasMore)
                return;

            setLoading(true);
    
            const token = localStorage.getItem("jwt");
            if (!token)
                return;

            try {
                const response = await fetch(`${api}/video/${videoId}/tag-proposals?page=${currentPage}&size=${pageSize}`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                if(response.ok) {
                    const data = await response.json();

                    if(data.length < pageSize)
                        setHasMore(false);
                    
                    data.forEach(proposal => {
                        proposal.author.imageUrl = proposal.author.imageUrl ? api + proposal.author.imageUrl : "https://agrinavia.pl/wp-content/uploads/2022/03/zdjecie-profilowe-1.jpg"
                    })
                    setProposals((prev) => [...prev, ...data]);
                }
            } catch {
                setError("Wystąpił niespodziewany błąd w trakcie pobierania propozycji tagów.");
            } finally {
                setLoading(false);
            }
        };

        fetchTagsPropositions();
    }, [videoId, currentPage, hasMore]);

    useEffect(() => {
        const container = listRef.current;
        if (!container) return;

        const handleScroll = () => {
            if (loading || !hasMore) return;

            if (container.scrollTop + container.clientHeight >= container.scrollHeight - 10)
                setCurrentPage(prev => prev + 1);
        };
        
        container.addEventListener('scroll', handleScroll);

        return () => container.removeEventListener('scroll', handleScroll);
    }, [videoId, loading, hasMore]);

    useEffect(() => {
        setHasMore(true);
        setCurrentPage(1);
        setProposals([]);
        setLoading(false);

        setError(null);
        setSuccess(null);
    }, [videoId]);

    const accept = async (id) => {
        const token = localStorage.getItem("jwt");
        if(!token) {
            navigate("/login");
            return;
        }

        setSuccess(null);
        setError(null);

        try {
            const response = await fetch(`${api}/video/tag-proposals/${id}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.status == 401) {
                navigate("/logout");
                return;
            }

            if (!response.ok) {
                const errorData = await response.json();
                if (errorData.message) {
                    setError(errorData.message);
                }

                return;
            }

            setSuccess("Propozycja tagów została zaakceptowana.");
            setProposals(proposals.filter(p => p.id !== id));
            onAcceptReject();
        } catch {
            setError("Wystąpił niespodziewany błąd.")
        }
    }

    const reject = async (id) => {
        const token = localStorage.getItem("jwt");
        if(!token) {
            navigate("/login");
            return;
        }

        setSuccess(null);
        setError(null);

        try {
            const response = await fetch(`${api}/video/tag-proposals/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.status == 401) {
                navigate("/logout");
                return;
            }

            if (!response.ok) {
                const errorData = await response.json();
                if (errorData.message) {
                    setError(errorData.message);
                }

                return;
            }

            setSuccess("Propozycja tagów została odrzucona.");
            setProposals(proposals.filter(p => p.id !== id));
            onAcceptReject();
        } catch {
            setError("Wystąpił niespodziewany błąd.")
        }
    }

    return (
        <div className="modal fade" id="tagProposalsModal" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Propozycje tagów</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div className="modal-body">
                        <ul ref={listRef} className="list-group" style={{ maxHeight: "400px", overflowY: "auto" }}>
                            {proposals.map((p) => (
                                <li className="list-group-item" key={p.id}>
                                    <div className="d-flex justify-content-between align-items-start">
                                        <div>
                                            <div className="d-flex align-items-center mb-2">
                                                <a 
                                                    href={`/channels/${p.author.login}`}
                                                    style={{ textDecoration: "none" }}
                                                    target="_blank" 
                                                    rel="noopener noreferrer" 
                                                    className="text-black"
                                                >
                                                    <img
                                                        src={p.author.imageUrl}
                                                        alt={p.author.login}
                                                        className="rounded-circle me-2"
                                                        width="36"
                                                        height="36"
                                                    />
                                                </a>
                                                <a 
                                                    href={`/channels/${p.author.login}`}
                                                    style={{ textDecoration: "none" }}
                                                    target="_blank" 
                                                    rel="noopener noreferrer" 
                                                    className="text-black fw-bold"
                                                >
                                                    {p.author.login}
                                                </a>
                                            </div>
                                            <small className="text-muted d-block">
                                                Zgłoszono: {formatDatetime(p.createdAt)}
                                            </small>
                                            <small className="text-muted d-block mb-2">
                                                Ważne do: {formatDatetime(p.validUntil)}
                                            </small>
                                            <div className="mb-2">
                                                {p.tags.map((tag) => (
                                                    <span className="badge bg-primary me-1" key={tag}>
                                                    {tag}
                                                    </span>
                                                ))}
                                            </div>
                                            {p.comment && (
                                                <p className="fst-italic mb-1">Komentarz: {p.comment}</p>
                                            )}
                                        </div>
                                        <div className="d-flex flex-column gap-1">
                                            <button
                                                className="btn btn-success btn-sm"
                                                onClick={() => accept(p.id)}
                                            >
                                                Akceptuj
                                            </button>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => reject(p.id)}
                                            >
                                                Odrzuć
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                            {loading && (
                                <div className="text-center mt-2">
                                    <div className="spinner-border spinner-border-sm" role="status"></div>
                                </div>
                            )}
                        </ul>
                    </div>
                    <div className="modal-footer d-flex justify-content-between align-items-center">
                        <div>
                            {success && !error && (
                                <div className="text-success">
                                    {success}
                                </div>
                            )}
                            {!success && error && (
                                <div className="text-danger">
                                    {error}
                                </div>                                
                            )}
                        </div>
                        <button className="btn btn-secondary" data-bs-dismiss="modal">
                            Zamknij
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TagProposalsModal;