import React from 'react';
import Image from 'next/image';
import Animation from '../public/AnimationFrontPage.gif';

export const GameStart = () => {
    return (
        <div>
            <Image src={Animation} alt="Animation" />
        </div>
    )
}