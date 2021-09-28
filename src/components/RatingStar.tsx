import { faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useMemo, useState } from 'react';

interface RatingProps {
  count: number;
  rating: number;
  onRating(rate: number): void;
  color?: {
    filled: string;
    unfilled: string;
  };
}

const RatingStar: React.FC<RatingProps> = ({ count, rating, onRating, color }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const getColor = (index) => {
    if (hoverRating >= index) {
      return color.filled;
    } else if (rating >= index) {
      return color.filled;
    }

    return color.unfilled;
  };
  const starRating = useMemo(() => {
    return Array(count) //
      .fill(0)
      .map((_, i) => i + 1)
      .map((idx) => (
        <FontAwesomeIcon //
          key={idx}
          className="cursor-pointer"
          icon={faStar}
          style={{ color: getColor(idx) }}
          onClick={() => onRating(idx)}
          onMouseEnter={() => setHoverRating(idx)}
          onMouseLeave={() => setHoverRating(0)}
          size="2x"
        />
      ));
  }, [count, rating, hoverRating]);

  return <div className="my-4">{starRating}</div>;
};

RatingStar.defaultProps = {
  count: 5,
  rating: 0,
  color: {
    filled: '#f5eb3b',
    unfilled: '#DCDCDC',
  },
};

export default RatingStar;
