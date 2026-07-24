import { useState, useEffect, useCallback } from 'react';
import { Search, X, ArrowLeft } from 'lucide-react';

// ─── Types ───
type Screen = 'welcome' | 'menu' | 'logic-gates' | 'basic-logic-gates' | 'gears' | 'linkages';

interface GearType { id: string; name: string; icon: string; color: string; desc: string; }
interface LinkageType { id: string; name: string; icon: string; color: string; desc: string; }

// ─── Data: GEAR_TYPES (36) ───
const GEAR_TYPES: GearType[] = [
  { id: 'spur', name: 'Spur Gear', icon: 'spur', color: '#4caf50', desc: 'Most common gear type with straight teeth parallel to the axis of rotation. Used in simple speed reducers and transmissions.' },
  { id: 'helical', name: 'Helical Gear', icon: 'helical', color: '#2196f3', desc: 'Teeth are cut at an angle to the face, providing smoother and quieter operation than spur gears.' },
  { id: 'double-helical', name: 'Double Helical/Herringbone', icon: 'double-helical', color: '#9c27b0', desc: 'Two helical gears mirrored back-to-back, cancelling axial thrust. Used in heavy-duty applications like power plants.' },
  { id: 'bevel', name: 'Bevel Gear', icon: 'bevel', color: '#ff9800', desc: 'Conical gears that transmit motion between intersecting shafts, typically at 90 degrees.' },
  { id: 'spiral-bevel', name: 'Spiral Bevel Gear', icon: 'spiral-bevel', color: '#f44336', desc: 'Bevel gears with curved teeth for smoother and quieter operation at higher speeds.' },
  { id: 'zerol-bevel', name: 'Zerol Bevel Gear', icon: 'zerol-bevel', color: '#e91e63', desc: 'Bevel gears with zero spiral angle, combining benefits of straight and spiral bevel gears.' },
  { id: 'hypoid', name: 'Hypoid Gear', icon: 'hypoid', color: '#ff5722', desc: 'Similar to spiral bevel but with offset axes, commonly used in automotive rear axle differentials.' },
  { id: 'worm', name: 'Worm Gear', icon: 'worm', color: '#795548', desc: 'A screw meshes with a wheel to achieve high reduction ratios in a compact space. Self-locking capability.' },
  { id: 'worm-wheel', name: 'Worm Wheel', icon: 'worm-wheel', color: '#607d8b', desc: 'The gear that meshes with a worm screw, providing smooth and quiet high-ratio speed reduction.' },
  { id: 'rack', name: 'Rack & Pinion', icon: 'rack', color: '#009688', desc: 'Converts rotational motion to linear motion (or vice versa) using a circular gear and a straight bar.' },
  { id: 'internal', name: 'Internal/Ring Gear', icon: 'internal', color: '#3f51b5', desc: 'A gear with teeth on the inside of a ring, used in planetary gear systems for compact design.' },
  { id: 'planetary', name: 'Planetary/Epicyclic', icon: 'planetary', color: '#673ab7', desc: 'System of sun, planet, and ring gears providing high torque density and multiple gear ratios.' },
  { id: 'sun', name: 'Sun Gear', icon: 'sun', color: '#ffc107', desc: 'Central gear in a planetary gear system that meshes with planet gears to distribute torque.' },
  { id: 'ring-gear', name: 'Ring Gear (Annulus)', icon: 'ring-gear', color: '#8bc34a', desc: 'Outer ring gear in a planetary system with internal teeth that mesh with planet gears.' },
  { id: 'compound', name: 'Compound Gear', icon: 'compound', color: '#00bcd4', desc: 'Multiple gears rigidly attached to the same shaft, enabling large speed reductions in fewer stages.' },
  { id: 'idler', name: 'Idler Gear', icon: 'idler', color: '#ff9800', desc: 'Intermediate gear that transmits motion between other gears without changing the gear ratio. Reverses direction.' },
  { id: 'miter', name: 'Miter Gear', icon: 'miter', color: '#4caf50', desc: 'A pair of bevel gears with equal teeth count, used to change shaft direction by 90 degrees without speed change.' },
  { id: 'crown', name: 'Crown Gear', icon: 'crown', color: '#ffd700', desc: 'A bevel gear with teeth on the edge of a flat disc, meshing with an angled gear for 90-degree transmission.' },
  { id: 'face', name: 'Face Gear', icon: 'face', color: '#ff6b35', desc: 'Disk-shaped gear with teeth on its face, meshing with a spur or helical pinion. Used in aerospace applications.' },
  { id: 'skew-bevel', name: 'Skew Bevel Gear', icon: 'skew-bevel', color: '#da70d6', desc: 'Bevel gears where shafts neither intersect nor are parallel, for complex angular motion transmission.' },
  { id: 'crossed-helical', name: 'Crossed Helical/Screw', icon: 'crossed-helical', color: '#20b2aa', desc: 'Helical gears on non-intersecting, non-parallel shafts. Single-point contact allows light-duty applications.' },
  { id: 'harmonic', name: 'Harmonic Drive/Flexspline', icon: 'harmonic', color: '#7b68ee', desc: 'Uses a flexible spline deformed by an elliptical wave generator. Zero backlash, high reduction ratios.' },
  { id: 'cycloidal', name: 'Cycloidal Drive', icon: 'cycloidal', color: '#32cd32', desc: 'Speed reducer using cycloidal disc motion. High efficiency, excellent shock load resistance.' },
  { id: 'noncircular', name: 'Non-circular Gear', icon: 'noncircular', color: '#ff4500', desc: 'Gears with non-circular profiles to produce variable output speed from constant input speed.' },
  { id: 'elliptical', name: 'Elliptical Gear', icon: 'elliptical', color: '#1e90ff', desc: 'A type of non-circular gear with elliptical pitch curves, producing cyclically varying speed ratios.' },
  { id: 'sector', name: 'Sector Gear', icon: 'sector', color: '#ff69b4', desc: 'Partial gear (a segment of a full gear) used where only partial rotation is needed, like in steering systems.' },
  { id: 'segment', name: 'Segment Gear', icon: 'segment', color: '#adff2f', desc: 'Gear consisting of a partial toothed arc, used in intermittent motion mechanisms.' },
  { id: 'lantern', name: 'Lantern/Pin Gear', icon: 'lantern', color: '#dda0dd', desc: 'Simple gear with cylindrical pins instead of teeth, used historically in mills and low-speed applications.' },
  { id: 'cage', name: 'Cage Gear', icon: 'cage', color: '#f0e68c', desc: 'Gear with pins held in a cage frame, providing simple construction for low-load applications.' },
  { id: 'sprocket', name: 'Sprocket/Chain Gear', icon: 'sprocket', color: '#b8860b', desc: 'Toothed wheel designed to mesh with a chain, used in bicycles, motorcycles, and conveyors.' },
  { id: 'ratchet', name: 'Ratchet & Pawl', icon: 'ratchet', color: '#cd5c5c', desc: 'Allows continuous linear or rotary motion in one direction while preventing reverse motion.' },
  { id: 'geneva', name: 'Geneva Drive', icon: 'geneva', color: '#4682b4', desc: 'Converts continuous rotation into intermittent rotary motion with precise angular indexing.' },
  { id: 'globoid', name: 'Globoid/Hindley Worm', icon: 'globoid', color: '#2e8b57', desc: 'Hourglass-shaped worm gear with concave surface, providing more contact area than standard worm gears.' },
  { id: 'straight-bevel', name: 'Straight Bevel Gear', icon: 'straight-bevel', color: '#d2691e', desc: 'Bevel gear with straight teeth that converge at the shaft intersection point. Simplest bevel type.' },
  { id: 'conical', name: 'Conical Involute Gear', icon: 'conical', color: '#8fbc8f', desc: 'Gear with teeth cut on a conical surface using involute profiles for smooth meshing.' },
  { id: 'magnetic', name: 'Magnetic Gear', icon: 'magnetic', color: '#9400d3', desc: 'Non-contact gear using magnetic field modulation for torque transmission. No friction or wear.' },
];

// ─── Data: LINKAGE_TYPES (45) ───
const LINKAGE_TYPES: LinkageType[] = [
  { id: 'four-bar', name: 'Four-Bar Linkage', icon: 'four-bar', color: '#4caf50', desc: 'Most fundamental planar linkage with 4 bars and 4 revolute joints. Converts input rotation to complex output motion.' },
  { id: 'slider-crank', name: 'Slider-Crank', icon: 'slider-crank', color: '#2196f3', desc: 'Converts rotary motion to reciprocating linear motion (or vice versa). Core mechanism in engines and compressors.' },
  { id: 'scotch-yoke', name: 'Scotch Yoke', icon: 'scotch-yoke', color: '#9c27b0', desc: 'Converts rotary motion to pure sinusoidal linear motion. Used in control valves and precision actuators.' },
  { id: 'crank-rocker', name: 'Crank-Rocker', icon: 'crank-rocker', color: '#ff9800', desc: 'Four-bar linkage where the input link makes full rotation while the output link oscillates (rocks).' },
  { id: 'double-crank', name: 'Double Crank/Drag Link', icon: 'double-crank', color: '#f44336', desc: 'Both input and output links make full rotations. Used in locomotive wheel coupling and steering mechanisms.' },
  { id: 'double-rocker', name: 'Double Rocker', icon: 'double-rocker', color: '#009688', desc: 'Neither input nor output link makes a full rotation; both oscillate. Used in oscillating engine designs.' },
  { id: 'pantograph', name: 'Pantograph', icon: 'pantograph', color: '#3f51b5', desc: 'Mechanical linkage that copies motion from one point to another at a different scale. Used in drawing and railways.' },
  { id: 'watt-1', name: "Watt's Linkage I", icon: 'watt-1', color: '#673ab7', desc: "Invented by James Watt to approximate straight-line motion. Used in steam engine piston rod guides." },
  { id: 'watt-2', name: "Watt's Linkage II", icon: 'watt-2', color: '#e91e63', desc: "Second type of Watt's linkage providing improved straight-line approximation for mechanical guidance." },
  { id: 'chebyshev', name: 'Chebyshev Linkage', icon: 'chebyshev', color: '#ff5722', desc: 'Approximates straight-line motion using a four-bar mechanism. Named after mathematician Pafnuty Chebyshev.' },
  { id: 'peaucellier', name: 'Peaucellier-Lipkin', icon: 'peaucellier', color: '#795548', desc: 'First planar linkage to produce exact straight-line motion. Uses 7 bars and a rhombus configuration.' },
  { id: 'roberts', name: 'Roberts Linkage', icon: 'roberts', color: '#607d8b', desc: 'Three-bar linkage producing approximate straight-line motion. Simpler alternative to Peaucellier-Lipkin.' },
  { id: 'hoekens', name: 'Hoekens Linkage', icon: 'hoekens', color: '#ffc107', desc: 'Inverted slider-crank linkage that generates approximate straight-line motion from rotary input.' },
  { id: 'stephenson-1', name: 'Stephenson I', icon: 'stephenson-1', color: '#8bc34a', desc: 'Six-bar linkage with three simple links and two ternary links. Provides complex motion generation capabilities.' },
  { id: 'stephenson-2', name: 'Stephenson II', icon: 'stephenson-2', color: '#00bcd4', desc: 'Variant of Stephenson linkage with different ground pivot arrangement for specific motion requirements.' },
  { id: 'stephenson-3', name: 'Stephenson III', icon: 'stephenson-3', color: '#ff9800', desc: 'Third Stephenson configuration with ground pivots on outer links for precise path generation.' },
  { id: 'watt-six-1', name: 'Watt Six-Bar I', icon: 'watt-six-1', color: '#4caf50', desc: 'Two four-bar chains sharing a common link. Generates complex motion paths with fewer joints.' },
  { id: 'watt-six-2', name: 'Watt Six-Bar II', icon: 'watt-six-2', color: '#ffd700', desc: 'Alternative Watt six-bar configuration for different motion generation requirements.' },
  { id: 'toggle', name: 'Toggle/Knee Linkage', icon: 'toggle', color: '#ff6b35', desc: 'Mechanism that locks at dead-center position, providing high mechanical advantage at the end of stroke.' },
  { id: 'oldham', name: 'Oldham Coupling', icon: 'oldham', color: '#da70d6', desc: 'Coupling for parallel shafts with small offset. Transmits constant velocity rotation between misaligned shafts.' },
  { id: 'hook', name: "Hook's Joint/Universal", icon: 'hook', color: '#20b2aa', desc: "Universal joint transmitting rotary motion between intersecting shafts. Non-constant velocity in single joints." },
  { id: 'rzeppa', name: 'Rzeppa CV Joint', icon: 'rzeppa', color: '#7b68ee', desc: 'Constant velocity joint using ball bearings in a cage. Used in front-wheel-drive vehicles.' },
  { id: 'tripode', name: 'Tripode CV Joint', icon: 'tripode', color: '#32cd32', desc: 'Three-leg CV joint providing smooth constant velocity transmission with high angular capability.' },
  { id: 'double-cardan', name: 'Double Cardan Joint', icon: 'double-cardan', color: '#ff4500', desc: 'Two universal joints in series that cancel velocity fluctuations, achieving true constant velocity.' },
  { id: 'bellcrank', name: 'Bell Crank Linkage', icon: 'bellcrank', color: '#1e90ff', desc: 'L-shaped lever that changes the direction of force. Used in control systems, brakes, and linkages.' },
  { id: 'rack-link', name: 'Rack & Pinion Linkage', icon: 'rack-link', color: '#ff69b4', desc: 'Converts rotary motion to linear translation using a gear and toothed bar. Used in steering systems.' },
  { id: 'cam-link', name: 'Cam-Follower Linkage', icon: 'cam-link', color: '#adff2f', desc: 'Rotating cam drives a follower through direct contact, generating custom motion profiles.' },
  { id: 'whitworth', name: 'Whitworth Quick-Return', icon: 'whitworth', color: '#dda0dd', desc: 'Mechanism producing unequal time for forward and return strokes. Used in shapers and slotting machines.' },
  { id: 'crank-shaper', name: 'Crank Shaper Mechanism', icon: 'crank-shaper', color: '#f0e68c', desc: 'Uses a crank and slotted lever to produce quick-return motion for metal shaping operations.' },
  { id: 'grasshopper', name: 'Grasshopper Linkage', icon: 'grasshopper', color: '#b8860b', desc: 'Approximate straight-line mechanism resembling a grasshopper leg. Used in early steam engine designs.' },
  { id: 'lambda', name: 'Lambda Linkage', icon: 'lambda', color: '#cd5c5c', desc: 'Five-bar linkage with lambda-shaped coupler providing approximate straight-line motion segments.' },
  { id: 'sarrus', name: 'Sarrus Linkage', icon: 'sarrus', color: '#4682b4', desc: 'Spatial mechanism producing exact straight-line motion using two hinged rectangular frames.' },
  { id: 'kempe', name: 'Kempe Linkage', icon: 'kempe', color: '#2e8b57', desc: 'Universal linkage that can trace any algebraic curve. Theoretical importance in kinematic synthesis.' },
  { id: 'klann', name: 'Klann Linkage (walking)', icon: 'klann', color: '#d2691e', desc: 'Walking mechanism that converts rotary motion to linear stepping. Used in walking robots and vehicles.' },
  { id: 'jansen', name: 'Jansen Linkage (walking)', icon: 'jansen', color: '#8fbc8f', desc: 'Eleven-bar walking mechanism with smooth gait. Used in the famous Strandbeest kinetic sculptures.' },
  { id: 'theo-jansen', name: 'Theo Jansen Strandbeest', icon: 'theo-jansen', color: '#9400d3', desc: 'Optimized walking mechanism by Theo Jansen, producing lifelike walking motion with minimal energy.' },
  { id: 'bennett', name: 'Bennett Linkage (3D)', icon: 'bennett', color: '#c71585', desc: 'Only overconstrained spatial 4-bar linkage with revolute joints. Moves despite having fewer constraints than needed.' },
  { id: 'bricard', name: 'Bricard Linkage (3D)', icon: 'bricard', color: '#00ced1', desc: 'Overconstrained spatial 6-bar linkage with interesting mobility properties not predicted by Grübler criterion.' },
  { id: 'wobble-plate', name: 'Wobble Plate Mechanism', icon: 'wobble-plate', color: '#ff8c00', desc: 'Tilting plate converts axial motion to rotary motion or vice versa. Used in axial piston pumps and motors.' },
  { id: 'scotch-yoke-var', name: 'Scotch Yoke Variant', icon: 'scotch-yoke-var', color: '#6a5acd', desc: 'Modified Scotch yoke mechanism with improved bearing arrangement for reduced friction and wear.' },
  { id: 'elliptic-trammel', name: 'Elliptic Trammel', icon: 'elliptic-trammel', color: '#3cb371', desc: 'Draws perfect ellipses. Two pins slide in perpendicular slots while a third point traces the ellipse.' },
  { id: 'drag-link', name: 'Drag Link Mechanism', icon: 'drag-link', color: '#dc143c', desc: 'Four-bar linkage where both cranks rotate fully. Used to convert uniform rotation to variable speed output.' },
  { id: 'quick-return', name: 'Quick-Return Mechanism', icon: 'quick-return', color: '#4169e1', desc: 'General mechanism producing faster return stroke than forward stroke, saving time in machining operations.' },
  { id: 'toggle-clamp', name: 'Toggle Clamp Mechanism', icon: 'toggle-clamp', color: '#228b22', desc: 'Self-locking clamp mechanism providing high holding force with minimal input. Used in fixtures and jigs.' },
  { id: 'straight-line', name: 'Straight-Line Mechanism', icon: 'straight-line', color: '#b22222', desc: 'General category of linkages designed to produce exact or approximate straight-line motion paths.' },
];

// ─── Logic Gate Data ───
interface GateInfo { type: string; label: string; inputs: number; compute: (inputs: boolean[]) => boolean; }
const GATES: GateInfo[] = [
  { type: 'AND', label: 'AND', inputs: 2, compute: (a) => a[0] && a[1] },
  { type: 'OR', label: 'OR', inputs: 2, compute: (a) => a[0] || a[1] },
  { type: 'NOT', label: 'NOT', inputs: 1, compute: (a) => !a[0] },
  { type: 'NAND', label: 'NAND', inputs: 2, compute: (a) => !(a[0] && a[1]) },
  { type: 'NOR', label: 'NOR', inputs: 2, compute: (a) => !(a[0] || a[1]) },
  { type: 'XOR', label: 'XOR', inputs: 2, compute: (a) => a[0] !== a[1] },
  { type: 'XNOR', label: 'XNOR', inputs: 2, compute: (a) => a[0] === a[1] },
  { type: 'WIRE', label: 'WIRE', inputs: 1, compute: (a) => a[0] },
];

// ─── SVG Helpers ───
function gearPath(cx: number, cy: number, teeth: number, outerR: number, innerR: number): string {
  const pts: string[] = [];
  for (let i = 0; i < teeth; i++) {
    const a1 = (i / teeth) * Math.PI * 2;
    const a2 = ((i + 0.35) / teeth) * Math.PI * 2;
    const a3 = ((i + 0.5) / teeth) * Math.PI * 2;
    const a4 = ((i + 0.85) / teeth) * Math.PI * 2;
    pts.push(`${cx + innerR * Math.cos(a1)},${cy + innerR * Math.sin(a1)}`);
    pts.push(`${cx + outerR * Math.cos(a2)},${cy + outerR * Math.sin(a2)}`);
    pts.push(`${cx + outerR * Math.cos(a3)},${cy + outerR * Math.sin(a3)}`);
    pts.push(`${cx + innerR * Math.cos(a4)},${cy + innerR * Math.sin(a4)}`);
  }
  return `M${pts.join(' L')} Z`;
}

function colorToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}

function B(x1: number, y1: number, x2: number, y2: number, color: string): JSX.Element {
  return <line x1={x1 * 100} y1={y1 * 100} x2={x2 * 100} y2={y2 * 100} stroke={color} strokeWidth="4" strokeLinecap="round" />;
}
function J(x: number, y: number, color: string): JSX.Element {
  return <circle cx={x * 100} cy={y * 100} r="5" fill={color} />;
}
function FP(x: number, y: number, color: string): JSX.Element {
  return <polygon points={`${x * 100},${y * 100 - 12} ${x * 100 - 8},${y * 100 + 4} ${x * 100 + 8},${y * 100 + 4}`} fill="none" stroke={color} strokeWidth="2.5" />;
}
function Rail(x1: number, x2: number, y: number, color: string): JSX.Element {
  return <rect x={x1 * 100} y={y * 100 - 4} width={(x2 - x1) * 100} height="8" fill="none" stroke={color} strokeWidth="2" rx="2" />;
}
function Slider(x: number, y: number, color: string): JSX.Element {
  return <rect x={x * 100 - 8} y={y * 100 - 8} width="16" height="16" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="2" rx="2" />;
}

// ─── GearIconSVG ───
function GearIconSVG({ icon, color }: { icon: string; color: string }) {
  const c = color;
  const d = colorToRgb(color);
  const filter = `drop-shadow(0 0 3px rgba(${d},0.4))`;
  const base = { width: 48, height: 48, viewBox: '0 0 100 100', style: { filter } as React.CSSProperties };

  switch (icon) {
    case 'spur': return <svg {...base}><path d={gearPath(50, 50, 12, 44, 34)} fill="none" stroke={c} strokeWidth="2.5" /><circle cx={50} cy={50} r={8} fill="none" stroke={c} strokeWidth="2" /></svg>;
    case 'helical': return <svg {...base}><path d={gearPath(50, 50, 12, 44, 34)} fill="none" stroke={c} strokeWidth="2.5" strokeDasharray="4 3" /><circle cx={50} cy={50} r={8} fill="none" stroke={c} strokeWidth="2" /></svg>;
    case 'double-helical': return <svg {...base}><path d={gearPath(50, 50, 12, 44, 34)} fill="none" stroke={c} strokeWidth="2" /><path d={gearPath(50, 50, 12, 40, 30)} fill="none" stroke={c} strokeWidth="1.5" strokeDasharray="2 2" /><circle cx={50} cy={50} r={6} fill="none" stroke={c} strokeWidth="2" /></svg>;
    case 'bevel': return <svg {...base}><ellipse cx={50} cy={50} rx={38} ry={28} fill="none" stroke={c} strokeWidth="2.5" /><line x1={20} y1={50} x2={80} y2={50} stroke={c} strokeWidth="1.5" strokeDasharray="3 3" /><circle cx={50} cy={50} r={6} fill={c} fillOpacity="0.3" /></svg>;
    case 'spiral-bevel': return <svg {...base}><ellipse cx={50} cy={50} rx={38} ry={28} fill="none" stroke={c} strokeWidth="2.5" /><path d="M20,50 Q50,35 80,50" fill="none" stroke={c} strokeWidth="1.5" /><path d="M20,50 Q50,65 80,50" fill="none" stroke={c} strokeWidth="1.5" /><circle cx={50} cy={50} r={5} fill={c} fillOpacity="0.3" /></svg>;
    case 'zerol-bevel': return <svg {...base}><ellipse cx={50} cy={50} rx={38} ry={28} fill="none" stroke={c} strokeWidth="2.5" /><circle cx={50} cy={50} r={6} fill={c} fillOpacity="0.3" /><line x1={50} y1={22} x2={50} y2={78} stroke={c} strokeWidth="1.5" strokeDasharray="2 2" /></svg>;
    case 'hypoid': return <svg {...base}><ellipse cx={50} cy={50} rx={38} ry={28} fill="none" stroke={c} strokeWidth="2.5" /><ellipse cx={55} cy={45} rx={16} ry={12} fill="none" stroke={c} strokeWidth="2" strokeDasharray="3 2" /><circle cx={55} cy={45} r={3} fill={c} /></svg>;
    case 'worm': return <svg {...base}><rect x={15} y={35} width={70} height={30} rx={15} fill="none" stroke={c} strokeWidth="2.5" /><path d="M20,42 Q30,35 40,42 Q50,49 60,42 Q70,35 80,42" fill="none" stroke={c} strokeWidth="1.5" /><path d="M20,58 Q30,51 40,58 Q50,65 60,58 Q70,51 80,58" fill="none" stroke={c} strokeWidth="1.5" /></svg>;
    case 'worm-wheel': return <svg {...base}><path d={gearPath(50, 50, 16, 44, 36)} fill="none" stroke={c} strokeWidth="2" /><circle cx={50} cy={50} r={10} fill="none" stroke={c} strokeWidth="2" /><circle cx={50} cy={50} r={3} fill={c} /></svg>;
    case 'rack': return <svg {...base}><rect x={10} y={55} width={80} height={15} fill="none" stroke={c} strokeWidth="2" rx="2" /><line x1={18} y1={55} x2={18} y2={48} stroke={c} strokeWidth="2" /><line x1={30} y1={55} x2={30} y2={48} stroke={c} strokeWidth="2" /><line x1={42} y1={55} x2={42} y2={48} stroke={c} strokeWidth="2" /><line x1={54} y1={55} x2={54} y2={48} stroke={c} strokeWidth="2" /><line x1={66} y1={55} x2={66} y2={48} stroke={c} strokeWidth="2" /><line x1={78} y1={55} x2={78} y2={48} stroke={c} strokeWidth="2" /><circle cx={35} cy={35} r={14} fill="none" stroke={c} strokeWidth="2" /><circle cx={35} cy={35} r={3} fill={c} /></svg>;
    case 'internal': return <svg {...base}><circle cx={50} cy={50} r={42} fill="none" stroke={c} strokeWidth="2.5" /><path d={gearPath(50, 50, 16, 36, 42)} fill="none" stroke={c} strokeWidth="1.5" /><circle cx={50} cy={50} r={8} fill={c} fillOpacity="0.2" stroke={c} strokeWidth="1.5" /></svg>;
    case 'planetary': return <svg {...base}><circle cx={50} cy={50} r={40} fill="none" stroke={c} strokeWidth="2" /><circle cx={50} cy={30} r={10} fill="none" stroke={c} strokeWidth="2" /><circle cx={67} cy={60} r={10} fill="none" stroke={c} strokeWidth="2" /><circle cx={33} cy={60} r={10} fill="none" stroke={c} strokeWidth="2" /><circle cx={50} cy={50} r={5} fill={c} fillOpacity="0.4" /></svg>;
    case 'sun': return <svg {...base}><path d={gearPath(50, 50, 10, 44, 36)} fill="none" stroke={c} strokeWidth="2.5" /><circle cx={50} cy={50} r={14} fill={c} fillOpacity="0.2" stroke={c} strokeWidth="2" /></svg>;
    case 'ring-gear': return <svg {...base}><circle cx={50} cy={50} r={42} fill="none" stroke={c} strokeWidth="2.5" /><path d={gearPath(50, 50, 14, 34, 42)} fill="none" stroke={c} strokeWidth="1.5" /></svg>;
    case 'compound': return <svg {...base}><path d={gearPath(35, 50, 10, 30, 24)} fill="none" stroke={c} strokeWidth="2" /><path d={gearPath(65, 50, 14, 26, 20)} fill="none" stroke={c} strokeWidth="2" /><line x1={35} y1={50} x2={65} y2={50} stroke={c} strokeWidth="3" /></svg>;
    case 'idler': return <svg {...base}><path d={gearPath(50, 50, 8, 30, 24)} fill="none" stroke={c} strokeWidth="2" /><path d="M20,50 L20,30" fill="none" stroke={c} strokeWidth="2" strokeDasharray="3 2" /><circle cx={20} cy={25} r={12} fill="none" stroke={c} strokeWidth="2" /><path d="M80,50 L80,30" fill="none" stroke={c} strokeWidth="2" strokeDasharray="3 2" /><circle cx={80} cy={25} r={12} fill="none" stroke={c} strokeWidth="2" /></svg>;
    case 'miter': return <svg {...base}><path d="M30,65 L50,35 L70,65 Z" fill="none" stroke={c} strokeWidth="2.5" /><line x1={30} y1={65} x2={70} y2={65} stroke={c} strokeWidth="2" /><circle cx={50} cy={50} r={4} fill={c} /></svg>;
    case 'crown': return <svg {...base}><path d="M25,55 Q50,20 75,55" fill="none" stroke={c} strokeWidth="2.5" /><line x1={25} y1={55} x2={25} y2={70} stroke={c} strokeWidth="2" /><line x1={35} y1={48} x2={35} y2={70} stroke={c} strokeWidth="2" /><line x1={45} y1={38} x2={45} y2={70} stroke={c} strokeWidth="2" /><line x1={55} y1={38} x2={55} y2={70} stroke={c} strokeWidth="2" /><line x1={65} y1={48} x2={65} y2={70} stroke={c} strokeWidth="2" /><line x1={75} y1={55} x2={75} y2={70} stroke={c} strokeWidth="2" /></svg>;
    case 'face': return <svg {...base}><ellipse cx={50} cy={50} rx={40} ry={20} fill="none" stroke={c} strokeWidth="2.5" /><circle cx={50} cy={50} r={6} fill={c} fillOpacity="0.3" /><line x1={14} y1={50} x2={86} y2={50} stroke={c} strokeWidth="1" strokeDasharray="2 3" /><line x1={50} y1={30} x2={50} y2={70} stroke={c} strokeWidth="1" strokeDasharray="2 3" /></svg>;
    case 'skew-bevel': return <svg {...base}><ellipse cx={45} cy={50} rx={30} ry={22} fill="none" stroke={c} strokeWidth="2" /><ellipse cx={60} cy={45} rx={20} ry={14} fill="none" stroke={c} strokeWidth="2" strokeDasharray="3 2" /><circle cx={45} cy={50} r={4} fill={c} /><circle cx={60} cy={45} r={3} fill={c} /></svg>;
    case 'crossed-helical': return <svg {...base}><path d={gearPath(35, 50, 8, 28, 22)} fill="none" stroke={c} strokeWidth="2" strokeDasharray="3 2" /><path d={gearPath(65, 50, 8, 28, 22)} fill="none" stroke={c} strokeWidth="2" strokeDasharray="3 2" /><line x1={35} y1={50} x2={15} y2={30} stroke={c} strokeWidth="2" /><line x1={65} y1={50} x2={85} y2={30} stroke={c} strokeWidth="2" /></svg>;
    case 'harmonic': return <svg {...base}><ellipse cx={50} cy={50} rx={40} ry={30} fill="none" stroke={c} strokeWidth="2" /><ellipse cx={50} cy={50} rx={34} ry={20} fill="none" stroke={c} strokeWidth="2" strokeDasharray="4 2" /><ellipse cx={50} cy={50} rx={14} ry={10} fill={c} fillOpacity="0.2" stroke={c} strokeWidth="1.5" /></svg>;
    case 'cycloidal': return <svg {...base}><circle cx={50} cy={50} r={38} fill="none" stroke={c} strokeWidth="2" /><circle cx={35} cy={42} r={14} fill="none" stroke={c} strokeWidth="2" strokeDasharray="2 2" /><circle cx={50} cy={50} r={5} fill={c} fillOpacity="0.3" /></svg>;
    case 'noncircular': return <svg {...base}><path d="M50,12 Q85,30 80,55 Q70,85 50,88 Q25,85 18,55 Q15,30 50,12 Z" fill="none" stroke={c} strokeWidth="2.5" /><circle cx={50} cy={50} r={5} fill={c} /></svg>;
    case 'elliptical': return <svg {...base}><ellipse cx={50} cy={50} rx={42} ry={28} fill="none" stroke={c} strokeWidth="2.5" /><circle cx={35} cy={50} r={3} fill={c} /><circle cx={65} cy={50} r={3} fill={c} /><circle cx={50} cy={50} r={4} fill={c} fillOpacity="0.3" /></svg>;
    case 'sector': return <svg {...base}><path d="M50,50 L20,25 A40,40 0 0,1 80,25 Z" fill={c} fillOpacity="0.15" stroke={c} strokeWidth="2.5" /><path d={gearPath(50, 50, 6, 44, 38)} fill="none" stroke={c} strokeWidth="1.5" clipPath="url(#sectorClip)" /><circle cx={50} cy={50} r={4} fill={c} /></svg>;
    case 'segment': return <svg {...base}><path d="M20,60 A35,35 0 0,1 80,60" fill="none" stroke={c} strokeWidth="2.5" /><line x1={20} y1={60} x2={80} y2={60} stroke={c} strokeWidth="2" /><line x1={28} y1={60} x2={28} y2={52} stroke={c} strokeWidth="2" /><line x1={40} y1={60} x2={40} y2={45} stroke={c} strokeWidth="2" /><line x1={52} y1={60} x2={52} y2={40} stroke={c} strokeWidth="2" /><line x1={64} y1={60} x2={64} y2={45} stroke={c} strokeWidth="2" /><line x1={72} y1={60} x2={72} y2={52} stroke={c} strokeWidth="2" /></svg>;
    case 'lantern': return <svg {...base}><circle cx={50} cy={50} r={38} fill="none" stroke={c} strokeWidth="2" /><circle cx={50} cy={14} r={4} fill={c} /><circle cx={83} cy={31} r={4} fill={c} /><circle cx={83} cy={69} r={4} fill={c} /><circle cx={50} cy={86} r={4} fill={c} /><circle cx={17} cy={69} r={4} fill={c} /><circle cx={17} cy={31} r={4} fill={c} /><circle cx={50} cy={50} r={8} fill="none" stroke={c} strokeWidth="2" /></svg>;
    case 'cage': return <svg {...base}><circle cx={50} cy={50} r={36} fill="none" stroke={c} strokeWidth="2" /><circle cx={50} cy={50} r={14} fill="none" stroke={c} strokeWidth="2" /><circle cx={50} cy={16} r={4} fill={c} /><circle cx={80} cy={35} r={4} fill={c} /><circle cx={80} cy={65} r={4} fill={c} /><circle cx={50} cy={84} r={4} fill={c} /><circle cx={20} cy={65} r={4} fill={c} /><circle cx={20} cy={35} r={4} fill={c} /><line x1={50} y1={16} x2={50} y2={36} stroke={c} strokeWidth="1.5" /><line x1={80} y1={35} x2={64} y2={43} stroke={c} strokeWidth="1.5" /><line x1={80} y1={65} x2={64} y2={57} stroke={c} strokeWidth="1.5" /><line x1={50} y1={84} x2={50} y2={64} stroke={c} strokeWidth="1.5" /><line x1={20} y1={65} x2={36} y2={57} stroke={c} strokeWidth="1.5" /><line x1={20} y1={35} x2={36} y2={43} stroke={c} strokeWidth="1.5" /></svg>;
    case 'sprocket': return <svg {...base}><path d={gearPath(50, 50, 14, 44, 36)} fill="none" stroke={c} strokeWidth="2.5" /><circle cx={50} cy={50} r={12} fill="none" stroke={c} strokeWidth="2" /><circle cx={50} cy={50} r={4} fill={c} /></svg>;
    case 'ratchet': return <svg {...base}><path d={gearPath(50, 50, 8, 44, 28)} fill="none" stroke={c} strokeWidth="2.5" /><circle cx={50} cy={50} r={8} fill="none" stroke={c} strokeWidth="2" /><path d="M72,22 L82,10 L88,24" fill="none" stroke={c} strokeWidth="2.5" strokeLinejoin="round" /></svg>;
    case 'geneva': return <svg {...base}><circle cx={35} cy={50} r={28} fill="none" stroke={c} strokeWidth="2" /><circle cx={70} cy={50} r={16} fill="none" stroke={c} strokeWidth="2" /><line x1={70} y1={34} x2={70} y2={50} stroke={c} strokeWidth="2" /><circle cx={70} cy={50} r={4} fill={c} /></svg>;
    case 'globoid': return <svg {...base}><path d="M20,50 Q50,25 80,50 Q50,75 20,50 Z" fill="none" stroke={c} strokeWidth="2.5" /><path d="M28,50 Q50,32 72,50" fill="none" stroke={c} strokeWidth="1.5" strokeDasharray="3 2" /><circle cx={50} cy={50} r={4} fill={c} /></svg>;
    case 'straight-bevel': return <svg {...base}><path d="M25,70 L50,30 L75,70 Z" fill="none" stroke={c} strokeWidth="2.5" /><line x1={32} y1={60} x2={68} y2={60} stroke={c} strokeWidth="1.5" /><line x1={38} y1={50} x2={62} y2={50} stroke={c} strokeWidth="1.5" /><circle cx={50} cy={50} r={4} fill={c} /></svg>;
    case 'conical': return <svg {...base}><path d="M30,70 L50,25 L70,70 Z" fill="none" stroke={c} strokeWidth="2.5" /><path d="M30,70 Q50,55 70,70" fill="none" stroke={c} strokeWidth="1.5" /><circle cx={50} cy={45} r={4} fill={c} fillOpacity="0.3" /></svg>;
    case 'magnetic': return <svg {...base}><circle cx={35} cy={50} r={22} fill="none" stroke={c} strokeWidth="2" /><circle cx={65} cy={50} r={16} fill="none" stroke={c} strokeWidth="2" strokeDasharray="4 3" /><path d="M42,35 L58,35" fill="none" stroke={c} strokeWidth="1.5" markerEnd="url(#arrowhead)" /><circle cx={35} cy={50} r={4} fill={c} fillOpacity="0.3" /><circle cx={65} cy={50} r={3} fill={c} fillOpacity="0.3" /></svg>;
    default: return <svg {...base}><circle cx={50} cy={50} r={38} fill="none" stroke={c} strokeWidth="2" /></svg>;
  }
}

// ─── LinkageIconSVG ───
function LinkageIconSVG({ icon, color }: { icon: string; color: string }) {
  const c = color;
  switch (icon) {
    case 'four-bar': return <svg width="48" height="48" viewBox="0 0 100 100">{FP(0.15, 0.8, c)}{FP(0.85, 0.8, c)}{B(0.15, 0.8, 0.15, 0.4, c)}{B(0.85, 0.8, 0.85, 0.4, c)}{B(0.15, 0.4, 0.85, 0.4, c)}{J(0.15, 0.4, c)}{J(0.85, 0.4, c)}{J(0.15, 0.8, c)}{J(0.85, 0.8, c)}</svg>;
    case 'slider-crank': return <svg width="48" height="48" viewBox="0 0 100 100">{FP(0.15, 0.8, c)}{B(0.15, 0.8, 0.4, 0.5, c)}{J(0.15, 0.8, c)}{J(0.4, 0.5, c)}{B(0.4, 0.5, 0.7, 0.65, c)}{J(0.7, 0.65, c)}{Slider(0.7, 0.65, c)}{Rail(0.55, 0.9, 0.65, c)}</svg>;
    case 'scotch-yoke': return <svg width="48" height="48" viewBox="0 0 100 100">{FP(0.2, 0.5, c)}{B(0.2, 0.5, 0.45, 0.35, c)}{J(0.2, 0.5, c)}{J(0.45, 0.35, c)}<rect x="38" y="22" width="18" height="56" fill="none" stroke={c} strokeWidth="2.5" rx="3" />{Slider(0.45, 0.35, c)}{B(0.5, 0.35, 0.85, 0.35, c)}{J(0.85, 0.35, c)}</svg>;
    case 'crank-rocker': return <svg width="48" height="48" viewBox="0 0 100 100">{FP(0.12, 0.8, c)}{FP(0.88, 0.8, c)}{B(0.12, 0.8, 0.3, 0.45, c)}{B(0.88, 0.8, 0.75, 0.35, c)}{B(0.3, 0.45, 0.75, 0.35, c)}{J(0.12, 0.8, c)}{J(0.88, 0.8, c)}{J(0.3, 0.45, c)}{J(0.75, 0.35, c)}</svg>;
    case 'double-crank': return <svg width="48" height="48" viewBox="0 0 100 100">{FP(0.15, 0.8, c)}{FP(0.85, 0.8, c)}{B(0.15, 0.8, 0.35, 0.4, c)}{B(0.85, 0.8, 0.65, 0.4, c)}{B(0.35, 0.4, 0.65, 0.4, c)}{J(0.15, 0.8, c)}{J(0.85, 0.8, c)}{J(0.35, 0.4, c)}{J(0.65, 0.4, c)}</svg>;
    case 'double-rocker': return <svg width="48" height="48" viewBox="0 0 100 100">{FP(0.15, 0.8, c)}{FP(0.85, 0.8, c)}{B(0.15, 0.8, 0.25, 0.5, c)}{B(0.85, 0.8, 0.75, 0.5, c)}{B(0.25, 0.5, 0.75, 0.5, c)}{J(0.15, 0.8, c)}{J(0.85, 0.8, c)}{J(0.25, 0.5, c)}{J(0.75, 0.5, c)}</svg>;
    case 'pantograph': return <svg width="48" height="48" viewBox="0 0 100 100">{FP(0.1, 0.85, c)}{B(0.1, 0.85, 0.4, 0.4, c)}{B(0.4, 0.4, 0.7, 0.2, c)}{B(0.4, 0.4, 0.9, 0.15, c)}{B(0.1, 0.85, 0.5, 0.7, c)}{B(0.5, 0.7, 0.9, 0.15, c)}{J(0.1, 0.85, c)}{J(0.4, 0.4, c)}{J(0.7, 0.2, c)}{J(0.9, 0.15, c)}{J(0.5, 0.7, c)}</svg>;
    case 'watt-1': return <svg width="48" height="48" viewBox="0 0 100 100">{FP(0.1, 0.85, c)}{FP(0.9, 0.85, c)}{B(0.1, 0.85, 0.3, 0.5, c)}{B(0.3, 0.5, 0.7, 0.5, c)}{B(0.7, 0.5, 0.9, 0.85, c)}{J(0.3, 0.5, c)}{J(0.7, 0.5, c)}{J(0.5, 0.35, c)}{B(0.3, 0.5, 0.5, 0.35, c)}{B(0.7, 0.5, 0.5, 0.35, c)}</svg>;
    case 'watt-2': return <svg width="48" height="48" viewBox="0 0 100 100">{FP(0.1, 0.85, c)}{FP(0.9, 0.85, c)}{B(0.1, 0.85, 0.3, 0.45, c)}{B(0.9, 0.85, 0.7, 0.45, c)}{B(0.3, 0.45, 0.5, 0.25, c)}{B(0.5, 0.25, 0.7, 0.45, c)}{J(0.3, 0.45, c)}{J(0.5, 0.25, c)}{J(0.7, 0.45, c)}</svg>;
    case 'chebyshev': return <svg width="48" height="48" viewBox="0 0 100 100">{FP(0.2, 0.85, c)}{FP(0.8, 0.85, c)}{B(0.2, 0.85, 0.35, 0.5, c)}{B(0.8, 0.85, 0.65, 0.5, c)}{B(0.35, 0.5, 0.5, 0.2, c)}{B(0.5, 0.2, 0.65, 0.5, c)}{J(0.2, 0.85, c)}{J(0.8, 0.85, c)}{J(0.35, 0.5, c)}{J(0.65, 0.5, c)}{J(0.5, 0.2, c)}</svg>;
    case 'peaucellier': return <svg width="48" height="48" viewBox="0 0 100 100">{FP(0.1, 0.6, c)}{B(0.1, 0.6, 0.4, 0.3, c)}{B(0.1, 0.6, 0.4, 0.7, c)}{B(0.4, 0.3, 0.7, 0.45, c)}{B(0.4, 0.7, 0.7, 0.55, c)}{B(0.4, 0.3, 0.4, 0.7, c)}{B(0.7, 0.45, 0.7, 0.55, c)}{J(0.1, 0.6, c)}{J(0.4, 0.3, c)}{J(0.4, 0.7, c)}{J(0.7, 0.45, c)}{J(0.7, 0.55, c)}</svg>;
    case 'roberts': return <svg width="48" height="48" viewBox="0 0 100 100">{FP(0.15, 0.85, c)}{FP(0.85, 0.85, c)}{B(0.15, 0.85, 0.4, 0.45, c)}{B(0.85, 0.85, 0.6, 0.45, c)}{B(0.4, 0.45, 0.6, 0.45, c)}{B(0.4, 0.45, 0.3, 0.2, c)}{B(0.6, 0.45, 0.7, 0.2, c)}{J(0.15, 0.85, c)}{J(0.85, 0.85, c)}{J(0.4, 0.45, c)}{J(0.6, 0.45, c)}</svg>;
    case 'hoekens': return <svg width="48" height="48" viewBox="0 0 100 100">{FP(0.2, 0.8, c)}{B(0.2, 0.8, 0.4, 0.4, c)}{J(0.2, 0.8, c)}{J(0.4, 0.4, c)}{B(0.4, 0.4, 0.75, 0.5, c)}{Slider(0.75, 0.5, c)}{Rail(0.6, 0.9, 0.5, c)}</svg>;
    case 'stephenson-1': return <svg width="48" height="48" viewBox="0 0 100 100">{FP(0.1, 0.85, c)}{FP(0.9, 0.85, c)}{B(0.1, 0.85, 0.25, 0.5, c)}{B(0.9, 0.85, 0.75, 0.5, c)}{B(0.25, 0.5, 0.5, 0.25, c)}{B(0.5, 0.25, 0.75, 0.5, c)}{B(0.25, 0.5, 0.75, 0.5, c)}{J(0.25, 0.5, c)}{J(0.5, 0.25, c)}{J(0.75, 0.5, c)}</svg>;
    case 'stephenson-2': return <svg width="48" height="48" viewBox="0 0 100 100">{FP(0.1, 0.85, c)}{FP(0.9, 0.85, c)}{B(0.1, 0.85, 0.3, 0.5, c)}{B(0.9, 0.85, 0.7, 0.5, c)}{B(0.3, 0.5, 0.5, 0.3, c)}{B(0.5, 0.3, 0.7, 0.5, c)}{B(0.5, 0.3, 0.5, 0.15, c)}{J(0.3, 0.5, c)}{J(0.5, 0.3, c)}{J(0.7, 0.5, c)}{J(0.5, 0.15, c)}</svg>;
    case 'stephenson-3': return <svg width="48" height="48" viewBox="0 0 100 100">{FP(0.1, 0.85, c)}{FP(0.9, 0.85, c)}{B(0.1, 0.85, 0.3, 0.5, c)}{B(0.9, 0.85, 0.7, 0.5, c)}{B(0.3, 0.5, 0.5, 0.3, c)}{B(0.5, 0.3, 0.7, 0.5, c)}{B(0.3, 0.5, 0.7, 0.5, c)}{J(0.3, 0.5, c)}{J(0.5, 0.3, c)}{J(0.7, 0.5, c)}</svg>;
    case 'watt-six-1': return <svg width="48" height="48" viewBox="0 0 100 100">{FP(0.1, 0.85, c)}{FP(0.9, 0.85, c)}{B(0.1, 0.85, 0.25, 0.5, c)}{B(0.25, 0.5, 0.5, 0.25, c)}{B(0.5, 0.25, 0.75, 0.5, c)}{B(0.75, 0.5, 0.9, 0.85, c)}{B(0.25, 0.5, 0.75, 0.5, c)}{J(0.25, 0.5, c)}{J(0.5, 0.25, c)}{J(0.75, 0.5, c)}</svg>;
    case 'watt-six-2': return <svg width="48" height="48" viewBox="0 0 100 100">{FP(0.1, 0.85, c)}{FP(0.9, 0.85, c)}{B(0.1, 0.85, 0.3, 0.5, c)}{B(0.9, 0.85, 0.7, 0.5, c)}{B(0.3, 0.5, 0.5, 0.3, c)}{B(0.5, 0.3, 0.7, 0.5, c)}{B(0.5, 0.3, 0.5, 0.1, c)}{J(0.3, 0.5, c)}{J(0.5, 0.3, c)}{J(0.7, 0.5, c)}{J(0.5, 0.1, c)}</svg>;
    case 'toggle': return <svg width="48" height="48" viewBox="0 0 100 100">{FP(0.15, 0.85, c)}{FP(0.85, 0.85, c)}{B(0.15, 0.85, 0.5, 0.4, c)}{B(0.85, 0.85, 0.5, 0.4, c)}{B(0.5, 0.4, 0.5, 0.15, c)}{J(0.15, 0.85, c)}{J(0.85, 0.85, c)}{J(0.5, 0.4, c)}</svg>;
    case 'oldham': return <svg width="48" height="48" viewBox="0 0 100 100"><circle cx="28" cy="50" r="14" fill="none" stroke={c} strokeWidth="2" /><circle cx="72" cy="50" r="14" fill="none" stroke={c} strokeWidth="2" /><rect x="38" y="42" width="24" height="16" fill={c} fillOpacity="0.2" stroke={c} strokeWidth="2" rx="2" />{J(0.28, 0.5, c)}{J(0.72, 0.5, c)}<line x1="28" y1="50" x2="14" y2="50" stroke={c} strokeWidth="2" /><line x1="72" y1="50" x2="86" y2="50" stroke={c} strokeWidth="2" /></svg>;
    case 'hook': return <svg width="48" height="48" viewBox="0 0 100 100">{B(0.15, 0.5, 0.5, 0.5, c)}{B(0.5, 0.5, 0.85, 0.5, c)}{J(0.5, 0.5, c)}<circle cx="50" cy="50" r="10" fill="none" stroke={c} strokeWidth="2" />{J(0.15, 0.5, c)}{J(0.85, 0.5, c)}<line x1="50" y1="40" x2="50" y2="60" stroke={c} strokeWidth="2" /></svg>;
    case 'rzeppa': return <svg width="48" height="48" viewBox="0 0 100 100"><circle cx="50" cy="50" r="30" fill="none" stroke={c} strokeWidth="2" /><circle cx="50" cy="50" r="12" fill="none" stroke={c} strokeWidth="2" /><circle cx="38" cy="38" r="4" fill={c} /><circle cx="62" cy="38" r="4" fill={c} /><circle cx="38" cy="62" r="4" fill={c} /><circle cx="62" cy="62" r="4" fill={c} /><line x1="50" y1="50" x2="20" y2="50" stroke={c} strokeWidth="2" /><line x1="50" y1="50" x2="80" y2="50" stroke={c} strokeWidth="2" /></svg>;
    case 'tripode': return <svg width="48" height="48" viewBox="0 0 100 100"><circle cx="50" cy="50" r="28" fill="none" stroke={c} strokeWidth="2" />{B(0.5, 0.5, 0.5, 0.22, c)}{B(0.5, 0.5, 0.26, 0.64, c)}{B(0.5, 0.5, 0.74, 0.64, c)}{J(0.5, 0.5, c)}{J(0.5, 0.22, c)}{J(0.26, 0.64, c)}{J(0.74, 0.64, c)}</svg>;
    case 'double-cardan': return <svg width="48" height="48" viewBox="0 0 100 100">{B(0.1, 0.5, 0.35, 0.5, c)}{B(0.35, 0.5, 0.65, 0.5, c)}{B(0.65, 0.5, 0.9, 0.5, c)}{J(0.1, 0.5, c)}{J(0.35, 0.5, c)}{J(0.5, 0.5, c)}{J(0.65, 0.5, c)}{J(0.9, 0.5, c)}<circle cx="35" cy="50" r="6" fill="none" stroke={c} strokeWidth="1.5" /><circle cx="65" cy="50" r="6" fill="none" stroke={c} strokeWidth="1.5" /></svg>;
    case 'bellcrank': return <svg width="48" height="48" viewBox="0 0 100 100">{B(0.2, 0.3, 0.5, 0.5, c)}{B(0.5, 0.5, 0.8, 0.7, c)}{B(0.5, 0.5, 0.5, 0.85, c)}{J(0.2, 0.3, c)}{J(0.8, 0.7, c)}{J(0.5, 0.85, c)}{FP(0.5, 0.5, c)}</svg>;
    case 'rack-link': return <svg width="48" height="48" viewBox="0 0 100 100"><circle cx="40" cy="35" r="14" fill="none" stroke={c} strokeWidth="2" />{J(0.4, 0.35, c)}<rect x="20" y="58" width="60" height="10" fill="none" stroke={c} strokeWidth="2" rx="2" /><line x1="28" y1="58" x2="28" y2="52" stroke={c} strokeWidth="2" /><line x1="40" y1="58" x2="40" y2="52" stroke={c} strokeWidth="2" /><line x1="52" y1="58" x2="52" y2="52" stroke={c} strokeWidth="2" /><line x1="64" y1="58" x2="64" y2="52" stroke={c} strokeWidth="2" /></svg>;
    case 'cam-link': return <svg width="48" height="48" viewBox="0 0 100 100"><ellipse cx="35" cy="50" rx="22" ry="16" fill={c} fillOpacity="0.15" stroke={c} strokeWidth="2" />{B(0.6, 0.4, 0.85, 0.3, c)}{Slider(0.6, 0.4, c)}{J(0.6, 0.4, c)}{J(0.85, 0.3, c)}{J(0.35, 0.5, c)}</svg>;
    case 'whitworth': return <svg width="48" height="48" viewBox="0 0 100 100">{FP(0.2, 0.8, c)}{B(0.2, 0.8, 0.35, 0.45, c)}{J(0.2, 0.8, c)}{J(0.35, 0.45, c)}{B(0.35, 0.45, 0.6, 0.25, c)}{J(0.6, 0.25, c)}{B(0.6, 0.25, 0.85, 0.15, c)}{J(0.85, 0.15, c)}{B(0.35, 0.45, 0.5, 0.8, c)}{J(0.5, 0.8, c)}</svg>;
    case 'crank-shaper': return <svg width="48" height="48" viewBox="0 0 100 100">{FP(0.2, 0.7, c)}{B(0.2, 0.7, 0.35, 0.4, c)}{J(0.2, 0.7, c)}{J(0.35, 0.4, c)}<rect x="28" y="20" width="10" height="60" fill="none" stroke={c} strokeWidth="2" rx="2" />{B(0.35, 0.4, 0.75, 0.35, c)}{Slider(0.35, 0.4, c)}{J(0.75, 0.35, c)}</svg>;
    case 'grasshopper': return <svg width="48" height="48" viewBox="0 0 100 100">{FP(0.15, 0.85, c)}{B(0.15, 0.85, 0.35, 0.5, c)}{J(0.15, 0.85, c)}{J(0.35, 0.5, c)}{B(0.35, 0.5, 0.65, 0.35, c)}{J(0.65, 0.35, c)}{B(0.65, 0.35, 0.85, 0.2, c)}{J(0.85, 0.2, c)}{B(0.35, 0.5, 0.25, 0.2, c)}{J(0.25, 0.2, c)}</svg>;
    case 'lambda': return <svg width="48" height="48" viewBox="0 0 100 100">{FP(0.15, 0.85, c)}{FP(0.85, 0.85, c)}{B(0.15, 0.85, 0.3, 0.45, c)}{B(0.85, 0.85, 0.7, 0.45, c)}{B(0.3, 0.45, 0.5, 0.15, c)}{B(0.5, 0.15, 0.7, 0.45, c)}{B(0.3, 0.45, 0.7, 0.45, c)}{J(0.15, 0.85, c)}{J(0.85, 0.85, c)}{J(0.3, 0.45, c)}{J(0.7, 0.45, c)}{J(0.5, 0.15, c)}</svg>;
    case 'sarrus': return <svg width="48" height="48" viewBox="0 0 100 100"><rect x="10" y="60" width="35" height="8" fill="none" stroke={c} strokeWidth="2" rx="2" /><rect x="55" y="60" width="35" height="8" fill="none" stroke={c} strokeWidth="2" rx="2" />{B(0.25, 0.6, 0.35, 0.3, c)}{B(0.75, 0.6, 0.65, 0.3, c)}{B(0.35, 0.3, 0.65, 0.3, c)}{J(0.35, 0.3, c)}{J(0.65, 0.3, c)}</svg>;
    case 'kempe': return <svg width="48" height="48" viewBox="0 0 100 100">{FP(0.1, 0.85, c)}{FP(0.9, 0.85, c)}{B(0.1, 0.85, 0.3, 0.5, c)}{B(0.3, 0.5, 0.5, 0.2, c)}{B(0.5, 0.2, 0.7, 0.5, c)}{B(0.7, 0.5, 0.9, 0.85, c)}{B(0.3, 0.5, 0.7, 0.5, c)}{B(0.3, 0.5, 0.5, 0.7, c)}{B(0.7, 0.5, 0.5, 0.7, c)}{J(0.3, 0.5, c)}{J(0.5, 0.2, c)}{J(0.7, 0.5, c)}{J(0.5, 0.7, c)}</svg>;
    case 'klann': return <svg width="48" height="48" viewBox="0 0 100 100">{FP(0.5, 0.85, c)}{B(0.5, 0.85, 0.35, 0.55, c)}{B(0.5, 0.85, 0.65, 0.55, c)}{B(0.35, 0.55, 0.25, 0.25, c)}{B(0.65, 0.55, 0.75, 0.25, c)}{B(0.25, 0.25, 0.75, 0.25, c)}{J(0.5, 0.85, c)}{J(0.35, 0.55, c)}{J(0.65, 0.55, c)}{J(0.25, 0.25, c)}{J(0.75, 0.25, c)}</svg>;
    case 'jansen': return <svg width="48" height="48" viewBox="0 0 100 100">{FP(0.5, 0.85, c)}{B(0.5, 0.85, 0.4, 0.6, c)}{B(0.5, 0.85, 0.6, 0.6, c)}{B(0.4, 0.6, 0.3, 0.35, c)}{B(0.6, 0.6, 0.7, 0.35, c)}{B(0.3, 0.35, 0.2, 0.15, c)}{B(0.7, 0.35, 0.8, 0.15, c)}{B(0.2, 0.15, 0.8, 0.15, c)}{J(0.5, 0.85, c)}{J(0.4, 0.6, c)}{J(0.6, 0.6, c)}{J(0.3, 0.35, c)}{J(0.7, 0.35, c)}{J(0.2, 0.15, c)}{J(0.8, 0.15, c)}</svg>;
    case 'theo-jansen': return <svg width="48" height="48" viewBox="0 0 100 100">{FP(0.5, 0.85, c)}{B(0.5, 0.85, 0.35, 0.6, c)}{B(0.5, 0.85, 0.65, 0.6, c)}{B(0.35, 0.6, 0.2, 0.3, c)}{B(0.65, 0.6, 0.8, 0.3, c)}{B(0.2, 0.3, 0.15, 0.1, c)}{B(0.8, 0.3, 0.85, 0.1, c)}{B(0.15, 0.1, 0.85, 0.1, c)}{B(0.35, 0.6, 0.65, 0.6, c)}{J(0.5, 0.85, c)}{J(0.35, 0.6, c)}{J(0.65, 0.6, c)}{J(0.2, 0.3, c)}{J(0.8, 0.3, c)}{J(0.15, 0.1, c)}{J(0.85, 0.1, c)}</svg>;
    case 'bennett': return <svg width="48" height="48" viewBox="0 0 100 100">{B(0.15, 0.8, 0.35, 0.35, c)}{B(0.35, 0.35, 0.75, 0.25, c)}{B(0.75, 0.25, 0.85, 0.7, c)}{B(0.85, 0.7, 0.15, 0.8, c)}{J(0.15, 0.8, c)}{J(0.35, 0.35, c)}{J(0.75, 0.25, c)}{J(0.85, 0.7, c)}<text x="50" y="98" fontSize="8" fill={c} textAnchor="middle" fontFamily="Inter">3D</text></svg>;
    case 'bricard': return <svg width="48" height="48" viewBox="0 0 100 100">{B(0.15, 0.8, 0.35, 0.35, c)}{B(0.35, 0.35, 0.65, 0.2, c)}{B(0.65, 0.2, 0.85, 0.7, c)}{B(0.85, 0.7, 0.65, 0.85, c)}{B(0.65, 0.85, 0.15, 0.8, c)}{B(0.35, 0.35, 0.65, 0.85, c)}{J(0.15, 0.8, c)}{J(0.35, 0.35, c)}{J(0.65, 0.2, c)}{J(0.85, 0.7, c)}{J(0.65, 0.85, c)}<text x="50" y="98" fontSize="8" fill={c} textAnchor="middle" fontFamily="Inter">3D</text></svg>;
    case 'wobble-plate': return <svg width="48" height="48" viewBox="0 0 100 100"><ellipse cx="50" cy="50" rx="38" ry="12" fill="none" stroke={c} strokeWidth="2" /><line x1="50" y1="38" x2="50" y2="62" stroke={c} strokeWidth="2" /><ellipse cx="50" cy="44" rx="30" ry="8" fill="none" stroke={c} strokeWidth="1.5" strokeDasharray="3 2" /><circle cx="50" cy="50" r="4" fill={c} /><line x1="50" y1="50" x2="50" y2="85" stroke={c} strokeWidth="2.5" /></svg>;
    case 'scotch-yoke-var': return <svg width="48" height="48" viewBox="0 0 100 100">{FP(0.2, 0.5, c)}{B(0.2, 0.5, 0.4, 0.5, c)}{J(0.2, 0.5, c)}<circle cx="40" cy="50" r="8" fill="none" stroke={c} strokeWidth="2" />{J(0.4, 0.5, c)}<rect x="32" y="25" width="16" height="50" fill="none" stroke={c} strokeWidth="2" rx="3" />{B(0.5, 0.5, 0.85, 0.5, c)}{J(0.85, 0.5, c)}</svg>;
    case 'elliptic-trammel': return <svg width="48" height="48" viewBox="0 0 100 100">{Rail(0.1, 0.9, 0.5, c)}<line x1="50" y1="10" x2="50" y2="90" stroke={c} strokeWidth="2" strokeDasharray="3 3" />{B(0.3, 0.5, 0.7, 0.35, c)}{J(0.3, 0.5, c)}{J(0.7, 0.35, c)}{Slider(0.3, 0.5, c)}<circle cx="70" cy="35" r="3" fill={c} /><circle cx="30" cy="50" r="3" fill={c} /></svg>;
    case 'drag-link': return <svg width="48" height="48" viewBox="0 0 100 100">{FP(0.15, 0.8, c)}{FP(0.85, 0.8, c)}{B(0.15, 0.8, 0.35, 0.4, c)}{B(0.85, 0.8, 0.65, 0.4, c)}{B(0.35, 0.4, 0.65, 0.4, c)}{J(0.15, 0.8, c)}{J(0.85, 0.8, c)}{J(0.35, 0.4, c)}{J(0.65, 0.4, c)}<path d="M22,60 A12,12 0 1,1 22,40" fill="none" stroke={c} strokeWidth="1.5" strokeDasharray="2 2" /></svg>;
    case 'quick-return': return <svg width="48" height="48" viewBox="0 0 100 100">{FP(0.2, 0.75, c)}{B(0.2, 0.75, 0.4, 0.4, c)}{J(0.2, 0.75, c)}{J(0.4, 0.4, c)}{B(0.4, 0.4, 0.8, 0.25, c)}{J(0.8, 0.25, c)}{B(0.4, 0.4, 0.5, 0.85, c)}{J(0.5, 0.85, c)}</svg>;
    case 'toggle-clamp': return <svg width="48" height="48" viewBox="0 0 100 100">{FP(0.2, 0.85, c)}{B(0.2, 0.85, 0.5, 0.45, c)}{J(0.2, 0.85, c)}{J(0.5, 0.45, c)}{B(0.5, 0.45, 0.8, 0.45, c)}{J(0.8, 0.45, c)}<rect x="10" y="82" width="30" height="6" fill={c} fillOpacity="0.3" stroke={c} strokeWidth="1.5" rx="1" /></svg>;
    case 'straight-line': return <svg width="48" height="48" viewBox="0 0 100 100">{FP(0.15, 0.85, c)}{FP(0.85, 0.85, c)}{B(0.15, 0.85, 0.3, 0.5, c)}{B(0.85, 0.85, 0.7, 0.5, c)}{B(0.3, 0.5, 0.7, 0.5, c)}{B(0.3, 0.5, 0.5, 0.15, c)}{J(0.15, 0.85, c)}{J(0.85, 0.85, c)}{J(0.3, 0.5, c)}{J(0.7, 0.5, c)}{J(0.5, 0.15, c)}<line x1="50" y1="15" x2="50" y2="5" stroke={c} strokeWidth="2" strokeDasharray="2 2" /></svg>;
    default: return <svg width="48" height="48" viewBox="0 0 100 100"><circle cx="50" cy="50" r="30" fill="none" stroke={c} strokeWidth="2" /></svg>;
  }
}

// ─── Logic Gate SVGs ───
function GateSVG({ type, active }: { type: string; active: boolean }) {
  const c = active ? '#60a5fa' : '#2d3f55';
  const fill = active ? 'rgba(96,165,250,0.15)' : 'none';
  switch (type) {
    case 'AND': return <svg width="80" height="60" viewBox="0 0 80 60"><path d="M5,5 L30,5 C50,5 65,15 65,30 C65,45 50,55 30,55 L5,55 Z" fill={fill} stroke={c} strokeWidth="2.5" /></svg>;
    case 'OR': return <svg width="80" height="60" viewBox="0 0 80 60"><path d="M5,5 C20,5 35,5 50,12 C62,18 72,22 75,30 C72,38 62,42 50,48 C35,55 20,55 5,55 C20,40 20,20 5,5 Z" fill={fill} stroke={c} strokeWidth="2.5" /></svg>;
    case 'NOT': return <svg width="70" height="60" viewBox="0 0 70 60"><path d="M5,5 L5,55 L50,30 Z" fill={fill} stroke={c} strokeWidth="2.5" /><circle cx="58" cy="30" r="6" fill={fill} stroke={c} strokeWidth="2" /></svg>;
    case 'NAND': return <svg width="88" height="60" viewBox="0 0 88 60"><path d="M5,5 L30,5 C48,5 60,15 60,30 C60,45 48,55 30,55 L5,55 Z" fill={fill} stroke={c} strokeWidth="2.5" /><circle cx="68" cy="30" r="6" fill={fill} stroke={c} strokeWidth="2" /></svg>;
    case 'NOR': return <svg width="88" height="60" viewBox="0 0 88 60"><path d="M5,5 C20,5 32,5 45,12 C55,18 60,22 63,28" fill="none" stroke={c} strokeWidth="2" /><path d="M5,5 C20,5 35,5 50,12 C60,17 65,22 68,30 C65,38 60,43 50,48 C35,55 20,55 5,55 C20,40 20,20 5,5 Z" fill={fill} stroke={c} strokeWidth="2.5" /><circle cx="76" cy="30" r="6" fill={fill} stroke={c} strokeWidth="2" /></svg>;
    case 'XOR': return <svg width="84" height="60" viewBox="0 0 84 60"><path d="M12,5 C27,5 42,5 55,12 C65,17 72,22 75,30 C72,38 65,43 55,48 C42,55 27,55 12,55 C27,40 27,20 12,5 Z" fill={fill} stroke={c} strokeWidth="2.5" /><path d="M5,5 C8,20 8,40 5,55" fill="none" stroke={c} strokeWidth="2.5" /></svg>;
    case 'XNOR': return <svg width="92" height="60" viewBox="0 0 92 60"><path d="M12,5 C27,5 38,5 48,12 C56,17 62,22 65,28" fill="none" stroke={c} strokeWidth="2" /><path d="M12,5 C27,5 40,5 52,12 C62,17 68,22 70,30 C68,38 62,43 52,48 C40,55 27,55 12,55 C27,40 27,20 12,5 Z" fill={fill} stroke={c} strokeWidth="2.5" /><circle cx="78" cy="30" r="6" fill={fill} stroke={c} strokeWidth="2" /><path d="M5,5 C8,20 8,40 5,55" fill="none" stroke={c} strokeWidth="2.5" /></svg>;
    case 'WIRE': return <svg width="80" height="20" viewBox="0 0 80 20"><line x1="0" y1="10" x2="80" y2="10" stroke={c} strokeWidth="3" /></svg>;
    default: return <svg width="60" height="60"><circle cx="30" cy="30" r="25" fill="none" stroke={c} strokeWidth="2" /></svg>;
  }
}

// ─── Logic Gate Card Component ───
function LogicGateCard({ gate }: { gate: GateInfo }) {
  const [inputs, setInputs] = useState<boolean[]>(Array(gate.inputs).fill(false));
  const output = gate.compute(inputs);
  const isActive = inputs.some(Boolean);

  const toggle = (i: number) => {
    setInputs(prev => { const n = [...prev]; n[i] = !n[i]; return n; });
  };

  const labels = gate.inputs === 1 ? ['A'] : ['A', 'B'];

  return (
    <div style={{ background: '#161b22', border: '2px solid #2d3f55', borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, animation: 'fadeIn 0.3s ease' } as React.CSSProperties}>
      <div style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 700, fontSize: 14, color: '#60a5fa', letterSpacing: 2 } as React.CSSProperties}>{gate.label}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', justifyContent: 'center' } as React.CSSProperties}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 } as React.CSSProperties}>
          {labels.map((l, i) => (
            <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 6 } as React.CSSProperties}>
              <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 11, color: '#8b949e', width: 16, textAlign: 'right' } as React.CSSProperties}>{l}</span>
              <button onClick={() => toggle(i)} style={{ width: 40, height: 22, borderRadius: 11, border: `2px solid ${inputs[i] ? '#60a5fa' : '#2d3f55'}`, background: inputs[i] ? 'rgba(96,165,250,0.2)' : '#1c2128', cursor: 'pointer', position: 'relative', transition: 'all 0.2s', padding: 0 } as React.CSSProperties}>
                <div style={{ position: 'absolute', top: 2, left: inputs[i] ? 20 : 2, width: 14, height: 14, borderRadius: '50%', background: inputs[i] ? '#60a5fa' : '#8b949e', transition: 'all 0.2s' } as React.CSSProperties} />
              </button>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: inputs[i] ? '#60a5fa' : '#2d3f55', boxShadow: inputs[i] ? '0 0 8px rgba(96,165,250,0.5)' : 'none', transition: 'all 0.2s' } as React.CSSProperties} />
            </div>
          ))}
        </div>
        <div style={{ width: 2, height: gate.inputs === 2 ? 40 : 20, background: isActive ? '#60a5fa' : '#2d3f55', borderRadius: 1, boxShadow: isActive ? '0 0 6px rgba(96,165,250,0.3)' : 'none', transition: 'all 0.2s' } as React.CSSProperties} />
        <GateSVG type={gate.type} active={isActive} />
        <div style={{ width: 2, height: 20, background: output ? '#60a5fa' : '#2d3f55', borderRadius: 1, boxShadow: output ? '0 0 6px rgba(96,165,250,0.3)' : 'none', transition: 'all 0.2s' } as React.CSSProperties} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 } as React.CSSProperties}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: output ? '#60a5fa' : '#2d3f55', boxShadow: output ? '0 0 10px rgba(96,165,250,0.5)' : 'none', transition: 'all 0.2s' } as React.CSSProperties} />
          <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 11, color: output ? '#60a5fa' : '#8b949e', fontWeight: 700 } as React.CSSProperties}>{output ? '1' : '0'}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Toast Component ───
function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 2500); return () => clearTimeout(t); }, [onClose]);
  return (
    <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', background: '#1c2128', border: '2px solid #f59e0b', borderRadius: 10, padding: '12px 24px', color: '#f59e0b', fontFamily: "'Orbitron', sans-serif", fontSize: 13, fontWeight: 600, zIndex: 999, animation: 'toastIn 0.3s ease', boxShadow: '0 4px 20px rgba(245,158,11,0.2)' } as React.CSSProperties}>
      {message}
    </div>
  );
}

// ─── Main App ───
export default function App() {
  const [screen, setScreen] = useState<Screen>('welcome');
  const [toast, setToast] = useState<string | null>(null);
  const [gearSearch, setGearSearch] = useState('');
  const [linkSearch, setLinkSearch] = useState('');

  const handleComingSoon = useCallback(() => { setToast('Coming Soon!'); }, []);

  // ─── Welcome Screen ───
  if (screen === 'welcome') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0d1117', gap: 32, padding: 24 } as React.CSSProperties}>
        <div style={{ width: 180, height: 120, border: '2px solid #2d3f55', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#161b22' } as React.CSSProperties}>
          <span style={{ color: '#8b949e', fontSize: 12 } as React.CSSProperties}>LOGO</span>
        </div>
        <h1 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 900, background: 'linear-gradient(135deg, #4caf50, #81c784, #a5d6a7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textAlign: 'center', letterSpacing: 3 } as React.CSSProperties}>BABFT Learning</h1>
        <button onClick={() => setScreen('menu')} style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 14, fontWeight: 700, padding: '14px 40px', background: 'linear-gradient(135deg, #4caf50, #66bb6a)', color: '#0d1117', border: 'none', borderRadius: 8, cursor: 'pointer', animation: 'pulse 2s infinite', letterSpacing: 1, boxShadow: '0 0 20px rgba(76,175,80,0.3)' } as React.CSSProperties}>
          START LEARNING
        </button>
      </div>
    );
  }

  // ─── Menu Screen ───
  if (screen === 'menu') {
    const items = [
      { label: 'Logic Gates', color: '#60a5fa', screen: 'logic-gates' as Screen },
      { label: 'Gears', color: '#f59e0b', screen: 'gears' as Screen },
      { label: 'Linkages Mechanic', color: '#818cf8', screen: 'linkages' as Screen },
      { label: 'Coming Soon', color: '#4b5563', screen: null },
    ];
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0d1117', gap: 20, padding: 24 } as React.CSSProperties}>
        <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 20, color: '#e6edf3', letterSpacing: 2, marginBottom: 12 } as React.CSSProperties}>SELECT TOPIC</h2>
        {items.map((item, i) => (
          <button key={item.label} onClick={() => item.screen ? setScreen(item.screen) : handleComingSoon()} style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 13, fontWeight: 600, padding: '16px 48px', width: '100%', maxWidth: 360, background: item.screen ? 'transparent' : '#1c2128', border: `2px solid ${item.color}${item.screen ? '' : '40'}`, borderRadius: 10, color: item.screen ? item.color : '#4b5563', cursor: item.screen ? 'pointer' : 'not-allowed', opacity: item.screen ? 1 : 0.5, letterSpacing: 1, animation: `fadeIn 0.3s ease ${i * 0.1}s both`, transition: 'all 0.2s' } as React.CSSProperties}>
            {item.label}
          </button>
        ))}
        {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      </div>
    );
  }

  // ─── Logic Gates Screen ───
  if (screen === 'logic-gates') {
    return (
      <div style={{ minHeight: '100vh', background: '#0d1117', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 24 } as React.CSSProperties}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', maxWidth: 600, marginBottom: 24 } as React.CSSProperties}>
          <button onClick={() => setScreen('menu')} style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 700, fontSize: 12, padding: '10px 18px', background: 'transparent', border: '2px solid #2d3f55', borderRadius: 8, color: '#8b949e', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.2s' } as React.CSSProperties}><ArrowLeft size={17} /> Back</button>
          <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 14, color: '#60a5fa', fontWeight: 700, letterSpacing: 1 } as React.CSSProperties}>Logic Gates</span>
        </div>
        <div style={{ width: '100%', maxWidth: 600, marginBottom: 24, padding: 16, background: '#161b22', border: '2px solid #2d3f55', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 } as React.CSSProperties}>
          <span style={{ color: '#8b949e', fontSize: 12, fontFamily: "'Orbitron', sans-serif" } as React.CSSProperties}>INPUT</span>
          <span style={{ color: '#60a5fa', fontSize: 16 } as React.CSSProperties}>→</span>
          <span style={{ color: '#8b949e', fontSize: 12, fontFamily: "'Orbitron', sans-serif" } as React.CSSProperties}>GATE</span>
          <span style={{ color: '#60a5fa', fontSize: 16 } as React.CSSProperties}>→</span>
          <span style={{ color: '#8b949e', fontSize: 12, fontFamily: "'Orbitron', sans-serif" } as React.CSSProperties}>OUTPUT</span>
        </div>
        <button onClick={() => setScreen('basic-logic-gates')} style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 14, fontWeight: 700, padding: '16px 40px', background: 'linear-gradient(135deg, #60a5fa, #3b82f6)', color: '#0d1117', border: 'none', borderRadius: 10, cursor: 'pointer', letterSpacing: 1, boxShadow: '0 0 20px rgba(96,165,250,0.3)', marginBottom: 24, transition: 'all 0.2s' } as React.CSSProperties}>
          8 Logic Gates
        </button>
      </div>
    );
  }

  // ─── Basic Logic Gates Screen ───
  if (screen === 'basic-logic-gates') {
    return (
      <div style={{ minHeight: '100vh', background: '#0d1117', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 24 } as React.CSSProperties}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', maxWidth: 700, marginBottom: 24 } as React.CSSProperties}>
          <button onClick={() => setScreen('logic-gates')} style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 700, fontSize: 12, padding: '10px 18px', background: 'transparent', border: '2px solid #2d3f55', borderRadius: 8, color: '#8b949e', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 } as React.CSSProperties}><ArrowLeft size={17} /> Back</button>
          <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 14, color: '#60a5fa', fontWeight: 700 } as React.CSSProperties}>8 Logic Gates</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 700 } as React.CSSProperties}>
          {GATES.map(g => <LogicGateCard key={g.type} gate={g} />)}
        </div>
      </div>
    );
  }

  // ─── Gears Screen ───
  if (screen === 'gears') {
    const filtered = GEAR_TYPES.filter(g => (g.name + ' ' + g.desc).toLowerCase().includes(gearSearch.toLowerCase()));
    return (
      <div style={{ minHeight: '100vh', background: '#0d1117', padding: 16 } as React.CSSProperties}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, flexWrap: 'wrap' } as React.CSSProperties}>
          <button onClick={() => { setGearSearch(''); setScreen('menu'); }} style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 700, fontSize: 13, padding: '10px 18px', background: 'transparent', border: '2px solid #2d3f55', borderRadius: 8, color: '#8b949e', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0, transition: 'all 0.2s' } as React.CSSProperties}><ArrowLeft size={17} /> Back</button>
          <div style={{ flex: 1, minWidth: 200, position: 'relative' } as React.CSSProperties}>
            <input value={gearSearch} onChange={e => setGearSearch(e.target.value)} placeholder="Search gears..." style={{ width: '100%', padding: '10px 36px 10px 14px', background: '#1c2128', border: '2px solid #2d3f55', borderRadius: 8, color: '#e6edf3', fontFamily: 'Inter, sans-serif', fontSize: 13, outline: 'none', transition: 'border-color 0.2s' } as React.CSSProperties} onFocus={e => (e.target.style.borderColor = '#4caf50')} onBlur={e => (e.target.style.borderColor = '#2d3f55')} />
            {gearSearch && <button onClick={() => setGearSearch('')} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#8b949e', cursor: 'pointer', padding: 4, display: 'flex' } as React.CSSProperties}><X size={16} /></button>}
            {!gearSearch && <Search size={16} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: '#8b949e' } as React.CSSProperties} />}
          </div>
        </div>
        {filtered.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 60, opacity: 0.4 } as React.CSSProperties}>
            <Search size={40} color="#8b949e" />
            <p style={{ color: '#8b949e', fontSize: 14, marginTop: 12, fontFamily: "'Orbitron', sans-serif" } as React.CSSProperties}>Tidak ada gear yang cocok</p>
          </div>
        ) : (
          <div className="gear-grid">
            {filtered.map((g, i) => (
              <button key={g.id} onClick={handleComingSoon} className="gear-card" style={{ animation: `fadeIn 0.3s ease ${i * 0.02}s both` } as React.CSSProperties}>
                <GearIconSVG icon={g.icon} color={g.color} />
                <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 11, color: '#e6edf3', fontWeight: 600, letterSpacing: 0.5 } as React.CSSProperties}>{g.name}</span>
                <span style={{ fontSize: 11, color: '#8b949e', lineHeight: 1.4 } as React.CSSProperties}>{g.desc}</span>
              </button>
            ))}
          </div>
        )}
        {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      </div>
    );
  }

  // ─── Linkages Screen ───
  if (screen === 'linkages') {
    const filtered = LINKAGE_TYPES.filter(l => (l.name + ' ' + l.desc).toLowerCase().includes(linkSearch.toLowerCase()));
    return (
      <div style={{ minHeight: '100vh', background: '#0d1117', padding: 16 } as React.CSSProperties}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, flexWrap: 'wrap' } as React.CSSProperties}>
          <button onClick={() => { setLinkSearch(''); setScreen('menu'); }} style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 700, fontSize: 13, padding: '10px 18px', background: 'transparent', border: '2px solid #2d3f55', borderRadius: 8, color: '#8b949e', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 } as React.CSSProperties}><ArrowLeft size={17} /> Back</button>
          <div style={{ flex: 1, minWidth: 200, position: 'relative' } as React.CSSProperties}>
            <input value={linkSearch} onChange={e => setLinkSearch(e.target.value)} placeholder="Search linkages..." style={{ width: '100%', padding: '10px 36px 10px 14px', background: '#1c2128', border: '2px solid #2d3f55', borderRadius: 8, color: '#e6edf3', fontFamily: 'Inter, sans-serif', fontSize: 13, outline: 'none' } as React.CSSProperties} onFocus={e => (e.target.style.borderColor = '#818cf8')} onBlur={e => (e.target.style.borderColor = '#2d3f55')} />
            {linkSearch && <button onClick={() => setLinkSearch('')} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#8b949e', cursor: 'pointer', padding: 4, display: 'flex' } as React.CSSProperties}><X size={16} /></button>}
            {!linkSearch && <Search size={16} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: '#8b949e' } as React.CSSProperties} />}
          </div>
        </div>
        {filtered.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 60, opacity: 0.4 } as React.CSSProperties}>
            <Search size={40} color="#8b949e" />
            <p style={{ color: '#8b949e', fontSize: 14, marginTop: 12, fontFamily: "'Orbitron', sans-serif" } as React.CSSProperties}>Tidak ada mekanisme yang cocok</p>
          </div>
        ) : (
          <div className="linkage-grid">
            {filtered.map((l, i) => (
              <button key={l.id} onClick={handleComingSoon} className="linkage-card" style={{ animation: `fadeIn 0.3s ease ${i * 0.02}s both` } as React.CSSProperties}>
                <LinkageIconSVG icon={l.icon} color={l.color} />
                <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 10, color: '#e6edf3', fontWeight: 600, letterSpacing: 0.5 } as React.CSSProperties}>{l.name}</span>
                <span style={{ fontSize: 10, color: '#8b949e', lineHeight: 1.3 } as React.CSSProperties}>{l.desc}</span>
              </button>
            ))}
          </div>
        )}
        {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      </div>
    );
  }

  return null;
}
