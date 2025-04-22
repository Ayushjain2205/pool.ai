export function FontStyleGuide() {
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-4xl font-mono mb-8">POOL.AI Font Style Guide</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="glassmorphic-card p-6">
          <h2 className="text-2xl font-mono mb-4">Headings (Roboto Mono)</h2>
          <div className="space-y-4">
            <div>
              <h1 className="text-4xl">Heading 1</h1>
              <p className="text-sm text-off-white/70 mt-1">font-mono text-4xl</p>
            </div>
            <div>
              <h2 className="text-3xl">Heading 2</h2>
              <p className="text-sm text-off-white/70 mt-1">font-mono text-3xl</p>
            </div>
            <div>
              <h3 className="text-2xl">Heading 3</h3>
              <p className="text-sm text-off-white/70 mt-1">font-mono text-2xl</p>
            </div>
            <div>
              <h4 className="text-xl">Heading 4</h4>
              <p className="text-sm text-off-white/70 mt-1">font-mono text-xl</p>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-sm text-off-white/70 mb-2">Font Weights:</p>
            <div className="space-y-2">
              <p className="font-mono font-normal">Regular (400) - Default</p>
              <p className="font-mono font-bold">Bold (700)</p>
            </div>
          </div>
        </div>

        <div className="glassmorphic-card p-6">
          <h2 className="text-2xl font-mono mb-4">Body Text (Plus Jakarta Sans)</h2>
          <div className="space-y-4">
            <div>
              <p className="text-lg">Large Paragraph</p>
              <p className="text-sm text-off-white/70 mt-1">text-lg</p>
            </div>
            <div>
              <p>Regular Paragraph</p>
              <p className="text-sm text-off-white/70 mt-1">Default size</p>
            </div>
            <div>
              <p className="text-sm">Small Text</p>
              <p className="text-sm text-off-white/70 mt-1">text-sm</p>
            </div>
            <div>
              <p className="text-xs">Extra Small Text</p>
              <p className="text-sm text-off-white/70 mt-1">text-xs</p>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-sm text-off-white/70 mb-2">Font Weights:</p>
            <div className="space-y-2">
              <p className="font-extralight">Extra Light (200)</p>
              <p className="font-light">Light (300)</p>
              <p className="font-normal">Regular (400) - Default</p>
              <p className="font-medium">Medium (500)</p>
              <p className="font-semibold">Semi Bold (600)</p>
              <p className="font-bold">Bold (700)</p>
              <p className="font-extrabold">Extra Bold (800)</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <div className="glassmorphic-card p-6">
          <h2 className="text-2xl font-mono mb-4">UI Components</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-mono mb-3">Buttons</h3>
              <div className="space-y-4">
                <button className="button-primary">Primary Button</button>
                <div>
                  <button className="bg-indigo-glow text-off-white font-mono py-3 px-6 rounded-full">
                    Secondary Button
                  </button>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-mono mb-3">Labels & Tags</h3>
              <div className="flex flex-wrap gap-2">
                <span className="bg-deep-violet px-3 py-1 rounded-full text-sm">Text</span>
                <span className="bg-mint-green/20 text-mint-green px-3 py-1 rounded-full text-sm">Audio</span>
                <span className="bg-indigo-glow/20 text-indigo-glow px-3 py-1 rounded-full text-sm">Image</span>
                <span className="bg-[#FF44A4]/20 text-[#FF44A4] px-3 py-1 rounded-full text-sm">Sensor</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
