import React, { useState } from "react";
import expandIcon from "../assets/Expand_down.svg";

export interface LangOption {
  id: string;
  label: string;
}

interface Props {
  fixed: LangOption[];
  extra: LangOption[];
  selected: string;
  onSelect: (id: string) => void;
}

const LanguageTabs: React.FC<Props> = ({ fixed, extra, selected, onSelect }) => {
  const [open, setOpen] = useState(false);
  const [lastExtraId, setLastExtraId] = useState<string | null>(
    extra[0]?.id ?? null
  );

  const selectedExtra = extra.find((l) => l.id === selected);
  const lastExtra = extra.find((l) => l.id === lastExtraId);

  const buttonLabel = selectedExtra?.label ?? lastExtra?.label ?? "";

  return (
    <div className="header-tabs">
      {fixed.map((lang) => (
        <button
          key={lang.id}
          type="button"
          className={
            "tab-pill" + (selected === lang.id ? " tab-pill--active" : "")
          }
          onClick={() => onSelect(lang.id)}
        >
          {lang.label}
        </button>
      ))}

      {/* dropdown */}
      {extra.length > 0 && (
        <div className="tab-dropdown-wrapper">
          <button
            type="button"
            className={
              "tab-pill tab-dropdown" +
              (extra.some((l) => l.id === selected) ? " tab-pill--active" : "")
            }
            onClick={() => setOpen((o) => !o)}
          >
            <span>{buttonLabel}</span>
            <img src={expandIcon} className="tab-pill-expand" />
          </button>

          {open && (
            <div className="tab-dropdown-menu">
              {extra.map((lang) => (
                <button
                  type="button"
                  key={lang.id}
                  className="tab-dropdown-item"
                  onClick={() => {
                    onSelect(lang.id);
                    setLastExtraId(lang.id);
                    setOpen(false);
                  }}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LanguageTabs;
