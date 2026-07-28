# Wend Archive Growth Design

## Outcome

Complete the verified LinkedIn Wend archive without publishing guessed data, then turn that complete dataset into more useful daily pages, archive discovery, and an original statistics page.

The smallest acceptable outcome is:

1. Every released puzzle from Wend #1 through the newest verified puzzle has one permanent, self-canonical detail page.
2. Every backfilled record passes source quorum and the existing geometry validator.
3. Detail pages include puzzle-derived facts instead of repeated filler.
4. The archive can be filtered in the browser without creating indexable URL combinations.
5. `/linkedin-wend-statistics` publishes transparent aggregates calculated only from verified records.

## Data integrity boundary

Historical pages are public only when all of these checks pass:

- Primary source: `https://wendanswertoday.me/archive` supplies the complete grid, answer words, and ordered cell paths.
- Secondary source: `https://wendgames.org/src/answers-data.js` supplies the same date, puzzle number, and answer words. Wend #7 uses an audited snapshot from `https://www.followchain.org/linkedin-wend-answer-today-june-15-2026/` because the WendGames dataset incorrectly says `CONSISTS` instead of the path-validated `CONSIST`; Wend #9 uses an audited snapshot from `https://wendanswer.com/archive/9` because the WendGames dataset omits June 17. These two explicit overrides contain only date, number, words, and source URL; all geometry still comes from the primary archive and must pass validation.
- `preparePublicPuzzle()` confirms date, number, and normalized word-list agreement.
- `validateWendPuzzle()` confirms a rectangular grid, valid coordinates, orthogonal movement, correct spelling, no cell reuse, and exact coverage of all open cells.
- The stored `publication.sourceHash` must equal the normalized puzzle source hash.

No page is generated from screenshots alone, a single uncorroborated source, or inferred paths.

## P0-2: reproducible historical backfill

Add a small historical backfill parser and command instead of manually transcribing 20 JSON files. It isolates each archive item by `data-puzzle-number`, reuses the same cell attributes understood by the daily importer, verifies the secondary record, builds publication provenance, validates geometry, and writes only the explicitly requested missing puzzle numbers.

Add a dataset-level test that validates every JSON file and asserts unique dates/numbers, filename/date agreement, date-label agreement, and provenance hash agreement. This closes the current gap where generated imports can include malformed historical JSON without running the validator.

## P0-3: puzzle-derived unique content

Add pure metrics helpers that calculate:

- grid rows and columns;
- open and blocked cells;
- answer count and shortest, longest, and average word length;
- total path turns and the most winding answer;
- edge and corner start counts.

Detail pages render a compact “Puzzle facts” section and one natural summary generated from those metrics. Existing editorial hints and explanations remain; repeated boilerplate is not expanded. The facts are deterministic and auditable from the grid and paths.

## P1-1: archive discovery

Keep the archive page server-rendered and indexable. Convert only the list into a client component with reversible filters for puzzle/date text, month, difficulty, and grid size. Filters remain local state, so query combinations do not create crawlable duplicates. All result cards keep normal server-rendered links.

Coverage copy reports verified count, first and latest puzzle, and missing numbers. Month chips are generated from data instead of hard-coded to June 2026.

## P1-2: original statistics page

Create `/linkedin-wend-statistics` from the same pure metrics module. Publish:

- verified puzzle and date coverage;
- totals and averages for open cells, blocked cells, answers, word length, and turns;
- most common grid sizes and difficulty labels;
- longest word and most winding path with links to their puzzle pages;
- monthly coverage table;
- a transparent methodology note explaining that difficulty labels are editorial and all other figures are calculated from verified JSON.

The page gets self-canonical metadata, breadcrumb structured data, sitemap inclusion, and internal links from Archive and related navigation. It does not claim causal difficulty rankings from insufficient data.

## Verification

- Parser unit tests cover archive isolation, blocked cells, word ordering, and secondary disagreement.
- Dataset validation covers every stored Wend JSON record.
- Archive coverage asserts no gaps from #1 through the latest verified puzzle.
- Metrics unit tests use a small hand-checked puzzle.
- SEO tests cover statistics metadata, sitemap inclusion, and internal links.
- Full repository tests, typecheck, production build, local smoke, and responsive browser checks pass.
- After deployment: every newly added detail URL returns 200 with one H1 and self-canonical metadata; the sitemap contains all verified daily URLs and no deprecated Today URL.
