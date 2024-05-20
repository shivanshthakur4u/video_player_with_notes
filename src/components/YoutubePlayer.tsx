import React, { useEffect, useState } from 'react';
import YouTube from 'react-youtube';
import Divider from './common/divider';

const YoutubePlayer = ({ videoId, onReady }: { videoId: string, onReady: any }) => {
    const [videoDetails, setVideoDetails] = useState({ title: '', description: '' });
    const [showMore, setShowMore] = useState(false);

    const fetchVideoDetails = async (id: string) => {
        const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?id=${id}&key=${process.env.NEXT_PUBLIC_YOUTUBE_API}&part=snippet`);
        const data = await response.json();
        if (data.items.length > 0) {
            const snippet = data.items[0].snippet;
            setVideoDetails({
                title: snippet.title,
                description: snippet.description,
            });
        }
    };

    useEffect(() => {
        fetchVideoDetails(videoId);
    }, [videoId]);

    const opts = {
        height: '774',
        width: '100%',
        playerVars: {
            autoplay: 0,
            showinfo: 0,
            modestbranding: 0,
            rel: 0,
            cc_load_policy: 0,
        },
    };

    const toggleShowMore = () => {
        setShowMore(!showMore);
    };

    return (
        <div className='flex flex-col gap-6 w-full h-full' style={{ borderRadius: '8px', overflow: 'hidden' }}>
            <div className='rounded-lg w-full h-full overflow-hidden'>
                <YouTube videoId={videoId} opts={opts} onReady={onReady} />
            </div>
            <div className='flex flex-col gap-6 p-4'>
                <div className='flex flex-col gap-1'>
                    <h4 className='text-lg font-semibold text-[#101828]'>
                        {videoDetails.title}
                    </h4>
                    <p className='text-[#475467] text-sm font-normal'>
                        {showMore ? videoDetails.description : `${videoDetails.description.slice(0, 200)}... `}
                        {videoDetails.description.length > 200 && (
                            <button onClick={toggleShowMore} className='text-blue-500'>
                                {showMore ? ' Show less' : ' Show more'}
                            </button>
                        )}
                    </p>
                </div>
                {/* divider */}
                <Divider />
            </div>
        </div>
    );
};

export default YoutubePlayer;
