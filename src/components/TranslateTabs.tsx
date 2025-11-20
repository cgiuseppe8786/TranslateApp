// src/components/LanguageTabs.tsx
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
      <div className="tab-dropdown-wrapper">
        <button
          type="button"
          className={
            "tab-pill tab-dropdown" +
            (extra.some((l) => l.id === selected) ? " tab-pill--active" : "")
          }
          onClick={() => setOpen((o) => !o)}
        >
          <span>
            {extra.find((x) => x.id === selected)?.label ?? "More"}
          </span>
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
                  setOpen(false);
                }}
              >
                {lang.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LanguageTabs;
