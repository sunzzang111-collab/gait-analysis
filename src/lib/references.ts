// Verified peer-reviewed sources used to calibrate thresholds and to state
// method limitations. Numbers were checked against the cited articles; where a
// value is convention rather than a validated cut-point it is graded 'heuristic'.

export interface Reference {
  id: string
  citation: string
  pmid?: string
  doi?: string
}

export const REFERENCES: Reference[] = [
  {
    id: 'tudorlocke2018',
    citation:
      'Tudor-Locke C, et al. How fast is fast enough? Walking cadence as a practical estimate of intensity in adults: a narrative review. Br J Sports Med. 2018;52(12):776–788.',
    pmid: '29858465',
    doi: '10.1136/bjsports-2017-097628',
  },
  {
    id: 'bramah2018',
    citation:
      'Bramah C, Preece SJ, Gill N, Herrington L. Is There a Pathological Gait Associated With Common Soft Tissue Running Injuries? Am J Sports Med. 2018;46(12):3023–3031.',
    pmid: '30193080',
    doi: '10.1177/0363546518793657',
  },
  {
    id: 'munro2011',
    citation:
      'Munro A, Herrington L, Carolan M. Reliability of 2-dimensional video assessment of frontal-plane dynamic knee valgus. J Sport Rehabil. 2011;21(1):7–11.',
    pmid: '22104115',
    doi: '10.1123/jsr.21.1.7',
  },
  {
    id: 'zhang2017',
    citation:
      'Zhang X, Aeles J, Vanwanseele B. Comparison of foot muscle morphology and foot kinematics between recreational runners with normal feet and with asymptomatic over-pronated feet. Gait Posture. 2017;54:290–294.',
    pmid: '28390293',
    doi: '10.1016/j.gaitpost.2017.03.030',
  },
  {
    id: 'stenum2021',
    citation:
      'Stenum J, Rossi C, Roemmich RT. Two-dimensional video-based analysis of human gait using pose estimation. PLoS Comput Biol. 2021;17(4):e1008935.',
    pmid: '33891585',
    doi: '10.1371/journal.pcbi.1008935',
  },
  {
    id: 'wade2022',
    citation:
      'Wade L, Needham L, McGuigan P, Bilzon J. Applications and limitations of current markerless motion capture methods for clinical gait biomechanics. PeerJ. 2022;10:e12995.',
    pmid: '35237469',
    doi: '10.7717/peerj.12995',
  },
  {
    id: 'needham2021',
    citation:
      'Needham L, Evans M, Cosker DP, et al. The accuracy of several pose estimation methods for 3D joint centre localisation. Sci Rep. 2021;11(1):20673.',
    pmid: '34667207',
    doi: '10.1038/s41598-021-00212-x',
  },
  {
    id: 'herzog1989',
    citation:
      'Herzog W, Nigg BM, Read LJ, Olsson E. Asymmetries in ground reaction force patterns in normal human gait. Med Sci Sports Exerc. 1989;21(1):110–114.',
    pmid: '2927295',
    doi: '10.1249/00005768-198902000-00020',
  },
]

export function refUrl(r: Reference): string {
  if (r.doi) return `https://doi.org/${r.doi}`
  if (r.pmid) return `https://pubmed.ncbi.nlm.nih.gov/${r.pmid}/`
  return '#'
}

export type EvidenceGrade = 'evidence' | 'heuristic'

/** A caution/abnormal threshold pair for a metric, with its evidence basis. */
export interface Threshold {
  warn: number
  bad: number
  refId: string
  grade: EvidenceGrade
  note: string
}

export const THRESHOLDS: Record<string, Threshold> = {
  // Contralateral pelvic drop (running): healthy 3.7±1.9°, injured 6.4±2.1° (Bramah 2018).
  pelvicDrop: {
    warn: 4,
    bad: 7,
    refId: 'bramah2018',
    grade: 'evidence',
    note: '달리기 기준 정상 ~3.7°, 손상군 ~6.4° (Bramah 2018). 연속적 위험도이며 확정 진단 컷오프가 아님.',
  },
  // 2D FPPA reliability: SEM ~3°, smallest detectable difference ~8° (Munro 2011).
  kneeValgus: {
    warn: 8,
    bad: 12,
    refId: 'munro2011',
    grade: 'evidence',
    note: '2D FPPA 측정오차 SEM ~3°, 최소검출차 ~8° (Munro 2011). 8° 미만 차이는 측정 잡음 범위. 정상/손상 절대 컷오프는 근거가 약함.',
  },
  // Direction established (over-pronators evert more); degree cut-points inconsistent → heuristic.
  rearfoot: {
    warn: 8,
    bad: 12,
    refId: 'zhang2017',
    grade: 'heuristic',
    note: '과회내 시 외반이 커진다는 방향성은 확립(Zhang 2017)되었으나 각도 컷오프는 문헌마다 상이. 2D 정면 촬영은 신뢰도 낮음 → 참고 지표.',
  },
  // No verified lateral-trunk-lean injury threshold (Bramah measured forward lean).
  trunkSway: {
    warn: 6,
    bad: 12,
    refId: 'bramah2018',
    grade: 'heuristic',
    note: '측방(횡단) 몸통 흔들림에 대한 검증된 임계값은 확인되지 않음(Bramah 2018은 전방 기울기를 측정). 아래 값은 임의 기준.',
  },
  // Healthy gait asymmetry ~4–6% (Herzog 1989, via review); the 10% cut is convention.
  symmetry: {
    warn: 6,
    bad: 10,
    refId: 'herzog1989',
    grade: 'heuristic',
    note: '정상 보행 비대칭 ~4–6% (Herzog 1989). "10%" 기준은 관례일 뿐 검증된 컷오프 아님.',
  },
}

/** Cadence intensity bands (Tudor-Locke 2018): ~100 steps/min ≈ moderate intensity. */
export const CADENCE = {
  normalLow: 100,
  normalHigh: 125,
  refId: 'tudorlocke2018',
  note: '성인 편안한 보행 ~100–125 steps/min, ≥100은 중강도 지표(Tudor-Locke 2018). 신장·속도에 크게 좌우되므로 이상 판별력은 약함.',
}
