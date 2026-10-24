import { AudioLines, Check, SlidersHorizontal } from "lucide-react";

const channels = [
  { name: "Sistem", level: 72 },
  { name: "Tarayıcı", level: 46 },
  { name: "Müzik", level: 85 },
];

// Decorative interface studies inspired by Yusuf's projects, not product screenshots.
export function HeroPanels() {
  return (
    <>
      <div className="orbit-panel orbit-panel-code" aria-hidden="true">
        <div className="panel-chrome">
          <span className="panel-dots">
            <i />
            <i />
            <i />
          </span>
          <span>RequestLab</span>
          <span className="panel-status-dot" />
        </div>
        <div className="request-preview">
          <div className="request-address">
            <span>GET</span>
            <code>/api/projects</code>
          </div>
          <div className="request-result">
            <span>
              <Check size={10} /> 200 OK
            </span>
            <span>42 ms</span>
          </div>
          <pre>
            <span>{"{"}</span>
            {"\n"} <b>&quot;status&quot;</b>: <em>&quot;ready&quot;</em>,{"\n"}{" "}
            <b>&quot;projects&quot;</b>: [{"\n"}{" "}
            <em>&quot;WinSoundMixer&quot;</em>,{"\n"}{" "}
            <em>&quot;LLMVoice&quot;</em>
            {"\n"} ]{"\n"}
            <span>{"}"}</span>
          </pre>
          <div className="request-preview-footer">
            <span>Response</span>
            <span>JSON</span>
          </div>
        </div>
      </div>
      <div className="orbit-panel orbit-panel-project" aria-hidden="true">
        <div className="panel-chrome">
          <span className="panel-dots">
            <i />
            <i />
            <i />
          </span>
          <span>WinSoundMixer</span>
          <SlidersHorizontal size={10} />
        </div>
        <div className="mixer-preview">
          <div className="mixer-preview-heading">
            <span className="mixer-app-icon">
              <AudioLines size={19} />
            </span>
            <div>
              <strong>Ses senin kontrolünde.</strong>
              <span>Uygulama sesleri</span>
            </div>
          </div>
          <div className="mixer-channels">
            {channels.map((channel) => (
              <div key={channel.name} className="mixer-channel">
                <div>
                  <span>{channel.name}</span>
                  <span>{channel.level}%</span>
                </div>
                <span className="mixer-track">
                  <span style={{ width: `${channel.level}%` }} />
                </span>
              </div>
            ))}
          </div>
          <div className="mixer-preview-footer">
            <span className="panel-status-dot" /> Tüm sesler, tek bir yerde.
          </div>
        </div>
      </div>
    </>
  );
}
