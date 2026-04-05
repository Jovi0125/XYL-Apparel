import React, { useRef, useEffect, useState } from 'react';

export default function HeroMedia({ src }) {
    const videoRef = useRef(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(false); 
        if (videoRef.current) {
            videoRef.current.load();
        }
    }, [src]);

    return (
        <div className="absolute inset-0 w-full h-full bg-[#050505] flex justify-center items-center overflow-hidden">
            <video
                ref={videoRef}
                onCanPlay={() => setIsLoaded(true)}
                className={`absolute min-w-full min-h-full object-cover transition-opacity duration-[1500ms] ease-in-out 
                    ${isLoaded ? 'opacity-50' : 'opacity-0'}`}
                autoPlay
                muted
                loop
                playsInline
                key={src}
            >
                <source src={src} type="video/mp4" />
            </video>
        </div>
    );
}
