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


  const [localValues, setLocalValues] = useState(params)


  useEffect(() => {
    setLocalValues(params)
  }, [params])

  const visualizerParams = {
    ...params,
    diameter: params.diameter,
  }

  const handleChange = (name, value, isSlider = false) => {
    let parsedValue = parseFloat(value)
    if (isNaN(parsedValue)) return


    if (isSlider) {
      if (name === 'shapeRatio') {
        parsedValue = Math.round(parsedValue * 10) / 10
      } else {
        parsedValue = Math.round(parsedValue)
      }
    } else {
      if (name === 'diameter') {
        parsedValue = Math.round(parsedValue * 10) / 10
      } else if (name === 'ventRatio') {
        parsedValue = Math.round(parsedValue * 100) / 100
      } else if (name === 'shapeRatio') {
        parsedValue = Math.round(parsedValue * 1000) / 1000
      } else if (name === 'gores' || name === 'seamAllowance') {
        parsedValue = Math.round(parsedValue)
      }
    }
    
    setParams(prev => ({ ...prev, [name]: parsedValue }))
  }

  const handleLocalChange = (name, value) => {
    setLocalValues(prev => ({ ...prev, [name]: value }))
  }

  const handleKeyDown = (e, name) => {
    if (e.key === 'Enter') {
      handleChange(name, localValues[name], false)
      e.target.blur()
    }
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
              <span className="control-label">Diameter <span className="unit-label">mm</span></span>
              <input
                type="range"
                min="100"
                max="5000"
                step="1"
                value={params.diameter}
                onChange={(e) => handleChange('diameter', e.target.value, true)}
              />
              <div className="control-input-wrapper">
                <input
                  type="number"
                  className="control-number-input"
                  min="100"
                  max="5000"
                  step="0.1"
                  value={localValues.diameter}
                  onChange={(e) => handleLocalChange('diameter', e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, 'diameter')}
                  onBlur={() => handleChange('diameter', localValues.diameter, false)}
                />
              </div>
            </div>

            <div className="control-group">
              <span className="control-label">Shape Ratio</span>
              <input
                type="range"
                min="0.3"
                max="1.7"
                step="0.1"
                value={params.shapeRatio}
                onChange={(e) => handleChange('shapeRatio', e.target.value, true)}
              />
              <div className="control-input-wrapper">
                <input
                  type="number"
                  className="control-number-input"
                  min="0.3"
                  max="1.7"
                  step="0.001"
                  value={localValues.shapeRatio}
                  onChange={(e) => handleLocalChange('shapeRatio', e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, 'shapeRatio')}
                  onBlur={() => handleChange('shapeRatio', localValues.shapeRatio, false)}
                />
              </div>
            </div>

            <div className="control-group">
              <span className="control-label">Panel Count</span>
              <input
                type="range"
                min="4"
                max="30"
                step="1"
                value={params.gores}
                onChange={(e) => handleChange('gores', e.target.value, true)}
              />
              <div className="control-input-wrapper">
                <input
                  type="number"
                  className="control-number-input"
                  min="4"
                  max="30"
                  step="1"
                  value={localValues.gores}
                  onChange={(e) => handleLocalChange('gores', e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, 'gores')}
                  onBlur={() => handleChange('gores', localValues.gores, false)}
                />
              </div>
            </div>

            <div className="control-group">
              <span className="control-label">Vent Ratio <span className="unit-label">%</span></span>
              <input
                type="range"
                min="0"
                max="30"
                step="1"
                value={params.ventRatio}
                onChange={(e) => handleChange('ventRatio', e.target.value, true)}
              />
              <div className="control-input-wrapper">
                <input
                  type="number"
                  className="control-number-input"
                  min="0"
                  max="30"
                  step="0.01"
                  value={localValues.ventRatio}
                  onChange={(e) => handleLocalChange('ventRatio', e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, 'ventRatio')}
                  onBlur={() => handleChange('ventRatio', localValues.ventRatio, false)}
                />
              </div>
            </div>

            <div className="control-group">
              <span className="control-label">Seam <span className="unit-label">mm</span></span>
              <input
                type="range"
                min="0"
                max="50"
                step="1"
                value={params.seamAllowance}
                onChange={(e) => handleChange('seamAllowance', e.target.value, true)}
              />
              <div className="control-input-wrapper">
                <input
                  type="number"
                  className="control-number-input"
                  min="0"
                  max="50"
                  step="1"
                  value={localValues.seamAllowance}
                  onChange={(e) => handleLocalChange('seamAllowance', e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, 'seamAllowance')}
                  onBlur={() => handleChange('seamAllowance', localValues.seamAllowance, false)}
                />
              </div>
            </div>
          </section>

          <div className="info-box">
            <h3>How to use these files</h3>
            <ul>
              <li>Use the template to cut out <strong>{params.gores}</strong> identical fabric panels.</li>
              <li>Sew panels together using the <strong>{params.seamAllowance}mm</strong> seam built into the tracing.</li>
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
