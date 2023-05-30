import React from 'react';
import Image from 'next/image';
import PictionaryLogo from '../public/pictionary_logo.svg';

export const GameStart = () => {
    return (
        <div>
            <Image src={PictionaryLogo} alt='pictioner logo' />
        </div>
    )
}