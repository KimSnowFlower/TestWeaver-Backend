/**
 * parameters: [{ name: string, values: string[] }, ...]
 * return: [{ [name]: value, ...}, ...]
 */
function generatePairwise(parameters) {
    if (!Array.isArray(parameters) || parameters.length === 0)
        return [];

    // 파라미터 이름/도메인 정규화
    const names = parameters.map(p => p.name);
    const domains = parameters.map(p => {

        const vals = (p.values || []).map(v => String(v));
        return vals.length > 0 ? vals : [""];
    });

    const n = parameters.length;

    // 파라미터가 1개인 경우: 그냥 값 리스트만 리턴
    if (n === 1)
        return domains[0].map(v => ({ [names[0]]: v }));

    // pair key 유틸
    const makeKey = (i, vi, j, vj) => JSON.stringify([i, vi, j, vj]);

    // 아직 커버되지 않은 pair 집합 생성
    const uncovered = new Set();
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            for (const vi of domains[i]) {
                for (const vj of domains[j]) {
                    uncovered.add(makeKey(i, vi, j, vj));
                }
            }
        }
    }

    const rows = [];

    // 1단계: 첫 두 파라미터(0,1)로 전체 카테시안 생성
    for (const v0 of domains[0]) {
        for (const v1 of domains[1]) {
            const row = new Array(n).fill(null);
            row[0] = v0;
            row[1] = v1;
            rows.push(row);
            // (0,1) 쌍 커버 처리
            uncovered.delete(makeKey(0, v0, 1, v1));
        }
    }

    // 2단계: 나머지 파라미터를 하나씩 추가하며 pairwise 커버
    for (let k = 2; k < n; k++) {
        // 2-1) 기존 row들에 대해, k번째 컬럼 값을 '현재 커버 안 된 pair를 가장 많이 덮는 값'으로 선택
        for (const row of rows) {
            let bestVal = null;
            let bestGain = -1;

            for (const v of domains[k]) {
                let gain = 0;
                for (let j = 0; j < k; j++) {
                    const vi = row[j];
                    if (vi == null) continue;
                    const key = makeKey(j, vi, k, v);
                    if (uncovered.has(key)) gain++;
                }
                if (gain > bestGain) {
                    bestGain = gain;
                    bestVal = v;
                }
            }

            if (bestVal == null) bestVal = domains[k][0];
            row[k] = bestVal;

            // 커버된 pair 제거
            for (let j = 0; j < k; j++) {
                const key = makeKey(j, row[j], k, bestVal);
                uncovered.delete(key);
            }
        }

        // 2-2) 여전히 남은 pair 중, 두 번째 인덱스가 k인 것들을 커버하기 위해 row 추가/보정
        for (const keyStr of Array.from(uncovered)) {
            const [i, vi, j, vj] = JSON.parse(keyStr);
            if (j !== k) continue; // 아직 처리할 필요 없는 pair

            // i번째 값이 vi인 row를 찾아서, k번째 값으로 vj를 넣어보고,
            // 없으면 새 row 생성
            let target = null;
            for (const row of rows) {
                if (row[i] === vi && (row[k] == null || row[k] === vj)) {
                    target = row;
                    break;
                }
            }

            if (!target) {
                const newRow = new Array(n).fill(null);
                // 기본값 채우기 (0~k-1은 각 도메인의 첫 값으로 세팅)
                for (let t = 0; t < k; t++) {
                    newRow[t] = domains[t][0];
                }
                newRow[i] = vi;
                newRow[k] = vj;
                rows.push(newRow);
                target = newRow;
            } else {
                target[k] = vj;
            }

            // 방금 만든/수정한 row가 커버하는 (t,k) pair 제거
            const valK = target[k];
            for (let t = 0; t < k; t++) {
                const key2 = makeKey(t, target[t], k, valK);
                uncovered.delete(key2);
            }
        }
    }

    // row를 { name: value } 형태로 변환
    return rows.map(row => {
        const obj = {};
        for (let idx = 0; idx < n; idx++) {
            obj[names[idx]] = row[idx];
        }
        return obj;
    });
}

module.exports = { generatePairwise, }