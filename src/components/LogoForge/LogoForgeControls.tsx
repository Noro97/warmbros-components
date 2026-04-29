import { useCallback, useRef, useState } from 'react';
import styles from './LogoForge.module.css';
import { ENV_PRESETS } from './presets';
import type {
  EnvPreset,
  LogoForgeConfig,
  LogoForgeLabels,
  LogoSource,
  MaterialPreset,
  MaterialType,
} from './types';

export interface LogoForgeControlsProps {
  config: LogoForgeConfig;
  source: LogoSource;
  presets: MaterialPreset[];
  labels: LogoForgeLabels;
  onConfigChange: (patch: Partial<LogoForgeConfig>) => void;
  onSourceChange: (s: LogoSource) => void;
  onReset: () => void;
}

export function LogoForgeControls({
  config,
  source,
  presets,
  labels,
  onConfigChange,
  onSourceChange,
  onReset,
}: LogoForgeControlsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFile = useCallback(
    (file: File) => {
      const isSvg =
        file.type.includes('svg') || file.name.toLowerCase().endsWith('.svg');
      if (!isSvg) {
        // eslint-disable-next-line no-alert
        alert(labels.errorNotSvg);
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => {
        const text = ev.target?.result;
        if (typeof text === 'string') {
          onSourceChange({ name: file.name, svgString: text });
        }
      };
      reader.readAsText(file);
    },
    [onSourceChange, labels.errorNotSvg],
  );

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  };

  const applyPreset = (presetId: string, patch: Partial<LogoForgeConfig>) => {
    setActivePreset(presetId);
    onConfigChange(patch);
  };

  const isPhysical = config.materialType === 'physical';
  const isStandard = config.materialType === 'standard';

  const materialLabels: Record<MaterialType, string> = {
    physical: labels.materialPhysical,
    standard: labels.materialStandard,
    toon: labels.materialToon,
    wireframe: labels.materialWireframe,
  };

  return (
    <div className={styles.controls}>
      {/* SVG Upload */}
      <Section label={labels.uploadTitle}>
        <div
          className={[
            styles.uploadDrop,
            dragActive ? styles.dragActive : '',
          ]
            .filter(Boolean)
            .join(' ')}
          onDrop={onDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
        >
          <UploadIcon />
          <div className={styles.uploadText}>
            <p className={styles.uploadFilename}>
              {source.svgString ? source.name : labels.uploadDefault}
            </p>
            <p className={styles.uploadHint}>{labels.uploadHint}</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".svg,image/svg+xml"
            onChange={onFileChange}
            className={styles.hiddenInput}
          />
        </div>
      </Section>

      {/* Material Presets */}
      <Section label={labels.presetsTitle}>
        <div className={styles.presetGrid}>
          {presets.map((p) => {
            const active = activePreset === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => applyPreset(p.id, p.config)}
                className={[styles.presetButton, active ? styles.active : '']
                  .filter(Boolean)
                  .join(' ')}
              >
                <span
                  className={styles.presetSwatch}
                  style={{ backgroundColor: p.swatch }}
                />
                <span className={styles.presetLabel}>{p.label}</span>
              </button>
            );
          })}
        </div>
      </Section>

      {/* Material Type */}
      <Section label={labels.materialTitle}>
        <div className={styles.segmented}>
          {(['physical', 'standard', 'toon', 'wireframe'] as MaterialType[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => onConfigChange({ materialType: m })}
              className={[
                styles.segmentedButton,
                config.materialType === m ? styles.active : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {materialLabels[m]}
            </button>
          ))}
        </div>
      </Section>

      {/* Color */}
      <Section label={labels.colorTitle}>
        <div className={styles.colorRow}>
          <input
            type="color"
            value={config.color}
            onChange={(e) => onConfigChange({ color: e.target.value })}
            className={styles.colorInput}
          />
          <span className={styles.colorValue}>{config.color}</span>
        </div>
      </Section>

      <Slider
        label={labels.sliderDepth}
        value={config.depth}
        min={0.05}
        max={1.5}
        step={0.05}
        onChange={(v) => onConfigChange({ depth: v })}
      />
      <Slider
        label={labels.sliderBevel}
        value={config.bevelSize}
        min={0}
        max={0.05}
        step={0.005}
        onChange={(v) => onConfigChange({ bevelSize: v, bevelThickness: v })}
      />

      {(isPhysical || isStandard) && (
        <>
          <Slider
            label={labels.sliderMetalness}
            value={config.metalness}
            min={0}
            max={1}
            step={0.05}
            onChange={(v) => onConfigChange({ metalness: v })}
          />
          <Slider
            label={labels.sliderRoughness}
            value={config.roughness}
            min={0}
            max={1}
            step={0.05}
            onChange={(v) => onConfigChange({ roughness: v })}
          />
        </>
      )}
      {isPhysical && (
        <>
          <Slider
            label={labels.sliderTransmission}
            value={config.transmission}
            min={0}
            max={1}
            step={0.05}
            onChange={(v) => onConfigChange({ transmission: v })}
          />
          <Slider
            label={labels.sliderClearcoat}
            value={config.clearcoat}
            min={0}
            max={1}
            step={0.05}
            onChange={(v) => onConfigChange({ clearcoat: v })}
          />
        </>
      )}
      {(isPhysical || isStandard) && (
        <Slider
          label={labels.sliderEmissive}
          value={config.emissiveIntensity}
          min={0}
          max={3}
          step={0.1}
          onChange={(v) => onConfigChange({ emissiveIntensity: v })}
        />
      )}

      {/* Environment */}
      <Section label={labels.envTitle}>
        <select
          value={config.environment}
          onChange={(e) =>
            onConfigChange({ environment: e.target.value as EnvPreset })
          }
          className={styles.select}
        >
          {ENV_PRESETS.map((p) => (
            <option key={p.value} value={p.value}>
              {labels[p.labelKey]}
            </option>
          ))}
        </select>
      </Section>

      <Slider
        label={labels.sliderLightIntensity}
        value={config.lightIntensity}
        min={0}
        max={3}
        step={0.1}
        onChange={(v) => onConfigChange({ lightIntensity: v })}
      />
      <Slider
        label={labels.sliderEnvIntensity}
        value={config.envIntensity}
        min={0}
        max={2}
        step={0.05}
        onChange={(v) => onConfigChange({ envIntensity: v })}
      />

      {/* Auto-rotate */}
      <Section label={labels.rotateTitle}>
        <div className={styles.rotateRow}>
          <button
            type="button"
            onClick={() => onConfigChange({ autoRotate: !config.autoRotate })}
            className={[styles.toggleButton, config.autoRotate ? styles.active : '']
              .filter(Boolean)
              .join(' ')}
          >
            {config.autoRotate ? labels.rotateOn : labels.rotateOff}
          </button>
          <input
            type="range"
            min={0.1}
            max={3}
            step={0.1}
            value={config.rotateSpeed}
            disabled={!config.autoRotate}
            onChange={(e) =>
              onConfigChange({ rotateSpeed: parseFloat(e.target.value) })
            }
            className={`${styles.range} ${styles.rotateSpeed}`}
          />
          <span className={styles.rotateSpeedValue}>
            ×{config.rotateSpeed.toFixed(1)}
          </span>
        </div>
      </Section>

      <button
        type="button"
        onClick={() => {
          setActivePreset(null);
          onReset();
        }}
        className={styles.resetButton}
      >
        <RefreshIcon />
        {labels.resetAction}
      </button>
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className={styles.section}>
      <label className={styles.sectionLabel}>{label}</label>
      {children}
    </div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className={styles.slider}>
      <div className={styles.sliderHeader}>
        <label className={styles.sliderLabel}>{label}</label>
        <span className={styles.sliderValue}>{value.toFixed(2)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className={styles.range}
      />
    </div>
  );
}

/* Inline icons (to avoid runtime icon library dependency) */
function UploadIcon() {
  return (
    <svg
      className={styles.uploadIcon}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  );
}
