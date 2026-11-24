import { useState } from 'react';
import { ParentGate } from '../components/ParentGate';
import { Modal, ScreenHeader } from '../components/ui';
import { APP_NAME, APP_VERSION, APP_AUTHOR, APP_SITE_LABEL, APP_SITE_URL, APP_YEAR, AVATARS } from '../lib/constants';
import { speak } from '../lib/audio';
import { useInstallPrompt } from '../lib/pwa';
import { useEnglishVoices } from '../lib/useVoices';
import { useApp } from '../state/AppContext';

export function ParentScreen({ onBack }: { onBack: () => void }) {
  const [unlocked, setUnlocked] = useState(false);

  if (!unlocked) {
    return <ParentGate onSuccess={() => setUnlocked(true)} onBack={onBack} />;
  }

  return <ParentZone onBack={onBack} />;
}

function ParentZone({ onBack }: { onBack: () => void }) {
  const { save, setProfile, setSettings, resetProgress } = useApp();
  const voices = useEnglishVoices();
  const { canInstall, busy, promptInstall, isIOS: ios, standalone } = useInstallPrompt();
  const [iosHelp, setIosHelp] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [installedNow, setInstalledNow] = useState(false);

  const toggleSound = () => {
    const next = !save.settings.soundOn;
    setSettings({ soundOn: next });
    if (next) window.setTimeout(() => speak('Sound is on.'), 80);
  };

  const testVoice = () => {
    speak("Hello! I am Aphakids. Let's learn together!");
  };

  const install = async () => {
    const outcome = await promptInstall();
    if (outcome === 'accepted') setInstalledNow(true);
  };

  const updateName = (value: string) => {
    setProfile({ name: value.slice(0, 12) });
  };

  return (
    <div className="screen parent-screen">
      <ScreenHeader title="Parent Zone" onBack={onBack} />

      <section className="section-card">
        <h2 className="section-title">Child profile</h2>
        <label className="field-label" htmlFor="child-name">
          Name
        </label>
        <input
          id="child-name"
          className="text-input"
          type="text"
          maxLength={12}
          autoComplete="off"
          value={save.profile.name}
          onChange={(event) => updateName(event.target.value)}
          onBlur={() => {
            if (!save.profile.name.trim()) setProfile({ name: 'Friend' });
          }}
        />
        <p className="field-label">Avatar</p>
        <div className="avatar-grid">
          {AVATARS.map((avatar) => (
            <button
              key={avatar}
              type="button"
              className={`avatar-option ${save.profile.avatar === avatar ? 'selected' : ''}`}
              onClick={() => setProfile({ avatar })}
              aria-label={`Choose avatar ${avatar}`}
              aria-pressed={save.profile.avatar === avatar}
            >
              {avatar}
            </button>
          ))}
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">Sound & voice</h2>
        <div className="switch-row">
          <span>Sound effects and voice</span>
          <button
            type="button"
            role="switch"
            aria-checked={save.settings.soundOn}
            aria-label="Sound on or off"
            className={`switch ${save.settings.soundOn ? 'on' : ''}`}
            onClick={toggleSound}
          >
            <span className="switch-thumb" />
          </button>
        </div>

        <label className="field-label" htmlFor="volume">
          Volume
        </label>
        <div className="slider-row">
          <span aria-hidden>🔈</span>
          <input
            id="volume"
            type="range"
            min={0}
            max={100}
            value={Math.round(save.settings.volume * 100)}
            onChange={(event) => setSettings({ volume: Number(event.target.value) / 100 })}
            className="range"
          />
          <span aria-hidden>🔊</span>
        </div>

        <label className="field-label" htmlFor="voice">
          Speaking voice
        </label>
        <select
          id="voice"
          className="voice-select"
          value={save.settings.voiceURI ?? ''}
          onChange={(event) => setSettings({ voiceURI: event.target.value || null })}
        >
          <option value="">Device default</option>
          {voices.map((voice) => (
            <option key={voice.voiceURI} value={voice.voiceURI}>
              {voice.name} ({voice.lang})
            </option>
          ))}
        </select>
        {voices.length === 0 ? (
          <p className="info-text">
            English voices are not loaded yet. They usually appear after the first tap.
          </p>
        ) : null}

        <button type="button" className="btn btn-secondary" onClick={testVoice}>
          🔊 Test the voice
        </button>
      </section>

      <section className="section-card">
        <h2 className="section-title">Install app</h2>
        {standalone || installedNow ? (
          <p className="info-text success">✅ Aphakids is installed on this device.</p>
        ) : canInstall ? (
          <>
            <p className="info-text">
              Add Aphakids to the home screen. It opens full screen and works offline.
            </p>
            <button type="button" className="btn btn-primary" onClick={install} disabled={busy}>
              {busy ? 'Installing…' : '📲 Install Aphakids'}
            </button>
          </>
        ) : ios ? (
          <>
            <p className="info-text">
              On iPhone and iPad, installation is done from Safari's Share menu.
            </p>
            <button type="button" className="btn btn-primary" onClick={() => setIosHelp(true)}>
              📲 How to install
            </button>
          </>
        ) : (
          <p className="info-text">
            Open Aphakids in Chrome (Android) or Safari (iPhone), then choose “Install app” or
            “Add to Home Screen”.
          </p>
        )}
        {!standalone ? (
          <p className="info-text small">
            Installation requires the secure (HTTPS) version of the app.
          </p>
        ) : null}
      </section>

      <section className="section-card">
        <h2 className="section-title">Progress</h2>
        <div className="stat-row">
          <span>Stars collected</span>
          <strong>⭐ {save.stars}</strong>
        </div>
        <p className="info-text">
          Progress is stored only on this device. No account, no ads, no tracking.
        </p>
        <button type="button" className="btn btn-danger" onClick={() => setResetOpen(true)}>
          Reset progress
        </button>
      </section>

      <section className="section-card about-card">
        <h2 className="section-title">About</h2>
        <p className="about-title">
          {APP_NAME} <span className="version-pill">{APP_VERSION}</span>
        </p>
        <p className="info-text">
          A safe offline playroom for ages 4–6: easy English words, counting to 100, and
          addition & subtraction.
        </p>
        <p className="info-text small">
          Works offline. No data leaves the device. Designed for big fingers and little
          readers.
        </p>
        <p className="about-signature">
          © {APP_YEAR} {APP_AUTHOR} ·{' '}
          <a className="text-link" href={APP_SITE_URL} target="_blank" rel="noopener noreferrer">
            {APP_SITE_LABEL}
          </a>
        </p>
      </section>

      <Modal open={iosHelp} title="Install on iPhone or iPad" onClose={() => setIosHelp(false)}>
        <ol className="ios-steps">
          <li>Open Aphakids in Safari.</li>
          <li>Tap the Share button (the square with an arrow).</li>
          <li>Scroll down and tap “Add to Home Screen”.</li>
          <li>Tap “Add”. The Aphakids icon will appear on your home screen.</li>
        </ol>
        <button type="button" className="btn btn-primary" onClick={() => setIosHelp(false)}>
          Got it
        </button>
      </Modal>

      <Modal open={resetOpen} title="Reset progress?" onClose={() => setResetOpen(false)}>
        <p className="info-text">
          Stars and stickers will go back to zero. The child profile and settings stay.
        </p>
        <div className="modal-actions">
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => {
              resetProgress();
              setResetOpen(false);
            }}
          >
            Yes, reset
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => setResetOpen(false)}>
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
}
