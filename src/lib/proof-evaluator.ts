
export async function evaluateProof(userSolution: string, referenceSolution: string): Promise<number> {

  const userWords = userSolution.toLowerCase().split(/\W+/).filter(word => word.length > 3);
  const referenceWords = referenceSolution.toLowerCase().split(/\W+/).filter(word => word.length > 3);
  
  const keywordMatches = userWords.filter(word => referenceWords.includes(word));
  
  const keywordCoverage = keywordMatches.length / referenceWords.length;
  
  const lengthRatio = Math.min(userSolution.length / referenceSolution.length, 1.5);
  const lengthBonus = lengthRatio >= 0.7 && lengthRatio <= 1.3 ? 10 : 0;
  
  const rawScore = Math.min(keywordCoverage * 100 + lengthBonus, 100);
  
  return Math.round(rawScore);
}
