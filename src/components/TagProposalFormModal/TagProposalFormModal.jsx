import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { WithContext as ReactTags } from "react-tag-input";

const TagProposalFormModal = ({videoId, setTagsProposed}) => {
    const [tags, setTags] = useState([]);
    const [comment, setComment] = useState("");
    const [tagError, setTagError] = useState(null);
    const [commentError, setCommentError] = useState(null);

    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const api = import.meta.env.VITE_API_URL;

    const KeyCodes = {
        comma: 188,
        enter: 13,
        space: 32
    };
    const delimiters = [KeyCodes.comma, KeyCodes.enter, KeyCodes.space];

    const handleTagAddition = (tag) => {
        setTagError(null);

        if (tags.length >= 5)
            return setTagError("Możesz dodać maksymalnie 5 tagów.");

        const tagRegex = /^[a-zA-Z0-9]*$/
        if(typeof tag.text !== "string" || !tagRegex.test(tag.text)) {
            return setTagError("Tag może zawierać tylko cyfry i litery.");
        }

        if (tag.text.length > 25)
            return setTagError("Tag może mieć maks. 25 znaków.");

        tag.text = tag.text.toLowerCase();

        setTags([...tags, tag]);
    };

    const handleTagDelete = (i) => {
        setTagError(null);
        setTags(tags.filter((_, index) => index !== i));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setSuccess(null);
        setError(null);
        setTagError(null);
        setCommentError(null);

        if (tags.length == 0) {
            setTagError("Podaj listę tagów.");
            return;
        }

        if (comment.length > 100) {
            setCommentError("Komentarz może mieć maksymalnie 100 znaków.");
            return;
        }

        const token = localStorage.getItem("jwt");
        if (!token) {
            navigate("/login");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${api}/video/${videoId}/tag-proposals`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ tags: tags.map(tag => tag.text), comment })
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

                if (errorData.errors?.Tags) {
                    setTagError(errorData.errors.Tags);
                }

                if (errorData.errors?.Comment) {
                    setCommentError(errorData.errors.Comment);
                } 

                return;
            }

            setSuccess("Propozycja tagów została wysłana.");
            setComment("");
            setTags([]);
            setTagsProposed(true);
        } catch {
            setError("Wystąpił niespodziewany błąd.");
        } finally {
            setLoading(false);
        }
    }

    return (
    <div className="modal fade" id="tagProposalFormModal" tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">

          <div className="modal-header">
            <h5 className="modal-title">Zaproponuj tagi</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
          </div>

          <div className="modal-body">
            <form onSubmit={handleSubmit}>
      <div className="mb-3" id="tags">
        <label className="form-label">Tagi ({tags.length})</label>
        <ReactTags
            tags={tags}
            delimiters={delimiters}
            handleDelete={handleTagDelete}
            handleAddition={handleTagAddition}
            inputFieldPosition="bottom"
            autocomplete
            placeholder="Dodaj tag"
            allowDragDrop={false}
            autoFocus={false}
        />
        <div className="form-text">Umieść przecinek, enter lub spację po każdym tagu.</div>
        {tagError && <div className="invalid-feedback d-inline">{tagError}</div>}
      </div>

      <div className="mb-3">
        <label className="form-label">Komentarz (opcjonalnie)</label>
        <textarea
          className={`form-control ${commentError ? "is-invalid" : ""}`}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          style={{resize: "none"}}
          maxLength={100}
            rows={4}
          placeholder="Np. proponuję dodać tagi związane z fabułą..."
        ></textarea>
        {commentError && <div className="invalid-feedback d-inline">{commentError}</div>}
      </div>

      <button type="submit" className="btn btn-primary">
        Wyślij
      </button>
    </form>
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
                {loading && (
                    <div className="text-center mt-2">
                        <div className="spinner-border spinner-border" role="status"></div>
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
    )
}

export default TagProposalFormModal;