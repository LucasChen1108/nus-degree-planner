# NUS Degree Planner

A free, single-page 4-year degree planner for NUS students.

- **55 majors across 5 faculties:**
  - **Computing:** Computer Science, Artificial Intelligence, Business Analytics, Business AI Systems, Information Security
  - **Science (CHS):** Chemistry, Life Sciences, Mathematics, Physics, Statistics, Data Science & Analytics, Quantitative Finance, Food Science & Technology, Pharmaceutical Science, Data Science & Economics
  - **Arts & Social Sciences (CHS):** Economics, Psychology, Political Science, History, Philosophy, Sociology, Anthropology, Chinese Language, Chinese Studies, Communications & New Media, English Language & Linguistics, English Literature, Geography, Global Studies, Japanese Studies, Malay Studies, Social Work, South Asian Studies, Southeast Asian Studies, Theatre & Performance Studies
  - **Engineering (CDE):** Biomedical, Mechanical, Environmental & Sustainability, Materials Science, Industrial & Systems, Electrical, Computer, Chemical, Civil, Robotics & Machine Intelligence
  - **Business:** Finance, Marketing, Leadership & Human Capital Management, Operations & Supply Chain, Business Analytics, Business Economics, Innovation & Entrepreneurship, Accountancy, Real Estate
  - **Any other programme:** enter your own requirement groups with the Custom programme option
- **Residential colleges:** UTCP (Tembusu, CAPT, RC4, Acacia), Ridge View and NUS College courses count toward the requirements they replace for your faculty
- **Second majors:** Mathematics, Statistics, Quantitative Finance, Economics, Management, Computer Science, Business Analytics, Information Security
- **Minors (up to three):** Mathematics, Statistics, Economics, Artificial Intelligence, Computer Science, Business Analytics, Information Security, Interactive Media Development
- **Specialisations:** CS focus areas, Business Analytics, Business AI Systems, Mathematics, Life Sciences, Economics and Electrical Engineering specialisations, with their own sample plans. Pick more than one if you plan to do several; leave them all unticked for the general sample plan
- **Double degrees:** the specially designed NUS double degrees plus ad hoc combinations. Adds the second degree's requirements, a 5th year and the 200-unit / 32-unit double-counting checks
- Plan Semester 1, Semester 2 and Special Terms for 4 years (5 for a double degree), and drag courses between terms
- Mark your current semester (or any course) as in progress, so you can see what you've completed, what you're taking now and what's still planned
- Tick courses as completed and watch every requirement group fill up: pillars, ID/CD, foundations, breadth & depth, focus areas, level-4000 units, Industry Experience and UE overflow
- Sharing limits for second majors (16 units) and minors (8 units), plus a warning when a course would be counted three times
- Live course data from the [NUSMods API](https://api.nusmods.com/v2/): every course code, title and unit value, plus offered semesters and prerequisite warnings
- No account and no server. Your plan stays in your browser (Export/Import to back it up)

> Unofficial tool. Not affiliated with or endorsed by NUS. Requirements change by intake year, so always confirm with your EduRec degree audit.

## Files

| File | What it is |
| --- | --- |
| `index.html` | The whole app: layout, requirement engine, drag and drop, NUSMods connection |
| `programmes.js` | Requirement data for every major, second major, minor and residential college, with links to the official sources. Majors marked `simplified` match electives by course prefix |
| `.nojekyll` | Tells GitHub Pages to serve the files as they are |

## Adding or fixing a programme

Found a wrong requirement? [Open an issue](https://github.com/lucaschen1108/nus-degree-planner/issues).


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
