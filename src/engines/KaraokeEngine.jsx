import React from 'react';
import ConversationActivity from './karaoke/ConversationActivity';
import './karaoke/KaraokeEngine.css';

export default function KaraokeEngine({ data, title }) {
    return (
        <ConversationActivity data={data} title={title} />
    );
}
