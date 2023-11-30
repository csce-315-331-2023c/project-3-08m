import React from 'react';
import { Box} from '@mui/material';

const AlleyBackgroundVideo = () => {

  return (
    <Box sx={{ 
      overflow: 'hidden', 
      position: 'relative', 
      width: '100%', 
      // Set a padding-top for aspect ratio (e.g., 56.25% for 16:9 aspect ratio)
      paddingTop: '56.25%', 
      // Add a negative margin to push the video up and cut off the top
      marginTop: '-15%', 
      // Add a negative margin to push the video down and cut off the bottom
      marginBottom: '-20%',
      "&:after": { // Create an overlaying pseudo-element
        content: '""',
        display: 'block',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        // Adjust the zIndex to be below the content but above the video
        zIndex: -1,
      }
    }}>
      <iframe
        src="https://www.youtube.com/embed/2pPCHckv9P8?autoplay=1&controls=0&loop=1&playlist=2pPCHckv9P8&mute=1&modestbranding=1&playsinline=1&rel=0&showinfo=0"
        frameBorder="0"
        allow="autoplay; fullscreen"
        allowFullScreen
        title="YouTube Video"
        style={{
          position: 'absolute',
          top: '50%', // Center vertically
          left: '50%', // Center horizontally
          width: '100vw', // Cover the full viewport width
          height: 'calc(100vw * (9 / 16))', // Maintain a 16:9 aspect ratio
          transform: 'translate(-50%, -50%) scale(1.2)', // Adjust scale as needed
          zIndex: -2, // Ensure the video is behind the overlay
        }}
      />
    </Box>
  );
};

export default AlleyBackgroundVideo;
