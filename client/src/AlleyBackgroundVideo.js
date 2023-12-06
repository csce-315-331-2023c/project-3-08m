import React from 'react';
import { Box} from '@mui/material';
import logoOverlay from './alley_overlay_logo.svg';

/**
 * Provides a YouTube video background for the Alley page
 * @returns {JSX.Element} Alley background video
 */
const AlleyBackgroundVideo = () => {

  return (
    <Box sx={{ 
      overflow: 'hidden', 
      position: 'relative', 
      width: '100%', 
      paddingTop: '56.25%', 
      marginTop: '-15%', 
      marginBottom: '-20%',
    }}>
      {/* YouTube iframe */}
      <iframe
        src="https://www.youtube.com/embed/2pPCHckv9P8?autoplay=1&controls=0&loop=1&playlist=2pPCHckv9P8&mute=1&modestbranding=1&playsinline=1&rel=0&showinfo=0"
        frameBorder="0"
        allow="autoplay; fullscreen"
        allowFullScreen
        title="YouTube Video"
        style={{
          position: 'absolute',
          top: '50%', 
          left: '50%', 
          width: '100vw', 
          height: 'calc(100vw * (9 / 16))', 
          transform: 'translate(-50%, -50%) scale(1.2)', 
          zIndex: -2,
        }}
      />

      {/* Image Overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%', 
          left: '50%', 
          width: '20vw', 
          height: 'calc(30vw * (9 / 16))', 
          // width: 300,
          // height: 300,
          transform: 'translate(-50%, -50%) scale(1.2)', 
          backgroundImage: `url(${logoOverlay})`, // Replace with your image path
          backgroundSize: 'cover',
          // backgroundPosition: 'center',
          // opacity: 0.5, // Adjust the opacity as needed
          zIndex: -1, // Overlay is above the video but below other content
        }}
      />

      {/* Any other content you want to display on top */}
    </Box>
  );
};

export default AlleyBackgroundVideo;
