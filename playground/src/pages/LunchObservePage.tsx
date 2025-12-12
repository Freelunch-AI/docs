export function LunchObservePage() {
  return (
    <div className="w-full h-full flex items-center justify-center flex-col gap-6 bg-vscode-bg">
      <div className="flex items-center gap-3">
        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-3xl">
          📊
        </div>
        <div>
          <h1 className="text-3xl font-semibold text-vscode-textBright">lunch-observe</h1>
          <p className="text-vscode-textMuted">Observability & PR Review</p>
        </div>
      </div>
      <p className="text-sm text-vscode-text max-w-xl text-center leading-relaxed">
        Monitor system health, view logs and traces, and compare PR branches
        with performance and cost metrics. See architectural changes at a glance.
      </p>
      <div className="mt-4 px-4 py-2 bg-vscode-bgLight rounded text-xs text-vscode-textMuted">
        Phase 9 coming soon: Logs, traces, and PR comparison
      </div>
    </div>
  );
}
