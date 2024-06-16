const StarRating = ({ rating, setRating }) => (
    <div>
        {[1, 2, 3, 4, 5].map((star) => (
            <span
                key={star}
                className={`star ${star <= rating ? 'selected' : ''}`}
                onClick={() => setRating(star)}
                style={{ cursor: 'pointer', color: star <= rating ? 'gold' : 'grey' }}
            >
                &#9733;
            </span>
        ))}
    </div>
);
export default StarRating;