/* ==========================================================================
   ARTISTRY MARKETS — CONTENT LAYER
   All section markup + static/reference datasets live here, kept separate
   from app.js (behavior) so copy can be edited without touching logic.
   ========================================================================== */

const SECTIONS = [];

/* ---------------------------------------------------------------------
   1. MONEY
--------------------------------------------------------------------- */
SECTIONS.push({
  id: 'money',
  html: `
  <div class="section-inner">
    <div class="section-head">
      <div class="section-index">01</div>
      <div class="section-title-wrap">
        <p class="eyebrow">Foundations</p>
        <h2>Money</h2>
        <p>Before charts and tickers mean anything, it helps to understand the substance underneath them: what money actually is, who creates it, and why it quietly loses value over time.</p>
      </div>
    </div>

    <div class="teach-grid">
      <div class="teach-card"><h3>What is money?</h3><p>A shared belief system for value — anything widely accepted for trade, that stores value and lets us compare the worth of very different things.</p></div>
      <div class="teach-card"><h3>A short history</h3><p>Barter gave way to commodity money (salt, shells, metal), then coinage, then paper claims on gold, then — since 1971 — pure fiat currency backed by trust alone.</p></div>
      <div class="teach-card"><h3>Fiat currency</h3><p>Money with no physical backing, valuable because a government declares it legal tender and people agree to use it.</p></div>
      <div class="teach-card"><h3>Inflation</h3><p>The gradual rise in prices — and fall in what each unit of currency buys — usually driven by the money supply growing faster than the economy.</p></div>
      <div class="teach-card"><h3>Purchasing power</h3><p>What your money can actually buy. The same $100 buys less every year inflation runs above 0%, even if the number in your account stays the same.</p></div>
      <div class="teach-card"><h3>Central banks</h3><p>Institutions like the Federal Reserve or RBI that set interest rates and manage the money supply to balance growth against inflation.</p></div>
      <div class="teach-card"><h3>How money is created</h3><p>Governments don't just print notes — most new money is created when commercial banks issue loans, expanding deposits far beyond physical cash in circulation.</p></div>
      <div class="teach-card"><h3>Emergency funds</h3><p>Three to six months of essential expenses, kept liquid and boring, so a job loss or medical bill never forces you to sell investments at a bad time.</p></div>
    </div>

    <div class="dash-label">Live Dashboard · Currency &amp; Inflation</div>
    <div class="two-col" style="margin-bottom:20px;">
      <div class="panel">
        <div class="panel-title">Currency Converter</div>
        <div class="field-row">
          <div class="field">
            <label for="conv-amount">Amount</label>
            <input type="number" id="conv-amount" value="1000" min="0" step="1">
          </div>
          <div class="field">
            <label for="conv-from">From</label>
            <select id="conv-from"></select>
          </div>
        </div>
        <div class="field-row">
          <div class="field">
            <label for="conv-to">To</label>
            <select id="conv-to"></select>
          </div>
          <div class="field" style="display:flex; align-items:flex-end;">
            <div class="stat" id="conv-result" style="width:100%;">—</div>
          </div>
        </div>
        <div class="foot-note" id="conv-rate-note">Fetching live exchange rates…</div>
      </div>
      <div class="panel">
        <div class="panel-title">Exchange Rates vs USD</div>
        <table class="data-table" id="fx-table">
          <thead><tr><th>Currency</th><th>Rate</th><th>24h</th></tr></thead>
          <tbody><tr><td colspan="3" style="color:var(--muted);">Loading…</td></tr></tbody>
        </table>
      </div>
    </div>

    <div class="panel">
      <div class="panel-title">$100 of Purchasing Power, 1990 → Today <span class="badge">Illustrative</span></div>
      <canvas id="purchasing-power-chart" height="90"></canvas>
    </div>
  </div>`
});

/* ---------------------------------------------------------------------
   2. GOLD
--------------------------------------------------------------------- */
SECTIONS.push({
  id: 'gold',
  html: `
  <div class="section-inner">
    <div class="section-head">
      <div class="section-index">02</div>
      <div class="section-title-wrap">
        <p class="eyebrow">Hard Assets</p>
        <h2>Gold</h2>
        <p>For five thousand years, gold has been the asset every civilization eventually trusted. It doesn't rust, can't be printed, and answers to no central bank.</p>
      </div>
    </div>

    <div class="teach-grid">
      <div class="teach-card"><h3>Physical vs digital gold</h3><p>Coins and bars give direct ownership; digital gold and gold ETFs give price exposure without storage — at the cost of counterparty trust.</p></div>
      <div class="teach-card"><h3>Hallmarking</h3><p>An independent stamp certifying purity (e.g. 22K, 24K) so buyers don't have to take a seller's word for gold content.</p></div>
      <div class="teach-card"><h3>Why central banks buy gold</h3><p>Gold carries no counterparty risk — no issuer can default on it — which makes it a reserve asset that holds value through currency and political crises.</p></div>
      <div class="teach-card"><h3>The safe-haven case</h3><p>Gold has historically moved opposite to confidence: it tends to rise when currencies weaken, inflation runs hot, or geopolitical risk spikes.</p></div>
      <div class="teach-card"><h3>Advantages</h3><p>Scarcity, portability, universal recognition, and a multi-thousand-year track record as a store of value.</p></div>
      <div class="teach-card"><h3>Risks</h3><p>No yield or dividend, storage and insurance costs for physical holdings, and prices that can stay flat — or fall — for long stretches.</p></div>
    </div>

    <div class="dash-label">Live Dashboard · Gold Markets</div>
    <div class="dash-grid" style="margin-bottom:20px;">
      <div class="card card-glow">
        <h4>Live Gold Price</h4>
        <div class="stat" id="gold-live-price">$—<small>/oz</small></div>
        <span class="delta" id="gold-live-delta">—</span>
        <div class="foot-note" id="gold-source-note">Connecting to feed…</div>
      </div>
      <div class="card">
        <h4>Silver</h4>
        <div class="stat" id="silver-live-price">$—<small>/oz</small></div>
        <span class="delta" id="silver-live-delta">—</span>
      </div>
      <div class="card">
        <h4>Gold / Silver Ratio</h4>
        <div class="stat" id="gold-silver-ratio">—</div>
        <div class="foot-note">Ounces of silver per ounce of gold</div>
      </div>
    </div>

    <div class="two-col" style="margin-bottom:20px;">
      <div class="panel">
        <div class="panel-title">10-Year Gold Trend (USD/oz) <span class="badge">Illustrative</span></div>
        <canvas id="gold-history-chart" height="110"></canvas>
      </div>
      <div class="panel">
        <div class="panel-title">Largest Official Gold Reserves</div>
        <table class="data-table" id="gold-reserves-table"><thead><tr><th>Country</th><th>Tonnes</th></tr></thead><tbody></tbody></table>
      </div>
    </div>

    <div class="panel">
      <div class="panel-title">Gold Investment Calculator</div>
      <div class="two-col">
        <div>
          <div class="field-row">
            <div class="field"><label for="gold-calc-grams">Quantity (grams)</label><input type="number" id="gold-calc-grams" value="50" min="0"></div>
            <div class="field"><label for="gold-calc-buy">Buy price (per gram, $)</label><input type="number" id="gold-calc-buy" value="60" min="0" step="0.01"></div>
          </div>
          <div class="foot-note">Current price auto-fills from the live feed once loaded; you can override it.</div>
          <div class="field"><label for="gold-calc-now">Current price (per gram, $)</label><input type="number" id="gold-calc-now" value="70" min="0" step="0.01"></div>
        </div>
        <div style="display:flex; flex-direction:column; justify-content:center; gap:14px;">
          <div><span class="foot-note">Invested</span><div class="stat" id="gold-calc-invested">$—</div></div>
          <div><span class="foot-note">Current value</span><div class="stat" id="gold-calc-value">$—</div></div>
          <div><span class="foot-note">Gain / loss</span><div class="stat" id="gold-calc-gain">$—</div></div>
        </div>
      </div>
    </div>
  </div>`
});

/* ---------------------------------------------------------------------
   3. STOCK MARKET
--------------------------------------------------------------------- */
SECTIONS.push({
  id: 'stocks',
  html: `
  <div class="section-inner">
    <div class="section-head">
      <div class="section-index">03</div>
      <div class="section-title-wrap">
        <p class="eyebrow">Equities</p>
        <h2>Stock Market</h2>
        <p>A share is a sliver of ownership in a real business. The stock market is simply the venue where millions of people continuously re-price that ownership.</p>
      </div>
    </div>

    <div class="teach-grid">
      <div class="teach-card"><h3>Shares &amp; IPOs</h3><p>A share is one unit of company ownership. An IPO is the first time a private company sells shares to the public to raise capital.</p></div>
      <div class="teach-card"><h3>Market capitalization</h3><p>Share price × shares outstanding — the market's real-time estimate of what the whole company is worth.</p></div>
      <div class="teach-card"><h3>Bull &amp; bear markets</h3><p>Bull markets are sustained uptrends built on optimism; bear markets are sustained downtrends (typically −20% or more) built on fear or fundamentals.</p></div>
      <div class="teach-card"><h3>Dividends</h3><p>A portion of profit a company pays directly to shareholders, usually quarterly, as a reward for holding the stock.</p></div>
      <div class="teach-card"><h3>Cap sizes</h3><p>Large-cap ($10B+) tends to be stable; mid-cap offers a growth/stability blend; small-cap is higher risk and higher potential reward.</p></div>
      <div class="teach-card"><h3>Indices</h3><p>A basket of stocks — like the S&amp;P 500 or NIFTY 50 — used as a single number to track how "the market" is doing overall.</p></div>
      <div class="teach-card"><h3>How exchanges work</h3><p>Exchanges match buy and sell orders electronically in fractions of a second, using the highest bid and lowest ask to set the current price.</p></div>
      <div class="teach-card"><h3>Blue-chip companies</h3><p>Large, established, financially sound companies with a long record of stable performance — the "safer" end of equities.</p></div>
    </div>

    <div class="dash-label">Live Dashboard · Equities <span class="badge" style="margin-left:8px;">Demo Feed — add a key</span></div>
    <div class="two-col" style="margin-bottom:16px;">
      <div class="panel">
        <div class="panel-title">Top Gainers</div>
        <table class="data-table" id="gainers-table"><thead><tr><th>Symbol</th><th>Price</th><th>Chg %</th></tr></thead><tbody></tbody></table>
      </div>
      <div class="panel">
        <div class="panel-title">Top Losers</div>
        <table class="data-table" id="losers-table"><thead><tr><th>Symbol</th><th>Price</th><th>Chg %</th></tr></thead><tbody></tbody></table>
      </div>
    </div>

    <div class="panel" style="margin-bottom:16px;">
      <div class="panel-title">Interactive Sector Heatmap <span class="badge">Demo Feed</span></div>
      <div class="heatmap" id="stock-heatmap"></div>
    </div>

    <div class="dash-grid">
      <div class="card"><h4>Most Active</h4><div id="most-active-list" style="font-family:var(--font-mono); font-size:0.85rem; display:flex; flex-direction:column; gap:8px;"></div></div>
      <div class="card"><h4>NYSE</h4><div class="stat" id="mkt-nyse">—</div></div>
      <div class="card"><h4>NASDAQ</h4><div class="stat" id="mkt-nasdaq">—</div></div>
      <div class="card"><h4>BSE / NSE (India)</h4><div class="stat" id="mkt-india">—</div></div>
    </div>
  </div>`
});

/* ---------------------------------------------------------------------
   4. CRYPTOCURRENCY
--------------------------------------------------------------------- */
SECTIONS.push({
  id: 'crypto',
  html: `
  <div class="section-inner">
    <div class="section-head">
      <div class="section-index">04</div>
      <div class="section-title-wrap">
        <p class="eyebrow">Digital Assets</p>
        <h2>Cryptocurrency</h2>
        <p>A public, tamper-resistant ledger that lets strangers transact without a bank in the middle — and the first genuinely new asset class in a generation.</p>
      </div>
    </div>

    <div class="teach-grid">
      <div class="teach-card"><h3>Blockchain</h3><p>A distributed, append-only ledger duplicated across thousands of computers, making past records extremely difficult to alter.</p></div>
      <div class="teach-card"><h3>Bitcoin &amp; Ethereum</h3><p>Bitcoin is digital scarcity — a fixed-supply store of value. Ethereum is a programmable ledger that runs smart contracts and applications.</p></div>
      <div class="teach-card"><h3>Wallets</h3><p>Software or hardware that stores the private keys proving ownership of coins — lose the keys, lose the funds, with no customer support to call.</p></div>
      <div class="teach-card"><h3>Mining &amp; validation</h3><p>Proof of Work has computers compete to solve puzzles to add blocks; Proof of Stake has validators post collateral instead, using far less energy.</p></div>
      <div class="teach-card"><h3>Stablecoins</h3><p>Tokens pegged to a stable asset like the US dollar, used to move value on-chain without crypto's usual price swings.</p></div>
      <div class="teach-card"><h3>Advantages &amp; risks</h3><p>24/7 global markets and no intermediary, weighed against extreme volatility, irreversible mistakes, and evolving regulation.</p></div>
    </div>

    <div class="dash-label">Live Dashboard · Crypto <span class="badge" style="margin-left:8px;">Live via CoinGecko</span></div>
    <div class="dash-grid" style="margin-bottom:16px;">
      <div class="card card-glow"><h4>Total Market Cap</h4><div class="stat" id="crypto-mcap">—</div><span class="delta" id="crypto-mcap-delta"></span></div>
      <div class="card"><h4>24h Volume</h4><div class="stat" id="crypto-vol">—</div></div>
      <div class="card"><h4>BTC Dominance</h4><div class="stat" id="btc-dominance">—</div></div>
      <div class="card"><h4>Trending Now</h4><div id="trending-coins" style="font-size:0.85rem; color:var(--muted); font-family:var(--font-mono);">—</div></div>
    </div>

    <div class="panel">
      <div class="panel-title">Top Coins by Market Cap</div>
      <table class="data-table" id="crypto-table">
        <thead><tr><th>#</th><th>Coin</th><th>Price</th><th>24h</th><th>Market Cap</th><th>Volume</th></tr></thead>
        <tbody><tr><td colspan="6" style="color:var(--muted);">Loading live data…</td></tr></tbody>
      </table>
    </div>
  </div>`
});

/* ---------------------------------------------------------------------
   5. TRADING
--------------------------------------------------------------------- */
SECTIONS.push({
  id: 'trading',
  html: `
  <div class="section-inner">
    <div class="section-head">
      <div class="section-index">05</div>
      <div class="section-title-wrap">
        <p class="eyebrow">Reading Price</p>
        <h2>Trading</h2>
        <p>Trading is the discipline of reading short-term price behavior — and, more importantly, managing risk when you're inevitably wrong.</p>
      </div>
    </div>

    <div class="teach-grid">
      <div class="teach-card"><h3>Candlesticks</h3><p>Each candle shows open, high, low, and close for a period — a compact story of the battle between buyers and sellers.</p></div>
      <div class="teach-card"><h3>Support &amp; resistance</h3><p>Price levels where buying or selling pressure has repeatedly stalled a move, often acting as floors and ceilings.</p></div>
      <div class="teach-card"><h3>Trend &amp; breakout</h3><p>A trend is the market's prevailing direction; a breakout is price decisively moving past a support/resistance level, often with rising volume.</p></div>
      <div class="teach-card"><h3>Risk management</h3><p>Sizing positions and setting stop losses so that no single trade can meaningfully damage the account — the actual job of a trader.</p></div>
      <div class="teach-card"><h3>Stop loss &amp; take profit</h3><p>Pre-set exit orders that cap downside and lock in gains automatically, removing emotion from the decision in the moment.</p></div>
      <div class="teach-card"><h3>Trading psychology</h3><p>Fear and greed cause most losses that bad analysis didn't — discipline and a written plan are what separate traders from gamblers.</p></div>
      <div class="teach-card"><h3>Styles</h3><p>Scalping (seconds–minutes), day trading (intraday), swing trading (days–weeks), and position trading (months–years) — same markets, different time horizons.</p></div>
    </div>

    <div class="dash-label">Live Dashboard · Candlestick Chart <span class="badge" style="margin-left:8px;">Live via CoinGecko OHLC</span></div>
    <div class="panel">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:14px; margin-bottom:18px;">
        <div class="panel-title" style="margin:0;">BTC/USD</div>
        <div class="filter-row" style="margin:0;" id="candle-timeframe">
          <button class="chip-btn active" data-days="1">1D</button>
          <button class="chip-btn" data-days="7">7D</button>
          <button class="chip-btn" data-days="30">30D</button>
          <button class="chip-btn" data-days="90">90D</button>
        </div>
      </div>
      <div id="candle-wrap" style="position:relative; height:380px;">
        <canvas id="candle-canvas"></canvas>
      </div>
      <div class="foot-note" id="candle-note" style="margin-top:12px;">Loading candles…</div>
    </div>
  </div>`
});

/* ---------------------------------------------------------------------
   6. INVESTING
--------------------------------------------------------------------- */
SECTIONS.push({
  id: 'investing',
  html: `
  <div class="section-inner">
    <div class="section-head">
      <div class="section-index">06</div>
      <div class="section-title-wrap">
        <p class="eyebrow">Building Wealth</p>
        <h2>Investing</h2>
        <p>Trading manages short-term risk. Investing harnesses time — letting compounding, diversification, and patience do most of the work.</p>
      </div>
    </div>

    <div class="teach-grid">
      <div class="teach-card"><h3>Compound interest</h3><p>Interest earned on interest already earned — the mechanism Einstein reputedly called the eighth wonder of the world.</p></div>
      <div class="teach-card"><h3>Index funds &amp; ETFs</h3><p>Low-cost baskets that track an entire market, giving broad diversification without picking individual winners.</p></div>
      <div class="teach-card"><h3>Mutual funds</h3><p>Professionally managed pooled investments — actively trying to beat the market, usually for a higher fee than an index fund.</p></div>
      <div class="teach-card"><h3>Diversification</h3><p>Spreading capital across assets that don't move in lockstep, so one bad outcome doesn't sink the whole portfolio.</p></div>
      <div class="teach-card"><h3>Asset allocation</h3><p>The split between stocks, bonds, gold, cash, and alternatives — the single biggest driver of a portfolio's long-run risk and return.</p></div>
      <div class="teach-card"><h3>Retirement planning</h3><p>Working backward from a future income target to decide how much to invest today, and in what, to get there.</p></div>
    </div>

    <div class="dash-label">Live Dashboard · Calculators</div>
    <div class="three-col" style="margin-bottom:16px; align-items:stretch;">
      <div class="panel">
        <div class="panel-title">Compound Interest</div>
        <div class="field"><label for="ci-principal">Initial amount ($)</label><input type="number" id="ci-principal" value="10000"></div>
        <div class="field-row">
          <div class="field"><label for="ci-rate">Annual return (%)</label><input type="number" id="ci-rate" value="8" step="0.1"></div>
          <div class="field"><label for="ci-years">Years</label><input type="number" id="ci-years" value="20"></div>
        </div>
        <div class="foot-note">Future value</div>
        <div class="stat" id="ci-result">$—</div>
      </div>
      <div class="panel">
        <div class="panel-title">SIP Calculator</div>
        <div class="field"><label for="sip-amount">Monthly investment ($)</label><input type="number" id="sip-amount" value="500"></div>
        <div class="field-row">
          <div class="field"><label for="sip-rate">Expected return (%)</label><input type="number" id="sip-rate" value="10" step="0.1"></div>
          <div class="field"><label for="sip-years">Years</label><input type="number" id="sip-years" value="15"></div>
        </div>
        <div class="foot-note">Maturity value</div>
        <div class="stat" id="sip-result">$—</div>
      </div>
      <div class="panel">
        <div class="panel-title">Portfolio Allocation</div>
        <div class="range-row"><span>Stocks</span><span id="alloc-stocks-val">50%</span></div>
        <input type="range" id="alloc-stocks" min="0" max="100" value="50">
        <div class="range-row" style="margin-top:12px;"><span>Bonds</span><span id="alloc-bonds-val">25%</span></div>
        <input type="range" id="alloc-bonds" min="0" max="100" value="25">
        <div class="range-row" style="margin-top:12px;"><span>Gold</span><span id="alloc-gold-val">15%</span></div>
        <input type="range" id="alloc-gold" min="0" max="100" value="15">
        <div class="range-row" style="margin-top:12px;"><span>Crypto</span><span id="alloc-crypto-val">10%</span></div>
        <input type="range" id="alloc-crypto" min="0" max="100" value="10">
      </div>
    </div>
    <div class="two-col">
      <div class="panel">
        <div class="panel-title">Growth Projection</div>
        <canvas id="investing-growth-chart" height="110"></canvas>
      </div>
      <div class="panel">
        <div class="panel-title">Allocation Mix</div>
        <canvas id="allocation-pie-chart" height="200"></canvas>
      </div>
    </div>
  </div>`
});

/* ---------------------------------------------------------------------
   7. BUSINESS
--------------------------------------------------------------------- */
SECTIONS.push({
  id: 'business',
  html: `
  <div class="section-inner">
    <div class="section-head">
      <div class="section-index">07</div>
      <div class="section-title-wrap">
        <p class="eyebrow">Building Value</p>
        <h2>Business</h2>
        <p>Every public company on the ticker started as an idea, a spreadsheet, and a founder guessing at demand. The mechanics are learnable.</p>
      </div>
    </div>

    <div class="teach-grid">
      <div class="teach-card"><h3>Finding ideas &amp; validation</h3><p>Good ideas usually come from a founder's own frustration; validation means testing whether strangers will actually pay before you build much.</p></div>
      <div class="teach-card"><h3>MVP</h3><p>A minimum viable product — the smallest version of a solution that lets you learn from real customers as fast as possible.</p></div>
      <div class="teach-card"><h3>Branding &amp; marketing</h3><p>Branding is the promise a company makes; marketing is how it reaches the people who might care about that promise.</p></div>
      <div class="teach-card"><h3>Customer acquisition</h3><p>The channels and cost required to turn a stranger into a paying customer — the number every growth decision revolves around.</p></div>
      <div class="teach-card"><h3>Pricing</h3><p>Set too low, it signals cheapness and starves margin; set too high without proof of value, it kills conversion. Pricing is a positioning decision, not just a math one.</p></div>
      <div class="teach-card"><h3>Cash flow &amp; profit</h3><p>Profit is an accounting concept; cash flow is what's actually in the bank. Profitable companies still die from running out of cash.</p></div>
      <div class="teach-card"><h3>Scaling</h3><p>Growing revenue faster than costs — usually by removing whatever manual step currently caps how fast the business can grow.</p></div>
    </div>

    <div class="dash-label">Live Dashboard · Business Modeling</div>
    <div class="two-col" style="margin-bottom:16px;">
      <div class="panel">
        <div class="panel-title">Break-Even Calculator</div>
        <div class="field"><label for="be-fixed">Fixed costs / month ($)</label><input type="number" id="be-fixed" value="8000"></div>
        <div class="field-row">
          <div class="field"><label for="be-price">Price per unit ($)</label><input type="number" id="be-price" value="40"></div>
          <div class="field"><label for="be-varcost">Variable cost / unit ($)</label><input type="number" id="be-varcost" value="15"></div>
        </div>
        <div class="foot-note">Break-even volume</div>
        <div class="stat" id="be-units">— units/mo</div>
        <div class="foot-note" style="margin-top:6px;">Break-even revenue</div>
        <div class="stat" id="be-revenue">$—</div>
      </div>
      <div class="panel">
        <div class="panel-title">Revenue Projection</div>
        <div class="field-row">
          <div class="field"><label for="rev-start">Starting monthly revenue ($)</label><input type="number" id="rev-start" value="5000"></div>
          <div class="field"><label for="rev-growth">Monthly growth (%)</label><input type="number" id="rev-growth" value="12" step="0.5"></div>
        </div>
        <canvas id="revenue-chart" height="150"></canvas>
      </div>
    </div>

    <div class="dash-grid">
      <div class="card"><h4>Startup KPI · Burn Rate</h4><div class="stat">$18.4k<small>/mo</small></div><div class="foot-note">Illustrative sample company</div></div>
      <div class="card"><h4>Startup KPI · Runway</h4><div class="stat">14.2<small> months</small></div></div>
      <div class="card"><h4>Startup KPI · CAC</h4><div class="stat">$62<small>/customer</small></div></div>
      <div class="card"><h4>Startup KPI · LTV:CAC</h4><div class="stat">3.4<small>×</small></div></div>
    </div>
  </div>`
});

/* ---------------------------------------------------------------------
   8. GLOBAL ECONOMY
--------------------------------------------------------------------- */
SECTIONS.push({
  id: 'economy',
  html: `
  <div class="section-inner">
    <div class="section-head">
      <div class="section-index">08</div>
      <div class="section-title-wrap">
        <p class="eyebrow">The Big Picture</p>
        <h2>Global Economy</h2>
        <p>Zoom out far enough and every stock, coin, and gold bar is downstream of a handful of macro forces: growth, prices, rates, and trade.</p>
      </div>
    </div>

    <div class="teach-grid">
      <div class="teach-card"><h3>GDP</h3><p>The total value of goods and services a country produces in a period — the standard scoreboard for economic size and growth.</p></div>
      <div class="teach-card"><h3>Interest rates</h3><p>The price of borrowing money, set largely by central banks, which ripples into mortgages, business loans, and stock valuations.</p></div>
      <div class="teach-card"><h3>Recession</h3><p>A sustained, broad-based decline in economic activity — commonly flagged after two consecutive quarters of shrinking GDP.</p></div>
      <div class="teach-card"><h3>Employment</h3><p>The share of the workforce with jobs; a lagging but closely watched signal of economic health and consumer spending power.</p></div>
      <div class="teach-card"><h3>Trade, imports &amp; exports</h3><p>What a country buys from and sells to the rest of the world — and the balance between the two shapes its currency and industry.</p></div>
      <div class="teach-card"><h3>Government debt</h3><p>What a country owes, typically as bonds sold to investors — manageable in moderation, destabilizing if it grows faster than the economy.</p></div>
    </div>

    <div class="dash-label">Live Dashboard · Macro</div>
    <div class="two-col" style="margin-bottom:16px;">
      <div class="panel">
        <div class="panel-title">GDP Rankings (Nominal, approx.) <span class="badge">Illustrative</span></div>
        <table class="data-table" id="gdp-table"><thead><tr><th>Country</th><th>GDP</th></tr></thead><tbody></tbody></table>
      </div>
      <div class="panel">
        <div class="panel-title">Major Central Bank Rates <span class="badge">Illustrative</span></div>
        <table class="data-table" id="rates-table"><thead><tr><th>Central Bank</th><th>Rate</th></tr></thead><tbody></tbody></table>
      </div>
    </div>

    <div class="two-col">
      <div class="panel">
        <div class="panel-title">Global Market Status</div>
        <div id="global-exchange-status" style="display:flex; flex-direction:column; gap:10px;"></div>
      </div>
      <div class="panel">
        <div class="panel-title">Economic Calendar <span class="badge">Illustrative</span></div>
        <div id="econ-calendar" style="display:flex; flex-direction:column; gap:12px;"></div>
      </div>
    </div>
  </div>`
});

/* ---------------------------------------------------------------------
   9. AI IN FINANCE
--------------------------------------------------------------------- */
SECTIONS.push({
  id: 'ai-finance',
  html: `
  <div class="section-inner">
    <div class="section-head">
      <div class="section-index">09</div>
      <div class="section-title-wrap">
        <p class="eyebrow">The New Layer</p>
        <h2>AI in Finance</h2>
        <p>Machine learning now sits underneath most of modern finance — pricing risk, spotting fraud, and executing trades faster than any human could.</p>
      </div>
    </div>

    <div class="teach-grid">
      <div class="teach-card"><h3>Algorithmic trading</h3><p>Pre-programmed strategies that execute trades automatically based on price, timing, or statistical signals — no human in the loop.</p></div>
      <div class="teach-card"><h3>Machine learning</h3><p>Models that learn patterns from historical data to forecast prices, risk, or behavior, improving as more data arrives.</p></div>
      <div class="teach-card"><h3>Fraud detection</h3><p>Real-time anomaly detection that flags transactions inconsistent with a user's normal behavior, often within milliseconds.</p></div>
      <div class="teach-card"><h3>Risk analysis</h3><p>Models that estimate the probability and size of losses across a portfolio, stress-testing it against thousands of scenarios.</p></div>
      <div class="teach-card"><h3>Portfolio optimization</h3><p>Algorithms that balance expected return against risk to suggest the most efficient mix of assets for a given goal.</p></div>
      <div class="teach-card"><h3>The road ahead</h3><p>Expect more personalized advice, faster fraud response, and markets that react to news within seconds — alongside new questions about transparency and systemic risk.</p></div>
    </div>

    <div class="dash-label">Live Dashboard · Sentiment <span class="badge" style="margin-left:8px;">Demo Feed</span></div>
    <div class="two-col">
      <div class="panel">
        <div class="panel-title">AI Market Sentiment</div>
        <div class="gauge-wrap">
          <canvas id="sentiment-gauge" width="280" height="160"></canvas>
          <div class="gauge-label" id="sentiment-label">Neutral</div>
        </div>
      </div>
      <div class="panel">
        <div class="panel-title">Trending Financial Topics</div>
        <div id="topic-cloud" style="display:flex; flex-wrap:wrap; gap:10px;"></div>
      </div>
    </div>
  </div>`
});

/* ---------------------------------------------------------------------
   10. FINANCIAL ACADEMY
--------------------------------------------------------------------- */
SECTIONS.push({
  id: 'academy',
  html: `
  <div class="section-inner">
    <div class="section-head">
      <div class="section-index">10</div>
      <div class="section-title-wrap">
        <p class="eyebrow">Your Path</p>
        <h2>Financial Academy</h2>
        <p>A structured roadmap from first principles to professional-level fluency. Expand a level to see what it covers.</p>
      </div>
    </div>
    <div id="academy-accordion"></div>
  </div>`
});

/* ---------------------------------------------------------------------
   11. FINANCIAL NEWS
--------------------------------------------------------------------- */
SECTIONS.push({
  id: 'news',
  html: `
  <div class="section-inner">
    <div class="section-head">
      <div class="section-index">11</div>
      <div class="section-title-wrap">
        <p class="eyebrow">Stay Current</p>
        <h2>Financial News</h2>
        <p>Curated, categorized headlines. <span class="badge">Demo Feed — connect a news API for live headlines</span></p>
      </div>
    </div>
    <div class="filter-row">
      <input type="text" id="news-search" placeholder="Search headlines…" style="flex:1; min-width:220px; background:var(--bg2); border:1px solid var(--hairline); border-radius:999px; padding:10px 18px; color:var(--text); font-size:0.85rem;">
    </div>
    <div class="filter-row" id="news-filters"></div>
    <div class="news-list" id="news-list"></div>
  </div>`
});

/* ---------------------------------------------------------------------
   12. PERSONAL WATCHLIST
--------------------------------------------------------------------- */
SECTIONS.push({
  id: 'watchlist',
  html: `
  <div class="section-inner">
    <div class="section-head">
      <div class="section-index">12</div>
      <div class="section-title-wrap">
        <p class="eyebrow">Track What Matters</p>
        <h2>Personal Watchlist</h2>
        <p>Add stocks, crypto, currencies, gold, or indices to track in one place. Saved for this session <span class="badge">Live prices for crypto</span></p>
      </div>
    </div>
    <div class="panel">
      <div class="watch-add">
        <select id="watch-select"></select>
        <button class="btn btn-primary" id="watch-add-btn" style="flex-shrink:0;">Add to Watchlist</button>
      </div>
      <div id="watch-table-wrap"></div>
    </div>
  </div>`
});

/* ---------------------------------------------------------------------
   13. GLOBAL FINANCIAL OBSERVATORY (standalone full-bleed section)
--------------------------------------------------------------------- */
SECTIONS.push({
  id: 'observatory',
  fullBleed: true,
  html: `
  <div class="observatory-inner">
    <div class="section-inner">
      <div class="section-head">
        <div class="section-index">13</div>
        <div class="section-title-wrap">
          <p class="eyebrow">The Whole Picture</p>
          <h2>Global Financial Observatory</h2>
          <p>An interactive Earth linking the world's major financial hubs. Drag to rotate, scroll to zoom, hover a hub for a snapshot.</p>
        </div>
      </div>
      <div id="globe-canvas-wrap">
        <div class="globe-tooltip" id="globe-tooltip"></div>
        <div class="globe-fallback" id="globe-fallback">Your browser couldn't initialize the 3D globe. Try a different browser or enable hardware acceleration.</div>
      </div>
      <p class="globe-hint">Hubs shown: New York · London · Tokyo · Hong Kong · Frankfurt · Mumbai · Shanghai · Singapore · Sydney · Zürich</p>
    </div>
  </div>`
});

/* ---------------------------------------------------------------------
   REFERENCE DATA
--------------------------------------------------------------------- */
const DATA = {
  goldReserves: [
    ['United States', 8133], ['Germany', 3352], ['Italy', 2452], ['France', 2437],
    ['Russia', 2333], ['China', 2264], ['Switzerland', 1040], ['Japan', 846],
    ['India', 840], ['Netherlands', 612]
  ],
  gdpRankings: [
    ['United States', '$27.4T'], ['China', '$18.3T'], ['Germany', '$4.7T'],
    ['Japan', '$4.1T'], ['India', '$3.9T'], ['United Kingdom', '$3.5T'],
    ['France', '$3.1T'], ['Brazil', '$2.3T'], ['Italy', '$2.3T'], ['Canada', '$2.2T']
  ],
  centralBankRates: [
    ['US Federal Reserve', '4.25% – 4.50%'], ['European Central Bank', '3.15%'],
    ['Bank of England', '4.50%'], ['Reserve Bank of India', '6.25%'],
    ['Bank of Japan', '0.50%'], ["People's Bank of China", '3.10%'],
    ['Swiss National Bank', '0.50%']
  ],
  econCalendar: [
    ['Mon', 'US ISM Manufacturing PMI', 'High impact'],
    ['Tue', 'RBI Interest Rate Decision', 'High impact'],
    ['Wed', 'US CPI (Inflation) Release', 'High impact'],
    ['Thu', 'ECB Monetary Policy Statement', 'Medium impact'],
    ['Fri', 'US Non-Farm Payrolls', 'High impact']
  ],
  topics: ['Rate cuts', 'AI capex', 'Gold rally', 'Bitcoin ETFs', 'Chip exports',
    'Green energy', 'Sovereign debt', 'Stablecoins', 'De-dollarization', 'Earnings season'],
  academy: [
    { level: 'Beginner', topics: ['What is money', 'Budgeting basics', 'Saving vs investing', 'Bank accounts & interest', 'Understanding inflation', 'Reading a paycheck'] },
    { level: 'Intermediate', topics: ['Stock market fundamentals', 'Index funds & ETFs', 'Compound interest', 'Diversification', 'Understanding risk', 'Reading financial news'] },
    { level: 'Advanced', topics: ['Technical analysis', 'Options basics', 'Portfolio construction', 'Macro indicators', 'Valuation models', 'Tax-efficient investing'] },
    { level: 'Professional', topics: ['Derivatives & hedging', 'Quantitative strategies', 'Algorithmic trading', 'Behavioral finance', 'Alternative assets', 'Global macro strategy'] }
  ],
  news: [
    { cat: 'Stocks', title: 'Blue-chip indices grind to fresh highs as earnings beat expectations', time: '2h ago' },
    { cat: 'Crypto', title: 'Bitcoin holds key support level as ETF inflows continue', time: '3h ago' },
    { cat: 'Economy', title: 'Inflation print comes in softer than forecast, easing rate-cut bets', time: '5h ago' },
    { cat: 'Business', title: 'Wave of mid-cap IPOs signals reopening risk appetite', time: '7h ago' },
    { cat: 'Technology', title: 'AI infrastructure spending reshapes capex across the S&P 500', time: '9h ago' },
    { cat: 'Global Markets', title: 'Asian markets mixed as regional currencies firm against the dollar', time: '11h ago' },
    { cat: 'Crypto', title: 'Ethereum network activity climbs on renewed DeFi interest', time: '13h ago' },
    { cat: 'Stocks', title: 'Energy sector lags broader market on softer crude prices', time: '15h ago' }
  ],
  watchOptions: [
    { sym: 'AAPL', name: 'Apple Inc.', type: 'Stock' }, { sym: 'MSFT', name: 'Microsoft Corp.', type: 'Stock' },
    { sym: 'NVDA', name: 'NVIDIA Corp.', type: 'Stock' }, { sym: 'TSLA', name: 'Tesla Inc.', type: 'Stock' },
    { sym: 'bitcoin', name: 'Bitcoin', type: 'Crypto' }, { sym: 'ethereum', name: 'Ethereum', type: 'Crypto' },
    { sym: 'solana', name: 'Solana', type: 'Crypto' },
    { sym: 'XAU', name: 'Gold', type: 'Commodity' }, { sym: 'XAG', name: 'Silver', type: 'Commodity' },
    { sym: 'USDINR', name: 'USD / INR', type: 'Currency' }, { sym: 'EURUSD', name: 'EUR / USD', type: 'Currency' },
    { sym: 'NIFTY', name: 'Nifty 50', type: 'Index' }, { sym: 'SPX', name: 'S&P 500', type: 'Index' }
  ],
  hubs: [
    { name: 'New York', lat: 40.7, lon: -74.0, exch: 'NYSE / NASDAQ', tz: 'America/New_York', open: 9.5, close: 16 },
    { name: 'London', lat: 51.5, lon: -0.12, exch: 'London Stock Exchange', tz: 'Europe/London', open: 8, close: 16.5 },
    { name: 'Tokyo', lat: 35.68, lon: 139.7, exch: 'Tokyo Stock Exchange', tz: 'Asia/Tokyo', open: 9, close: 15 },
    { name: 'Hong Kong', lat: 22.3, lon: 114.17, exch: 'Hong Kong Exchange', tz: 'Asia/Hong_Kong', open: 9.5, close: 16 },
    { name: 'Frankfurt', lat: 50.1, lon: 8.68, exch: 'Deutsche Börse', tz: 'Europe/Berlin', open: 9, close: 17.5 },
    { name: 'Mumbai', lat: 19.07, lon: 72.87, exch: 'BSE / NSE', tz: 'Asia/Kolkata', open: 9.25, close: 15.5 },
    { name: 'Shanghai', lat: 31.23, lon: 121.47, exch: 'Shanghai Stock Exchange', tz: 'Asia/Shanghai', open: 9.5, close: 15 },
    { name: 'Singapore', lat: 1.35, lon: 103.82, exch: 'Singapore Exchange', tz: 'Asia/Singapore', open: 9, close: 17 },
    { name: 'Sydney', lat: -33.87, lon: 151.21, exch: 'Australian Securities Exchange', tz: 'Australia/Sydney', open: 10, close: 16 },
    { name: 'Zürich', lat: 47.37, lon: 8.54, exch: 'SIX Swiss Exchange', tz: 'Europe/Zurich', open: 9, close: 17.3 }
  ]
};
