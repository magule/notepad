import React, { useEffect, useState, useRef } from 'react';
import './LegalPad.css';

const themes = [
    {
        name: 'leather',
        url: 'https://www.transparenttextures.com/patterns/leather.png'
    },
    {
        name: 'wood',
        url: 'https://www.transparenttextures.com/patterns/wood-pattern.png'
    },
    {
        name: 'colored-wood',
        url: 'https://www.transparenttextures.com/patterns/tileable-wood-colored.png'
    }
];

const LegalPad = () => {
    const [note, setNote] = useState('');
    const [charCount, setCharCount] = useState(0);
    const [shareMessage, setShareMessage] = useState('');
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [shareUrl, setShareUrl] = useState('');
    const [currentTheme, setCurrentTheme] = useState(0);
    const saveTimeoutRef = useRef(null);

    useEffect(() => {
        // Load saved content when component mounts
        const savedContent = localStorage.getItem('legalPadContent');
        if (savedContent) {
            setNote(savedContent);
            setCharCount(savedContent.length);
        }
    }, []);

    useEffect(() => {
        // Apply theme to header
        const header = document.querySelector('.header');
        header.style.backgroundImage = `url('${themes[currentTheme].url}')`;
        
        // Special styling for space theme
        if (currentTheme === 3) { // Space theme
            header.classList.add('matrix-theme');
            document.querySelector('.legal-pad').classList.add('space-theme');
            document.querySelectorAll('.action-button').forEach(button => {
                button.classList.add('matrix-theme');
            });
        } else {
            header.classList.remove('matrix-theme');
            document.querySelector('.legal-pad').classList.remove('space-theme');
            document.querySelectorAll('.action-button').forEach(button => {
                button.classList.remove('matrix-theme');
            });
        }
    }, [currentTheme]);

    const handleNoteChange = (e) => {
        const newValue = e.target.value;
        setNote(newValue);
        setCharCount(newValue.length);
        
        // Clear existing timeout
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }

        // Set new timeout for auto-save
        saveTimeoutRef.current = setTimeout(() => {
            localStorage.setItem('legalPadContent', newValue);
        }, 1000);
    };

    const handleThemeChange = () => {
        setCurrentTheme((prev) => (prev + 1) % themes.length);
    };

    const handleClear = () => {
        if (window.confirm('Clear note?')) {
            setNote('');
            setCharCount(0);
            localStorage.removeItem('legalPadContent');
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(note);
        setShareMessage('Copied to clipboard!');
        setTimeout(() => setIsShareModalOpen(true), 2000);
    };

    const handleShare = () => {
        try {
            // Create a temporary object with the note content
            const shareData = {
                note: note,
                timestamp: new Date().toISOString()
            };

            // Convert to base64 to make it URL-safe
            const base64Data = btoa(JSON.stringify(shareData));
            
            // Create a short unique ID (first 8 characters of base64)
            const shortId = base64Data.slice(0, 8);
            
            // Create the shareable URL
            const shareUrl = `${window.location.origin}/share/${shortId}`;
            
            setShareUrl(shareUrl);
            setIsShareModalOpen(true);
        } catch (error) {
            console.error('Error creating share link:', error);
            setShareMessage('Error creating share link');
            setTimeout(() => setIsShareModalOpen(true), 2000);
        }
    };

    const handleCopyUrl = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setShareMessage('Share link copied!');
            setIsShareModalOpen(false);
        } catch (error) {
            console.error('Error copying URL:', error);
            setShareMessage('Error copying URL');
            setTimeout(() => setIsShareModalOpen(true), 2000);
        }
    };

    return (
        <div className="legal-pad-container">
            <header className="header">
                <div className="logo">note<span>pad</span></div>
                <div className="actions">
                    <div className="character-count">
                        {charCount.toLocaleString()} chars
                    </div>
                    <button className="action-button" onClick={handleCopy}>
                        Copy
                    </button>
                    <button className="action-button" onClick={handleShare}>
                        Share
                    </button>
                    <button className="action-button" onClick={handleThemeChange}>
                        Theme ({currentTheme + 1})
                    </button>
                </div>
            </header>

            <div className="legal-pad">
                <div className="lines"></div>
                <textarea
                    value={note}
                    onChange={handleNoteChange}
                    placeholder="Start typing..."
                    className="notepad"
                    spellCheck="false"
                    autoFocus
                />
                <div className="char-count-bottom">
                    {charCount.toLocaleString()} chars
                </div>
            </div>

            <div className={`modal-overlay ${isShareModalOpen ? 'visible' : ''}`} onClick={() => setIsShareModalOpen(false)}>
                <div className="share-modal" onClick={e => e.stopPropagation()}>
                    <div className="modal-header">
                        <div className="modal-title">Share Note</div>
                        <button className="close-button" onClick={() => setIsShareModalOpen(false)}>×</button>
                    </div>
                    <div className="url-container">
                        <input
                            type="text"
                            className="share-url"
                            value={shareUrl}
                            readOnly
                        />
                        <button className="copy-url-button" onClick={handleCopyUrl}>
                            Copy URL
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LegalPad;