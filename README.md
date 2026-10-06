# NUS SoC Degree Planner

A free, single-page 4-year planner for NUS School of Computing students.

- **Every current SoC major:** Computer Science, Artificial Intelligence, Business Analytics, Business AI Systems and Information Security (cohorts AY2025/26 and AY2026/27)
- **Second majors:** Mathematics, Statistics, Quantitative Finance, Economics, Management, Computer Science, Business Analytics, Information Security
- **Minors (up to two):** Mathematics, Statistics, Economics, Artificial Intelligence, Computer Science, Business Analytics, Information Security, Interactive Media Development
- Plan Semester 1, Semester 2 and Special Terms for 4 years, and drag courses between terms
- Tick courses as completed and watch every requirement group fill up: pillars, ID/CD, foundations, breadth & depth, focus areas, level-4000 units, Industry Experience and UE overflow
- Sharing limits for second majors (16 units) and minors (8 units), plus a warning when a course would be counted three times
- Live course data from the [NUSMods API](https://api.nusmods.com/v2/): every course code, title and unit value, plus offered semesters and prerequisite warnings
- No account and no server. Your plan stays in your browser (Export/Import to back it up)

> Unofficial tool. Not affiliated with or endorsed by NUS. Requirements change by intake year, so always confirm with your EduRec degree audit.

## Files

| File | What it is |
| --- | --- |
| `index.html` | The whole app: layout, requirement engine, drag and drop, NUSMods connection |
| `programmes.js` | Requirement data for every major, second major and minor, with links to the official sources |
| `.nojekyll` | Tells GitHub Pages to serve the files as they are |

## Adding or fixing a programme

Every programme lives in `programmes.js` as a list of requirement groups. The comment at the top of that file explains the format:

```js
{k:"math", name:"Mathematics & Sciences", short:"Math", units:12, reqs:[
  {label:"MA1521 Calculus for Computing", any:["MA1521"]},
  {label:"MA1522 Linear Algebra for Computing", any:["MA1522"]},
  {label:"ST2334 Probability and Statistics", any:["ST2334"]}]}
```

Patterns: `CS2040S` exact code, `GEC%` any code starting with GEC, `MA32xx` any digits, `CS[3-9]%` level 3000+, `!ST328%` exclude, `@ID` / `@CD` tagged courses, `@4+` level 4000 or higher.

How courses are counted:
1. Each course fills the first matching required slot.
2. Leftover courses fill elective pools, respecting caps such as "at most 12 units of Industry Experience".
3. Anything else overflows to Unrestricted Electives.
4. A repair step swaps courses between a pool and UE so rules like "12 units at level 4000" are met, the way a degree audit would count them.

Second majors and minors are counted the same way, preferring courses that don't already count for your major, so sharing stays within the limit.

## Run locally

Open `index.html` in a browser. There's no build step.

## Deploy on GitHub Pages

1. Push these files to the root of a public GitHub repository.
2. Go to **Settings → Pages**, set Source to **Deploy from a branch**, choose **main** and **/ (root)**, and save.
3. The site goes live at `https://<username>.github.io/<repository>/` and redeploys on every push.
