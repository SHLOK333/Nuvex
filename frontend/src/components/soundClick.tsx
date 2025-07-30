'use client';

const playClick = () => {
    const audio = new Audio('/mouse_click.mp3');
    audio.play();
}

export { playClick };