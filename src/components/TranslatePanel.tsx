// src/components/TranslatePanel.tsx
import React from "react";
import soundIcon from "../assets/sound_max_fill.svg";
import copyIcon from "../assets/Copy.svg";
import swapIcon from "../assets/Horizontal_top_left_main.svg";
import sortAlphaIcon from "../assets/Sort_alfa.svg";
import type { Language, LanguageId } from "../App";
import LanguageTabs from "./TranslateTabs";

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
          <LanguageTabs
            fixed={[
              { id: "auto", label: "Detect Language" },
              { id: "en", label: "English" },
              { id: "fr", label: "French" },
            ]}
            extra={[
              { id: "es", label: "Spanish" },
              { id: "it", label: "Italian" },
              { id: "de", label: "German" },
              { id: "pt", label: "Portuguese" },
              { id: "ja", label: "Japanese" },
              { id: "zh", label: "Chinese" },
            ]}
            selected={selectedLang}
            onSelect={(id) => onSelectLang?.(id as any)}
          />
        </div>

        {variant === "target" && (
          <button
            type="button"
            className="swap-icon-button"
            onClick={onSwapClick}
            aria-label="Swap languages"
          >
            <img src={swapIcon} alt="" className="swap-icon-img" />
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
              <img src={soundIcon} alt="" className="circle-icon" />
            </button>
            <button
              type="button"
              className="circle-button"
              onClick={onCopyClick}
              aria-label="Copy text"
            >
              <img src={copyIcon} alt="" className="circle-icon" />
            </button>
          </div>

          <div className="footer-right">
            {isSource && (
              <div className="footer-right-inner">
                <span className="char-counter">
                  {text.length}/{maxLength}
                </span>

                <button
                  type="button"
                  className="translate-main-button"
                  onClick={onTranslateClick}
                  disabled={isLoading || !text.trim()}
                >
                  <span className="translate-main-icon">
                    <img
                      src={sortAlphaIcon}
                      alt=""
                      className="translate-main-icon-img"
                    />
                  </span>
                  <span>Translate</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TranslatePanel;
