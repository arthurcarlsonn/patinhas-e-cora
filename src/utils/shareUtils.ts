
/**
 * Utility function for sharing content using the Web Share API or fallback
 */
export const shareContent = (title: string, text: string, url: string) => {
  if (navigator.share) {
    navigator
      .share({
        title,
        text,
        url,
      })
      .then(() => console.log('Successful share'))
      .catch((error) => console.log('Error sharing:', error));
  } else {
    // Fallback for browsers that don't support the Share API
    try {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy: ', err);
      // Very basic fallback
      window.open(`https://wa.me/?text=${encodeURIComponent(`${title} - ${text} ${url}`)}`, '_blank');
    }
  }
};
