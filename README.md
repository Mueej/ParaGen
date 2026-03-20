# ParaGen

A highly interactive, browser-based 3D parachute generation and visualization tool built for professional pattern drafting. ParaGen allows users to visually configure structural variables for a parachute canopy and directly export the resulting 2D cutting patterns as standard DXF blueprints.

## Features
- **Real-Time 3D Visualization**: Fully responsive `react-three-fiber` environment rendering the canopy mesh in real-time.
- **Parametric Adjustments**: Seamless manipulation of Diameter, Shape Ratio, Panel Count, Vent Ratio, and Seam Allowance.
- **Blueprint DXF Export**: Harnesses raw geometric algorithms to generate highly accurate 2D flat-pattern gores with seamlessly integrated seam allowances.
- **Monochrome Theme Engine**: Sleek, structural light and dark mode toggling mirroring a darkroom engineering aesthetic.

## Setup Protocol

```bash
cd ParaGen
npm install
npm run dev
```

## How to use Exported Patterns
1. Import the generated `.dxf` pattern into standard CAD or vector processing software (Fusion 360, AutoCAD, Illustrator).
2. Print or laser-cut the pattern out of your fabric for the exact `Panel Count` generated.
3. Overlap and sew panels strictly tracking the encoded `Seam Allowance`.