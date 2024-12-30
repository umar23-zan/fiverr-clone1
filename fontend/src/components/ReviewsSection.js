import React from 'react';

const ReviewsSection = () => {
  const reviews = [
    {
      id: 1,
      author: "Michael Chen",
      rating: 5,
      date: "3 days ago",
      text: "Outstanding experience working with this freelancer! The communication was excellent, and they went above and beyond to ensure the project met all requirements. Would definitely hire again.",
      projectType: "Website Design",
      projectBudget: "$500"
    },
    {
      id: 2,
      author: "Emma Wilson",
      rating: 5,
      date: "1 week ago",
      text: "Incredible attention to detail and very professional approach. Delivered the project ahead of schedule and incorporated all feedback seamlessly. A true expert in their field!",
      projectType: "UI/UX Design",
      projectBudget: "$750"
    },
    {
      id: 3,
      author: "David Rodriguez",
      rating: 4,
      date: "2 weeks ago",
      text: "Great work on our mobile app design project. Very responsive and collaborative throughout the process. Would recommend for any design work.",
      projectType: "Mobile App Design",
      projectBudget: "$1000"
    },
    {
      id: 4,
      author: "Sarah Johnson",
      rating: 5,
      date: "3 weeks ago",
      text: "Exceptional work quality and very prompt with deliverables. They have a great eye for design and really understood our brand vision. Looking forward to working together again!",
      projectType: "Brand Identity",
      projectBudget: "$1200"
    }
  ];

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <span key={index} className={`star ${index < rating ? 'filled' : ''}`}>
        {index < rating ? "★" : "☆"}
      </span>
    ));
  };

  const reviewsStyle = {
    reviews: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px'
    },
    heading: {
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '24px'
    },
    reviewsGrid: {
      display: 'grid',
      gap: '24px',
      marginBottom: '32px'
    },
    reviewCard: {
      backgroundColor: '#fff',
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      padding: '24px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
    },
    reviewHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '16px'
    },
    authorInfo: {
      marginBottom: '8px'
    },
    authorName: {
      fontSize: '18px',
      fontWeight: '600',
      marginBottom: '4px'
    },
    rating: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '8px'
    },
    stars: {
      display: 'flex',
      gap: '2px',
      fontSize: '18px'
    },
    star: {
      color: '#FFB800'
    },
    date: {
      color: '#666',
      fontSize: '14px'
    },
    reviewText: {
      color: '#333',
      marginBottom: '16px',
      lineHeight: '1.6'
    },
    projectInfo: {
      display: 'flex',
      gap: '16px',
      color: '#666',
      fontSize: '14px'
    },
    projectLabel: {
      fontWeight: '500'
    },
    loadMoreButton: {
      display: 'block',
      margin: '0 auto',
      padding: '12px 24px',
      backgroundColor: '#fff',
      border: '1px solid #ddd',
      borderRadius: '6px',
      color: '#333',
      fontSize: '16px',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    }
  };

  return (
    <div style={reviewsStyle.reviews}>
      <h2 style={reviewsStyle.heading}>Client Reviews</h2>
      <div style={reviewsStyle.reviewsGrid}>
        {reviews.map((review) => (
          <div key={review.id} style={reviewsStyle.reviewCard}>
            <div style={reviewsStyle.reviewHeader}>
              <div style={reviewsStyle.authorInfo}>
                <h3 style={reviewsStyle.authorName}>{review.author}</h3>
                <div style={reviewsStyle.rating}>
                  <div style={reviewsStyle.stars}>
                    {renderStars(review.rating)}
                  </div>
                  <span style={reviewsStyle.ratingNumber}>({review.rating}.0)</span>
                </div>
              </div>
              <span style={reviewsStyle.date}>{review.date}</span>
            </div>
            
            <p style={reviewsStyle.reviewText}>{review.text}</p>
            
            <div style={reviewsStyle.projectInfo}>
              <div>
                <span style={reviewsStyle.projectLabel}>Project: </span>
                <span>{review.projectType}</span>
              </div>
              <div>
                <span style={reviewsStyle.projectLabel}>Budget: </span>
                <span>{review.projectBudget}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button 
        style={reviewsStyle.loadMoreButton}
        onMouseOver={e => {
          e.target.style.backgroundColor = '#f5f5f5';
        }}
        onMouseOut={e => {
          e.target.style.backgroundColor = '#fff';
        }}
      >
        Load More Reviews
      </button>
    </div>
  );
};

export default ReviewsSection;