/** Sliding toggle switch (e.g. for donor availability). */
export function SlideToggle({ checked, onChange, disabled, label }) {
  return (
    <label className="inline-flex items-center gap-3 cursor-pointer">
      <span className={`relative inline-flex h-7 w-12 flex-shrink-0 rounded-full border transition-colors focus-within:ring-2 focus-within:ring-accent focus-within:ring-offset-2 focus-within:ring-offset-bg ${checked ? 'border-primary bg-primary' : 'border-muted bg-muted'}`}>
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange?.(e.target.checked)}
          disabled={disabled}
          className="sr-only"
        />
        <span
          className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform duration-200 left-0.5 ${checked ? 'translate-x-5' : 'translate-x-0'} ${disabled ? 'opacity-50' : ''}`}
          aria-hidden
        />
      </span>
      {label && <span className="text-sm text-text select-none">{label}</span>}
    </label>
  );
}
