/**
 * TriEstimator — Simulated 3PL Item Response Theory Engine
 *
 * In production, this would use real item parameters (a, b, c) from INEP calibration data.
 * For this demo, we simulate the TRI score transformation using a weighted model.
 */

export interface TriItemParams {
    discrimination: number;  // a: item discrimination
    difficulty: number;      // b: item difficulty
    guessing: number;        // c: pseudo-guessing parameter
}

export interface TriResult {
    theta: number;           // Estimated proficiency (latent trait)
    score: number;           // Transformed ENEM-scale score (300-900)
    reliability: number;     // Estimation reliability
    standardError: number;   // Standard error of measurement
}

// Mock item parameters for different difficulty levels
const ITEM_PARAMS: Record<string, TriItemParams> = {
    facil: { discrimination: 0.8, difficulty: -1.5, guessing: 0.2 },
    media: { discrimination: 1.2, difficulty: 0.0, guessing: 0.2 },
    dificil: { discrimination: 1.5, difficulty: 1.5, guessing: 0.2 },
};

/**
 * 3PL probability function
 * P(θ) = c + (1 - c) / (1 + exp(-a * (θ - b)))
 */
function probability3PL(theta: number, params: TriItemParams): number {
    const { discrimination: a, difficulty: b, guessing: c } = params;
    return c + (1 - c) / (1 + Math.exp(-a * (theta - b)));
}

/**
 * Estimate theta (proficiency) given response pattern
 * Uses Maximum Likelihood Estimation (MLE) via Newton-Raphson
 */
function estimateTheta(
    responses: { correct: boolean; difficulty: string }[]
): number {
    let theta = 0; // Initial estimate
    const maxIterations = 50;
    const convergence = 0.001;

    for (let i = 0; i < maxIterations; i++) {
        let numerator = 0;
        let denominator = 0;

        responses.forEach(({ correct, difficulty }) => {
            const params = ITEM_PARAMS[difficulty] || ITEM_PARAMS.media;
            const p = probability3PL(theta, params);
            const u = correct ? 1 : 0;

            const a = params.discrimination;
            const pStar = (p - params.guessing) / (1 - params.guessing);

            numerator += a * pStar * (u - p) / (p * (1 - p)) * (1 - params.guessing);
            denominator += a * a * pStar * pStar * (1 - p) / p;
        });

        if (denominator === 0) break;

        const delta = numerator / denominator;
        theta += delta;

        if (Math.abs(delta) < convergence) break;
    }

    // Clamp theta to reasonable range
    return Math.max(-3, Math.min(3, theta));
}

/**
 * Transform theta to ENEM scale (approximately 300-900)
 */
function thetaToEnemScale(theta: number): number {
    // ENEM uses mean ~500 and SD ~100
    const score = 500 + theta * 100;
    return Math.round(Math.max(300, Math.min(900, score)));
}

export const TriEstimator = {
    /**
     * Calculate TRI score from question responses.
     */
    estimate: (responses: { correct: boolean; difficulty: string }[]): TriResult => {
        if (responses.length === 0) {
            return { theta: 0, score: 500, reliability: 0, standardError: 1 };
        }

        const theta = estimateTheta(responses);
        const score = thetaToEnemScale(theta);

        // Simplified reliability (based on number of items and information)
        const reliability = Math.min(0.95, 0.5 + responses.length * 0.01);
        const standardError = Math.sqrt(1 - reliability) * 100;

        return {
            theta: Math.round(theta * 1000) / 1000,
            score,
            reliability: Math.round(reliability * 100) / 100,
            standardError: Math.round(standardError * 10) / 10,
        };
    },
};
