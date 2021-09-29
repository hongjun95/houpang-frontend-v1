import { faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useMemo } from 'react';

interface RatingProps {
  count: number;
  rating: number;
  color?: {
    filled: string;
    unfilled: string;
  };
  className?: string;
}

const StaticRatingStar: React.FC<RatingProps> = ({ count, rating, color, className }) => {
  const getColor = (index) => {
    if (rating >= index) {
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
          className={className}
          icon={faStar}
          style={{ color: getColor(idx) }}
        />
      ));
  }, [count, rating]);

  return <>{starRating}</>;
};

StaticRatingStar.defaultProps = {
  count: 5,
  rating: 0,
  color: {
    filled: '#f5eb3b',
    unfilled: '#DCDCDC',
  },
};

export default StaticRatingStar;
