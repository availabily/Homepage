interface ImportMetaEnv {
  readonly VITE_MANIFOLD?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}
