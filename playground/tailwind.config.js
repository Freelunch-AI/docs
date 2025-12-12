/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // VSCode Dark+ theme colors (exact match)
        vscode: {
          titleBar: '#3c3c3c',
          bg: '#1e1e1e',
          bgLight: '#252526',
          sidebar: '#252526',
          activityBar: '#333333',
          statusBar: '#007acc',
          border: '#1e1e1e',
          borderLight: '#2b2b2b',
          text: '#cccccc',
          textMuted: '#858585',
          textBright: '#ffffff',
          primary: '#0e639c',
          primaryBright: '#1177bb',
          hover: '#2a2d2e',
          selection: '#094771',
        },
        // Block type colors from spec
        service: '#10B981',        // green
        serviceBlock: '#06B6D4',   // cyan
        workloadsInfra: '#8B5CF6', // purple
        infrastructure: '#1E40AF', // dark blue
        pipeline: '#F59E0B',       // orange
      },
    },
  },
  plugins: [],
}
