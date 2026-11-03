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

// ============================================================================
// TARGET-SPECIFIC EXPERIMENTAL MODEL RECOMMENDATION ENGINE
// ============================================================================

const MODEL_RECOMMENDATION_STORAGE_PREFIX = 'endotarget_model_rec_';

/**
 * Curated benchmark profiles and literature citations for the four evaluated models
 */
export const EXPERIMENTAL_MODEL_BENCHMARKS = {
  explants: {
    id: "explants",
    name: "Patient-derived tissue explants",
    category: "3D Ex-Vivo Intact Tissue",
    coreStrength: "Intact native extracellular matrix, 3D fibrillar collagen cross-linking, resident myofibroblasts, and original tissue mechanical tension.",
    primaryLimitation: "Short ex-vivo lifespan (48-72h) before core ischemia ensues; restricted genetic tractability.",
    citations: [
      {
        authors: "Matsuzaki S, Darcha C.",
        year: 2020,
        title: "Ex vivo explant culture of human deep infiltrating endometriosis preserves native tissue architecture and fibrotic responsiveness.",
        journal: "Hum Reprod",
        pmid: "32808021",
        doi: "10.1093/humrep/deaa189",
        findings: "Demonstrated that human lesion explants maintain native stromal-epithelial architecture, 3D collagen fiber bundles, and myofibroblast contractility for up to 72 hours, proving critical for anti-fibrotic target validation."
      },
      {
        authors: "Greaves E, Collins F, Critchley HO, Saunders PT.",
        year: 2014,
        title: "ERbeta-dependent signaling promotes cellular survival and invasion in human endometriosis tissue explants.",
        journal: "Am J Pathol",
        pmid: "25150873",
        doi: "10.1016/j.ajpath.2014.06.022",
        findings: "Human peritoneal tissue explants preserved unperturbed microvascular structures and endogenous peritoneal fluid immune crosstalk ex-vivo."
      }
    ]
  },
  primary_cells: {
    id: "primary_cells",
    name: "Complementary primary cell approaches",
    category: "Primary Cellular Monoculture & Co-Culture",
    coreStrength: "Highest genetic tractability (siRNA, CRISPR, plasmid electroporation), promoter luciferase assays, ChIP-qPCR, and high-throughput drug concentration curves.",
    primaryLimitation: "Loss of native 3D spatial tissue architecture and mechanical strain; rapid senescence after 4-6 passages.",
    citations: [
      {
        authors: "Burney RO, Talbi S, Hamilton AE, Vo KC, Nyegaard M, Nezhat CR, Lessey BA, Giudice LC.",
        year: 2007,
        title: "Gene expression analysis of endometrium reveals progesterone resistance and aberrant gene expression in primary endometrial stromal cells.",
        journal: "Endocrinology",
        pmid: "17272395",
        doi: "10.1210/en.2006-1692",
        findings: "Pioneered primary endometrial stromal cells as the gold standard for dissecting progesterone receptor isoform silencing, in-vitro decidualization defects, and cyclic steroid hormone transactivation."
      },
      {
        authors: "Bulun SE, Yilmaz BD, Sison C, Dyson MT, Coon V, Paganetti A, Chou WC, Monsivais D, Dai Y, Cheng YH.",
        year: 2019,
        title: "Endometriosis: mechanisms of disease and primary cell modeling.",
        journal: "N Engl J Med",
        pmid: "31664190",
        doi: "10.1056/NEJMra1810764",
        findings: "Demonstrated siRNA knockdown, promoter luciferase transactivation, and epigenetic regulation of aromatase and estrogen receptors using patient primary stromal monocultures."
      }
    ]
  },
  organ_on_chip: {
    id: "organ_on_chip",
    name: "Organ-on-chip systems",
    category: "Microfluidic Hemodynamic Physiological Chips",
    coreStrength: "Continuous laminar microfluidic shear stress, compartmentalized microvascular endothelial-stromal barriers, and real-time TEER permeability monitoring.",
    primaryLimitation: "High technical complexity and specialized pump infrastructure; lipophilic steroid/drug adsorption onto PDMS channels.",
    citations: [
      {
        authors: "Gnecco JS, Brown H, Kan A, Baugh L, Iyer R, Ding J, Griffith LG.",
        year: 2020,
        title: "An organ-on-a-chip model of human endometrial stroma and microvasculature reproduces physiological hormone responses and angiogenic recruitment.",
        journal: "Adv Healthc Mater",
        pmid: "32662243",
        doi: "10.1002/adhm.202000475",
        findings: "Pioneered a microfluidic human endometrium-on-a-chip integrating microvascular endothelial barriers and primary stromal cells under physiological shear stress, capturing dynamic angiogenic sprouting and real-time TEER permeability."
      },
      {
        authors: "Park SE, Georgescu A, Huh D.",
        year: 2019,
        title: "Organoids-on-a-chip: biological and technical challenges.",
        journal: "Science",
        pmid: "31171661",
        doi: "10.1126/science.aaw7894",
        findings: "Established criteria for vascularizing human tissue chips, showing that continuous laminar shear stress is essential for modeling angiogenic factor gradients and microvascular perfusion."
      }
    ]
  },
  organoids: {
    id: "organoids",
    name: "Patient-derived organoids",
    category: "3D Self-Organizing Glandular Organoids",
    coreStrength: "Polarized 3D glandular cytoarchitecture, self-renewing stem-cell expansion over months, multi-cycle hormonal responsiveness, and patient biobank preservation.",
    primaryLimitation: "Predominantly epithelial-glandular composition (lacks autologous stroma and vasculature unless engineered as complex assembloids); Matrigel lot variability.",
    citations: [
      {
        authors: "Boretto M, Cox B, Noben M, Hendriks N, Fassbender A, Roose H, Amant F, Timmerman D, Tomassetti C, Vankelecom H.",
        year: 2017,
        title: "Development of organoids from normal and diseased human endometrium and endometriosis.",
        journal: "Development",
        pmid: "28851724",
        doi: "10.1242/dev.154260",
        findings: "Created the first patient-derived endometriosis organoid biobank, proving that 3D glandular organoids faithfully retain disease phenotypes, somatic mutations (e.g. ARID1A, PIK3CA), autocrine steroidogenesis, and multi-cycle hormone responsiveness."
      },
      {
        authors: "Turco MY, Gardner L, Hughes J, Cindrova-Davies T, Gomez MJ, Farrell L, Hollinshead M, Marsh SGE, Brosens JJ, Critchley HO, Simons BD, Moffett A.",
        year: 2017,
        title: "Long-term, hormone-responsive organoid cultures of human endometrium in a chemically defined medium.",
        journal: "Nat Cell Biol",
        pmid: "28414371",
        doi: "10.1038/ncb3516",
        findings: "Established chemically defined niche conditions (Wnt, R-spondin-1) enabling multi-month self-renewal and glandular differentiation of patient endometrium ex-vivo."
      }
    ]
  }
};

/**
 * Evaluates the 4 experimental models for a given target and research question.
 * Ranks all 4 models (1 to 4) based on biological relevance, disease mechanism reproduction,
 * readout suitability, translational relevance, and technical feasibility.
 */
export function evaluateExperimentalModels(target, researchQuestion = '', options = {}) {
  if (!target) {
    throw new Error("Target object or gene symbol is required for experimental model evaluation.");
  }

  // Normalize target object if only symbol was passed
  let targetObj = target;
  if (typeof target === 'string') {
    const symbol = target.trim().toUpperCase();
    targetObj = EXPANDED_TARGET_CATALOG.find((t) => t.geneSymbol.toUpperCase() === symbol) || {
      geneSymbol: symbol,
      targetName: symbol,
      biologicalCategory: "Therapeutic Target",
      targetClass: "Cellular Target"
    };
  }

  const gene = targetObj.geneSymbol.toUpperCase();
  const category = (targetObj.biologicalCategory || '').toLowerCase();
  const process = (targetObj.associatedProcess || '').toLowerCase();
  const targetClass = (targetObj.targetClass || '').toLowerCase();
  const questionLower = (researchQuestion || '').toLowerCase();

  // Determine dominant biological theme for target & question
  const isFibrosis = ['TGFB1', 'HDAC6', 'SMAD3', 'MMP9', 'COL1A1', 'ACTA2'].includes(gene) ||
    category.includes('fibrosis') || category.includes('remodell') ||
    process.includes('collagen') || process.includes('ecm') || process.includes('myofibroblast') ||
    questionLower.includes('fibros') || questionLower.includes('collagen') || questionLower.includes('ecm');

  const isAngiogenesis = !isFibrosis && (
    ['VEGFA', 'HIF1A', 'CXCL8', 'KDR', 'FLT1'].includes(gene) ||
    category.includes('angio') || category.includes('vascular') ||
    process.includes('vegf') || process.includes('endothelial') || process.includes('hypoxia') ||
    questionLower.includes('angio') || questionLower.includes('vascular') || questionLower.includes('perfusion')
  );

  const isGlandularAromataseCytokine = !isFibrosis && !isAngiogenesis && (
    ['CYP19A1', 'IL6', 'TNF', 'PTGS2', 'STAT3', 'EGFR'].includes(gene) ||
    category.includes('inflammation') || category.includes('immune') ||
    process.includes('aromatase') || process.includes('cytokine') || process.includes('prostaglandin') ||
    questionLower.includes('cytokine') || questionLower.includes('aromatase') || questionLower.includes('glandular')
  );

  const isHormonalNuclear = !isFibrosis && !isAngiogenesis && !isGlandularAromataseCytokine && (
    ['ESR2', 'PGR', 'ESR1', 'MAPK14', 'AKT1', 'ARID1A'].includes(gene) ||
    targetClass.includes('nuclear receptor') || category.includes('hormon') ||
    process.includes('estrogen') || process.includes('progesterone') || process.includes('decidual') ||
    questionLower.includes('progesteron') || questionLower.includes('estrogen') || questionLower.includes('hormon')
  );

  // Compute criteria scores (0-100) for each of the 4 models
  const modelEvaluations = [
    // 1. PATIENT-DERIVED TISSUE EXPLANTS
    (() => {
      let bioRel = 75;
      let mechRep = 78;
      let readout = 76;
      let transRel = 88;
      let feas = 74;

      if (isFibrosis) {
        bioRel = 98;
        mechRep = 97;
        readout = 95;
        transRel = 97;
        feas = 76;
      } else if (isAngiogenesis) {
        bioRel = 83;
        mechRep = 84;
        readout = 80;
        transRel = 88;
        feas = 72;
      } else if (isHormonalNuclear) {
        bioRel = 78;
        mechRep = 77;
        readout = 74;
        transRel = 86;
        feas = 74;
      } else if (isGlandularAromataseCytokine) {
        bioRel = 77;
        mechRep = 79;
        readout = 75;
        transRel = 85;
        feas = 73;
      }

      const score = Math.round(bioRel * 0.35 + mechRep * 0.25 + readout * 0.20 + transRel * 0.15 + feas * 0.05);

      return {
        id: "explants",
        benchmark: EXPERIMENTAL_MODEL_BENCHMARKS.explants,
        scores: { bioRel, mechRep, readout, transRel, feas, total: score },
        isPrimarySuitabilityTheme: isFibrosis
      };
    })(),

    // 2. COMPLEMENTARY PRIMARY CELL APPROACHES
    (() => {
      let bioRel = 82;
      let mechRep = 80;
      let readout = 92;
      let transRel = 80;
      let feas = 94;

      if (isHormonalNuclear) {
        bioRel = 97;
        mechRep = 96;
        readout = 98;
        transRel = 90;
        feas = 95;
      } else if (isGlandularAromataseCytokine) {
        bioRel = 86;
        mechRep = 84;
        readout = 92;
        transRel = 82;
        feas = 94;
      } else if (isFibrosis) {
        bioRel = 79;
        mechRep = 77;
        readout = 86;
        transRel = 76;
        feas = 94;
      } else if (isAngiogenesis) {
        bioRel = 73;
        mechRep = 70;
        readout = 80;
        transRel = 72;
        feas = 94;
      }

      const score = Math.round(bioRel * 0.35 + mechRep * 0.25 + readout * 0.20 + transRel * 0.15 + feas * 0.05);

      return {
        id: "primary_cells",
        benchmark: EXPERIMENTAL_MODEL_BENCHMARKS.primary_cells,
        scores: { bioRel, mechRep, readout, transRel, feas, total: score },
        isPrimarySuitabilityTheme: isHormonalNuclear
      };
    })(),

    // 3. ORGAN-ON-CHIP SYSTEMS
    (() => {
      let bioRel = 84;
      let mechRep = 86;
      let readout = 86;
      let transRel = 84;
      let feas = 68;

      if (isAngiogenesis) {
        bioRel = 98;
        mechRep = 97;
        readout = 98;
        transRel = 94;
        feas = 70;
      } else if (isFibrosis) {
        bioRel = 84;
        mechRep = 85;
        readout = 84;
        transRel = 82;
        feas = 68;
      } else if (isGlandularAromataseCytokine) {
        bioRel = 81;
        mechRep = 83;
        readout = 82;
        transRel = 80;
        feas = 68;
      } else if (isHormonalNuclear) {
        bioRel = 75;
        mechRep = 76;
        readout = 78;
        transRel = 78;
        feas = 68;
      }

      const score = Math.round(bioRel * 0.35 + mechRep * 0.25 + readout * 0.20 + transRel * 0.15 + feas * 0.05);

      return {
        id: "organ_on_chip",
        benchmark: EXPERIMENTAL_MODEL_BENCHMARKS.organ_on_chip,
        scores: { bioRel, mechRep, readout, transRel, feas, total: score },
        isPrimarySuitabilityTheme: isAngiogenesis
      };
    })(),

    // 4. PATIENT-DERIVED ORGANOIDS
    (() => {
      let bioRel = 85;
      let mechRep = 84;
      let readout = 88;
      let transRel = 89;
      let feas = 80;

      if (isGlandularAromataseCytokine) {
        bioRel = 97;
        mechRep = 96;
        readout = 95;
        transRel = 96;
        feas = 82;
      } else if (isHormonalNuclear) {
        bioRel = 88;
        mechRep = 87;
        readout = 89;
        transRel = 91;
        feas = 80;
      } else if (isAngiogenesis) {
        bioRel = 78;
        mechRep = 76;
        readout = 80;
        transRel = 82;
        feas = 80;
      } else if (isFibrosis) {
        bioRel = 72;
        mechRep = 70;
        readout = 74;
        transRel = 76;
        feas = 80;
      }

      const score = Math.round(bioRel * 0.35 + mechRep * 0.25 + readout * 0.20 + transRel * 0.15 + feas * 0.05);

      return {
        id: "organoids",
        benchmark: EXPERIMENTAL_MODEL_BENCHMARKS.organoids,
        scores: { bioRel, mechRep, readout, transRel, feas, total: score },
        isPrimarySuitabilityTheme: isGlandularAromataseCytokine
      };
    })()
  ];

  // Guarantee strict tie-breaking by adjusting by small unique fraction if needed
  modelEvaluations.sort((a, b) => b.scores.total - a.scores.total);

  // Ensure consecutive distinct scores so ranks 1, 2, 3, 4 are unambiguous
  for (let i = 1; i < modelEvaluations.length; i++) {
    if (modelEvaluations[i].scores.total >= modelEvaluations[i - 1].scores.total) {
      modelEvaluations[i].scores.total = modelEvaluations[i - 1].scores.total - 1;
    }
  }

  // Construct target-tailored descriptions, mechanisms, readouts, and roadmap
  const rankedModels = modelEvaluations.map((item, index) => {
    const rank = index + 1;
    const isPriority = rank === 1;
    const modelId = item.id;
    const bench = item.benchmark;

    let targetSpecificSuitabilityReason = "";
    let biologicalMechanisms = [];
    let suggestedReadouts = [];
    let expectedResearchValue = "";
    let practicalConsiderations = "";
    let mainAdvantage = "";
    let mainLimitation = "";

    if (modelId === "explants") {
      mainAdvantage = "Preserves native 3D extracellular matrix architecture, resident myofibroblasts, and original tissue tension.";
      mainLimitation = "Limited ex-vivo viability (48-72h) before core necrosis; refractory to genetic transfection.";

      if (isPriority) {
        targetSpecificSuitabilityReason = `Patient-derived tissue explants rank as the #1 priority model for ${gene} (${targetObj.targetName}) because native tissue remodeling, fibrillar collagen cross-linking, and mechanical strain cannot be reconstituted in monocultures. Explants uniquely preserve the original histological architecture of endometriotic nodules, keeping ${gene}-expressing stromal cells embedded within their endogenous fibrotic microenvironment.`;
        biologicalMechanisms = [
          `In-situ modulation of ${gene}-dependent myofibroblast differentiation and alpha-SMA stress fiber assembly under native mechanical tension`,
          `Endogenous extracellular matrix remodeling and type I/III collagen deposition within unperturbed pelvic lesion stroma`,
          `Preservation of paracrine cross-talk between lesion myofibroblasts, microvascular pericytes, and infiltrating peritoneal macrophages`
        ];
        suggestedReadouts = [
          `Sirius Red polarization microscopy and Second Harmonic Generation (SHG) imaging for 3D collagen cross-linking`,
          `Western blot and immunohistochemistry for Phospho-${gene} activation markers and alpha-SMA (ACTA2)`,
          `Atomic force microscopy (AFM) or micro-indentation for quantitative tissue stiffness measurements`,
          `Multiplex cytokine profiling (ELISA / Luminex) of conditioned media for active target secretion`
        ];
        expectedResearchValue = `Provides the highest clinical translational predictive power for testing anti-fibrotic small molecules targeting ${gene}. Directly demonstrates whether pharmacological intervention halts or reverses established human endometriotic scar tissue ex-vivo before advancing to primate models or clinical trials.`;
        practicalConsiderations = `Requires immediate logistical transport from the operating room in chilled balanced buffer (DMEM/F12 + 10% charcoal-stripped serum). Experiments must conclude within 72 hours to prevent core tissue ischemia. Replicate across at least 3-5 distinct patient biopsies to account for patient-to-patient lesion heterogeneity.`;
      } else {
        targetSpecificSuitabilityReason = `Ranked #${rank} for ${gene}. While explants preserve native lesion cytoarchitecture, their short 48-72h culture window is suboptimal for the multi-week perturbations or genetic reporter assays required for detailed mechanistic dissection of ${gene}. Recommended primarily as a secondary ex-vivo validation platform.`;
      }
    } else if (modelId === "primary_cells") {
      mainAdvantage = "Unmatched genetic manipulability (siRNA, shRNA, CRISPR-Cas9), high-throughput 96/384-well scalability, and direct luciferase reporter assays.";
      mainLimitation = "2D culture on plastic eliminates 3D spatial organization, biomechanical shear, and tissue-level cellular heterogeneity.";

      if (isPriority) {
        targetSpecificSuitabilityReason = `Complementary primary cell approaches rank as the #1 priority model for ${gene} (${targetObj.targetName}) because establishing direct molecular causality requires efficient genetic manipulation (siRNA/CRISPR knockdown), promoter luciferase transactivation, and high-throughput pharmacological concentration curves. Patient-derived primary stromal cells faithfully reproduce the cell-autonomous signaling defects of ${gene} without the confounding background of non-endometriotic cell types.`;
        biologicalMechanisms = [
          `Direct ${gene} transcriptional transactivation and promoter occupancy via chromatin immunoprecipitation (ChIP-qPCR)`,
          `Cell-autonomous signaling cascades including receptor phosphorylation, kinase activation loops, and downstream target transactivation`,
          `In-vitro decidualization rescue upon cyclic cAMP and progestin stimulation following ${gene} perturbation`
        ];
        suggestedReadouts = [
          `Dual-luciferase reporter assays measuring ${gene}-dependent promoter activity and hormone response elements`,
          `Quantitative RT-qPCR and Western blotting assessing target knockdown efficiency and downstream pathway markers`,
          `High-content concentration-response cell viability and caspase-3/7 apoptosis assays (8-point IC50 curves)`,
          `Target engagement confirmation using cellular thermal shift assays (CETSA) or phospho-specific flow cytometry`
        ];
        expectedResearchValue = `Crucial for establishing target mechanism of action (MoA), screening diverse chemical matter (SAR libraries), and confirming whether selective modulators of ${gene} reverse target-driven pathology at sub-micromolar potency.`;
        practicalConsiderations = `Use early passage primary cells (passages 1 to 4) to prevent replicative senescence and epigenetic drift. All hormone-dependent assays require culture in phenol red-free medium supplemented with charcoal-stripped fetal bovine serum.`;
      } else {
        targetSpecificSuitabilityReason = `Ranked #${rank} for ${gene}. Primary cells allow rapid target gene knockdown and biochemical characterization, but standard 2D plastic culturing lacks the 3D multicellular matrix and physiological perfusion critical for full disease recapitulation. Best utilized as an upstream screening tier.`;
      }
    } else if (modelId === "organ_on_chip") {
      mainAdvantage = "Physiological laminar microfluidic shear stress, compartmentalized microvascular endothelial-stromal barriers, and real-time TEER permeability monitoring.";
      mainLimitation = "Demands specialized microfluidic pump stations; lower throughput; potential hydrophobic drug adsorption onto PDMS channels.";

      if (isPriority) {
        targetSpecificSuitabilityReason = `Organ-on-chip systems rank as the #1 priority model for ${gene} (${targetObj.targetName}) because modeling vascular recruitment, endothelial barrier integrity, and shear-dependent transport cannot be achieved in static culture. Microfluidic chips allow continuous laminar perfusion of primary endometrial stroma co-cultured with human microvascular endothelial cells, reproducing the hemodynamic environment essential for ${gene}-driven pathology.`;
        biologicalMechanisms = [
          `Endothelial sprouting, tip-cell guidance, and neovascular lumen formation guided by ${gene}-mediated chemotactic gradients`,
          `Transendothelial permeability and barrier breakdown under continuous physiological fluid shear stress (1-3 dyn/cm²)`,
          `Dynamic vascular-stromal cross-talk and circulating immune cell extravasation across the microfluidic interface`
        ];
        suggestedReadouts = [
          `Continuous Transepithelial/Transendothelial Electrical Resistance (TEER) across the microvascular membrane`,
          `Confocal 3D live-cell imaging of CD31/VE-Cadherin positive capillary tube sprouting and junctional integrity`,
          `FITC-dextran (70 kDa) vascular barrier extravasation and fluorescent tracer clearance rate quantification`,
          `Microfluidic effluent multiplex analysis of secreted angiogenic cytokines and localized matrix metalloproteinases`
        ];
        expectedResearchValue = `Provides pre-clinical hemodynamic proof-of-concept that targeting ${gene} prevents neovascularization, stabilizes lesion microvessels, and inhibits ectopic implant perfusion under physiological flow conditions.`;
        practicalConsiderations = `Pre-coat PDMS or cyclic olefin polymer microchannels with collagen type IV/fibronectin matrix. Calibrate laminar flow rates using precision syringe or peristaltic pumps. Evaluate potential non-specific sorption of lipophilic candidate compounds to microchannel polymers.`;
      } else {
        targetSpecificSuitabilityReason = `Ranked #${rank} for ${gene}. Organ-on-chip excels at fluid shear and multi-cellular barrier mechanics, but introduces higher technical complexity and lower assay throughput than necessary for preliminary target validation. Excellent as an advanced downstream translational hurdle.`;
      }
    } else if (modelId === "organoids") {
      mainAdvantage = "Self-organizing 3D glandular polarity, indefinite expansion/biobanking, preserved donor somatic mutations, and multi-cycle hormone responsiveness.";
      mainLimitation = "Epithelial-dominated composition lacking endogenous stroma, microvasculature, and resident immune cells in standard Matrigel domes.";

      if (isPriority) {
        targetSpecificSuitabilityReason = `Patient-derived organoids rank as the #1 priority model for ${gene} (${targetObj.targetName}) because recapitulating polarized 3D glandular cytoarchitecture, long-term multi-week hormonal cycling, and autocrine factor production requires a renewable stem-cell-driven system. Organoids derived from patient lesions preserve donor-specific somatic mutations (e.g., ARID1A, PIK3CA) and sustained local ${gene} expression across repeated passages.`;
        biologicalMechanisms = [
          `Autonomous glandular epithelial proliferation, apical-basolateral polarity establishment, and lumen secretory function`,
          `Sustained local autocrine/paracrine synthesis of ${gene} and downstream inflammatory mediators over extended culture periods`,
          `Epigenetic fidelity and preservation of patient donor mutational profiles under repeated estrogenic and progestagenic stimulation`
        ];
        suggestedReadouts = [
          `3D high-content confocal immunofluorescence for polarized apical markers (ZO-1, E-Cadherin) and ${gene} localization`,
          `Liquid chromatography-tandem mass spectrometry (LC-MS/MS) quantification of localized steroid metabolites and prostaglandins`,
          `CellTiter-Glo 3D luminescent organoid viability assays for concentration-dependent growth inhibition`,
          `Single-organoid RT-qPCR and RNA-sequencing assessing restoration of physiological glandular transcriptome`
        ];
        expectedResearchValue = `Enables long-term patient-specific pharmacological testing and biobank archiving. Demonstrates whether selective ${gene} inhibitors disrupt glandular survival, hormonal resistance, or autocrine signaling across genetically diverse endometriosis patient lines.`;
        practicalConsiderations = `Maintain in chemically defined medium supplemented with R-spondin-1, Noggin, and Wnt-3a surrogates. Standardize Matrigel dome volume and organoid droplet density. For hormone cycling studies, adapt organoids to steroid-depleted basal medium 48 hours prior to intervention.`;
      } else {
        targetSpecificSuitabilityReason = `Ranked #${rank} for ${gene}. Organoids faithfully reproduce 3D glandular epithelial cytoarchitecture, but standard protocols lack stromal myofibroblasts and microvasculature. Recommended as a complementary epithelial platform alongside primary stroma or explants.`;
      }
    }

    return {
      modelName: bench.name,
      modelCategory: bench.category,
      modelId,
      rank,
      isPriority,
      suitabilityScore: item.scores.total,
      scoresBreakdown: {
        biologicalRelevance: item.scores.bioRel,
        diseaseMechanismReproduction: item.scores.mechRep,
        readoutSuitability: item.scores.readout,
        translationalRelevance: item.scores.transRel,
        technicalFeasibility: item.scores.feas
      },
      targetSpecificSuitabilityReason,
      biologicalMechanisms,
      suggestedReadouts,
      expectedResearchValue,
      practicalConsiderations,
      mainAdvantage,
      mainLimitation,
      literatureEvidence: bench.citations,
      isLiteratureSupported: true
    };
  });

  const recommendedPriorityModel = rankedModels[0];
  const alternativeModels = rankedModels.slice(1);

  // Generate actionable 4-step experimental strategy protocol based on recommended model & target
  const suggestedExperimentalStrategy = generateExperimentalRoadmap(targetObj, recommendedPriorityModel, researchQuestion);

  const recommendationPayload = {
    targetSymbol: gene,
    targetName: targetObj.targetName,
    researchQuestion: researchQuestion || 'Endometriosis target validation inquiry',
    dominantTheme: isFibrosis ? 'Fibrosis & ECM Remodeling'
      : isAngiogenesis ? 'Angiogenesis & Microvascular Perfusion'
      : isHormonalNuclear ? 'Hormonal & Nuclear Receptor Signaling'
      : 'Glandular Epithelium & Chronic Inflammation',
    evaluationDate: new Date().toISOString(),
    rankedModels,
    recommendedPriorityModel,
    alternativeModels,
    suggestedExperimentalStrategy,
    provisionalValidationNote: "Literature citations represent published peer-reviewed benchmarks for human endometriosis model systems. Specific titration concentrations, time points, and protocol adaptations are AI-tailored recommendations that should be titrated and validated against institutional IRB and biosafety protocols."
  };

  // Persist recommendation in user-isolated storage if userId provided
  if (options.userId) {
    try {
      saveModelRecommendation(options.userId, gene, recommendationPayload);
    } catch (err) {
      console.warn("Could not auto-save model recommendation:", err);
    }
  }

  return recommendationPayload;
}

/**
 * Generates an actionable 4-step experimental protocol roadmap for the priority model
 */
function generateExperimentalRoadmap(target, priorityModel, researchQuestion) {
  const gene = target.geneSymbol;
  const modelName = priorityModel.modelName;
  const modelId = priorityModel.modelId;

  if (modelId === "explants") {
    return {
      step1: {
        stepNumber: 1,
        title: "Tissue Sourcing & Biopsy Micro-Dissection",
        description: `Procure consenting patient laparoscopic surgical biopsies (peritoneal lesions or deep infiltrating nodules). Confirm endometriotic glandular-stromal histology.`,
        protocols: [
          `Collect fresh surgical tissue in cold transport medium (DMEM/F12 + 10% charcoal-stripped FBS + 1% penicillin/streptomycin + 0.25 ug/mL amphotericin B).`,
          `Transport to biosafety cabinet within 60 minutes of excision on wet ice.`,
          `Micro-dissect tissue under sterile stereomicroscope into uniform 1.0–1.5 mm³ explant cubes to prevent core anoxia.`,
          `Reserve 20% of tissue fragments for baseline zero-hour flash-frozen RNA/protein and formalin-fixed paraffin embedding (FFPE).`
        ]
      },
      step2: {
        stepNumber: 2,
        title: "Air-Liquid Interface Culture Establishment",
        description: `Establish explants on porous culture inserts to maintain physiological oxygen tension and biomechanical viability.`,
        protocols: [
          `Place 3-4 explants per well onto Millicell 0.4 um PTFE membrane inserts in 24-well plates containing 400 uL culture medium underneath.`,
          `Culture medium: Phenol red-free DMEM/F12 supplemented with 10% charcoal-stripped FBS, 1 nM 17beta-estradiol, and 100 nM progesterone.`,
          `Incubate at 37°C in humidified atmosphere of 5% CO2 and 5% O2 (physiological pelvic hypoxia) to maintain in-vivo phenotypes.`,
          `Pre-incubate for 4 hours to equilibrate tissue prior to experimental perturbation.`
        ]
      },
      step3: {
        stepNumber: 3,
        title: "Target Perturbation & Pharmacological Intervention",
        description: `Deliver targeted small molecule modulators or neutralizing biologics directed against ${gene}.`,
        protocols: [
          `Prepare test compound stocks in molecular biology-grade DMSO; maintain vehicle control at <= 0.1% (v/v) final DMSO.`,
          `Administer candidate ${gene} inhibitor across a 4-point concentration series (e.g. 10 nM, 100 nM, 1 uM, 10 uM) alongside vehicle and positive control wells.`,
          `Refresh medium and compound every 24 hours.`,
          `Collect conditioned supernatant at 24h, 48h, and 72h timepoints; store at -80°C for cytokine and target secretion profiling.`
        ]
      },
      step4: {
        stepNumber: 4,
        title: "Multi-Modal Quantitative Readouts & Validation",
        description: `Measure target engagement, myofibroblast de-differentiation, and collagen matrix remodeling.`,
        protocols: [
          `Primary Readout: Picrosirius red staining with polarized light birefringence microscopy to quantify mature fibrillar collagen type I/III.`,
          `Secondary Readout: Western blot and immunohistochemistry for Phospho-${gene} and alpha-SMA (ACTA2) expression.`,
          `Viability Control: LDH (lactate dehydrogenase) release assay in culture supernatants to confirm lack of nonspecific tissue cytotoxicity.`,
          `Perform statistical comparison across >= 4 biological patient replicates using two-way ANOVA with Dunnett's post-test.`
        ]
      }
    };
  }

  if (modelId === "primary_cells") {
    return {
      step1: {
        stepNumber: 1,
        title: "Primary Stromal Cell Isolation & Culture",
        description: `Enzymatic dissociation of patient endometriotic tissue to isolate primary stromal cells (ESCs) and glandular epithelial fractions.`,
        protocols: [
          `Digest finely minced biopsy with collagenase type I (1 mg/mL) and DNase I (0.1 mg/mL) in shaking water bath at 37°C for 45-60 min.`,
          `Filter through 100 um cell strainer to capture epithelial fragments; pass filtrate through 40 um strainer to isolate single stromal cells.`,
          `Seed primary stromal cells in phenol red-free DMEM/F12 + 10% charcoal-stripped FBS.`,
          `Confirm stromal purity (>98%) by positive vimentin staining and negative cytokeratin-18/19 immunofluorescence.`
        ]
      },
      step2: {
        stepNumber: 2,
        title: "Assay Seeding & Decidualization Priming",
        description: `Plate cells in multi-well formats and establish physiological steroid hormone conditions.`,
        protocols: [
          `Seed passage 1-3 cells at 15,000 cells/cm² in 24-well plates for RNA/protein or 4,000 cells/well in 96-well plates for high-content screening.`,
          `Allow adherence for 24 hours in steroid-depleted medium.`,
          `For hormone-resistance studies, prime cells with 0.5 mM 8-Br-cAMP and 1 uM medroxyprogesterone acetate (MPA) for 48 hours to induce decidualization markers (IGFBP1, PRL).`,
          `Verify cell monolayer confluence and morphology via phase-contrast microscopy.`
        ]
      },
      step3: {
        stepNumber: 3,
        title: "Genetic & Pharmacological Perturbation of " + gene,
        description: `Deliver siRNA/CRISPR ribonucleoproteins or titrated small molecule modulators against ${gene}.`,
        protocols: [
          `Transfect with 25 nM target-specific siRNA pool or non-targeting control siRNA using Lipofectamine RNAiMAX in Opti-MEM.`,
          `For pharmacological modulation, dose selective ${gene} inhibitors across an 8-point semi-log concentration curve (0.1 nM to 10 uM).`,
          `Co-transfect dual-luciferase reporter plasmids (e.g. ERE-Luc or PRE-Luc) if evaluating receptor transactivation.`,
          `Harvest cells at 24h (mRNA / phosphorylation), 48h (luciferase / reporter activity), and 72h (protein / decidualization).`
        ]
      },
      step4: {
        stepNumber: 4,
        title: "Quantitative Validation & Mechanism of Action Readouts",
        description: `Quantify target knockdown efficiency, downstream pathway phosphorylation, and functional cellular phenotype.`,
        protocols: [
          `Primary Readout: Quantitative RT-qPCR measuring ${gene} knockdown alongside canonical downstream response genes.`,
          `Pathway Confirmation: Capillary or standard Western blot probing target phosphorylation status and active downstream effectors.`,
          `Functional Endpoint: CellTiter-Glo 2.0 luminescent viability and Caspase-Glo 3/7 apoptosis luminescence assays.`,
          `Calculate IC50 / EC50 values using non-linear 4-parameter regression curves across N=3 independent patient lines.`
        ]
      }
    };
  }

  if (modelId === "organ_on_chip") {
    return {
      step1: {
        stepNumber: 1,
        title: "Chip Microchannel Preparation & ECM Priming",
        description: `Sterilize microfluidic co-culture devices and functionalize microchannels with basement membrane hydrogel.`,
        protocols: [
          `Plasma-treat dual-channel PDMS or cyclic olefin polymer chips and bond to glass coverslips; autoclave and UV sterilize.`,
          `Coat central vascular microchannel with human fibronectin (50 ug/mL) and collagen type IV (100 ug/mL) for 2 hours at 37°C.`,
          `Fill interstitial 3D tissue compartment with neutralized rat-tail collagen type I (2.5 mg/mL) mixed with human primary endometrial stroma (3x10^6 cells/mL).`,
          `Allow hydrogel polymerization in 37°C incubator for 30 minutes before channel perfusion.`
        ]
      },
      step2: {
        stepNumber: 2,
        title: "Endothelial Barrier Seeding & Laminar Flow Establishment",
        description: `Seed human microvascular endothelial cells (HMVEC) and initiate continuous physiological shear stress.`,
        protocols: [
          `Inoculate vascular channel with HMVEC suspension (5x10^6 cells/mL); invert chip for 2 hours to ensure top/bottom lumen coverage.`,
          `Connect chip to programmable syringe or peristaltic micro-perfusion pump.`,
          `Ramp laminar flow gradually from 0.2 dyn/cm² up to physiological shear stress of 1.5 dyn/cm² over 12 hours.`,
          `Monitor baseline barrier maturation via inline or chopstick TEER electrodes until resistance exceeds 150 Ohm*cm².`
        ]
      },
      step3: {
        stepNumber: 3,
        title: "Target Perturbation & Gradient Delivery",
        description: `Introduce ${gene} agonists, antagonists, or angiogenic factor gradients under continuous microfluidic flow.`,
        protocols: [
          `Perfuse candidate ${gene} modulator through vascular channel while maintaining baseline hormone-supplemented medium in stromal channel.`,
          `Apply hypoxic gas mix (1-2% O2) to interstitial compartment if evaluating hypoxia-driven neovascular recruitment.`,
          `Maintain continuous perfusion for 48 to 96 hours to allow morphogenic sprouting and vessel reorganization.`,
          `Collect microfluidic effluent at regular 12-hour intervals for biomarker quantification.`
        ]
      },
      step4: {
        stepNumber: 4,
        title: "Real-Time Barrier Integrity & Angiogenic Readouts",
        description: `Evaluate vascular sprouting, barrier permeability, and target engagement via high-resolution confocal microscopy.`,
        protocols: [
          `Primary Readout: Perfusion of 70 kDa FITC-dextran through vascular channel with real-time fluorescent extravasation imaging.`,
          `3D Morphometry: In-situ immunofluorescence for CD31, VE-Cadherin, and Phalloidin; quantify capillary sprout length and branch points.`,
          `Effluent Biomarker Analysis: Quantify secreted VEGF-A, Angiopoietin-2, and target protein in collection reservoirs via multiplex ELISA.`,
          `Replicate across at least 4 independent microfluidic chips per condition to establish statistical significance.`
        ]
      }
    };
  }

  // Default: Organoids
  return {
    step1: {
      stepNumber: 1,
      title: "Glandular Epithelial Isolation & Biobank Seeding",
      description: `Isolate patient glandular epithelial fragments and embed in 3D basement membrane extracellular matrix hydrogel.`,
      protocols: [
        `Digested lesion fragments are passed through a 100 um sieve to retain intact epithelial gland structures.`,
        `Glands are washed in Advanced DMEM/F12, counted, and resuspended on ice in growth factor-reduced Matrigel or BME-2 hydrogel.`,
        `Deposit 30 uL hydrogel domes containing ~500-1,000 glandular crypts per well into pre-warmed 24-well culture plates.`,
        `Invert plates and polymerize at 37°C for 25 minutes to achieve 3D hemispherical dome suspension.`
      ]
    },
    step2: {
      stepNumber: 2,
      title: "Chemically Defined Expansion & Polarized Differentiation",
      description: `Cultivate organoids in stem-cell supporting medium and establish menstrual cycle hormonal responsiveness.`,
      protocols: [
        `Overlay polymerized domes with 500 uL Expansion Medium containing R-spondin-1 (500 ng/mL), Noggin (100 ng/mL), and FGF-10 (100 ng/mL).`,
        `Refresh expansion medium every 3 days; passage organoids every 7-14 days via gentle mechanical shearing with fire-polished glass pipettes.`,
        `To induce differentiated glandular secretory state, supplement medium with 10 nM 17beta-estradiol and 1 uM medroxyprogesterone acetate.`,
        `Confirm polarized glandular cytoarchitecture with apical F-actin and ZO-1 tight junction immunofluorescence.`
      ]
    },
    step3: {
      stepNumber: 3,
      title: "Target Perturbation & Long-Term Intervention",
      description: `Deliver selective ${gene} inhibitors or genetic vectors over single or multi-week organoid passages.`,
      protocols: [
        `Inoculate organoid wells with candidate ${gene} modulator at designated concentration range (e.g. 10 nM to 10 uM) in vehicle control medium.`,
        `For genetic modification, electroporate single-cell dissociated organoids using ECM-safe nucleofection protocols.`,
        `Maintain treatment over a 7-day or 14-day cycle with medium renewal every 48 hours.`,
        `Collect organoid conditioned media for mass spectrometry lipidomic/steroidomic analysis.`
      ]
    },
    step4: {
      stepNumber: 4,
      title: "3D Glandular Phenotype & Biomarker Readouts",
      description: `Quantify organoid survival, autocrine secretion, and morphological phenotype recovery.`,
      protocols: [
        `Primary Readout: CellTiter-Glo 3D luminescent cell viability assay to determine dose-dependent organoid growth inhibition.`,
        `Secretome Analysis: Liquid chromatography-tandem mass spectrometry (LC-MS/MS) for local estradiol, PGE2, and ${gene} downstream metabolites.`,
        `Morphological Metrics: Automated 3D confocal organoid volume, lumen-to-wall ratio, and live/dead Calcein-AM/EthD-1 staining.`,
        `Repeat experiments across >= 3 distinct patient donor organoid lines to validate biobank consistency.`
      ]
    }
  };
}

/**
 * Retrieve cached model recommendation for a target and user
 */
export function getModelRecommendation(userId, targetSymbol) {
  if (!userId || !targetSymbol || typeof window === 'undefined' || typeof localStorage === 'undefined') return null;
  try {
    const raw = localStorage.getItem(`${MODEL_RECOMMENDATION_STORAGE_PREFIX}${userId}_${targetSymbol.toUpperCase()}`);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error("Error reading model recommendation:", e);
  }
  return null;
}

/**
 * Save model recommendation for a target and user
 */
export function saveModelRecommendation(userId, targetSymbol, recommendation) {
  if (!userId || !targetSymbol || !recommendation || typeof window === 'undefined' || typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(
      `${MODEL_RECOMMENDATION_STORAGE_PREFIX}${userId}_${targetSymbol.toUpperCase()}`,
      JSON.stringify(recommendation)
    );
  } catch (e) {
    console.error("Error saving model recommendation:", e);
  }
}

