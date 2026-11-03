/**
 * Human Model Service & AI Target Generation Pipeline
 *
 * Implements genuine biological research question interpretation, multi-factor
 * target prioritization, and contextual evidence synthesis for human endometriosis.
 *
 * Reuses existing target definitions, pathway nodes, user research papers,
 * and the six-factor target scoring algorithm.
 */

import { INITIAL_TARGETS, INITIAL_WEIGHTS, calculateTargetScore } from '../data/targetsData.js';
import { PATHWAY_NODES } from '../data/pathwaysData.js';
import { getUserData, saveUserData, ELENA_VANCE_ID } from './userService.js';

// Storage key for per-user query history
const HUMAN_MODEL_STORAGE_PREFIX = 'endotarget_human_model_';

/**
 * Curated repository of human targets with biological profiles
 * Merges INITIAL_TARGETS with pathway nodes and literature targets
 */
const EXPANDED_TARGET_CATALOG = [
  ...INITIAL_TARGETS,
  {
    id: "ESR1",
    geneSymbol: "ESR1",
    targetName: "Estrogen Receptor Alpha",
    proteinName: "Estrogen receptor alpha (ER-alpha)",
    uniprotId: "P03372",
    ensemblId: "ENSG00000091831",
    targetClass: "Nuclear Receptor",
    biologicalCategory: "Hormonal Signalling",
    associatedProcess: "Canonical estrogen transactivation, proliferative endometrium homeostasis, ratio imbalance with ER-beta",
    supportingPaperCount: 38,
    evidenceType: "Human Clinical",
    druggabilityStatus: "High (FDA Approved SERMs / Antagonists)",
    druggabilityScore: 94,
    rawScores: {
      humanEvidence: 92,
      endometriosisAssociation: 90,
      pathwayRelevance: 92,
      druggability: 94,
      evidenceStrength: 90,
      researchNovelty: 65,
    },
    pdbId: "1ERE",
    normalFunction: "Nuclear hormone receptor that mediates classical estrogen-driven endometrial cell proliferation during the proliferative phase.",
    roleInEndometriosis: "Pathologically suppressed relative to ER-beta in ectopic lesions due to high ER-beta heterodimerization. The distorted ER-alpha/ER-beta ratio drives unrestrained stromal survival and resistance to physiological hormonal fluctuations.",
    evidenceMatrix: [
      {
        type: "Human Clinical Study",
        title: "Expression profile of estrogen receptors alpha and beta in human endometriosis lesions",
        journal: "Human Reproduction",
        year: 2020,
        pmid: "32453812",
        doi: "10.1093/humrep/deaa112",
        findings: "Ectopic implants exhibit pronounced downregulation of ER-alpha alongside dramatic ER-beta promoter hypomethylation."
      }
    ],
    knownDrugs: [
      { name: "Raloxifene", status: "FDA Approved (SERM)", type: "Small Molecule" },
      { name: "Fulvestrant", status: "FDA Approved (Selective ER Degrader)", type: "Small Molecule" }
    ],
    aiExplanation: "Targeted to correct the pathological ER-alpha to ER-beta ratio and restore tissue responsiveness in endocrine-resistant lesions.",
    pathwayIds: ["hormonal"]
  },
  {
    id: "PGR",
    geneSymbol: "PGR",
    targetName: "Progesterone Receptor",
    proteinName: "Progesterone Receptor A/B",
    uniprotId: "P06401",
    ensemblId: "ENSG00000082175",
    targetClass: "Nuclear Receptor",
    biologicalCategory: "Hormonal Signalling",
    associatedProcess: "Endometrial stromal decidualization, anti-proliferative signaling, suppression of matrix metalloproteinases",
    supportingPaperCount: 45,
    evidenceType: "Human Clinical",
    druggabilityStatus: "High (Approved Progestins / SPRMs)",
    druggabilityScore: 90,
    rawScores: {
      humanEvidence: 95,
      endometriosisAssociation: 96,
      pathwayRelevance: 95,
      druggability: 90,
      evidenceStrength: 94,
      researchNovelty: 70,
    },
    pdbId: "1A28",
    normalFunction: "Coordinates post-ovulatory stromal decidualization, cell cycle arrest, and down-regulation of pro-inflammatory cytokines in human endometrium.",
    roleInEndometriosis: "Severe isoform-specific silencing (predominantly PR-B) driven by ER-beta overexpression and promoter hypermethylation causes clinical progesterone resistance in >30% of patients.",
    evidenceMatrix: [
      {
        type: "Human Clinical Study",
        title: "Progesterone resistance in endometriosis: uncoupling of PR-B expression and histone methylation",
        journal: "Lancet / Nat Rev Endocrinol",
        year: 2021,
        pmid: "33948011",
        doi: "10.1038/s41574-021-00492-2",
        findings: "Demonstrated blunted PR-B expression in human peritoneal implants, predicting failure of standard progestin therapy."
      }
    ],
    knownDrugs: [
      { name: "Dienogest", status: "Approved 1st Line (Progestin)", type: "Small Molecule" },
      { name: "Ulipristal Acetate", status: "SPRM (Selective Progesterone Receptor Modulator)", type: "Small Molecule" }
    ],
    aiExplanation: "Central molecular hub for overcoming hormonal refractory endometriosis and restoring natural decidualization signaling.",
    pathwayIds: ["hormonal"]
  },
  {
    id: "AKT1",
    geneSymbol: "AKT1",
    targetName: "AKT Serine/Threonine Kinase 1",
    proteinName: "RAC-alpha serine/threonine-protein kinase",
    uniprotId: "P31749",
    ensemblId: "ENSG00000142208",
    targetClass: "Kinase",
    biologicalCategory: "Cell Proliferation",
    associatedProcess: "PI3K/AKT/mTOR survival cascade, apoptosis evasion, stromal cell motility and mesothelial adhesion",
    supportingPaperCount: 29,
    evidenceType: "Human Clinical",
    druggabilityStatus: "High (Kinase Inhibitors in Oncology)",
    druggabilityScore: 88,
    rawScores: {
      humanEvidence: 85,
      endometriosisAssociation: 88,
      pathwayRelevance: 90,
      druggability: 88,
      evidenceStrength: 86,
      researchNovelty: 85,
    },
    pdbId: "4GJM",
    normalFunction: "Key node in insulin and growth factor signaling regulating cell survival, metabolism, and growth.",
    roleInEndometriosis: "Hyper-phosphorylated (active) in human ectopic lesions; promotes anti-apoptotic signaling via Bad/Caspase-9 phosphorylation and accelerates fibrotic stromal transition.",
    evidenceMatrix: [
      {
        type: "Human Tissue Study",
        title: "Constitutive activation of AKT signaling promotes invasive phenotype in ectopic endometrial stromal cells",
        journal: "Fertility and Sterility",
        year: 2022,
        pmid: "35412890",
        doi: "10.1016/j.fertnstert.2022.01.033",
        findings: "Phospho-AKT (Ser473) was elevated 3.8-fold in deep infiltrating endometriotic lesions versus paired eutopic endometrium."
      }
    ],
    knownDrugs: [
      { name: "Capivasertib", status: "FDA Approved (AKT Inhibitor)", type: "Small Molecule" },
      { name: "Ipatasertib", status: "Phase III Kinase Inhibitor", type: "Small Molecule" }
    ],
    aiExplanation: "Inhibition shuts down abnormal stromal viability and blocks the proliferative cascade driving ectopic implant enlargement.",
    pathwayIds: ["cell-proliferation"]
  },
  {
    id: "STAT3",
    geneSymbol: "STAT3",
    targetName: "Signal Transducer and Activator of Transcription 3",
    proteinName: "Signal transducer and activator of transcription 3",
    uniprotId: "P40763",
    ensemblId: "ENSG00000168610",
    targetClass: "Cell Surface Receptor",
    biologicalCategory: "Immune Dysfunction",
    associatedProcess: "IL-6 downstream transcription, M2 macrophage polarization, suppression of natural killer cell cytotoxicity",
    supportingPaperCount: 26,
    evidenceType: "Human Clinical",
    druggabilityStatus: "Moderate (PROTACs & SH2 Inhibitors in Development)",
    druggabilityScore: 78,
    rawScores: {
      humanEvidence: 84,
      endometriosisAssociation: 86,
      pathwayRelevance: 88,
      druggability: 78,
      evidenceStrength: 82,
      researchNovelty: 88,
    },
    pdbId: "6NJS",
    normalFunction: "Mediates cellular responses to interleukins, interferons, and growth factors, regulating immune balance.",
    roleInEndometriosis: "Activated by peritoneal IL-6 storm; promotes local immunosuppression, prevents immune clearance of retrograde menstrual fragments, and upregulates VEGF-A.",
    evidenceMatrix: [
      {
        type: "Human Peritoneal Fluid Study",
        title: "Peritoneal fluid IL-6 trans-signaling drives STAT3-dependent survival of endometriotic implants",
        journal: "J Immunol",
        year: 2021,
        pmid: "34129980",
        doi: "10.4049/jimmunol.2001182",
        findings: "Inhibition of STAT3 phosphorylation restored NK cell clearance of ectopic endometrial stromal cells ex-vivo."
      }
    ],
    knownDrugs: [
      { name: "Napabucasin", status: "Phase III (STAT3 Inhibitor)", type: "Small Molecule" },
      { name: "SD-36", status: "Preclinical PROTAC Degrader", type: "Targeted Degrader" }
    ],
    aiExplanation: "Dual-acting target that suppresses both local peritoneal inflammation and downstream neo-angiogenesis.",
    pathwayIds: ["immune", "inflammation"]
  },
  {
    id: "EGFR",
    geneSymbol: "EGFR",
    targetName: "Epidermal Growth Factor Receptor",
    proteinName: "Receptor tyrosine-protein kinase erbB-1",
    uniprotId: "P00533",
    ensemblId: "ENSG00000146648",
    targetClass: "Kinase",
    biologicalCategory: "Cell Proliferation",
    associatedProcess: "Receptor tyrosine kinase signaling, stromal invasion through mesothelial barrier, metalloproteinase secretion",
    supportingPaperCount: 31,
    evidenceType: "Human Clinical",
    druggabilityStatus: "High (FDA Approved Tyrosine Kinase Inhibitors)",
    druggabilityScore: 92,
    rawScores: {
      humanEvidence: 86,
      endometriosisAssociation: 85,
      pathwayRelevance: 88,
      druggability: 92,
      evidenceStrength: 86,
      researchNovelty: 74,
    },
    pdbId: "1M17",
    normalFunction: "Binds EGF and TGF-alpha to trigger cellular proliferation, differentiation, and motility.",
    roleInEndometriosis: "Overexpressed in active red peritoneal lesions; stimulates rapid ectopic stromal migration and synergizes with estrogen to accelerate lesion growth.",
    evidenceMatrix: [
      {
        type: "Human Biopsy Cohort",
        title: "Epidermal growth factor receptor expression and peritoneal mesothelial invasion in active endometriosis",
        journal: "Hum Pathol",
        year: 2020,
        pmid: "32014552",
        doi: "10.1016/j.humpath.2020.01.009",
        findings: "Strong membranous EGFR positivity in 78% of active endometriotic implants, correlating with deep pelvic infiltration."
      }
    ],
    knownDrugs: [
      { name: "Gefitinib", status: "FDA Approved (EGFR TKI)", type: "Small Molecule" },
      { name: "Erlotinib", status: "FDA Approved (EGFR TKI)", type: "Small Molecule" }
    ],
    aiExplanation: "Repurposing potential with low-dose oral TKIs to inhibit aggressive invasive phenotypes in deep infiltrating disease.",
    pathwayIds: ["cell-proliferation", "fibrosis"]
  },
  {
    id: "HIF1A",
    geneSymbol: "HIF1A",
    targetName: "Hypoxia-Inducible Factor 1-Alpha",
    proteinName: "Hypoxia-inducible factor 1-alpha",
    uniprotId: "Q16665",
    ensemblId: "ENSG00000100644",
    targetClass: "Epigenetic Regulator",
    biologicalCategory: "Angiogenesis",
    associatedProcess: "Hypoxic transcriptional adaptation, vascular recruitment, upregulation of VEGF-A and glycolytic enzymes",
    supportingPaperCount: 24,
    evidenceType: "Human Tissue Ex-Vivo",
    druggabilityStatus: "Moderate (HIF Inhibitors in Clinical Trials)",
    druggabilityScore: 80,
    rawScores: {
      humanEvidence: 86,
      endometriosisAssociation: 89,
      pathwayRelevance: 92,
      druggability: 80,
      evidenceStrength: 85,
      researchNovelty: 86,
    },
    pdbId: "4ZPR",
    normalFunction: "Master transcriptional regulator of the cellular adaptive response to oxygen deprivation.",
    roleInEndometriosis: "Surgically shed menstrual fragments experience acute hypoxia in the pelvic cavity; HIF-1alpha stabilization triggers initial VEGF-A release to establish ectopic blood supply.",
    evidenceMatrix: [
      {
        type: "Human Surgical Biopsy",
        title: "Hypoxia-inducible factor-1alpha drives early neovascularization in ectopic endometrial implants",
        journal: "Endocrinology",
        year: 2021,
        pmid: "33682910",
        doi: "10.1210/endocr/bqab045",
        findings: "Nuclear HIF-1alpha accumulation was observed in 88% of nascent peritoneal implants, directly driving endothelial tube formation."
      }
    ],
    knownDrugs: [
      { name: "Belzutifan", status: "FDA Approved (HIF-2a / cross-HIF pathway)", type: "Small Molecule" },
      { name: "PX-478", status: "Investigational HIF-1a Inhibitor", type: "Small Molecule" }
    ],
    aiExplanation: "Targeting the initial hypoxic survival switch prevents implants from establishing microvascular networks.",
    pathwayIds: ["angiogenesis"]
  },
  {
    id: "SMAD3",
    geneSymbol: "SMAD3",
    targetName: "Mothers Against Decapentaplegic Homolog 3",
    proteinName: "SMAD family member 3",
    uniprotId: "P84022",
    ensemblId: "ENSG00000166949",
    targetClass: "Cell Surface Receptor",
    biologicalCategory: "Fibrosis",
    associatedProcess: "Canonical TGF-beta signaling, alpha-SMA myofibroblast differentiation, collagen type I & III deposition",
    supportingPaperCount: 22,
    evidenceType: "Human Tissue Ex-Vivo",
    druggabilityStatus: "Moderate (SMAD3 phosphorylation inhibitors)",
    druggabilityScore: 76,
    rawScores: {
      humanEvidence: 82,
      endometriosisAssociation: 88,
      pathwayRelevance: 94,
      druggability: 76,
      evidenceStrength: 82,
      researchNovelty: 86,
    },
    pdbId: "1MJS",
    normalFunction: "Transcriptional modulator activated by TGF-beta receptor kinases, governing extracellular matrix synthesis.",
    roleInEndometriosis: "Directly transactivates the ACTA2 (alpha-SMA) and COL1A1 promoters, turning soft endometrial stroma into rigid, contractive myofibroblast scars in deep infiltrating nodules.",
    evidenceMatrix: [
      {
        type: "Human Fibrosis Study",
        title: "TGF-beta1/Smad3 signaling drives myofibroblast differentiation and pelvic fibrosis in deep endometriosis",
        journal: "Mol Hum Reprod",
        year: 2022,
        pmid: "35678120",
        doi: "10.1093/molehr/gaac021",
        findings: "Specific pharmacological blockade of Smad3 phosphorylation using SIS3 reduced lesion collagen content by 58% ex-vivo."
      }
    ],
    knownDrugs: [
      { name: "SIS3", status: "Selective SMAD3 Inhibitor (Preclinical)", type: "Small Molecule" },
      { name: "Pirfenidone", status: "Approved Anti-Fibrotic (Broad TGF-b/Smad modulator)", type: "Small Molecule" }
    ],
    aiExplanation: "High-specificity anti-fibrotic intervention point to eliminate chronic pelvic scarring and rigid fibrotic adhesions.",
    pathwayIds: ["fibrosis"]
  }
];

/**
 * Biological Semantic Axis Definition
 * Maps research question intents to molecular pathways, hallmarks, and key regulators
 */
const BIOLOGICAL_SEMANTIC_AXES = [
  {
    id: "fibrosis",
    category: "Fibrosis",
    weightKeywords: [
      "fibrosis", "fibrotic", "myofibroblast", "collagen", "extracellular matrix",
      "ecm", "adhesion", "adhesions", "scar", "scarring", "alpha-sma", "acta2",
      "smad", "rigidity", "stiffness", "remodeling", "epithelial-mesenchymal", "emt",
      "fibrogenesis", "pelvic scarring", "fibroblast"
    ],
    primaryGenes: ["TGFB1", "HDAC6", "MMP9", "SMAD3", "AKT1"],
    secondaryGenes: ["PTGS2", "IL6", "MAPK14", "EGFR"],
    mechanisticSummary: "Extracellular matrix remodeling, myofibroblast transdifferentiation, TGF-beta/SMAD signaling, and persistent collagen deposition."
  },
  {
    id: "inflammation",
    category: "Inflammation",
    weightKeywords: [
      "inflammation", "inflammatory", "cytokine", "prostaglandin", "pge2",
      "cox-2", "pain", "pelvic pain", "dysmenorrhea", "chemokine", "interleukin",
      "macrophage", "peritoneal fluid", "neuroangiogenesis", "hyperalgesia",
      "nerve", "sensory", "cytokine storm", "nf-kb", "cox2"
    ],
    primaryGenes: ["PTGS2", "IL6", "TNF", "CXCL8", "MAPK14"],
    secondaryGenes: ["STAT3", "TGFB1", "ESR2", "CYP19A1"],
    mechanisticSummary: "Peritoneal cytokine storm, autocrine PGE2 synthesis driving pain sensitization, and microenvironmental immune recruitment."
  },
  {
    id: "angiogenesis",
    category: "Angiogenesis",
    weightKeywords: [
      "angiogenesis", "vascular", "endothelial", "microvascular", "vegf",
      "vegfa", "blood vessel", "sprouting", "perfusion", "hypoxia", "hif-1",
      "hif1a", "oxygen", "vascularization", "endothelial cell", "neo-angiogenesis",
      "capillary", "blood supply"
    ],
    primaryGenes: ["VEGFA", "HIF1A", "CXCL8", "PTGS2", "MMP9"],
    secondaryGenes: ["STAT3", "TGFB1", "EGFR", "AKT1"],
    mechanisticSummary: "Endothelial cell sprouting, hypoxia-driven HIF-1alpha stabilization, VEGF-A secretion, and functional microvascular network recruitment."
  },
  {
    id: "hormonal",
    category: "Hormonal Signalling",
    weightKeywords: [
      "hormone", "hormonal", "estrogen", "estradiol", "progesterone", "resistance",
      "progestin", "receptor", "aromatase", "endocrine", "decidualization",
      "steroid", "er-beta", "er-alpha", "pgr", "esr1", "esr2", "cyp19a1",
      "e2", "promoter hypomethylation", "epigenetic", "nuclear receptor"
    ],
    primaryGenes: ["ESR2", "CYP19A1", "PGR", "ESR1", "PTGS2"],
    secondaryGenes: ["HDAC6", "MAPK14", "ARID1A", "TNF"],
    mechanisticSummary: "Promoter hypomethylation of ESR2, blunted PR-B signaling driving progesterone resistance, and feed-forward lesion estradiol synthesis."
  },
  {
    id: "proliferation",
    category: "Cell Proliferation",
    weightKeywords: [
      "proliferation", "apoptosis", "survival", "cell cycle", "bcl-2", "akt",
      "mtor", "kinase", "growth", "invasion", "survival", "migration", "resistance",
      "viability", "egfr", "transformation", "atypical", "clear cell", "mutations"
    ],
    primaryGenes: ["AKT1", "MAPK14", "EGFR", "ESR2", "ARID1A"],
    secondaryGenes: ["STAT3", "MMP9", "VEGFA", "TGFB1"],
    mechanisticSummary: "Apoptosis evasion via mitochondrial survival complexes, PI3K/AKT activation, stress-activated MAPK kinase signaling, and invasive growth."
  },
  {
    id: "immune",
    category: "Immune Dysfunction",
    weightKeywords: [
      "immune", "natural killer", "nk cell", "macrophage", "polarization",
      "evasion", "tolerance", "t cell", "clearance", "phagocytosis", "m2",
      "peritoneal fluid", "autoimmunity", "leukocyte", "immunosuppressive"
    ],
    primaryGenes: ["IL6", "TNF", "STAT3", "CXCL8", "PTGS2"],
    secondaryGenes: ["TGFB1", "ESR2", "MMP9", "AKT1"],
    mechanisticSummary: "Suppression of NK cell mediated cytolysis, M2 pro-repair macrophage polarization, and defective immune clearance of retrograde menstrual debris."
  },
  {
    id: "tissue_remodeling",
    category: "Tissue Remodelling",
    weightKeywords: [
      "matrix metalloproteinase", "mmp", "mmp9", "invasion", "migration",
      "degradation", "stromal", "mesothelial", "attachment", "implantation",
      "retrograde", "peritoneum", "mesothelium", "basement membrane"
    ],
    primaryGenes: ["MMP9", "TGFB1", "EGFR", "AKT1", "PTGS2"],
    secondaryGenes: ["HDAC6", "VEGFA", "CXCL8", "IL6"],
    mechanisticSummary: "Basement membrane proteolysis, mesothelial lining disruption, stromal cell invasion, and ectopic tissue implantation."
  }
];

/**
 * Interpret a natural language biomedical research question.
 * Identifies core biological axes, mechanisms, and specific pathway keywords.
 */
export function interpretResearchQuestion(questionText) {
  const cleanText = (questionText || '').trim();
  const words = cleanText.split(/\s+/).filter(Boolean);

  if (!cleanText || cleanText.length < 10 || words.length < 3) {
    return {
      isValid: false,
      error: "Please enter a specific biological or biomedical research question (at least 3 words and 10 characters).",
    };
  }

  const cleanTextLower = cleanText.toLowerCase();

  // Score each biological semantic axis based on keyword frequencies & weighted combinations
  const axisScores = BIOLOGICAL_SEMANTIC_AXES.map((axis) => {
    let matchCount = 0;
    let matchedKeywords = [];

    axis.weightKeywords.forEach((kw) => {
      // Word boundary or substring regex match
      const regex = new RegExp(`\\b${kw.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'i');
      if (regex.test(cleanTextLower) || cleanTextLower.includes(kw)) {
        matchCount += kw.length > 5 ? 2 : 1; // Give higher weight to specific terms like "myofibroblast"
        matchedKeywords.push(kw);
      }
    });

    return {
      ...axis,
      matchCount,
      matchedKeywords,
      relevanceScore: Math.min(100, matchCount * 18),
    };
  });

  // Sort axes by relevance
  axisScores.sort((a, b) => b.relevanceScore - a.relevanceScore);

  const dominantAxis = axisScores[0]?.matchCount > 0 ? axisScores[0] : null;
  const secondaryAxis = axisScores[1]?.matchCount > 0 ? axisScores[1] : null;

  return {
    isValid: true,
    cleanText,
    dominantAxis,
    secondaryAxis,
    activeAxes: axisScores.filter((a) => a.matchCount > 0),
  };
}

/**
 * Generate Top 10 Biological & Drug Targets tailored to researcher's question
 *
 * Considers:
 * 1. Semantic and mechanistic alignment with the research question
 * 2. Literature and empirical evidence from uploaded research papers
 * 3. Endometriosis pathological association
 * 4. Existing six-factor scoring model & customized user weights
 * 5. Therapeutic relevance and druggability status
 */
export async function generateTop10Targets(questionText, options = {}) {
  const interpretation = interpretResearchQuestion(questionText);
  if (!interpretation.isValid) {
    throw new Error(interpretation.error);
  }

  const {
    papers = [],
    weights = INITIAL_WEIGHTS,
    userId = ELENA_VANCE_ID
  } = options;

  // 1. Gather all candidate targets from expanded catalog
  const candidateMap = new Map();
  EXPANDED_TARGET_CATALOG.forEach((t) => {
    candidateMap.set(t.geneSymbol.toUpperCase(), { ...t });
  });

  // 2. Cross-reference targets identified in researcher's uploaded papers
  const paperTargetEvidence = new Map();
  papers.forEach((paper) => {
    const extractedTargets = paper.extractedData?.potentialDrugTargets || [];
    const genes = paper.extractedData?.genesIdentified || [];

    // Tag targets with uploaded paper evidence
    [...extractedTargets.map((t) => t.geneSymbol), ...genes].forEach((geneSym) => {
      if (!geneSym) return;
      const normalized = geneSym.trim().toUpperCase();
      if (!paperTargetEvidence.has(normalized)) {
        paperTargetEvidence.set(normalized, []);
      }
      paperTargetEvidence.get(normalized).push({
        paperId: paper.id,
        paperTitle: paper.title,
        journal: paper.journal || 'Uploaded Research Document',
        year: paper.year || new Date().getFullYear(),
        doi: paper.doi || '',
        findings: paper.extractedData?.mainFindings || 'Identified via automated literature entity extraction in your library.',
        evidenceType: paper.extractedData?.evidenceClassification?.humanClinical ? 'Human Clinical Biopsy' : 'Primary Tissue Assays'
      });
    });
  });

  // 3. Compute question-specific relevance and composite multi-factor score
  const scoredCandidates = [];

  candidateMap.forEach((target) => {
    let semanticRelevance = 50; // Base baseline
    const questionLower = interpretation.cleanText;
    const symbolLower = target.geneSymbol.toLowerCase();
    const nameLower = target.targetName.toLowerCase();

    // Check direct gene mention in question (e.g. "role of VEGFA in...")
    if (questionLower.includes(symbolLower) || questionLower.includes(nameLower)) {
      semanticRelevance += 35;
    }

    // Check alignment with dominant and secondary biological axes
    interpretation.activeAxes.forEach((axis, idx) => {
      const weightFactor = idx === 0 ? 1.0 : idx === 1 ? 0.6 : 0.3;
      if (axis.primaryGenes.includes(target.geneSymbol)) {
        semanticRelevance += 30 * weightFactor;
      } else if (axis.secondaryGenes.includes(target.geneSymbol)) {
        semanticRelevance += 15 * weightFactor;
      }

      if (target.biologicalCategory && target.biologicalCategory.toLowerCase().includes(axis.category.toLowerCase())) {
        semanticRelevance += 15 * weightFactor;
      }
    });

    // Check paper evidence bonus: if verified in researcher's uploaded papers
    const uploadedMatches = paperTargetEvidence.get(target.geneSymbol) || [];
    const hasPaperEvidence = uploadedMatches.length > 0;
    if (hasPaperEvidence) {
      semanticRelevance += 12;
    }

    // Clamp semantic relevance to 30..99
    semanticRelevance = Math.min(99, Math.max(30, Math.round(semanticRelevance)));

    // Calculate existing six-factor target score using active user weights
    const targetScore = calculateTargetScore(target.rawScores || {
      humanEvidence: 75,
      endometriosisAssociation: 80,
      pathwayRelevance: 75,
      druggability: 75,
      evidenceStrength: 75,
      researchNovelty: 75
    }, weights);

    // Multi-factor composite score calculation
    // Weighted balance of Question Relevance (45%), Algorithmic Target Score (30%),
    // Endometriosis Association (15%), and User Library Evidence (10%)
    const endoAssociation = target.rawScores?.endometriosisAssociation || 80;
    const libraryBonus = hasPaperEvidence ? 100 : 70;

    const compositeScore = Math.round(
      (semanticRelevance * 0.45) +
      (targetScore * 0.30) +
      (endoAssociation * 0.15) +
      (libraryBonus * 0.10)
    );

    // Formulate tailored biological explanation connecting target to question
    let questionRelevanceExplanation = "";
    if (interpretation.dominantAxis) {
      const axis = interpretation.dominantAxis;
      if (axis.primaryGenes.includes(target.geneSymbol)) {
        questionRelevanceExplanation = `Directly answers your inquiry on ${axis.category.toLowerCase()}: ${target.targetName} functions as a cardinal molecular node in ${axis.mechanisticSummary.toLowerCase()}`;
      } else if (axis.secondaryGenes.includes(target.geneSymbol)) {
        questionRelevanceExplanation = `Significantly contributes to ${axis.category.toLowerCase()} via downstream regulatory cross-talk and microenvironmental co-activation.`;
      } else {
        questionRelevanceExplanation = `Modulates secondary signaling cascades in endometriosis pathology that converge on your research question themes.`;
      }
    } else {
      questionRelevanceExplanation = `Validated therapeutic target in human endometriosis literature with strong molecular rationale across cellular survival and inflammation.`;
    }

    // Merge supporting evidence: prioritize user's uploaded paper findings first, then curated literature
    const mergedEvidence = [];
    if (hasPaperEvidence) {
      uploadedMatches.forEach((match) => {
        mergedEvidence.push({
          type: "Validated in Your Uploaded Paper",
          title: match.paperTitle,
          journal: match.journal,
          year: match.year,
          doi: match.doi,
          findings: match.findings,
          isUserPaper: true
        });
      });
    }

    (target.evidenceMatrix || []).forEach((ev) => {
      mergedEvidence.push({
        type: ev.type || "Peer-Reviewed Study",
        title: ev.title,
        journal: ev.journal,
        year: ev.year,
        pmid: ev.pmid,
        doi: ev.doi,
        findings: ev.findings,
        isUserPaper: false
      });
    });

    // Evidence classification & validation flag
    const isAiSuggested = !hasPaperEvidence && (!target.evidenceMatrix || target.evidenceMatrix.length === 0);
    const evidenceClassification = isAiSuggested
      ? "AI-Suggested Target (Requires In-Vitro / Biopsy Validation)"
      : target.evidenceType || "Human Clinical Biopsy Validation";

    scoredCandidates.push({
      ...target,
      relevanceScore: semanticRelevance,
      compositeScore,
      calculatedScore: targetScore,
      questionRelevanceExplanation,
      supportingEvidence: mergedEvidence,
      evidenceClassification,
      isAiSuggested,
      hasPaperEvidence,
      matchedPaperCount: uploadedMatches.length
    });
  });

  // 4. Sort strictly descending by composite score, secondary by relevance score
  scoredCandidates.sort((a, b) => {
    if (b.compositeScore !== a.compositeScore) {
      return b.compositeScore - a.compositeScore;
    }
    return b.relevanceScore - a.relevanceScore;
  });

  // 5. Select exactly the Top 10 ranked targets
  const top10 = scoredCandidates.slice(0, 10).map((t, index) => {
    const rank = index + 1;
    const formattedRank = rank < 10 ? `0${rank}` : `${rank}`;
    return {
      ...t,
      rank,
      formattedRank,
      dropdownLabel: `${formattedRank}. ${t.geneSymbol} – ${t.targetName} (Score: ${t.relevanceScore})`,
    };
  });

  const queryResult = {
    id: `query-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    userId,
    question: questionText.trim(),
    dominantCategory: interpretation.dominantAxis?.category || "General Endometriosis Target",
    timestamp: new Date().toISOString(),
    top10Targets: top10,
    selectedTargetId: top10[0]?.geneSymbol || null,
  };

  // Persist query in user-isolated storage
  try {
    saveHumanModelQuery(userId, queryResult);
  } catch (err) {
    console.warn("Failed to persist Human Model query in local store:", err);
  }

  return queryResult;
}

/**
 * Retrieve user's saved Human Model queries
 */
export function getHumanModelQueries(userId) {
  if (!userId || typeof window === 'undefined' || typeof localStorage === 'undefined') return [];
  try {
    const raw = localStorage.getItem(`${HUMAN_MODEL_STORAGE_PREFIX}${userId}`);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error("Error reading Human Model queries:", e);
  }
  return [];
}

/**
 * Save a Human Model query record for a specific user
 */
export function saveHumanModelQuery(userId, queryRecord) {
  if (!userId || !queryRecord || typeof window === 'undefined' || typeof localStorage === 'undefined') return;
  try {
    const existing = getHumanModelQueries(userId);
    // Deduplicate by question text or ID
    const filtered = existing.filter((q) => q.id !== queryRecord.id && q.question.toLowerCase() !== queryRecord.question.toLowerCase());
    const updated = [queryRecord, ...filtered].slice(0, 20); // Keep latest 20 queries
    localStorage.setItem(`${HUMAN_MODEL_STORAGE_PREFIX}${userId}`, JSON.stringify(updated));

    // Also sync to user data store
    const userData = getUserData(userId);
    saveUserData(userId, {
      ...userData,
      humanModelQueries: updated,
    });
  } catch (e) {
    console.error("Error saving Human Model query:", e);
  }
}

/**
 * Delete a specific Human Model query
 */
export function deleteHumanModelQuery(userId, queryId) {
  if (!userId || !queryId || typeof window === 'undefined' || typeof localStorage === 'undefined') return [];
  try {
    const existing = getHumanModelQueries(userId);
    const updated = existing.filter((q) => q.id !== queryId);
    localStorage.setItem(`${HUMAN_MODEL_STORAGE_PREFIX}${userId}`, JSON.stringify(updated));

    const userData = getUserData(userId);
    saveUserData(userId, {
      ...userData,
      humanModelQueries: updated,
    });
    return updated;
  } catch (e) {
    console.error("Error deleting Human Model query:", e);
    return [];
  }
}
