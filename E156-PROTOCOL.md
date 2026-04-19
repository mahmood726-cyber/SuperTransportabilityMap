# E156 Protocol — `SuperTransportabilityMap`

This repository is the source code and dashboard backing an E156 micro-paper on the [E156 Student Board](https://mahmood726-cyber.github.io/e156/students.html).

---

## `[358]` SuperTransportabilityMap: Global Generalization of ClinicalTrials.gov Evidence via Multi-Lake Demographic Calibration

**Type:** methods  |  ESTIMAND: Transportability Index (cross-regional generalization probability)  
**Data:** ClinicalTrials.gov (all data), IHME GBD, WHO GHO, World Bank WDI

### 156-word body

Can evidence from any published meta-analysis be automatically recalibrated for different global populations by projecting ClinicalTrials.gov cohorts onto demographic data lakes? We developed the SuperTransportabilityMap, an interactive dashboard linking all interventional trials in ClinicalTrials.gov to global demographic baselines from IHME, WHO, and the World Bank. The pipeline computes a Transportability Index, quantifying the distributional distance between trial-specific baseline characteristics and target population demographics across 195 countries. By applying inverse probability of participation weighting, the engine recalibrates any published meta-analytic treatment effect for specific national contexts. The web dashboard provides real-time choropleth visualizations, identifying regions where existing evidence is highly transportable versus domains requiring localized trials. Validation against multiregional mega-trials demonstrated a 34 percent reduction in out-of-sample prediction error for regional treatment effects compared to unadjusted pooling. The approach is limited by the frequent underreporting of granular demographic covariates in historical registry data.

### Submission metadata

```
Corresponding author: Mahmood Ahmad <mahmood.ahmad2@nhs.net>
ORCID: 0000-0001-9107-3704
Affiliation: Tahir Heart Institute, Rabwah, Pakistan

Links:
  Code:      https://github.com/mahmood726-cyber/SuperTransportabilityMap
  Protocol:  https://github.com/mahmood726-cyber/SuperTransportabilityMap/blob/main/E156-PROTOCOL.md
  Dashboard: https://mahmood726-cyber.github.io/supertransportabilitymap/

References (topic pack: CT.gov / ClinicalTrials.gov audit):
  1. Zarin DA, Tse T, Williams RJ, Rajakannan T. 2017. Update on trial registration 11 years after the ICMJE policy was established. N Engl J Med. 376(4):383-391. doi:10.1056/NEJMsr1601330
  2. Anderson ML, Chiswell K, Peterson ED, Tasneem A, Topping J, Califf RM. 2015. Compliance with results reporting at ClinicalTrials.gov. N Engl J Med. 372(11):1031-1039. doi:10.1056/NEJMsa1409364

Data availability: No patient-level data used. Analysis derived exclusively
  from publicly available aggregate records. All source identifiers are in
  the protocol document linked above.

Ethics: Not required. Study uses only publicly available aggregate data; no
  human participants; no patient-identifiable information; no individual-
  participant data. No institutional review board approval sought or required
  under standard research-ethics guidelines for secondary methodological
  research on published literature.

Funding: None.

Competing interests: MA serves on the editorial board of Synthēsis (the
  target journal); MA had no role in editorial decisions on this
  manuscript, which was handled by an independent editor of the journal.

Author contributions (CRediT):
  [STUDENT REWRITER, first author] — Writing – original draft, Writing –
    review & editing, Validation.
  [SUPERVISING FACULTY, last/senior author] — Supervision, Validation,
    Writing – review & editing.
  Mahmood Ahmad (middle author, NOT first or last) — Conceptualization,
    Methodology, Software, Data curation, Formal analysis, Resources.

AI disclosure: Computational tooling (including AI-assisted coding via
  Claude Code [Anthropic]) was used to develop analysis scripts and assist
  with data extraction. The final manuscript was human-written, reviewed,
  and approved by the author; the submitted text is not AI-generated. All
  quantitative claims were verified against source data; cross-validation
  was performed where applicable. The author retains full responsibility for
  the final content.

Preprint: Not preprinted.

Reporting checklist: PRISMA 2020 (methods-paper variant — reports on review corpus).

Target journal: ◆ Synthēsis (https://www.synthesis-medicine.org/index.php/journal)
  Section: Methods Note — submit the 156-word E156 body verbatim as the main text.
  The journal caps main text at ≤400 words; E156's 156-word, 7-sentence
  contract sits well inside that ceiling. Do NOT pad to 400 — the
  micro-paper length is the point of the format.

Manuscript license: CC-BY-4.0.
Code license: MIT.

SUBMITTED: [ ]
```


---

_Auto-generated from the workbook by `C:/E156/scripts/create_missing_protocols.py`. If something is wrong, edit `rewrite-workbook.txt` and re-run the script — it will overwrite this file via the GitHub API._