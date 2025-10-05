import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";

const MobileVideoHandler = ({ children }) => {
  const [userInteracted, setUserInteracted] = useState(false);
  const videoRefs = useRef([]);

  useEffect(() => {
    const handleUserInteraction = () => {
      setUserInteracted(true);
      // Try to play all videos that might have been blocked
      videoRefs.current.forEach(video => {
        if (video && video.paused) {
          video.play().catch(() => {
            // Autoplay failed, but that's expected on some mobile browsers
          });
        }
      });
      // Remove listeners after first interaction
      document.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('click', handleUserInteraction);
    };

    // Add interaction listeners for mobile
    document.addEventListener('touchstart', handleUserInteraction, { once: true });
    document.addEventListener('click', handleUserInteraction, { once: true });

    return () => {
      document.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('click', handleUserInteraction);
    };
  }, []);

  // Register video refs
  const registerVideo = (video) => {
    if (video && !videoRefs.current.includes(video)) {
      videoRefs.current.push(video);
    }
  };

  return (
    <div data-mobile-video-handler="true">
      {children}
      {/* Invisible overlay for mobile devices to capture first touch */}
      {!userInteracted && (
        <div
          className="fixed inset-0 z-0 pointer-events-none"
          style={{ backgroundColor: 'transparent' }}
        />
      )}
    </div>
  );
};

MobileVideoHandler.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MobileVideoHandler;