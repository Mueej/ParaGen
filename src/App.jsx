import React, { useState, useEffect } from 'react'
import { Download, Github } from 'lucide-react'
import Visualizer from './components/Visualizer'
import { exportToDXF } from './utils/DXFExporter'

function App() {
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
  }, [isDark])

  const [params, setParams] = useState({
    diameter: 2400,
    gores: 12,
    ventRatio: 15,
    seamAllowance: 15,
    shapeRatio: 1.0,
  })

  const visualizerParams = {
    ...params,
    diameter: params.diameter,
  }

  const handleChange = (name, value) => {
    setParams(prev => ({ ...prev, [name]: parseFloat(value) }))
  }

  const [exporting, setExporting] = useState(false)

  const handleExport = () => {
    setExporting(true)
    exportToDXF(visualizerParams)
    setTimeout(() => {
      setExporting(false)
      console.log("DXF export triggered.")
    }, 2000)
  }

  return (
    <div className="container">
      <header className="header-row">
        <h1 className={`brand-logo-text ${exporting ? 'rainbow-text' : ''}`}>ParaGen</h1>
        <div
          className={`theme-switch ${isDark ? 'dark' : ''}`}
          onClick={() => setIsDark(!isDark)}
          aria-label="Toggle dark mode"
        >
          <div className="theme-switch-thumb" />
        </div>
      </header>

      <div className="content-layer">
        <main className="visualizer-container">
          <Visualizer params={visualizerParams} isDark={isDark} />
        </main>

        <aside className="sidebar">
          <section className="param-card">
            <div className="control-group">
              <span className="control-label">Diameter</span>
              <input
                type="range"
                min="500"
                max="5000"
                step="100"
                value={params.diameter}
                onChange={(e) => handleChange('diameter', e.target.value)}
              />
              <span className="control-value">{params.diameter} mm</span>
            </div>

            <div className="control-group">
              <span className="control-label">Shape Ratio</span>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.05"
                value={params.shapeRatio}
                onChange={(e) => handleChange('shapeRatio', e.target.value)}
              />
              <span className="control-value">{params.shapeRatio.toFixed(2)}</span>
            </div>

            <div className="control-group">
              <span className="control-label">Panel Count</span>
              <input
                type="range"
                min="4"
                max="24"
                step="2"
                value={params.gores}
                onChange={(e) => handleChange('gores', e.target.value)}
              />
              <span className="control-value">{params.gores}</span>
            </div>

            <div className="control-group">
              <span className="control-label">Vent Ratio</span>
              <input
                type="range"
                min="0"
                max="30"
                step="1"
                value={params.ventRatio}
                onChange={(e) => handleChange('ventRatio', e.target.value)}
              />
              <span className="control-value">{params.ventRatio} %</span>
            </div>

            <div className="control-group">
              <span className="control-label">Seam Allowance</span>
              <input
                type="range"
                min="0"
                max="50"
                step="5"
                value={params.seamAllowance}
                onChange={(e) => handleChange('seamAllowance', e.target.value)}
              />
              <span className="control-value">{params.seamAllowance} mm</span>
            </div>
          </section>

          <div className="info-box">
            <h3>About ParaGen</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--subtext-color)', margin: '0.25rem 0 0.75rem 0' }}>
              ParaGen procedurally generates 3D parachute models and natively exports perfectly flattened laser-ready 2D CAD patterns inline.
            </p>
            <h3>How to use these files</h3>
            <ul>
              <li>Use the template to cut out <strong>{params.gores}</strong> identical fabric panels.</li>
              <li>Sew panels together using the <strong>{params.seamAllowance}mm</strong> seam allowance built into the tracing.</li>
            </ul>
          </div>

          <button
            className="export-button"
            onClick={handleExport}
            disabled={exporting}
            style={exporting ? { background: '#222222', color: '#ffffff', borderColor: '#222222' } : {}}
          >
            <Download size={20} />
            {exporting ? 'Pattern Generated!' : 'Export DXF Pattern'}
          </button>
        </aside>
      </div>

      <footer className="footer-row">
        <span>ParaGen &mdash; Procedural 3D Parachute Pattern Generation</span>
        <a href="https://github.com/Mueej/ParaGen" target="_blank" rel="noreferrer" aria-label="GitHub Repository">
          <Github size={20} />
        </a>
      </footer>
    </div>
  )
}

export default App
