cat > src/custom.d.ts <<'TSDECL'
/**
 * Allows importing CSS files as side-effects in TypeScript (CRA).
 * Also declares common asset types used by the app.
 */
declare module '*.css';
declare module '*.scss';
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.svg';
declare module '*.gif';
TSDECL
