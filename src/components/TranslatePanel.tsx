// src/components/TranslatePanel.tsx
import React from "react";
import type { Language, LanguageId } from "../App";

export type PanelVariant = "source" | "target";

export interface TranslatePanelProps {
    variant: PanelVariant;
    languages: Language[];
    selectedLang: LanguageId;
    onSelectLang?: (id: LanguageId) => void;
    text: string;
    onChangeText?: (value: string) => void;
    maxLength?: number;
    readOnly?: boolean;
    isLoading?: boolean;
    onTranslateClick?: () => void;
    onSpeakClick?: () => void;
    onCopyClick?: () => void;
    onSwapClick?: () => void;
}

const TranslatePanel: React.FC<TranslatePanelProps> = ({
    variant,
    languages,
    selectedLang,
    onSelectLang,
    text,
    onChangeText,
    maxLength = 500,
    readOnly = false,
    isLoading = false,
    onTranslateClick,
    onSpeakClick,
    onCopyClick,
    onSwapClick,
}) => {
    const isSource = variant === "source";

    return (
        <section className={`card card--${variant}`}>
            <div className="card-header">
                <div className="header-tabs">
                    {languages.map((lang) => (
                        <button
                            key={lang.id}
                            type="button"
                            className={
                                "tab-pill" +
                                (selectedLang === lang.id ? " tab-pill--active" : "")
                            }
                            onClick={() => onSelectLang && onSelectLang(lang.id)}
                        >
                            {lang.label}
                        </button>
                    ))}
                </div>

                {variant === "target" && (
                    <button
                        type="button"
                        className="swap-icon-button"
                        onClick={onSwapClick}
                        aria-label="Swap languages"
                    >
                        ↻
                    </button>
                )}
            </div>

            <div className="card-divider" />

            <div className="card-body">
                <textarea
                    className="card-textarea"
                    value={text}
                    onChange={(e) => onChangeText && onChangeText(e.target.value)}
                    maxLength={maxLength}
                    readOnly={readOnly}
                    placeholder={isSource ? "Hello, how are you?" : ""}
                />

                <div className="card-footer">
                    <div className="footer-left">
                        <button
                            type="button"
                            className="circle-button"
                            onClick={onSpeakClick}
                            aria-label="Listen"
                        >
                            🔊
                        </button>
                        <button
                            type="button"
                            className="circle-button"
                            onClick={onCopyClick}
                            aria-label="Copy text"
                        >
                            📋
                        </button>
                    </div>

                    <div className="footer-right">
                        {isSource && (
                            <>
                                <span className="char-counter">
                                    {text.length}/{maxLength}
                                </span>
                                <button
                                    type="button"
                                    className="translate-main-button"
                                    onClick={onTranslateClick}
                                    disabled={isLoading || !text.trim()}
                                >
                                    <span className="translate-main-icon">A</span>
                                    <span>Translate</span>
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TranslatePanel;
