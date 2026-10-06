# NUS CS Degree Planner

A free, single-page planner for the NUS B.Comp. (Computer Science) degree.

- Plan all 4 years (Semester 1, Semester 2 and Special Terms), and drag courses between terms
- Tick courses as completed and watch units fill every requirement bucket
- Checks focus areas (SWE and AI), level-4000 units, Industry Experience (6–12 units), the ID/CD rule, and UE overflow
- Optional **Mathematics second major** tracker with the 16-unit sharing limit
- Live course data from the [NUSMods API](https://api.nusmods.com/v2/): every course code, title and unit value, plus offered semesters and prerequisite warnings
- No account and no server. Your plan stays in your browser (Export/Import to back it up)

> Unofficial tool. Not affiliated with or endorsed by NUS. Requirements change by intake year, so always confirm with your EduRec degree audit.

## Run locally

Open `index.html` in a browser. That's it, there's no build step.

## Deploy free on GitHub Pages

1. Create a public repository on GitHub (for example `nus-planner`).
2. Upload `index.html`, `README.md` and `.nojekyll` to the repository root.
3. In the repository, go to **Settings → Pages**.
4. Under **Build and deployment**, set Source to **Deploy from a branch**, Branch to **main**, folder **/ (root)**, then **Save**.
5. After a minute, the site is live at `https://<your-username>.github.io/nus-planner/`.

Every push to `main` redeploys the site automatically.

## How it works

| Part | Where in `index.html` |
| --- | --- |
| Requirement buckets and caps | `BUCKETS`, `FOUND`, `MATH`, `FOCUS` |
| Allocation (fills buckets in term order, overflow to UE) | `allocate()` |
| Breadth & Depth checks | `bdChecks()` |
| Math second major | `ma2Assign()`, `ma2Checks()` |
| NUSMods data and prerequisite checks | `loadList()`, `ensureDetail()`, `evalTree()`, `issues()` |

NUSMods responses are cached in `localStorage` (course list for 7 days, course details per academic year), so the site stays fast and light on the API.
