import React from 'react';

// Map the numeric IDs from the JSON to the SVG filenames
const ICON_MAP = {
    "image": "u1_image.svg",
    "ar": "u1_AR.svg",
    "3d": "u1_3D.svg",
    "audio": "u1_audio.svg",
    "drag": "u1_drag.svg",
    "karaoke": "u1_karaoke.svg",
    "gems": "u1_gems.svg",
    "reading": "u1_reading.svg",
    "dictionary": "u1_dictionary.svg",
    "form": "u1_form.svg",
    "write": "u1_write.svg",
    "check": "u1_check.svg",
    "choice": "u1_choice.svg",

    // Legacy maps for testing
    "1": "u1_audio.svg",
    "2": "u1_karaoke.svg",
    "3": "u1_gems.svg",
    "4": "u1_video.svg",
    "5": "u1_drag.svg",
    "6": "u1_form.svg",
    "7": "u1_check.svg",
    "8": "u1_3D.svg",
    "9": "u1_audio_practice.svg",
    "10": "u1_write.svg",
    "11": "u1_check.svg",
    "12": "u1_transcript.svg",
    "13": "u1_reading.svg",
    "14": "u1_dictionary.svg"
};

export default function Icon({ name, size = 24, className = '' }) {
    // Determine the filename from the mapping
    const filename = ICON_MAP[name];

    if (!filename) {
        // Fallback if no matching icon or still loading
        return (
            <span
                className={`icon icon-fallback ${className}`}
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: size,
                    height: size,
                    backgroundColor: '#e2e8f0',
                    borderRadius: '50%',
                    fontSize: size * 0.4,
                    fontWeight: 'bold',
                    color: '#475569'
                }}
                title={`Icon: ${name}`}
            >
                {String(name).substring(0, 2).toUpperCase()}
            </span>
        );
    }

    // Ensure the image URL resolves correctly via Vite's asset handling by importing them all
    // statically, or relying on them being in public/ (but user put them in src/).
    // For dynamic paths in src/assets, we use new URL + import.meta.url
    const iconUrl = new URL(`../assets/icons/unit1/${filename}`, import.meta.url).href;

    return (
        <img
            src={iconUrl}
            alt={`Activity Icon ${name}`}
            width={size}
            height={size}
            className={`icon ${className}`}
            style={{ display: 'inline-block', objectFit: 'contain' }}
        />
    );
}
